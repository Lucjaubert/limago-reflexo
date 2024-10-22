import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { WordpressService } from '../../services/wordpress.service';
import { HomepageData } from '../../models/homepage-data.model';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class HomepageComponent implements OnInit {
  homepageData$: Observable<HomepageData[] | null>;

  constructor(
    private wpService: WordpressService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private titleService: Title,
    private metaService: Meta

  ) {
    this.homepageData$ = this.wpService.getHomepage().pipe(
      catchError(error => {
        console.error('Error retrieving homepage data:', error);
        return of(null); 
      })
    );
  }

  ngOnInit(): void {
    this.titleService.setTitle('Limago reflexo - Magali Jaubert, réflexologie plantaire et palmaire');

    this.metaService.updateTag({ name: 'description', content: 'Limago reflexo offre des services de reflexologie plantaire et palmaire dans la région du Lot-et-Garonne. Découvrez nos services pour améliorer votre bien-être quotidien.' });

    this.metaService.updateTag({ name: 'canonical', href: `https://limago-reflexo.fr${this.router.url}` });
  }
  

  navigateToReservation(): void {
    this.router.navigate(['/reservation']); 
  }

  getSafeHtml(content: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }
}
