import { Component, Input, Renderer2 } from '@angular/core';
import { DeeplinkService } from 'src/app/search/deeplink.service';
import { PackageType } from 'src/typings';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {

  @Input() package: PackageType | null = null;
  constructor(
    private renderer: Renderer2,
    private deeplink: DeeplinkService
  ) { }


  onAvatarImageError(avatarImage: HTMLImageElement, avatarIcon: HTMLElement) {
    this.renderer.setStyle(avatarImage, 'display', 'none');
    this.renderer.setStyle(avatarIcon, 'display', 'block');
  }


  shouldShowVerifiedBadge(pkg: PackageType) {
    return pkg.owner.name === 'angular';
  }

  shouldShowWarningBadge(pkg: PackageType) {
    return pkg.name.toLocaleLowerCase().includes('angularjs') ||
      (pkg.keywords || []).map(k => k.toLowerCase()).includes('angularjs') ||
      (pkg.description || '').toLocaleLowerCase().includes('angularjs');
  }

  isDeprecated(pkg: PackageType) {
    return pkg.deprecated ||
      (pkg.description || '').toLocaleLowerCase().includes('deprecated');
  }

  searchByKeyword(keyword: string) {
    this.deeplink.syncUrl({
      q: keyword
    });
    window.scroll(0, 0);
  }

  buildTweetText(pkg: PackageType) {
    const packageName = pkg.name;
    const packageType = pkg.computedMetadata['schematics'] ? 'schematics' : 'library';
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
