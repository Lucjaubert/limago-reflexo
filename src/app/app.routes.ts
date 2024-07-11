import { Routes } from '@angular/router';
import { IntroComponent } from './pages/intro/intro.component';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { WhoAmIComponent } from './pages/who-am-i/who-am-i.component';
import { ReflexologyComponent } from './pages/reflexology/reflexology.component';
import { ServicesComponent } from './pages/services/services.component';
import { LegalNoticesComponent } from './pages/legal-documents/LegalNotices/legal-notices.component';
import { PrivacyPolicyComponent } from './pages/legal-documents/PrivacyPolicy/privacy-policy.component';
import { TermsConditionsComponent } from './pages/legal-documents/TermsConditions/terms-conditions.component';
import { ReserveComponent } from './pages/reserve/reserve.component';

export const routes: Routes = [
    { path: "", component: IntroComponent, title: "Introduction" },
    { path: 'accueil', component: HomepageComponent, title: 'Accueil' },
    { path: "qui-suis-je", component: WhoAmIComponent, title: 'Qui suis-je' },
    { path: "reflexologie", component: ReflexologyComponent, title: 'La réflexologie' },
    { path: "prestations", component: ServicesComponent, title: 'Prestations' },
    { path: "reserve", component: ReserveComponent, title: 'Réserver' },
    { path: 'mentions-legales', component: LegalNoticesComponent, title: 'Mentions Légales' },
    { path: 'politique-de-confidentialite', component: PrivacyPolicyComponent, title: 'Politique de Confidentialité' },
    { path: 'conditions-generales-de-vente', component: TermsConditionsComponent, title: 'Conditions Générales de Ventes' }
];

