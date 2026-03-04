import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { catchError, Observable, of, Subscription } from 'rxjs';
import { WordpressService } from '../../../services/wordpress.service';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { PrivacyData } from '../../../models/privacy-data.model';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Title, Meta } from '@angular/platform-browser';

import { LanguageService, Lang } from '../../../services/language.service';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent]
})
export class PrivacyPolicyComponent implements OnInit, OnDestroy {
  isHomepage = false;
  privacyData$: Observable<PrivacyData[] | null>;

  lang: Lang = 'fr';
  private langSub?: Subscription;

  constructor(
    private wpService: WordpressService,
    private sanitizer: DomSanitizer,
    private titleService: Title,
    private metaService: Meta,
    private router: Router,
    private languageService: LanguageService
  ) {
    this.privacyData$ = this.wpService.getPrivacyPolicy().pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération des données de la page:', error);
        return of(null);
      })
    );
  }

  ngOnInit(): void {
    this.lang = this.languageService.current;

    this.langSub = this.languageService.lang$.subscribe(l => {
      this.lang = l;

      if (l === 'fr') {
        this.titleService.setTitle('Politique de Confidentialité - Limago Reflexo');
        this.metaService.updateTag({
          name: 'description',
          content:
            'Consultez notre politique de confidentialité pour comprendre comment nous protégeons et gérons vos données personnelles chez Limago Reflexo.'
        });
      } else {
        this.titleService.setTitle('Privacy policy - Limago Reflexo');
        this.metaService.updateTag({
          name: 'description',
          content:
            'Read our privacy policy to understand how Limago Reflexo collects, uses and protects your personal data.'
        });
      }
    });

    this.metaService.updateTag({ name: 'canonical', href: `https://limago-reflexo.fr${this.router.url}` });
  }

  ngOnDestroy(): void {
    this.langSub?.unsubscribe();
  }

  setLang(lang: Lang): void {
    this.languageService.setLang(lang);
  }

  getSafeHtml(content: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }

  goHome(): void {
    this.router.navigate(['/accueil']);
  }
}
