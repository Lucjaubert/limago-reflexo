import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DomSanitizer, SafeHtml, Title, Meta } from '@angular/platform-browser';
import { Observable, of, Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { ReflexologyData } from '../../models/reflexology-data.model';
import { WordpressService } from '../../services/wordpress.service';
import { LanguageService, Lang } from '../../services/language.service';

@Component({
  selector: 'app-reflexology',
  templateUrl: './reflexology.component.html',
  styleUrls: ['./reflexology.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class ReflexologyComponent implements OnInit, OnDestroy {
  reflexologyData: ReflexologyData[] | null = null;

  lang: Lang = 'fr';
  private langSub?: Subscription;

  constructor(
    private wpService: WordpressService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private titleService: Title,
    private metaService: Meta,
    private cdr: ChangeDetectorRef,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {
    this.lang = this.languageService.current;

    this.langSub = this.languageService.lang$.subscribe(l => {
      this.lang = l;

      if (l === 'fr') {
        this.titleService.setTitle('Réflexologie - Limago Reflexo');
        this.metaService.updateTag({
          name: 'description',
          content: 'Approfondissez les services de réflexologie offerts par Limago Reflexo pour améliorer votre santé et bien-être général.'
        });
      } else {
        this.titleService.setTitle('Reflexology - Limago Reflexo');
        this.metaService.updateTag({
          name: 'description',
          content: 'Learn what reflexology is and how it helps relieve tension, improve circulation and support overall balance and well-being.'
        });
      }
    });

    this.metaService.updateTag({ name: 'canonical', href: `https://limago-reflexo.fr${this.router.url}` });

    gsap.registerPlugin(ScrollTrigger);

    this.wpService.getReflexology().pipe(
      catchError(error => {
        console.error('Error retrieving reflexology data:', error);
        return of(null);
      })
    ).subscribe(data => {
      this.reflexologyData = data;
      this.cdr.detectChanges();
      this.initAnimations();
    });
  }

  ngOnDestroy(): void {
    this.langSub?.unsubscribe();
  }

  setLang(lang: Lang): void {
    this.languageService.setLang(lang);
  }

  initAnimations(): void {
    gsap.fromTo('.image-container',
      { opacity: 0, x: -100 },
      {
        opacity: 1, x: 0, duration: 1.5, ease: 'power2.out',
        scrollTrigger: { trigger: '.image-container', start: 'top 80%', toggleActions: 'play none none none' }
      }
    );

    gsap.fromTo('.content-container',
      { opacity: 0, x: 100 },
      {
        opacity: 1, x: 0, duration: 1.5, ease: 'power2.out',
        scrollTrigger: { trigger: '.content-container', start: 'top 80%', toggleActions: 'play none none none' }
      }
    );

    gsap.fromTo('.lead',
      { opacity: 0, y: 50 },
      {
        opacity: 1, y: 0, duration: 1.2, ease: 'power2.out',
        scrollTrigger: { trigger: '.operation-content', start: 'top 80%', toggleActions: 'play none none none' }
      }
    );

    gsap.fromTo('.custom-border',
      { opacity: 0, y: 100 },
      {
        opacity: 1, y: 0, duration: 1.8, ease: 'power2.out',
        scrollTrigger: { trigger: '.operation-content', start: 'top 80%', toggleActions: 'play none none none' }
      }
    );

    gsap.fromTo('.btn-reserve',
      { opacity: 0, scale: 0.8 },
      {
        opacity: 1, scale: 1, duration: 1.5, ease: 'back.out(1.7)',
        scrollTrigger: { trigger: '.btn-reserve', start: 'top 80%', toggleActions: 'play none none none' }
      }
    );
  }

  navigateToReservation(): void {
    this.router.navigate(['/reservation']);
  }

  getSafeHtml(content: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }
}
