import { NgIf } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import * as showdown from 'showdown';
import { PackageType } from 'src/typings';
import { CardComponent } from '../shared/card/card.component';
import { ViewTransitionDirective } from '../shared/view-transition.directive';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
  standalone: true,
  imports: [CardComponent, ViewTransitionDirective, NgIf, MatCardModule],
})
export class DetailsComponent implements OnInit {
  pkg = signal<PackageType | null>(null);
  query = signal('');

  router = inject(Router);
  sanitizer = inject(DomSanitizer);

  ngOnInit(): void {
    const { pkg, query } = window.history.state;

    if (!pkg) {
      this.router.navigate(['/']);
      return;
    }

    this.query.set(query);
    this.pkg.set(pkg as PackageType);
  }

  readme() {
    const converter = new showdown.Converter();
    return this.sanitizer.bypassSecurityTrustHtml(
      converter.makeHtml(this.pkg()?.readme || '')
    );
  }
}
