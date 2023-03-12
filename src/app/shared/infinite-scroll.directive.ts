import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  Directive,
  EventEmitter,
  Input,
  Output,
  inject,
} from '@angular/core';

@Directive({
  selector: '[appInfiniteScroll]',
  standalone: true,
})
export class InfiniteScrollDirective implements AfterViewInit {
  @Output() scroll = new EventEmitter();
  @Input() appInfiniteScroll = 'load-more';

  document = inject(DOCUMENT);

  ngAfterViewInit() {
    const intersectionObserver = new IntersectionObserver((entries) => {
      if (entries[0].intersectionRatio <= 0) return;
      this.scroll.emit();
    });
    intersectionObserver.observe(
      this.document.querySelector(`.${this.appInfiniteScroll}`) as HTMLElement
    );
  }
}
