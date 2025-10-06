import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Login } from './Components/login/login';
import { Callback } from './Components/callback/callback';
import { Homepage } from './Components/homepage/homepage';
// import { Testing } from './Components/testing/testing';
import { Navbar } from './Components/navbar/navbar';
import { Artists } from './Components/artists/artists';
import { Dashboard } from './Components/dashboard/dashboard';
import { Recents } from './Components/recents/recents';
import { Share } from './Components/share/share';

@NgModule({
   declarations: [
    App,
    Login,
    Callback,
    Homepage,
    // Testing,
    Navbar,
    Artists,
    Dashboard,
    Recents,
    Share,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: [App]
})
export class AppModule { }
