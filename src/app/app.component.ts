import { NgIf } from '@angular/common';
import { Component, ViewChild, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import {
  Event,
  Router,
  RouterLink,
  RouterOutlet,
  RoutesRecognized,
} from '@angular/router';
import { environment } from 'src/environments/environment';
import { PromptUpdateService } from './shared/prompt-update.service';
import { ThemeManagerService } from './shared/theme-manager.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [
    NgIf,
    RouterLink,
    RouterOutlet,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
  ],
})
export class AppComponent {
  version = signal(environment.version);
  isDarkMode = signal(false);
  shouldShowBackButton = signal(false);
  locationHistory = signal<string[]>(['/']);

  promptUpdateService = inject(PromptUpdateService);
  themeManager = inject(ThemeManagerService);
  router = inject(Router);

  constructor() {
    this.promptUpdateService.check();
    this.isDarkMode.set(this.themeManager.isDarkMode());

    this.router.events.subscribe((event: Event) => {
      if (event instanceof RoutesRecognized) {
        const { url } = event;
        this.shouldShowBackButton.set(url.startsWith('/pkg'));

        // store the most recent 2 urls
        this.locationHistory.update((locationHistory) => {
          if (locationHistory[0] === url) {
            return locationHistory;
          }
          return [url, ...locationHistory].slice(0, 2);
        });
      }
    });
  }

  toggleDarkTheme() {
    this.themeManager.toggleDarkTheme();
    this.isDarkMode.update(() => this.themeManager.isDarkMode());
  }

  async navigateBack() {
    const [_, lastVisitedUrl] = this.locationHistory();
    await this.router.navigateByUrl(lastVisitedUrl);
  }
}
