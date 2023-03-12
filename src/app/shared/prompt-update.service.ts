import { DOCUMENT } from '@angular/common';
import { ApplicationRef, Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SwUpdate } from '@angular/service-worker';
import { concat, interval } from 'rxjs';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PromptUpdateService {
  document = inject(DOCUMENT);
  appRef = inject(ApplicationRef);
  updates = inject(SwUpdate);
  snackBar = inject(MatSnackBar);

  constructor() {
    // Allow the app to stabilize first, before starting
    // polling for updates with `interval()`.
    const appIsStable$ = this.appRef.isStable.pipe(
      first((isStable) => isStable === true)
    );
    const everySixHours$ = interval(6 * 60 * 60 * 1000);
    const everySixHoursOnceAppIsStable$ = concat(appIsStable$, everySixHours$);

    everySixHoursOnceAppIsStable$.subscribe(() =>
      this.updates.checkForUpdate()
    );
  }

  check() {
    console.log('check for updates?');
    this.updates.versionUpdates.subscribe((event) => {
      console.log('update available...');
      switch (event.type) {
        case 'VERSION_DETECTED':
          console.log(`Downloading new app version: ${event.version.hash}`);
          this.openSnackBar();
          break;
        case 'VERSION_READY':
          console.log(`Current app version: ${event.currentVersion.hash}`);
          console.log(
            `New app version ready for use: ${event.latestVersion.hash}`
          );
          break;
        case 'VERSION_INSTALLATION_FAILED':
          console.log(
            `Failed to install app version '${event.version.hash}': ${event.error}`
          );
          break;
      }
    });
  }

  openSnackBar() {
    this.snackBar
      .open('New Version Available', 'UPDATE')
      .onAction()
      .subscribe(async (clicked) => {
        console.log('installing new update...');
        await this.updates.activateUpdate();
        this.document.location.reload();
        console.log('done');
      });
  }
}
