import { DeeplinkService } from './../deeplink.service';
import { query } from '@angular/animations';
import { AlgoliaService } from './../../core/algolia/algolia.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit, EventEmitter, AfterContentInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { mapChildrenIntoArray } from '@angular/router/src/url_tree';
import { distinctUntilChanged, map } from 'rxjs/operators';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, AfterContentInit {
  searchForm: FormGroup;
  constructor(private algolia: AlgoliaService, private route: ActivatedRoute, private deeplink: DeeplinkService) {
    this.searchForm = new FormGroup({
      query: new FormControl('')
    });
  }

  ngOnInit() {
    this.searchForm.valueChanges
      .pipe(
        // prettier-ignore
        map(event => event.query),
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.algolia.sortByRelevance(value);
        this.deeplink.syncUrl({
          q: value || null
        });
      });
  }

  ngAfterContentInit() {
    this.deeplink.registerFormGroup(this.searchForm, 'query');
  }
}
