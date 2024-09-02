import { Component, OnInit, signal } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-theme-switcher',
  templateUrl: './theme-switcher.component.html',
})
export class ThemeSwitcherComponent implements OnInit {
  selector = document.querySelector('html')!;
  theme = signal({ activeTheme: 'default', idx: 0 });
  themes = [
    'deafult',
    'acid',
    'aqua',
    'autumn',
    'black',
    'bumblebee',
    'business',
    'cmyk',
    'coffee',
    'corporate',
    'cupcake',
    'cyberpunk',
    'dark',
    'dim',
    'dracula',
    'emerald',
    'fantasy',
    'forest',
    'garden',
    'halloween',
    'lemonade',
    'light',
    'lofi',
    'luxury',
    'night',
    'nord',
    'pastel',
    'retro',
    'sunset',
    'synthwave',
    'valentine',
    'winter',
    'wireframe',
  ];

  ngOnInit(): void {
    const local = JSON.parse(localStorage.getItem('theme') as string);
    this.theme.set(local);
    this.selector.setAttribute(
      'data-theme',
      local.activeTheme || this.theme().activeTheme,
    );
  }

  setTheme(params: { activeTheme: string; idx: number }) {
    const obj = { activeTheme: params.activeTheme, idx: params.idx };
    localStorage.setItem('theme', JSON.stringify(obj));
    this.theme.set(obj);
    document
      .querySelector('html')
      ?.setAttribute('data-theme', params.activeTheme);
  }
}
