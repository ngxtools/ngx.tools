import { DOCUMENT } from '@angular/common';
import {
  Directive,
  ElementRef,
  Inject,
  Input,
  NgZone,
  Renderer2,
  signal,
} from '@angular/core';
import { DocumentWithViewTransitionAPI } from 'src/typings';

@Directive({
  selector: '[appViewTransition]',
})
export class ViewTransitionDirective {
  @Input() appViewTransition!: string;
  id = signal('');
  constructor(
    private zone: NgZone,
    @Inject(DOCUMENT) private document: Document,
    private element: ElementRef<HTMLElement>,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.renderer.setStyle(this.element.nativeElement, 'contain', 'layout');
    this.id.set(this.appViewTransition || this.element.nativeElement.id);

    this.setElementTransitionName(this.id());
  }

  setElementTransitionName(name: string) {
    this.renderer.setStyle(
      this.element.nativeElement,
      'viewTransitionName',
      name
    );
  }

  startViewTransition(callback: () => Promise<void>) {
    if (!(this.document as DocumentWithViewTransitionAPI).startViewTransition) {
      console.warn('View transition API is not available in this browser.');
      return callback();
    }

    return (this.document as DocumentWithViewTransitionAPI).startViewTransition(() => {
      // TODO: patch zone.js to support view transition api callbacks
      this.zone.run(async() => await callback());
    });
  }
}
