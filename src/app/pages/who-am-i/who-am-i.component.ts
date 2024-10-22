import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { WhoAmIData } from '../../models/whoami-data.model';
import { WordpressService } from '../../services/wordpress.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Title, Meta } from '@angular/platform-browser';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-who-am-i',
  templateUrl: './who-am-i.component.html',
  styleUrls: ['./who-am-i.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class WhoAmIComponent implements OnInit {
  whoAmIData: WhoAmIData[] | null = null;

  constructor(
    private wpService: WordpressService,
    private sanitizer: DomSanitizer,
    private titleService: Title,
    private metaService: Meta,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle('Qui suis-je - Limago Reflexo');

    this.metaService.updateTag({
      name: 'description',
      content: 'Découvrez Magali Jaubert, votre spécialiste en réflexologie chez Limago Reflexo, dédiée à votre bien-être à travers la réflexologie plantaire et palmaire.'
    });
    this.metaService.updateTag({ name: 'canonical', href: `https://limago-reflexo.fr${this.router.url}` });

    gsap.registerPlugin(ScrollTrigger);

    this.wpService.getWhoAmI().pipe(
      catchError(error => {
        console.error('Error retrieving whoAmI data:', error);
        return of(null);
      })
    ).subscribe(data => {
      this.whoAmIData = data;
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

    gsap.fromTo('.degrees-content',
      { opacity: 0, y: 50 },
      {
        opacity: 1, y: 0, duration: 1.5, ease: 'power2.out',
        scrollTrigger: {
          trigger: '.degrees-content',
          start: 'top 80%',
          toggleActions: 'play none none none',
        }
      }
    );
  }

  getSafeHtml(content: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }
}
