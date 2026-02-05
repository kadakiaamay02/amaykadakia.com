import { Routes } from '@angular/router';
import { AboutComponent } from './components/about/about.component';
import { GamesMenuComponent } from './components/games-menu/games-menu.component';
import { RockPaperScissorsComponent } from './components/rock-paper-scissors/rock-paper-scissors.component';


export const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: AboutComponent },
      { path: 'games', component: GamesMenuComponent },
      { path: 'games/rock-paper-scissors', component: RockPaperScissorsComponent}
    ]
  }
];
