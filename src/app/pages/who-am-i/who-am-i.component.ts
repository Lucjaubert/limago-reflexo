import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { WhoAmIData } from '../../models/whoami-data.model';
import { WordpressService } from '../../services/wordpress.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Title, Meta } from '@angular/platform-browser';
@Component({
  selector: 'app-who-am-i',
  templateUrl: './who-am-i.component.html',
  styleUrls: ['./who-am-i.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class WhoAmIComponent implements OnInit {
  whoAmIData$: Observable<WhoAmIData[] | null>;

  constructor(
    private wpService: WordpressService, 
    private sanitizer: DomSanitizer, 
    private titleService: Title, 
    private metaService: Meta,
    private router: Router
  ) {
    this.whoAmIData$ = this.wpService.getWhoAmI().pipe(
      catchError(error => {
        console.error('Error retrieving whoAmI data:', error);
        return of(null);
      })
    );
  }

  ngOnInit(): void {
    this.titleService.setTitle('Qui suis-je - Limago Reflexo');

    this.metaService.updateTag({
      name: 'description',
      content: 'Découvrez Magali Jaubert, votre spécialiste en réflexologie chez Limago Reflexo, dédiée à votre bien-être à travers la réflexologie plantaire et palmaire.'
    });
    this.metaService.updateTag({ name: 'canonical', href: `https://limago-reflexo.fr${this.router.url}` });
  }

  getSafeHtml(content: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }
}
