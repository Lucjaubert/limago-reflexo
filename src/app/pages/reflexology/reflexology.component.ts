import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ReflexologyData } from '../../models/reflexology-data.model';
import { WordpressService } from '../../services/wordpress.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Title, Meta } from '@angular/platform-browser';
@Component({
  selector: 'app-reflexology',
  templateUrl: './reflexology.component.html',
  styleUrls: ['./reflexology.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class ReflexologyComponent implements OnInit {
  reflexologyData$: Observable<ReflexologyData[] | null>;

  constructor(
    private wpService: WordpressService, 
    private router: Router,
    private sanitizer: DomSanitizer,
    private titleService: Title,
    private metaService: Meta
  ) {
    this.reflexologyData$ = this.wpService.getReflexology().pipe(
      catchError(error => {
        console.error('Error retrieving reflexology data:', error);
        return of(null);
      })
    );
  }

  ngOnInit(): void {
    this.titleService.setTitle('Réflexologie - Limago Reflexo');
  
    this.metaService.updateTag({
      name: 'description',
      content: 'Approfondissez les services de réflexologie offerts par Limago Reflexo pour améliorer votre santé et bien-être général.'
    });
    this.metaService.updateTag({ name: 'canonical', href: `https://limago-reflexo.fr${this.router.url}` });
  }
  

  navigateToReservation(): void {
    this.router.navigate(['/reservation']); 
  }

  getSafeHtml(content: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }
}
