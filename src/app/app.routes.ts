import { Routes } from '@angular/router';
import { RockPaperScissorsComponent } from './pages/rock-paper-scissors/rock-paper-scissors.component';
import { TicTacToeComponent } from './pages/tic-tac-toe/tic-tac-toe.component';
import { SamayMenuComponent } from './pages/samay-menu/samay-menu.component';
import { WineListComponent } from './pages/sa/wine-list/wine-list.component';
import { RestaurantListComponent } from './pages/sa/restaurant-list/restaurant-list.component';
import { NotesComponent } from './pages/sa/notes/notes.component';
import { samayGuard } from './guards/samay.guard';
import { Dashboard } from './pages/dashboard/dashboard';
import {About} from './pages/about/about';
import {Experience} from './pages/experience/experience';
import {Education} from './pages/education/education';
import { GamesMenu } from './pages/games-menu/games-menu';
import { Projects } from './pages/projects/projects';


export const routes: Routes = [

  { path: '', redirectTo: '/about', pathMatch: 'full' },
  { path: 'about', component: About },
  { path: 'games', component: GamesMenu },
  { path: 'experience', component: Experience },
  { path: 'education', component: Education },
  { path: 'projects', component: Projects },
  { path: 'games/rock-paper-scissors', component: RockPaperScissorsComponent},
  { path: 'games/tic-tac-toe', component: TicTacToeComponent },
  { path: 'samay', component: SamayMenuComponent },
  { path: 'samay/wines', component: WineListComponent, canActivate: [samayGuard] },
  { path: 'samay/restaurants', component: RestaurantListComponent, canActivate: [samayGuard] },
  { path: 'notes', component: NotesComponent, canActivate: [samayGuard] },
  { path: 'admin/dashboard', component: Dashboard },
  { path: '**', redirectTo: '/about', pathMatch: 'full' },
];
