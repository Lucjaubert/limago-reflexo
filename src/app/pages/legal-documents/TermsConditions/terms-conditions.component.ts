import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Observable, catchError, of } from 'rxjs';
import { WordpressService } from '../../../services/wordpress.service';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { TermsData } from '../../../models/terms-data.model';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Title, Meta } from '@angular/platform-browser';
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
    private sanitizer: DomSanitizer,
    private titleService: Title,
    private metaService: Meta,
    private router: Router
  ) { 
    this.termsData$ = this.wpService.getTermsConditions().pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération des données de la page ateliers:', error);
        return of(null); 
      })
    );
  }

  ngOnInit() {
    this.titleService.setTitle('Conditions Générales de Vente - Limago Reflexo');
    this.metaService.updateTag({
      name: 'description',
      content: 'Familiarisez-vous avec les conditions générales de vente de Limago Reflexo pour une meilleure compréhension de nos services et engagements.'
    });
    this.metaService.updateTag({ name: 'canonical', href: `https://limago-reflexo.fr${this.router.url}` });
  }

  getSafeHtml(content: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }

}

