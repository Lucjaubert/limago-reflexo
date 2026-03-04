import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Lang = 'fr' | 'en';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly STORAGE_KEY = 'limago_lang';

  private readonly _lang$ = new BehaviorSubject<Lang>(this.getInitialLang());
  readonly lang$ = this._lang$.asObservable();

  get current(): Lang {
    return this._lang$.value;
  }

  setLang(lang: Lang): void {
    this._lang$.next(lang);
    localStorage.setItem(this.STORAGE_KEY, lang);
    document.documentElement.lang = lang; // utile pour SEO/accessibilité
  }

  toggle(): void {
    this.setLang(this.current === 'fr' ? 'en' : 'fr');
  }

  private getInitialLang(): Lang {
    const saved = localStorage.getItem(this.STORAGE_KEY) as Lang | null;
    if (saved === 'fr' || saved === 'en') return saved;

    // FR par défaut (comme demandé)
    document.documentElement.lang = 'fr';
    return 'fr';
  }
}
