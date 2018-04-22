import { AlgoliaService } from './../../core/algolia/algolia.service';
import { Component, OnInit, Renderer2, Input, SimpleChange, OnChanges } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { trigger, state, style, transition, animate, keyframes, stagger, query } from '@angular/animations';
import { Observable } from 'rxjs';

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
  // animations: [
  //   trigger('listAnimation', [
  //     transition('* => *', [
  //       query(':enter', style({}), { optional: true }),

  //       query(
  //         ':enter',
  //         stagger('100ms', [animate('200ms ease-in', keyframes([style({ offset: 0 }), style({ offset: 0.3 }), style({ offset: 1.0 })]))]),
  //         { optional: true }
  //       ),

  //       query(
  //         ':leave',
  //         stagger('100ms', [animate('200ms ease-in', keyframes([style({ offset: 0 }), style({ offset: 0.3 }), style({ offset: 1.0 })]))]),
  //         { optional: true }
  //       )
  //     ])
  //   ])
  // ]
})
export class SearchResultComponent implements OnInit {
  packages: PackageType[] = [];
  isInvalidAvatar = false;
  constructor(private algolia: AlgoliaService, private renderer: Renderer2) {
    this.algolia.searchState.result$.subscribe(results => {
      if (results.query.trim() === '') {
        this.packages = [];
      } else {
        this.packages = results.hits;
      }
    });
  }

  ngOnInit() {}

  packageName(pack: PackageType) {
    return pack.name;
  }

  onAvatarImageError(avatarImage: HTMLImageElement, avatarIcon: HTMLElement) {
    this.renderer.setStyle(avatarImage, 'display', 'none');
    this.renderer.setStyle(avatarIcon, 'display', 'block');
  }
}
