import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Observable, Subscription, catchError, of } from 'rxjs';
import { WordpressService } from '../../../services/wordpress.service';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { LegalData } from '../../../models/legal-data.model';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Title, Meta } from '@angular/platform-browser';

import { LanguageService, Lang } from '../../../services/language.service';

@Component({
  selector: 'app-legal-notices',
  templateUrl: './legal-notices.component.html',
  styleUrls: ['./legal-notices.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent] // ✅ ajoute HeaderComponent si tu l'utilises dans le template
})
export class LegalNoticesComponent implements OnInit, OnDestroy {
  isHomepage = false;
  legal$: Observable<LegalData[] | null>;

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
    this.legal$ = this.wpService.getLegalNotices().pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération des données de la page mentions-legales:', error);
        return of(null);
      })
    );
  }

  ngOnInit(): void {
    this.lang = this.languageService.current;

    this.langSub = this.languageService.lang$.subscribe(l => {
      this.lang = l;

      if (l === 'fr') {
        this.titleService.setTitle('Mentions Légales - Limago Reflexo');
        this.metaService.updateTag({
          name: 'description',
          content: 'Lisez les mentions légales de Limago Reflexo pour en savoir plus sur nos termes, conditions et la réglementation applicable.'
        });
      } else {
        this.titleService.setTitle('Legal notice - Limago Reflexo');
        this.metaService.updateTag({
          name: 'description',
          content: 'Read the legal notice of Limago Reflexo to learn more about the website publisher, hosting, and applicable regulations.'
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
