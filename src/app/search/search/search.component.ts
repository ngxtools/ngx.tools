import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit, EventEmitter, AfterContentInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { distinctUntilChanged, map, debounceTime } from 'rxjs/operators';
import { PackageType } from './../search-result/search-result.component';
import { DeeplinkService } from './../deeplink.service';
import { AlgoliaService } from './../../core/algolia/algolia.service';

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

  @ViewChild('resultContainerRef') resultContainerRef: ElementRef;
  constructor(private algolia: AlgoliaService, private route: ActivatedRoute, private deeplink: DeeplinkService) {
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
        this.algolia.sortByRelevance(value);
        this.deeplink.syncUrl({
          q: value || null
        });

        if (value === '') {
          this.resultContainerRef.nativeElement.classList.remove('no-package-found');
          this.packages = [];
        }
      });
    this.algolia.searchState.result$.subscribe(results => {
      this.hasReachedLastPage = results.page + 1 === results.nbPages;

      if(results.query !== this.currentQuery){
        this.currentQuery = results.query;
        this.packages = [];
      }

      if (results.query.trim() === '') {
        this.packages = [];
      } else {
        this.packages = this.packages.concat(results.hits);
        if (results.hits.length === 0) {
          this.resultContainerRef.nativeElement.classList.add('no-package-found');
          window['ga']('send', {
            hitType: 'event',
            eventCategory: 'Search',
            eventAction: 'query',
            eventLabel: results.query
          });
        } else {
          this.resultContainerRef.nativeElement.classList.remove('no-package-found');
        }
      }
    });
  }

  ngAfterContentInit() {
    this.deeplink.registerFormGroup(this.searchForm, 'query');
  }

  clear() {
    this.searchForm.setValue({
      query: ''
    });
  }

  isThereAnyPackage() {
    return this.searchForm.controls.query.value && this.packages.length === 0;
  }

  loadNextPage(){
    if(!this.hasReachedLastPage) {
      this.algolia.nextPage();
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
}
