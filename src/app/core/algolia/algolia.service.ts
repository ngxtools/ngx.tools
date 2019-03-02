import { Inject, Injectable } from '@angular/core';
import algoliasearchHelper from 'algoliasearch-helper';
import { Observable } from 'rxjs';
import { ALGOLIA_APPLICATION_ID, ALGOLIA_INDEX, ALGOLIA_SEARCH_API_KEY } from './injection-tokens';
import { SearchResult } from 'src/app/search/search-result/search-result.component';

export interface SearchState {
  search$: Observable<any>;
  result$: Observable<SearchResult>;
  change$: Observable<any>;
  error$: Observable<any>;
}

@Injectable({
  providedIn: 'root'
})
export class AlgoliaService {
  indices = {
    'npm-search': algoliasearchHelper
  };

  client: any;

  /**
   * A map of the different search states: `search$`, `result$`, `change$`, `error$`.
   */
  searchState: SearchState;

  constructor(
    @Inject(ALGOLIA_APPLICATION_ID) private applicationID: string,
    @Inject(ALGOLIA_SEARCH_API_KEY) private searchApiKey: string,
    @Inject(ALGOLIA_INDEX) private indexName: string
  ) {
    this.client = window['algoliasearch'](this.applicationID, this.searchApiKey);

    this.searchState = {} as any;

    this.configureMasterIndex(indexName);
  }

  /**
   * Configures the default Algolia index (master).
   * This will initialise all the search states `search$`, `result$`, `change$`, `error$`.
   * @param indexName The index name.
   */
  private configureMasterIndex(indexName: string) {
    this.indices[indexName] = algoliasearchHelper(this.client, indexName, {
      facets: ['downloadsLast30Days'],
      hierarchicalFacets: [{
        name: 'products',
        attributes: ['downloadsLast30Days'],
        sortBy: ['count:desc', 'name:asc'] // first show the most common values, then sort by name
      }]
    });

    this.searchState = {} as SearchState;

    // map algolia's events to observables
    ['search', 'result', 'change', 'error'].forEach(eventName => {
      this.searchState[`${eventName}$`] = new Observable(observer => {
        const handler = e => observer.next(e);
        this.indices[indexName].on(eventName, handler);
        return () => this.indices[indexName].removeListener(eventName, handler);
      });
    });
  }

  /**
   * Set an initial search parameters to be used by the search method.
   * @param options
   */
  setQueryParameter(options) {
    this.indices[this.indexName].setQueryParameter(options);
  }

  /**
   * Run the actual search process.
   * @param indexName The index name to be used.
   * @param query The user query used for search.
   */
  private search(indexName: string, query: string, extra = '') {

    console.log(query, extra);

    this.indices[this.indexName]
      .setIndex(indexName)
      .setQueryParameter('query', query)
      .setQueryParameter(
        'filters',
        `(keywords:ngx OR keywords:angular) AND (NOT keywords:angularjs) ${extra}`
      )
      .setQueryParameter('optionalFilters', 'owner.name:angular')
      .search();
  }

  /**
   * Enable or disable the Facet refinement when search against the master index.
   * @param facet The facet name and query
   */
  toggleFacetRefinement(facet: { name: string; query: string } = {} as any) {
    this.indices[this.indexName].toggleFacetRefinement(facet.name, facet.query).search();
  }

  /**
   * Search the next page (used for the infinite scrolling feature)
   */
  nextPage() {
    // request the next page only if the current query is not empty!
    if (this.indices[this.indexName].state.query !== '') {
      this.indices[this.indexName].nextPage().search();
    }
  }
  filterByRelevance(query: string) {
    // query = query || this.indices[this.indexName].state.query;
    this.search(this.indexName, query);
  }

  filterBySchematics(query: string) {
    // query = query || this.indices[this.indexName].state.query;
    this.search(this.indexName, query, 'AND (computedKeywords:angular-cli-schematic)');
  }

  sortByBestMatch(query: string) {
    this.search(this.indexName, query);
  }

  sortByMostDownloaded(query: string) {
    this.search(this.indexName, query);
  }
}
