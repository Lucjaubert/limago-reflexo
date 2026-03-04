import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { WordpressService } from '../../services/wordpress.service';
import { HomepageData } from '../../models/homepage-data.model';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Title, Meta } from '@angular/platform-browser';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { LanguageService, Lang } from '../../services/language.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class HomepageComponent implements OnInit, OnDestroy {
  homepageData: HomepageData[] | null = null;

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

    this.lang = this.languageService.current;

    this.langSub = this.languageService.lang$.subscribe(l => {
      this.lang = l;

      if (l === 'fr') {
        this.titleService.setTitle('Limago reflexo - Magali Jaubert, réflexologie plantaire et palmaire');
        this.metaService.updateTag({
          name: 'description',
          content:
            'Limago reflexo offre des services de reflexologie plantaire et palmaire dans la région du Lot-et-Garonne. Découvrez nos services pour améliorer votre bien-être quotidien.'
        });
      } else {
        this.titleService.setTitle('Limago reflexo - Magali Jaubert, foot & hand reflexology');
        this.metaService.updateTag({
          name: 'description',
          content:
            'Limago reflexo offers foot and hand reflexology sessions in the Lot-et-Garonne area. Discover our services to improve your daily well-being.'
        });
      }

      this.metaService.updateTag({ name: 'canonical', href: `https://limago-reflexo.fr${this.router.url}` });
    });

    this.wpService.getHomepage().pipe(
      catchError(error => {
        console.error('Error retrieving homepage data:', error);
        return of(null);
      })
    ).subscribe(data => {
      this.homepageData = data;
      this.cdr.detectChanges();
      this.initAnimations();
    });
  }

  ngOnDestroy(): void {
    this.langSub?.unsubscribe();
  }

  initAnimations(): void {
    gsap.fromTo(
      ".reflexologist-info .line",
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.2,
        duration: 1.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".reflexologist-info",
          start: 'top 80%',
          toggleActions: 'play none none none',
        }
      }
    );

    gsap.fromTo(
      ".slogan",
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".slogan",
          start: 'top 80%',
          toggleActions: 'play none none none',
        }
      }
    );

    gsap.fromTo(
      ".info-section h2",
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.2,
        duration: 1.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".info-section",
          start: 'top 80%',
          toggleActions: 'play none none none',
        }
      }
    );

    gsap.fromTo(
      ".info-section p",
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".info-section",
          start: 'top 80%',
          toggleActions: 'play none none none',
        }
      }
    );

    gsap.fromTo(
      ".info-image",
      { opacity: 0, scale: 0.8 },
      {
        opacity: 1,
        scale: 1,
        duration: 1.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".info-image",
          start: 'top 80%',
          toggleActions: 'play none none none',
        }
      }
    );

    gsap.fromTo(
      ".triptych-container .card",
      { opacity: 0, y: 100 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.2,
        duration: 1.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".triptych-container",
          start: 'top 80%',
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
