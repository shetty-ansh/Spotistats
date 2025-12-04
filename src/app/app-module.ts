import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Login } from './Components/login/login';
import { Callback } from './Components/callback/callback';
import { Homepage } from './Components/homepage/homepage';
// import { Testing } from './Components/testing/testing';
import { Navbar } from './Components/navbar/navbar';
import { Artists } from './Components/artists/artists';
import { Dashboard } from './Components/dashboard/dashboard';
import { Share } from './Components/share/share';
import { Tracks } from './Components/tracks/tracks';
import { MorphingCardDemoComponent } from './Components/morphing-card-stack/demo.component';
import { MorphingCardStackComponent } from './Components/morphing-card-stack/morphing-card-stack.component';
import { DemoPageComponent } from './Components/morphing-card-stack/demo-page';
import { DnaComponent } from './Components/dna/dna';

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
    Share,
    Tracks,
    MorphingCardDemoComponent,
    MorphingCardStackComponent,
    DemoPageComponent,
    DnaComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule, // Explicitly includes DatePipe and common directives
    BrowserAnimationsModule,
    AppRoutingModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: [App]
})
export class AppModule { }
