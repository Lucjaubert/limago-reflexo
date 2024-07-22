import { Component, HostListener, OnInit, OnDestroy, ChangeDetectorRef  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class HeaderComponent implements OnInit, OnDestroy {
  isHeaderHidden = false; 
  navbarExpanded = false;
  private mouseMove = new Subject<MouseEvent>(); 
  private subscription!: Subscription; 

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.subscription = this.mouseMove.pipe(
      debounceTime(300)  
    ).subscribe(event => {
      this.isHeaderHidden = event.clientY > 100;
      this.cdr.detectChanges();
    });
  }

  toggleMenu() {
    this.navbarExpanded = !this.navbarExpanded;
    console.log("Menu toggle state:", this.navbarExpanded);
    this.cdr.detectChanges();
    const headerElement = document.querySelector('.header') as HTMLElement;
    if (headerElement) {
        if (this.navbarExpanded) {
            headerElement.classList.add('is-active');
        } else {
            headerElement.classList.remove('is-active');
        }
    }
  }
  
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  
  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    this.mouseMove.next(event); 
  }

}
