import {
  Component,
  Renderer2,
  Input,
  OnChanges,
  Output,
  EventEmitter
} from '@angular/core';
import { DeeplinkService } from './../deeplink.service';

export interface SearchResult {
  exhaustiveFacetsCount: boolean;
  exhaustiveNbHits: boolean;
  facets: any;
  hits: PackageType[];
  hitsPerPage: number;
  index: string;
  nbHits: number;
  nbPages: number;
  page: number;
  params: string;
  processingTimeMS: number;
  query: string;
}

export interface ObjectLiteral {
  [key: string]: string;
}

export interface Repository {
  branch: string;
  host: string;
  path: string;
  project: string;
  url: string;
  user: string;
}

export interface AuthorInformation {
  avatar: string;
  email?: string;
  link: string;
  name: string;
}

export interface PackageType {
  _highlightResult?: ObjectLiteral;
  changelogFilename: string;
  computedKeywords: string[];
  computedMetadata: ObjectLiteral;
  created: number;
  dependencies: ObjectLiteral;
  dependents: number;
  deprecated: boolean;
  description: string;
  devDependencies: ObjectLiteral;
  downloadsLast30Days: number;
  downloadsRatio: number;
  gitHead: string;
  githubRepo: Repository;
  homepage: string;
  humanDependents: string;
  humanDownloadsLast30Days: string;
  keywords: string[];
  lastCrawl: string;
  lastPublisher: AuthorInformation;
  license: string;
  modified: number;
  name: string;
  objectID: string;
  owner: AuthorInformation;
  owners: AuthorInformation[];
  popular: boolean;
  readme: string;
  repository: Repository;
  tags: {
    latest: string;
  };
  version: string;
  versions: ObjectLiteral;
}

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent implements OnChanges {
  @Input() packages: PackageType[] = [];
  @Output() scrollReachedBottom: EventEmitter<void> = new EventEmitter();
  isInvalidAvatar = false;

  constructor(private deeplink: DeeplinkService, private renderer: Renderer2) {}

  ngOnChanges() {
    this.packages = this.packages.map(pack => {
      pack.keywords = pack.keywords.slice(0, 5);
      return pack;
    });
  }

  packageName(pack: PackageType) {
    return pack.name;
  }

  onAvatarImageError(avatarImage: HTMLImageElement, avatarIcon: HTMLElement) {
    this.renderer.setStyle(avatarImage, 'display', 'none');
    this.renderer.setStyle(avatarIcon, 'display', 'block');
  }

  searchByKeyword(keyword: string) {
    this.deeplink.syncUrl({
      q: keyword
    });
    window.scroll(0, 0);
  }

  onScroll() {
    this.scrollReachedBottom.emit();
  }

  buildTweetText(pkg: PackageType) {
    const packageName = pkg.name;
    const packageType = pkg.computedMetadata.schematics ? 'schematics' : 'library';
    const origin = `${location.origin}/#/search?q=${packageName}&t=${packageType}`;

    const pkgKeywords = new Set(pkg.keywords.concat(['angular', 'ngxtools', 'javascript']));
    const keywords = Array.from(pkgKeywords).map(k => `#${k.replace(/\s/g, '_')}`).join(' ');

    return encodeURIComponent(
      `Check out this cool @angular ${packageType}: "${pkg.name}".\n\n` +
      `🔗 ${origin}\n\n` +
      `${keywords}`
    );
  }
}
