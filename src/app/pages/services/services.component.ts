import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ServicesData } from '../../models/services-data.model';
import { WordpressService } from '../../services/wordpress.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Title, Meta } from '@angular/platform-browser';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { LanguageService, Lang } from '../../services/language.service';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class ServicesComponent implements OnInit, OnDestroy {
  servicesData: ServicesData[] | null = null;

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
    gsap.registerPlugin(ScrollTrigger);

    // Langue globale
    this.lang = this.languageService.current;

    this.langSub = this.languageService.lang$.subscribe(l => {
      this.lang = l;

      if (l === 'fr') {
        this.titleService.setTitle('Nos Prestations - Limago Reflexo');
        this.metaService.updateTag({
          name: 'description',
          content: 'Explorez les diverses prestations de réflexologie offertes par Limago Reflexo pour prendre soin de votre santé et bien-être.'
        });
      } else {
        this.titleService.setTitle('Services and prices - Limago Reflexo');
        this.metaService.updateTag({
          name: 'description',
          content: 'Discover Limago Reflexo services and prices: foot and hand reflexology sessions, packages, children and babies sessions, including Bach Flowers support.'
        });
      }

      this.metaService.updateTag({ name: 'canonical', href: `https://limago-reflexo.fr${this.router.url}` });
    });

    this.wpService.getServices().pipe(
      catchError(error => {
        console.error('Error retrieving services data:', error);
        return of(null);
      })
    ).subscribe(data => {
      this.servicesData = data;
      this.cdr.detectChanges();
      this.initAnimations();
    });
  }

  ngOnDestroy(): void {
    this.langSub?.unsubscribe();
  }

  initAnimations(): void {
    gsap.fromTo('.image-container',
      { opacity: 0, x: -100 },
      {
        opacity: 1, x: 0, duration: 1.5, ease: 'power2.out',
        scrollTrigger: {
          trigger: '.image-container',
          start: 'top 80%',
          toggleActions: 'play none none none',
        }
      }
    );

    gsap.fromTo('.content-container',
      { opacity: 0, x: 100 },
      {
        opacity: 1, x: 0, duration: 1.5, ease: 'power2.out',
        scrollTrigger: {
          trigger: '.content-container',
          start: 'top 80%',
          toggleActions: 'play none none none',
        }
      }
    );

    gsap.fromTo('.btn-reserve',
      { opacity: 0, scale: 0.8 },
      {
        opacity: 1, scale: 1, duration: 1.2, ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: '.btn-reserve',
          start: 'top 85%',
          toggleActions: 'play none none none',
        }
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
