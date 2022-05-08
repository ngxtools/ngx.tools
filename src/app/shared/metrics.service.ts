import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MetricsService {
  constructor() {}

  send(results: {query: string}) {
    try {
      (window as any)['ga']('send', {
        hitType: 'event',
        eventCategory: 'Search',
        eventAction: 'query',
        eventLabel: results.query
      });
    } catch {}
  }
}
