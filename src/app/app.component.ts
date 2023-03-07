import { Component, signal } from '@angular/core';
import { Event, Router, RoutesRecognized } from '@angular/router';
import { environment } from 'src/environments/environment';
import { PromptUpdateService } from './prompt-update.service';
import { ThemeManagerService } from './shared/theme-manager.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  version = environment.version;
  isDarkMode = signal(false);
  shouldShowBackButton = signal(false);

  constructor(
    private promptUpdateService: PromptUpdateService,
    private themeManager: ThemeManagerService, router: Router) {
    this.promptUpdateService.check();
    this.isDarkMode.set(this.themeManager.isDarkMode);

    router.events.subscribe((event: Event) => {
      if (event instanceof RoutesRecognized) {
        const { url } = event
        this.shouldShowBackButton.set(url.startsWith('/pkg'));
      }
    });
  }

  toggleDarkTheme() {
    this.themeManager.toggleDarkTheme();
    this.isDarkMode.mutate(() => this.isDarkMode.set(this.themeManager.isDarkMode));
  }

  navigateBack() {
    window.history.back();
  }

}
