import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { PackageType } from 'src/typings';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css'],
})
export class SearchResultComponent implements OnChanges {
  @Input() packages: PackageType[] = [];
  @Output() scrollReachedBottom: EventEmitter<void> = new EventEmitter();
  isInvalidAvatar = false;

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
}
