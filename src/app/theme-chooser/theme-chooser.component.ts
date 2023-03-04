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

  body!: HTMLBodyElement | null;

  constructor(@Inject(DOCUMENT) private document: Document)  { }

  ngOnInit() {
    this.body = this.document.querySelector('body');
    const theme = localStorage.getItem(this.storageKey);
    if (theme) {
      const savedTheme = parseInt(theme, 10);
      if (isNaN(savedTheme) === false) {
        this.setTheme(savedTheme);
      }
    }
    else {
      this.setTheme(0);
    }
  }

  setTheme(themeId: number | string) {

    let currentClassName = '';
    this.body?.classList.forEach(className => {
      if (className.startsWith('ngxtools-theme-')) {
        currentClassName = className;
      }
    });

    this.body?.classList.replace(currentClassName, `ngxtools-theme-${themeId}`);
    localStorage.setItem(this.storageKey, `${themeId}`);
  }

  themeId(_index: number, theme: Theme) {
    return theme.id;
  }
}
