import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ServicesData } from '../../models/services-data.model';
import { WordpressService } from '../../services/wordpress.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Title, Meta } from '@angular/platform-browser';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class ServicesComponent implements OnInit {
  servicesData: ServicesData[] | null = null;

  constructor(
    private wpService: WordpressService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private titleService: Title,
    private metaService: Meta,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle('Nos Prestations - Limago Reflexo');

    this.metaService.updateTag({
      name: 'description',
      content: 'Explorez les diverses prestations de réflexologie offertes par Limago Reflexo pour prendre soin de votre santé et bien-être.'
    });
    this.metaService.updateTag({ name: 'canonical', href: `https://limago-reflexo.fr${this.router.url}` });

    gsap.registerPlugin(ScrollTrigger);

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
