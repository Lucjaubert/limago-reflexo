import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
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
  private mouseMove = new Subject<MouseEvent>(); 
  private subscription!: Subscription; 

  constructor() { }

  ngOnInit() {
    this.subscription = this.mouseMove.pipe(
      debounceTime(300)  
    ).subscribe(event => {
      this.isHeaderHidden = event.clientY > 100;
    });
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    this.mouseMove.next(event); 
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
