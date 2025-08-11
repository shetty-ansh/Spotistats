import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../../Services/spotify-service';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar implements OnInit {
  token: string | null = null;
  profile: any = {};
  isDropdownVisible = false;

  constructor(private spotifyService: SpotifyService) {}

  async ngOnInit() {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const hash = window.location.hash;
    const token = new URLSearchParams(hash.substring(1)).get('access_token');

    if (code) {
      const accessToken = await this.spotifyService.getAccessToken(code);
      this.token = accessToken;

      if (this.token) {
        this.profile = await this.spotifyService.fetchProfile(this.token);
      } else {
        console.error('Failed to get access token. Check token exchange process.');
        return;
      }

      if (token) {
        localStorage.setItem('access_token', token);
        this.spotifyService.setAccessToken(token);
        this.token = token;
      }
    }
  }

  // Dropdown show/hide methods
  showDropdown() {
    this.isDropdownVisible = true;
  }

  hideDropdown() {
    this.isDropdownVisible = false;
  }

  onMenuItemClick(item: string) {
    console.log(`Clicked: ${item}`);
  }
}
