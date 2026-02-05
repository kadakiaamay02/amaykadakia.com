import { Routes } from '@angular/router';
import { AboutComponent } from './components/about/about.component';
import { GamesMenuComponent } from './components/games-menu/games-menu.component';


export const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: AboutComponent },
      { path: 'games', component: GamesMenuComponent }
    ]
  }
];
