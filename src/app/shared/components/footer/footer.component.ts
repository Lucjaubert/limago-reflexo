import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

import { LanguageService, Lang } from '../../../services/language.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class FooterComponent implements OnInit, OnDestroy {
  lang: Lang = 'fr';
  private sub?: Subscription;

  constructor(private languageService: LanguageService) {}

  ngOnInit(): void {
    this.lang = this.languageService.current;
    this.sub = this.languageService.lang$.subscribe(l => (this.lang = l));
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  debugClick(label: string, event: MouseEvent): void {
  // Si tu veux voir si un overlay reçoit le clic :
  // console.log('target:', event.target, 'currentTarget:', event.currentTarget);

  // log simple
  // eslint-disable-next-line no-console
  console.log('[FOOTER CLICK]', label);
}
}
