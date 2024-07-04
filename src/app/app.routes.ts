import { Routes } from '@angular/router';
import { IntroComponent } from './pages/intro/intro.component';
import { HomepageComponent } from './pages/homepage/homepage.component';

export const routes: Routes = [
    { path: "", component: IntroComponent, title: "Introduction" },
    { path: 'accueil', component: HomepageComponent, title: 'Accueil' },
];

