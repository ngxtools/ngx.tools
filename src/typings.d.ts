interface CSSStyleDeclarationWithViewTransitionAPI extends CSSStyleDeclaration {
  viewTransitionName: string
}

interface DocumentWithViewTransitionAPI extends Document {
  startViewTransition(callback: () => void): {
    finished: Promise<void>
  }
}

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
  _highlightResult?: ObjectLiteral & {
    description: {
      value: string;
    },
    owner: {
      name: {
        value: string;
      }
    }
  };
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
