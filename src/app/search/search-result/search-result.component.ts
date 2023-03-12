import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  ViewChild,
} from '@angular/core';
import { ViewTransitionDirective } from 'src/app/shared/view-transition.directive';
import { PackageType } from 'src/typings';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css'],
})
export class SearchResultComponent implements OnChanges {
  @Input() packages: PackageType[] = [];
  @Output() scrollReachedBottom: EventEmitter<void> = new EventEmitter();
  @Output() detailsRequestClicked: EventEmitter<{ pkg: PackageType; query: string }> = new EventEmitter();
  isInvalidAvatar = false;

  @ViewChild(ViewTransitionDirective, { static: true })
  viewTransitionRef!: ViewTransitionDirective;

  constructor() {}

  ngOnChanges() {
    this.packages = this.packages.map((pack) => {
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

  onDetailsRequestClicked({ pkg, query }: { pkg: PackageType; query: string }) {
    this.detailsRequestClicked.emit({ pkg, query });
  }
}
