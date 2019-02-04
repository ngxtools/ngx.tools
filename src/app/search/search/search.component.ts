import {
  AfterContentInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { AlgoliaService } from './../../core/algolia/algolia.service';
import { DeeplinkService } from './../deeplink.service';
import { PackageType } from './../search-result/search-result.component';
import { MatSelectChange, MatButtonToggleChange } from '@angular/material';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, AfterContentInit {
  searchForm: FormGroup;
  packages: PackageType[] = [];
  currentQuery: string;
  hasReachedLastPage = false;
  filterOptions = 'search_all';

  @ViewChild('resultContainerRef') resultContainerRef: ElementRef;
  @ViewChild('queryInput') queryInput: ElementRef;

  constructor(
    private search: AlgoliaService,
    private deeplink: DeeplinkService
  ) {
    this.searchForm = new FormGroup({
      query: new FormControl('')
    });
  }

  ngOnInit() {
    this.searchForm.valueChanges
      .pipe(
        // prettier-ignore
        debounceTime(50),
        map(event => event.query),
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.search.sortByRelevance(value);
        this.deeplink.syncUrl({
          q: value || null
        });

        if (value === '') {
          this.resultContainerRef.nativeElement.classList.remove(
            'no-package-found'
          );
          this.packages = [];
        }
      });
    this.search.searchState.result$.subscribe(results => {
      this.hasReachedLastPage = results.page + 1 === results.nbPages;

      if (results.query !== this.currentQuery) {
        this.currentQuery = results.query;
        this.packages = [];
      }

      if (results.query.trim() === '') {
        this.packages = [];
      } else {
        this.packages = results.hits;

        if (results.hits.length === 0) {
          this.resultContainerRef.nativeElement.classList.add(
            'no-package-found'
          );
          window['ga']('send', {
            hitType: 'event',
            eventCategory: 'Search',
            eventAction: 'query',
            eventLabel: results.query
          });
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
  }

  onFilterOptionsChange(changeEvent: MatButtonToggleChange) {
    const query = this.searchForm.get('query').value;
    switch (changeEvent.value) {
      case 'search_schematics':
        this.search.filterBySchematics(query);
        break;
      case 'search_all':
      default:
        this.search.sortByRelevance(query);
    }
  }

  clear() {
    this.searchForm.patchValue({
      query: ''
    });
  }

  isThereAnyPackage() {
    return this.searchForm.controls.query.value && this.packages.length === 0;
  }

  loadNextPage() {
    if (!this.hasReachedLastPage) {
      this.search.nextPage();
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
  closeMobileBeyboard() {
    this.queryInput.nativeElement.blur();
  }
}
