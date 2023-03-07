import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import * as showdown from 'showdown';
import { PackageType } from 'src/typings';


@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
  host: {
    class: 'package-details-wide'
  }
})
export class DetailsComponent implements OnInit {

  pkg = signal<PackageType | null>(null);
  query = signal('');

  constructor(private router: Router) {
    window.scrollTo(0, 0);
  }

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
    return converter.makeHtml(this.pkg()?.readme || '');
  }
}