import {
  AfterViewInit,
  Directive,
  EventEmitter,
  Inject,
  Output
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { fromEvent } from 'rxjs/internal/observable/fromEvent';
import { debounceTime, filter, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Directive({
  selector: '[appInfiniteScroll]'
})
export class InfiniteScrollDirective implements AfterViewInit {
  @Output() scroll = new EventEmitter();

  private scrollEvent$: Observable<Event>;
  private userScrolledDown$: Observable<number>;
  threshold = 500;

  constructor(@Inject(DOCUMENT) private document: any) {
    this.scrollEvent$ = fromEvent(window, 'scroll');
    this.userScrolledDown$ = this.scrollEvent$.pipe(
      map(() => window.scrollY),
      debounceTime(200),
      filter(
        (current: number) =>
          current >=
          this.document.body.clientHeight - window.innerHeight - this.threshold
      )
    );
  }

  ngAfterViewInit() {
    this.userScrolledDown$.subscribe(() => {
      this.scroll.emit();
    });
  }
}
