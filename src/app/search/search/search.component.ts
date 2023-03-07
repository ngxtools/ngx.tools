import {
  AfterContentInit,
  Component,
  ElementRef,
  OnInit,
  signal,
  ViewChild
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { MetricsService } from 'src/app/shared/metrics.service';
import { PackageType } from 'src/typings';
import { AlgoliaService } from './../../core/algolia/algolia.service';
import { DeeplinkService } from '../../shared/deeplink.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, AfterContentInit {
  searchForm: FormGroup;
  packages = signal<PackageType[]>([]);
  currentQuery = signal('');
  hasReachedLastPage = signal(false);
  shouldAppendResults = signal(false);
  filterOption = signal('library');

  @ViewChild('resultContainerRef') resultContainerRef!: ElementRef;
  @ViewChild('queryInput', { static: true }) queryInput!: ElementRef;

  constructor(
    private search: AlgoliaService,
    private deeplink: DeeplinkService,
    private metrics: MetricsService,
    private snackBar: MatSnackBar
  ) {
    this.searchForm = new FormGroup({
      query: new FormControl('')
    });
  }

  ngOnInit() {
    this.queryInput.nativeElement.focus();

    this.searchForm.valueChanges
      .pipe(
        // prettier-ignore
        debounceTime(50),
        map(event => event.query),
        distinctUntilChanged()
      )
      .subscribe(value => {

        // sync'ing the URL state will trigger the search process
        this.deeplink.syncUrl({
          q: value || null
        });

        if (value === '') {
          this.resultContainerRef.nativeElement.classList.remove(
            'no-package-found'
          );
          this.packages.set([]);
        }
      });

    this.search.searchState.result$.subscribe(data => {
      const results = data.results;
      this.hasReachedLastPage.set(results.page + 1 === results.nbPages);

      if (results.query !== this.currentQuery()) {
        this.currentQuery.set(results.query);
        this.packages.set([]);
      }

      if (results.query.trim() === '') {
        this.packages.set([]);
      } else {
        // get the actual result
        if (this.shouldAppendResults()) {
          this.packages.update((packages: PackageType[]) => {
            return [...packages, ...results.hits];
          });

        } else {
          this.packages.set(results.hits);
        }

        if (results.hits.length === 0) {
          this.resultContainerRef.nativeElement.classList.add(
            'no-package-found'
          );

          this.metrics.send(results);
        } else {
          this.resultContainerRef.nativeElement.classList.remove(
            'no-package-found'
          );
        }
      }
    });
  }

  ngAfterContentInit() {
    this.deeplink.registerFormGroup(this.searchForm, 'query');
    this.deeplink.registerState('t').subscribe(state => {
      this.filterOption.set(state || this.filterOption());

      const changeEvent = { value: state } as MatButtonToggleChange;
      const query = this.searchForm.get('query')?.value;
      switch (changeEvent.value) {
        case 'schematics':
          this.search.filterBySchematics(query);
          break;
        case 'library':
        default:
          this.search.filterByRelevance(query);
      }
    });
  }

  onFilterOptionsChange(changeEvent: MatButtonToggleChange) {
    this.deeplink.syncUrl({
      t: changeEvent.value
    });
    this.shouldAppendResults.set(false);
  }

  onSortOptionsChange(changeEvent: MatButtonToggleChange) {
    const query = this.searchForm.get('query')?.value;
    switch (changeEvent.value) {
      case 'best_match':
        this.search.sortByBestMatch(query);
        break;
      case 'most_downloaded':
      default:
        this.search.sortByMostDownloaded(query);
    }
  }

  clear() {
    this.searchForm.patchValue({
      query: ''
    });
  }

  isThereAnyPackage() {
    return this.searchForm.controls['query'].value && this.packages().length === 0;
  }

  loadNextPage() {
    if (!this.hasReachedLastPage()) {
      this.shouldAppendResults.set(true);
      this.search.nextPage();
      this.snackBar.open('Loading more packages...', undefined, {
        duration: 2000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      });
    }
  }

  /**
   * Kill the Enter keypress
   * @param keypressEvent The keypress DOM event.
   */
  noop(keypressEvent: Event) {
    keypressEvent.preventDefault();
    keypressEvent.stopPropagation();
    return false;
  }

  /**
   * Close keyboard on mobile device
   */
  closeMobileBeyboard(event: Event) {
    this.queryInput.nativeElement.blur();
    return this.noop(event);
  }
}
