import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ReserveData } from '../../models/reserve-data.model';
import { WordpressService } from '../../services/wordpress.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-reserve',
  templateUrl: './reserve.component.html',
  styleUrls: ['./reserve.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class ReserveComponent implements OnInit {
  reserveData$: Observable<ReserveData[] | null>;
  activeSection: string = 'reflexology_plantar';

  constructor(private wpService: WordpressService) {
    this.reserveData$ = this.wpService.getReservation().pipe(
      catchError(error => {
        console.error('Error retrieving reserve data:', error);
        return of(null);
      })
    );
  }

  ngOnInit(): void {}

  setActiveSection(section: string): void {
    this.activeSection = section;
  }
}