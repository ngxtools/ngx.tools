import { AlgoliaService } from './../../core/algolia/algolia.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  searchForm: FormGroup;
  constructor(private algolia: AlgoliaService, private route: ActivatedRoute) {
    this.searchForm = new FormGroup({
      query: new FormControl('')
    });
  }

  ngOnInit() {
    this.searchForm.valueChanges.subscribe(controls => {
      console.log(controls);

      this.algolia.sortByRelevance(controls.query);
    });
  }
}
