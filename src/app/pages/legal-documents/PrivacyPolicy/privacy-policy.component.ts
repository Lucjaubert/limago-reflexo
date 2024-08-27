import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { catchError, Observable, of } from 'rxjs';
import { WordpressService } from '../../../services/wordpress.service';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { PrivacyData } from '../../../models/privacy-data.model';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Title, Meta } from '@angular/platform-browser';

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
    private sanitizer: DomSanitizer,
    private titleService: Title,
    private metaService: Meta,
    private router: Router
  ) { 
    this.privacyData$ = this.wpService.getPrivacyPolicy().pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération des données de la page:', error);
        return of(null); 
      })
    );
  }

  ngOnInit() {
    this.titleService.setTitle('Politique de Confidentialité - Limago Reflexo');
    this.metaService.updateTag({
      name: 'description',
      content: 'Consultez notre politique de confidentialité pour comprendre comment nous protégeons et gérons vos données personnelles chez Limago Reflexo.'
    });
    this.metaService.updateTag({ name: 'canonical', href: `https://limago-reflexo.fr${this.router.url}` });
  }

  getSafeHtml(content: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }
}
