import { Routes } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { IntroComponent } from './components/intro/intro.component';
import { AboutComponent } from './components/about/about.component';
import { WorksComponent } from './components/works/works.component';
import { ContactComponent } from './components/contact/contact.component';
import { FooterComponent } from './components/footer/footer.component';

export const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: IntroComponent },
      { path: 'about', component: AboutComponent },
      { path: 'works', component: WorksComponent },
      { path: 'contact', component: ContactComponent }
    ]
  }
];
