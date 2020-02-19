import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export interface Theme {
  id: string;
  name: string;
}

@Component({
  selector: 'app-theme-chooser',
  templateUrl: './theme-chooser.component.html',
  styleUrls: ['./theme-chooser.component.css']
})
export class ThemeChooserComponent implements OnInit {
  storageKey = 'ngxtools-theme';
  themes: Theme[] = Array(9) // n+1
    .fill(1)
    .map((_e, i) => ({
      id: `${i}`,
      name: `Theme #${i}`
    }));

  body: HTMLBodyElement;

  constructor(@Inject(DOCUMENT) private document:  HTMLDocument) {}

  ngOnInit() {
    this.body = this.document.querySelector('body');
    const savedTheme = parseInt(localStorage.getItem(this.storageKey), 10);
    if (isNaN(savedTheme) === false) {
      this.setTheme(savedTheme);
    }
  }

  setTheme(themeId: number) {

    let currentClassName = '';
    this.body.classList.forEach(className => {
      if (className.startsWith('ngxtools-theme-')) {
        currentClassName = className;
      }
    });

    this.body.classList.replace(currentClassName, `ngxtools-theme-${themeId}`);
    localStorage.setItem(this.storageKey, `${themeId}`);
  }

  themeId(theme: Theme) {
    return theme.id;
  }
}
