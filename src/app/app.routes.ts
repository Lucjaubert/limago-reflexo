import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', loadComponent: () => import('./pages/intro/intro.component').then(m => m.IntroComponent), title: "Introduction" },
    { path: 'accueil', loadComponent: () => import('./pages/homepage/homepage.component').then(m => m.HomepageComponent), title: 'Accueil' },
    { path: 'qui-suis-je', loadComponent: () => import('./pages/who-am-i/who-am-i.component').then(m => m.WhoAmIComponent), title: 'Qui suis-je' },
    { path: 'reflexologie', loadComponent: () => import('./pages/reflexology/reflexology.component').then(m => m.ReflexologyComponent), title: 'La réflexologie' },
    { path: 'prestations', loadComponent: () => import('./pages/services/services.component').then(m => m.ServicesComponent), title: 'Prestations' },
    { path: 'reservation', loadComponent: () => import('./pages/reserve/reserve.component').then(m => m.ReserveComponent), title: 'Réserver' },
    { path: 'mentions-legales', loadComponent: () => import('./pages/legal-documents/LegalNotices/legal-notices.component').then(m => m.LegalNoticesComponent), title: 'Mentions Légales' },
    { path: 'politique-de-confidentialite', loadComponent: () => import('./pages/legal-documents/PrivacyPolicy/privacy-policy.component').then(m => m.PrivacyPolicyComponent), title: 'Politique de Confidentialité' },
    { path: 'conditions-generales-de-vente', loadComponent: () => import('./pages/legal-documents/TermsConditions/terms-conditions.component').then(m => m.TermsConditionsComponent), title: 'Conditions Générales de Ventes' },
    { path: '404', loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent), title: 'Page non trouvée' },
    { path: '**', redirectTo: '/404' }
];

