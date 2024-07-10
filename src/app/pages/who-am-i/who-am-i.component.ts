import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { WhoAmIData } from '../../models/whoami-data.model';
import { WordpressService } from '../../services/wordpress.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-who-am-i',
  templateUrl: './who-am-i.component.html',
  styleUrls: ['./who-am-i.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class WhoAmIComponent implements OnInit {
  whoAmIData$: Observable<WhoAmIData[] | null>;

  constructor(private wpService: WordpressService) {
    this.whoAmIData$ = this.wpService.getWhoAmI().pipe(
      catchError(error => {
        console.error('Error retrieving whoAmI data:', error);
        return of(null);
      })
    );
  }

  ngOnInit(): void {}
}
