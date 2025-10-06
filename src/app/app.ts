import { Component, signal } from '@angular/core';
import { Login } from './Components/login/login';
import { Callback } from './Components/callback/callback';
import { SpotifyService } from './Services/spotify-service';


@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrls: ['./app.css']
})
export class App {
  constructor( private spotifyService: SpotifyService){}
  protected readonly title = signal('SpotifyApp5');

  ngOnInit() {
  const token = localStorage.getItem('access_token');
  if (token) {
    this.spotifyService.setAccessToken(token);
    // Optionally call fetch methods here if needed globally
  }
}

}
