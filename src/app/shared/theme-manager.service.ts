import { DOCUMENT } from '@angular/common';
import { Injectable, inject, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeManagerService {
  isDarkMode = signal(false);

  document = inject(DOCUMENT);

  constructor() {
    this.isDarkMode.set(
      this.#readThemePreference('ngxtools-theme-mode') === 'dark'
    );

    if (this.isDarkMode()) {
      this.#enableDarkTheme();
    }
  }

  toggleDarkTheme() {
    if (this.isDarkMode()) {
      this.#disableDarkTheme();
    } else {
      this.#enableDarkTheme();
    }

    this.isDarkMode.update((isDarkMode) => !isDarkMode);
    this.#saveThemePreference('ngxtools-theme-mode', this.isDarkMode());
  }

  #disableDarkTheme() {
    this.#removeStyle('dark-theme');
    this.document.body.classList.remove('dark-theme');
  }

  #enableDarkTheme() {
    const href = 'dark-theme.css';
    this.#getLinkElementForKey('dark-theme').setAttribute('href', href);
    this.document.body.classList.add('dark-theme');
  }

  #removeStyle(key: string) {
    const existingLinkElement = this.#getExistingLinkElementByKey(key);
    if (existingLinkElement) {
      this.document.head.removeChild(existingLinkElement);
    }
  }

  #saveThemePreference(key: string, status: boolean) {
    localStorage.setItem(key, status ? 'dark' : 'light');
  }

  #readThemePreference(key: string) {
    return localStorage.getItem(key) || 'light';
  }

  #getLinkElementForKey(key: string) {
    return (
      this.#getExistingLinkElementByKey(key) ||
      this.#createLinkElementWithKey(key)
    );
  }

  #getExistingLinkElementByKey(key: string) {
    return this.document.head.querySelector(
      `link[rel="stylesheet"].${this.#getClassNameForKey(key)}`
    );
  }

  #createLinkElementWithKey(key: string) {
    const linkEl = this.document.createElement('link');
    linkEl.setAttribute('rel', 'stylesheet');
    linkEl.classList.add(this.#getClassNameForKey(key));
    this.document.head.appendChild(linkEl);
    return linkEl;
  }

  #getClassNameForKey(key: string) {
    return `theme-${key}`;
  }
}
