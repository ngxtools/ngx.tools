import { AlgoliaService } from './../core/algolia/algolia.service';
import { FormGroup } from '@angular/forms';
import { QueryParams } from './deeplink.service';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { map } from 'rxjs/operators';

export interface QueryParams {
  q: string;
}

@Injectable({
  providedIn: 'root'
})
export class DeeplinkService {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private search: AlgoliaService
  ) {}

  /**
   * Register a given FormGroup instance with the current "q" queryParams Observbale. Every time the
   * "q" queryParams changes, the "query" FormControl (of the given FormGroup instance) will be updated, reflecting the same value.
   * @param form The given FormGroup to register.
   */
  registerFormGroup(form: FormGroup, controlName: string) {
    this.route.queryParams.subscribe((query: QueryParams) => {
      if (query.q) {
        form.patchValue({
          [controlName]: query.q
        });
      }
    });
  }

  registerState(queryParam: string) {
    return this.route.queryParams.pipe(map(query => query[queryParam]));
  }

  /**
   * This method is used to update the current URL queryParams.
   * It is used to keep both the URL and the formControl in sync.
   * @param queryParams A given Params object containing the queryParams to set.
   */
  syncUrl(queryParams: Params) {
    if (!queryParams.t) {
      queryParams.t = this.route.snapshot.queryParams.t;
    } else {
      if (!queryParams.q) {
        queryParams.q = this.route.snapshot.queryParams.q;
      }
    }

    console.log(queryParams);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams
    });
  }
}
