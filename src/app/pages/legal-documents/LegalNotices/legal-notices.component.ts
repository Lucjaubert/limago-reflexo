import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Observable, catchError, of } from 'rxjs';
import { WordpressService } from '../../../services/wordpress.service';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { LegalData } from '../../../models/legal-data.model';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Title, Meta } from '@angular/platform-browser';
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
    private sanitizer: DomSanitizer,
    private titleService: Title,
    private metaService: Meta,
    private router: Router
  ) { 
    this.legal$ = this.wpService.getLegalNotices().pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération des données de la page mentions-legales:', error);
        return of(null); 
      })
    );
  }

  ngOnInit() {
    this.titleService.setTitle('Mentions Légales - Limago Reflexo');
    this.metaService.updateTag({
      name: 'description',
      content: 'Lisez les mentions légales de Limago Reflexo pour en savoir plus sur nos termes, conditions et la réglementation applicable.'
    });
    this.metaService.updateTag({ name: 'canonical', href: `https://limago-reflexo.fr${this.router.url}` });
  }

  getSafeHtml(content: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }

}
