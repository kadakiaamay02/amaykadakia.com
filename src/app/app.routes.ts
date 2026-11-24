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
import { FlightTracker } from './pages/flight-tracker/flight-tracker';


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
  // Wedding pages load only when opened, so they don't add to the size of the public site
  { path: 'samay/engagement-checklist', canActivate: [samayGuard], data: { checklist: 'engagement' },
    loadComponent: () => import('./pages/sa/checklist/checklist.component').then(m => m.ChecklistComponent) },
  { path: 'samay/wedding-checklist', canActivate: [samayGuard], data: { checklist: 'wedding' },
    loadComponent: () => import('./pages/sa/checklist/checklist.component').then(m => m.ChecklistComponent) },
  { path: 'samay/wedding-people', canActivate: [samayGuard],
    loadComponent: () => import('./pages/sa/wedding-people/wedding-people.component').then(m => m.WeddingPeopleComponent) },
  { path: 'samay/guest-flights', canActivate: [samayGuard],
    loadComponent: () => import('./pages/sa/guest-flights/guest-flights.component').then(m => m.GuestFlightsComponent) },
  { path: 'admin/dashboard', component: Dashboard },
  { path: 'flight-tracker', component: FlightTracker },
  { path: '**', redirectTo: '/about', pathMatch: 'full' },
];
