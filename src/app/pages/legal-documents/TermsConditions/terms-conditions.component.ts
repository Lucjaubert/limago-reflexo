import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Observable, catchError, of } from 'rxjs';
import { WordpressService } from '../../../services/wordpress.service';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { TermsData } from '../../../models/terms-data.model';
@Component({
  selector: 'app-terms-conditions',
  templateUrl: './terms-conditions.component.html',
  styleUrls: ['./terms-conditions.component.scss'],
  standalone: true,
  imports: [CommonModule, HeaderComponent, RouterModule]
})
export class TermsConditionsComponent implements OnInit {
  isHomepage = false;
  termsData$: Observable<TermsData[] | null>;

  constructor(
    private wpService: WordpressService, 
  ) { 
    this.termsData$ = this.wpService.getTermsConditions().pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération des données de la page ateliers:', error);
        return of(null); 
      })
    );
  }

  ngOnInit() {
  }

}

