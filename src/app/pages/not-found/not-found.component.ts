import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

import { LanguageService, Lang } from '../../services/language.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class NotFoundComponent implements OnInit, OnDestroy {
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

  setLang(lang: Lang): void {
    this.languageService.setLang(lang);
  }
}
