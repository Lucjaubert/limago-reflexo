import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ReserveData } from '../../models/reserve-data.model';
import { WordpressService } from '../../services/wordpress.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-reserve',
  templateUrl: './reserve.component.html',
  styleUrls: ['./reserve.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, NgbModule],
})
export class ReserveComponent implements OnInit {
  reserveData$: Observable<ReserveData[] | null>;
  activeSection: string = 'reflexology_plantar';
  selectedSessionTitle: string;
  selectedSessionContent: string;

  constructor(private wpService: WordpressService) {
    this.reserveData$ = this.wpService.getReservation().pipe(
      catchError(error => {
        console.error('Error retrieving reserve data:', error);
        return of(null);
      })
    );
    this.selectedSessionTitle = '';
    this.selectedSessionContent = '';
  }

  ngOnInit(): void {}

  setActiveSection(section: string): void {
    this.activeSection = section;
  }

  setSelectedSession(title: string, content: string) {
    this.selectedSessionTitle = title;
    this.selectedSessionContent = content;
  }  

  prepareMailToLink() {
    const subject = encodeURIComponent(`Réservation pour ${this.selectedSessionTitle}`);
    const body = encodeURIComponent(
      `Bonjour Magali,\n\n` +
      `Je souhaite réserver la séance suivante le [écrivez la date souhaitée] à [écrivez l'heure souhaitée]:\n\n` +
      `- ${this.selectedSessionTitle}\n\n` +
      `${this.selectedSessionContent}\n\n` +
      `Merci de me confirmer par mail ou bien de m'appeler au [écrivez votre numéro de portable].\n\n` +
      `Cordialement,\n\n` +
      `Votre Nom et Prénom`
    );
    return `mailto:limago.reflexo@gmail.com?subject=${subject}&body=${body}`;
  }

  get mailToLink(): string {
    return this.prepareMailToLink();
  }
}
