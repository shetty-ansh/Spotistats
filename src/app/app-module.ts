import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Login } from './Components/login/login';
import { Callback } from './Components/callback/callback';
import { Homepage } from './Components/homepage/homepage';

@NgModule({
  declarations: [
    App,
    Login,
    Callback,
    Homepage
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
