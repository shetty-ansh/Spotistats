import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { App } from './app';
import { Login } from './Components/login/login';
import { Callback } from './Components/callback/callback';
import { Homepage } from './Components/homepage/homepage';
import { Artists } from './Components/artists/artists';
import { Recents } from './Components/recents/recents';
import { Dashboard } from './Components/dashboard/dashboard';
import { Navbar } from './Components/navbar/navbar';
import { Tracks } from './Components/tracks/tracks';
import { DemoPageComponent } from './Components/morphing-card-stack/demo-page';
import { DnaComponent } from './Components/dna/dna';

const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'callback', component: Callback },
  { path: 'homepage', component: Homepage },
  { path: 'dashboard', component: Dashboard },
  { path: 'artists', component: Artists },
  { path: 'recents', component: Recents },
  { path: 'tracks', component: Tracks },
  { path: 'demo', component: DemoPageComponent },
  { path: 'dna', component: DnaComponent },
  { path: '', redirectTo: '/homepage', pathMatch: 'full' }
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
