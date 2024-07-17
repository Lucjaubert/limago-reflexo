import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { catchError, Observable, of } from 'rxjs';
import { WordpressService } from '../../../services/wordpress.service';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { PrivacyData } from '../../../models/privacy-data.model';
@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss'],
  standalone: true,
  imports: [CommonModule, HeaderComponent, RouterModule]
})
export class PrivacyPolicyComponent implements OnInit {
  isHomepage = false;
  privacyData$: Observable<PrivacyData[] | null>;

  constructor(
    private wpService: WordpressService, 
  ) { 
    this.privacyData$ = this.wpService.getPrivacyPolicy().pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération des données de la page ateliers:', error);
        return of(null); 
      })
    );
  }

  ngOnInit() {
  }

}
