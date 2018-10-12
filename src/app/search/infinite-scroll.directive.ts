import { AfterViewInit, Directive, EventEmitter, Inject, Output } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { fromEvent } from 'rxjs/internal/observable/fromEvent';
import { debounceTime, filter, map } from 'rxjs/operators';

@Directive({
  selector: '[app-infinite-scroll]',
})
export class InfiniteScrollDirective implements AfterViewInit {
  @Output() scroll = new EventEmitter();

  private scrollEvent$;
  private userScrolledDown$;
  threshold = 300;

  constructor(@Inject(DOCUMENT) private document) {
    this.scrollEvent$ = fromEvent(window, 'scroll');
    this.userScrolledDown$ = this.scrollEvent$.pipe(
      map(() => window.scrollY),
      debounceTime(200),
      filter((current: number) => current >= document.body.clientHeight - window.innerHeight - this.threshold),
    );
  }

  ngAfterViewInit() {
    this.userScrolledDown$.subscribe(() => {
      this.scroll.emit();
    });
  }
}
