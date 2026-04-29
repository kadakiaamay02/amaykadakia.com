import { Routes } from '@angular/router';
import { AboutComponent } from './components/about/about.component';
import { GamesMenuComponent } from './components/games-menu/games-menu.component';
import { RockPaperScissorsComponent } from './components/rock-paper-scissors/rock-paper-scissors.component';
import { TicTacToeComponent } from './components/tic-tac-toe/tic-tac-toe.component';
import { SamayMenuComponent } from './components/samay-menu/samay-menu.component';
import { WineListComponent } from './components/sa/wine-list/wine-list.component';
import { RestaurantListComponent } from './components/sa/restaurant-list/restaurant-list.component';
import { NotesComponent } from './components/sa/notes/notes.component';


export const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: AboutComponent },
      { path: 'games', component: GamesMenuComponent },
      { path: 'samay', component: SamayMenuComponent },
      { path: 'samay/wines', component: WineListComponent },
      { path: 'samay/restaurants', component: RestaurantListComponent },
      { path: 'games/rock-paper-scissors', component: RockPaperScissorsComponent},
      { path: 'games/tic-tac-toe', component: TicTacToeComponent },
      {path: 'notes', component: NotesComponent }
    ]
  }
];
