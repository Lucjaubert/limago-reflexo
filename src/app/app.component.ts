import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [
    RouterModule,
    CommonModule,
    HeaderComponent,
    FooterComponent
  ],
  
})
export class AppComponent {
  title = 'limago-reflexo';
  showHeader = true;
  isPageFullyLoaded = false;
  showFooter = true;

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showFooter = this.router.url !== '/'; 
        
        this.showHeader = this.router.url !== '/';
        
        setTimeout(() => {
          this.isPageFullyLoaded = true;
        }, 1000);
      }
    });
  }
}
