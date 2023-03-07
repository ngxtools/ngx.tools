import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  Directive,
  EventEmitter,
  Inject,
  Input,
  Output,
} from '@angular/core';

@Directive({
  selector: '[appInfiniteScroll]',
})
export class InfiniteScrollDirective implements AfterViewInit {
  @Output() scroll = new EventEmitter();
  @Input() appInfiniteScroll = 'load-more';

  constructor(@Inject(DOCUMENT) private document: Document) {}

  ngAfterViewInit() {
    const intersectionObserver = new IntersectionObserver((entries) => {
      if (entries[0].intersectionRatio <= 0) return;
      this.scroll.emit();
    });
    intersectionObserver.observe(this.document.querySelector(`.${this.appInfiniteScroll}`) as HTMLElement);
  }
}
