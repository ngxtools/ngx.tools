import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

@Component({
  selector: 'app-theme-chooser',
  templateUrl: './theme-chooser.component.html',
  styleUrls: ['./theme-chooser.component.css']
})
export class ThemeChooserComponent implements OnInit {
  themes = Array(12) // n+1
    .fill(1)
    .map((e, i) => ({
      id: `ngxtools-theme-${i}`,
      name: `Theme #${i}`
    }));

  body: HTMLBodyElement;

  constructor(@Inject(DOCUMENT) private document) {}

  ngOnInit() {
    this.body = this.document.querySelector('body');
    const savedTheme = parseInt(localStorage.getItem('theme'), 10);
    if (savedTheme) {
      this.setTheme(savedTheme);
    }
  }

  setTheme(themeId: number) {
    this.body.removeAttribute('class');
    this.body.classList.add(`${themeId}`);
    this.body.classList.add(`ngxtools-palette-primary`);
    localStorage.setItem('theme', `${themeId}`);
  }

  themeId(theme) {
    return theme.id;
  }
}
