import { DOCUMENT } from '@angular/common';
import {
  Directive,
  ElementRef,
  Inject,
  NgZone,
  Renderer2,
} from '@angular/core';
import { DocumentWithViewTransitionAPI } from 'src/typings';

@Directive({
  selector: '[appViewTransition]',
})
export class ViewTransitionDirective {
  constructor(
    private zone: NgZone,
    @Inject(DOCUMENT) private document: Document,
    private element: ElementRef<HTMLElement>,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.renderer.setStyle(this.element.nativeElement, 'contain', 'layout');
    this.setElementTransitionName(this.element.nativeElement.id);
  }

  setElementTransitionName(name: string) {
    this.renderer.setStyle(
      this.element.nativeElement,
      'viewTransitionName',
      name
    );
  }

  async startViewTransition(callback: () => Promise<void>) {
    if (!(this.document as DocumentWithViewTransitionAPI).startViewTransition) {
      console.warn('View transition API is not available in this browser.');
      return await callback();
    }

    this.setElementTransitionName(this.element.nativeElement.id + '-full');

    (this.document as DocumentWithViewTransitionAPI).startViewTransition(() => {
      // TODO: patch zone.js to support view transition api callbacks
      this.zone.run(async () => await callback());
      this.setElementTransitionName(this.element.nativeElement.id);
    });
  }
}
