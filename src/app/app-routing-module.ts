import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { App } from './app';
import { Login } from './Components/login/login';
import { Callback } from './Components/callback/callback';
import { Homepage } from './Components/homepage/homepage';
// import { Testing } from './Components/testing/testing';

const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'callback', component: Callback },
  { path: 'homepage', component: Homepage },
  // { path: 'testing', component: Testing },
  { path: '', redirectTo: '/homepage', pathMatch: 'full' }
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
