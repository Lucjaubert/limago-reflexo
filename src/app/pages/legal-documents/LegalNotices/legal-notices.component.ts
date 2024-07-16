import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Observable, catchError, of } from 'rxjs';
import { WordpressService } from '../../../services/wordpress.service';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { LegalData } from '../../../models/legal-data.model';
@Component({
  selector: 'app-legal-notices',
  templateUrl: './legal-notices.component.html',
  styleUrls: ['./legal-notices.component.scss'],
  standalone: true,
  imports: [CommonModule, HeaderComponent, RouterModule]
})
export class LegalNoticesComponent implements OnInit {
  isHomepage = false;
  legal$: Observable<LegalData[] | null>;

  constructor(
    private wpService: WordpressService, 
  ) { 
    this.legal$ = this.wpService.getLegalNotices().pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération des données de la page mentions-legales:', error);
        return of(null); 
      })
    );
  }

  ngOnInit() {
  }

}
