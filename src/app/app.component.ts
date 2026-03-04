import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';

import { LanguageService, Lang } from './services/language.service';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [
    RouterModule,
    CommonModule,
    HeaderComponent,
    FooterComponent
  ],
})
export class AppComponent implements OnDestroy {
  title = 'limago-reflexo';

  showHeader = true;
  isPageFullyLoaded = false;
  showFooter = true;

  lang: Lang = 'fr';
  private subs = new Subscription();

  constructor(
    private router: Router,
    private languageService: LanguageService
  ) {
    // Lang globale
    this.lang = this.languageService.current;
    this.subs.add(
      this.languageService.lang$.subscribe(l => (this.lang = l))
    );

    // Header / footer
    this.subs.add(
      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.showFooter = this.router.url !== '/';
          this.showHeader = this.router.url !== '/';

          // petit délai comme tu avais
          setTimeout(() => {
            this.isPageFullyLoaded = true;
          }, 1000);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  setLang(lang: Lang): void {
    this.languageService.setLang(lang);
  }
}
