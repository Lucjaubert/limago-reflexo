import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ReserveData } from '../../models/reserve-data.model';
import { WordpressService } from '../../services/wordpress.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Title, Meta } from '@angular/platform-browser';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { LanguageService, Lang } from '../../services/language.service';

@Component({
  selector: 'app-reserve',
  templateUrl: './reserve.component.html',
  styleUrls: ['./reserve.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class ReserveComponent implements OnInit, OnDestroy {
  reserveData: ReserveData[] | null = null;

  activeSection: string = 'reflexology_plantar';
  selectedSessionTitle: string = '';
  selectedSessionContent: string = '';

  lang: Lang = 'fr';
  private langSub?: Subscription;

  @ViewChild('reservationModal') reservationModalTemplate!: TemplateRef<any>;
  @ViewChild('chooseEmailClientModal') chooseEmailClientModalTemplate!: TemplateRef<any>;

  constructor(
    private wpService: WordpressService,
    private modalService: NgbModal,
    private sanitizer: DomSanitizer,
    private titleService: Title,
    private metaService: Meta,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {
    this.lang = this.languageService.current;

    this.langSub = this.languageService.lang$.subscribe(l => {
      this.lang = l;

      if (l === 'fr') {
        this.titleService.setTitle('Réserver un soin - Limago Reflexo');
        this.metaService.updateTag({
          name: 'description',
          content: 'Réservez une séance de réflexologie plantaire ou palmaire avec Magali Jaubert chez Limago Reflexo.'
        });
      } else {
        this.titleService.setTitle('Book a treatment - Limago Reflexo');
        this.metaService.updateTag({
          name: 'description',
          content: 'Book a foot and/or hand reflexology session with Magali Jaubert (Limago Reflexo).'
        });
      }

      this.metaService.updateTag({ name: 'canonical', href: `https://limago-reflexo.fr${this.router.url}` });
    });

    this.setActiveSection('reflexology_plantar');

    gsap.registerPlugin(ScrollTrigger);

    this.wpService.getReservation().pipe(
      catchError(error => {
        console.error('Error retrieving reserve data:', error);
        return of(null);
      })
    ).subscribe(data => {
      this.reserveData = data;
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
    gsap.fromTo(
      '.image-container',
      { opacity: 0, x: -100 },
      {
        opacity: 1,
        x: 0,
        duration: 1.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.image-container',
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      }
    );

    gsap.fromTo(
      '.content-container',
      { opacity: 0, x: 100 },
      {
        opacity: 1,
        x: 0,
        duration: 1.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.content-container',
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      }
    );

    gsap.fromTo(
      '.btn-reserve',
      { opacity: 0, scale: 0.9 },
      {
        opacity: 1,
        scale: 1,
        duration: 1.0,
        ease: 'back.out(1.4)',
        scrollTrigger: {
          trigger: '.btn-reserve',
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    );
  }

  setActiveSection(section: string): void {
    this.activeSection = section;
    this.cdr.detectChanges();
  }

  setSessionAndOpenModal(title: string, content: string, modal: TemplateRef<any> | string) {
    this.selectedSessionTitle = title;
    this.selectedSessionContent = content;

    if (typeof modal === 'string') {
      if (modal === 'email') {
        this.openModal(this.chooseEmailClientModalTemplate);
      } else if (modal === 'call') {
        window.location.href = 'tel:+33681002005';
      }
      return;
    }

    this.openModal(modal);
  }

  openModal(templateRef: TemplateRef<any>) {
    this.modalService.open(templateRef, { backdrop: true });
  }

  openEmailClient(client: string) {
    const mailLink = this.prepareMailToLink();
    let url = '';

    switch (client) {
      case 'gmail':
        url = `https://mail.google.com/mail/?view=cm&fs=1&to=limago.reflexo@gmail.com&su=${mailLink.subject}&body=${mailLink.body}`;
        break;
      case 'outlook':
      default:
        url = mailLink.fullLink;
        break;
    }

    window.open(url, '_blank');
  }

  prepareMailToLink() {
    const subjectText =
      this.lang === 'fr'
        ? `Réservation pour ${this.selectedSessionTitle}`
        : `Booking request: ${this.selectedSessionTitle}`;

    const bodyText =
      this.lang === 'fr'
        ? `Bonjour Magali,\n\nJe souhaite réserver la séance suivante le [écrivez la date souhaitée] à [écrivez l'heure souhaitée] :\n\n- ${this.selectedSessionTitle}\n\nMerci de me confirmer par mail ou bien de m'appeler au [écrivez votre numéro de portable].\n\nCordialement,\n\n[Votre Nom et Prénom]`
        : `Hello Magali,\n\nI would like to book the following session on [desired date] at [desired time]:\n\n- ${this.selectedSessionTitle}\n\nCould you please confirm by email, or call me at [your phone number].\n\nKind regards,\n\n[Your name]`;

    const subject = encodeURIComponent(subjectText);
    const body = encodeURIComponent(bodyText);

    return {
      subject,
      body,
      fullLink: `mailto:limago.reflexo@gmail.com?subject=${subject}&body=${body}`,
    };
  }

  getSafeHtml(content: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }
}
