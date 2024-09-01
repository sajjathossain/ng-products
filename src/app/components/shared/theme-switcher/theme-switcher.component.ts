import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-theme-switcher',
  templateUrl: './theme-switcher.component.html',
})
export class ThemeSwitcherComponent {
  activeThemeIdx = localStorage.getItem('theme') ?? 0;

  setTheme(theme: string) {
    localStorage.setItem('theme', theme);
    document.querySelector('html')?.setAttribute('data-theme', theme);
  }
}
