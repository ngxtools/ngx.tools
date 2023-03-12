import { Component, ViewChild, signal } from '@angular/core';
import { Event, Router, RoutesRecognized } from '@angular/router';
import { environment } from 'src/environments/environment';
import { PromptUpdateService } from './prompt-update.service';
import { ThemeManagerService } from './shared/theme-manager.service';
import { ViewTransitionDirective } from './shared/view-transition.directive';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  version = environment.version;
  isDarkMode = signal(false);
  shouldShowBackButton = signal(false);

  @ViewChild(ViewTransitionDirective, { static: true })
  viewTransitionRef!: ViewTransitionDirective;

  locationHistory = signal<string[]>(['/']);

  constructor(
    private promptUpdateService: PromptUpdateService,
    private themeManager: ThemeManagerService,
    private router: Router
  ) {
    this.promptUpdateService.check();
    this.isDarkMode.set(this.themeManager.isDarkMode);

    router.events.subscribe((event: Event) => {
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
    this.isDarkMode.update(() => this.themeManager.isDarkMode);
  }

  navigateBack() {
    this.viewTransitionRef.startViewTransition(async () => {
      const [_, lastVisitedUrl] = this.locationHistory();
      await this.router.navigateByUrl(lastVisitedUrl);
    });
  }
}
