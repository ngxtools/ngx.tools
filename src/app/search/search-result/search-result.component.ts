import { DOCUMENT } from '@angular/common';
import {
  Component, EventEmitter,
  Inject, Input,
  NgZone,
  OnChanges,
  Output
} from '@angular/core';
import { Router } from '@angular/router';
import { CSSStyleDeclarationWithViewTransitionAPI, DocumentWithViewTransitionAPI, PackageType } from 'src/typings';
import { DeeplinkService } from './../deeplink.service';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent implements OnChanges {
  @Input() packages: PackageType[] = [];
  @Output() scrollReachedBottom: EventEmitter<void> = new EventEmitter();
  isInvalidAvatar = false;

  constructor(
    private deeplink: DeeplinkService,
    private router: Router,
    private zone: NgZone,
    @Inject(DOCUMENT) private document: Document) { }

  ngOnChanges() {
    this.packages = this.packages.map(pack => {
      pack.keywords = pack.keywords.slice(0, 5);
      return pack;
    });
  }

  packageName(_index: number, pack: PackageType) {
    return pack.name;
  }

  onScroll() {
    this.scrollReachedBottom.emit();
  }

  async navigateTo(pkg: PackageType, event: Event) {
    const card = (event?.target as HTMLElement).closest<HTMLElement>('app-card');
    if (!card) {
      return;
    }

    (card.style as CSSStyleDeclarationWithViewTransitionAPI).viewTransitionName = 'package-details-wide';

    this.#startViewTransition(() => {
      this.zone.run(async() => {
        await this.router.navigate([`pkg`, pkg.name], {
          state: {
            pkg,
            query: this.deeplink.getState()
          }
        });
      });
    }, () => {
      (card.style as CSSStyleDeclarationWithViewTransitionAPI).viewTransitionName = '';
    });

  }

  #startViewTransition(onStart: () => void, onFinish: () => void = () => { }) {
    if (!(this.document as DocumentWithViewTransitionAPI).startViewTransition) {
      console.warn('View transition API is not available in this browser.');
      return onStart();
    }

    const transition = (this.document as DocumentWithViewTransitionAPI).startViewTransition(onStart);
    transition.finished.finally(onFinish);
  }

}
