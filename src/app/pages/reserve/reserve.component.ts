import { ChangeDetectorRef, Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ReserveData } from '../../models/reserve-data.model';
import { WordpressService } from '../../services/wordpress.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Title, Meta } from '@angular/platform-browser';
@Component({
  selector: 'app-reserve',
  templateUrl: './reserve.component.html',
  styleUrls: ['./reserve.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class ReserveComponent implements OnInit {
  reserveData$: Observable<ReserveData[] | null>;
  activeSection: string = 'reflexology_plantar';  
  selectedSessionTitle: string = '';  
  selectedSessionContent: string = '';  

  @ViewChild('reservationModal') reservationModalTemplate!: TemplateRef<any>;
  @ViewChild('chooseEmailClientModal') chooseEmailClientModalTemplate!: TemplateRef<any>;

  constructor(
    private wpService: WordpressService, 
    private modalService: NgbModal, 
    private ref: ChangeDetectorRef, 
    private sanitizer: DomSanitizer, 
    private titleService: Title, 
    private metaService: Meta,
    private router: Router
  ) {
    this.reserveData$ = this.wpService.getReservation().pipe(
      catchError(error => {
        console.error('Error retrieving reserve data:', error);
        return of(null);
      })
    );
  }

  ngOnInit(): void {
    this.setActiveSection('reflexology_plantar');

    this.titleService.setTitle('Réserver un soin - Limago Reflexo');
    this.metaService.updateTag({
      name: 'description',
      content: 'Réservez une séance de réflexologie plantaire ou palmaire avec Magali Jaubert chez Limago Reflexo pour améliorer votre bien-être général.'
    });
    this.metaService.updateTag({ name: 'canonical', href: `https://limago-reflexo.fr${this.router.url}` });
  }

  setActiveSection(section: string): void {
    console.log('Active section set to:', section);
    this.activeSection = section;
  }

  setSessionAndOpenModal(title: string, content: string, modal: TemplateRef<any> | string) {
    this.setSelectedSession(title, content);
    if (typeof modal === 'string') {
      if (modal === 'email') {
        this.openModal(this.chooseEmailClientModalTemplate);
      } else if (modal === 'call') {
        window.location.href = 'tel:+33681002005';
      }
    } else {
      this.openModal(modal);
    }
  }  

  openModal(templateRef: TemplateRef<any>) {
    this.modalService.open(templateRef, { backdrop: true });
  }

  setSelectedSession(title: string, content: string) {
    if (this.selectedSessionTitle !== title || this.selectedSessionContent !== content) {
      this.selectedSessionTitle = title;
      this.selectedSessionContent = content;
      this.ref.markForCheck();
    }
  }   

  openEmailClient(client: string) {
    const mailLink = this.prepareMailToLink();
    let url = '';
    switch (client) {
      case 'gmail':
        url = `https://mail.google.com/mail/?view=cm&fs=1&to=limago.reflexo@gmail.com&su=${mailLink.subject}&body=${mailLink.body}`;
        break;
      case 'outlook':
        url = mailLink.fullLink;
        break;
      default:
        url = mailLink.fullLink; 
        break;
    }
    window.open(url, '_blank');
  }
  
  prepareMailToLink() {
    const subject = encodeURIComponent(`Réservation pour ${this.selectedSessionTitle}`);
    const body = encodeURIComponent(
      `Bonjour Magali,\n\nJe souhaite réserver la séance suivante le [écrivez la date souhaitée] à [écrivez l'heure souhaitée] :\n\n- ${this.selectedSessionTitle}\n\nMerci de me confirmer par mail ou bien de m'appeler au [écrivez votre numéro de portable].\n\nCordialement,\n\n[Votre Nom et Prénom]`
    );
    return {
      subject,
      body,
      fullLink: `mailto:limago.reflexo@gmail.com?subject=${subject}&body=${body}`
    };
  }   

  get mailToLink(): string {
    return this.prepareMailToLink().fullLink;
  }

  getSafeHtml(content: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }
}
