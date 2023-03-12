import { Injectable, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AlgoliaService } from '../core/algolia/algolia.service';

export interface QueryParams {
  q: string;
}

@Injectable({
  providedIn: 'root',
})
export class DeeplinkService {
  router = inject(Router);
  route = inject(ActivatedRoute);
  search = inject(AlgoliaService);
  /**
   * Register a given FormGroup instance with the current "q" queryParams Observbale. Every time the
   * "q" queryParams changes, the "query" FormControl (of the given FormGroup instance) will be updated, reflecting the same value.
   * @param form The given FormGroup to register.
   */
  registerFormGroup(form: FormGroup, controlName: string) {
    this.route.queryParams.subscribe((query: Params) => {
      if (query['q']) {
        form.patchValue({
          [controlName]: query['q'],
        });
      }
    });
  }

  registerState(queryParam: string) {
    return this.route.queryParams.pipe(map((query) => query[queryParam]));
  }

  getState() {
    return this.route.snapshot.queryParams['q'];
  }

  /**
   * This method is used to update the current URL queryParams.
   * It is used to keep both the URL and the formControl in sync.
   * @param queryParams A given Params object containing the queryParams to set.
   */
  syncUrl(queryParams: Params) {
    if (!queryParams['t']) {
      queryParams['t'] = this.route.snapshot.queryParams['t'];
    } else {
      if (!queryParams['q']) {
        queryParams['q'] = this.route.snapshot.queryParams['q'];
      }
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
    });
  }
}
