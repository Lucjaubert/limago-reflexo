import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
  standalone: true,
  imports: [ CommonModule, RouterModule ]
})
export class HomepageComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
