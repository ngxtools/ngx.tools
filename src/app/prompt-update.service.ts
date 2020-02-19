import { DOCUMENT } from '@angular/common';
import { Injectable, Inject } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class PromptUpdateService {
  constructor(@Inject(DOCUMENT) private document, private updates: SwUpdate, private snackBar: MatSnackBar) {}

  check() {
    console.log('check for updates?');
    this.updates.available.subscribe(event => {
      console.log('update available...');

      this.openSnackBar();
    });
    this.updates.activated.subscribe(event => {
      console.log('old version was', event.previous);
      console.log('new version is', event.current);
    });
  }

  openSnackBar() {
    this.snackBar
      .open('New Version Available', 'UPDATE')
      .onAction()
      .subscribe(async clicked => {
        console.log('installing new update...');
        await this.updates.activateUpdate();
        this.document.location.reload();
        console.log('done');
      });
  }
}
