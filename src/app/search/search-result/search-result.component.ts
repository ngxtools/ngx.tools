import { AlgoliaService } from './../../core/algolia/algolia.service';
import { Component, OnInit, Renderer2, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
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
})
export class SearchResultComponent implements OnInit {
  @Input() packages: PackageType[] = [];
  isInvalidAvatar = false;
  constructor(private algolia: AlgoliaService, private renderer: Renderer2) {}

  ngOnInit() {}

  packageName(pack: PackageType) {
    return pack.name;
  }

  onAvatarImageError(avatarImage: HTMLImageElement, avatarIcon: HTMLElement) {
    this.renderer.setStyle(avatarImage, 'display', 'none');
    this.renderer.setStyle(avatarIcon, 'display', 'block');
  }
}
