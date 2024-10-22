import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ReflexologyData } from '../../models/reflexology-data.model';
import { WordpressService } from '../../services/wordpress.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Title, Meta } from '@angular/platform-browser';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-reflexology',
  templateUrl: './reflexology.component.html',
  styleUrls: ['./reflexology.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class ReflexologyComponent implements OnInit {
  reflexologyData: ReflexologyData[] | null = null;

  constructor(
    private wpService: WordpressService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private titleService: Title,
    private metaService: Meta,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle('Réflexologie - Limago Reflexo');

    this.metaService.updateTag({
      name: 'description',
      content: 'Approfondissez les services de réflexologie offerts par Limago Reflexo pour améliorer votre santé et bien-être général.'
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

    gsap.fromTo('.lead',
      { opacity: 0, y: 50 },
      {
        opacity: 1, y: 0, duration: 1.2, ease: 'power2.out',
        scrollTrigger: {
          trigger: '.operation-content',
          start: 'top 80%',
          toggleActions: 'play none none none',
        }
      }
    );

    gsap.fromTo('.custom-border',
      { opacity: 0, y: 100 },
      {
        opacity: 1, y: 0, duration: 1.8, ease: 'power2.out',
        scrollTrigger: {
          trigger: '.operation-content',
          start: 'top 80%',
          toggleActions: 'play none none none',
        }
      }
    );

    gsap.fromTo('.btn-reserve',
      { opacity: 0, scale: 0.8 },
      {
        opacity: 1, scale: 1, duration: 1.5, ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: '.btn-reserve',
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
