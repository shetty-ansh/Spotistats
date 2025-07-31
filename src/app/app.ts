import { Component, signal } from '@angular/core';
import { Login } from './Components/login/login';
import { Callback } from './Components/callback/callback';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('SpotifyApp5');
}
