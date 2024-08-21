import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ServicesData } from '../../models/services-data.model';
import { WordpressService } from '../../services/wordpress.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class ServicesComponent implements OnInit {
  servicesData$: Observable<ServicesData[] | null>;

  constructor(
    private wpService: WordpressService,
    private router: Router,
    private sanitizer: DomSanitizer 
  ) {
    this.servicesData$ = this.wpService.getServices().pipe(
      catchError(error => {
        console.error('Error retrieving services data:', error);
        return of(null);
      })
    );
  }

  ngOnInit(): void {}

  navigateToReservation(): void {
    this.router.navigate(['/reservation']); 
  }

  getSafeHtml(content: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }
}
