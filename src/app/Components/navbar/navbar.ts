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

    // Use stored token first (handles refresh/other routes)
    const stored = this.spotifyService.getStoredAccessToken();
    if (stored && !token && !code) {
      this.token = stored;
      this.profile = await this.spotifyService.fetchProfile(stored);
      return;
    }

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
        this.spotifyService.setAccessToken(token);
        this.token = token;
      }

      // Clean the URL once we have the token
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      const fallback = this.spotifyService.getStoredAccessToken();
      if (fallback) {
        this.token = fallback;
        this.profile = await this.spotifyService.fetchProfile(fallback);
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

  toggleDropdown(event: Event) {
    event.preventDefault();
    this.isDropdownVisible = !this.isDropdownVisible;
  }

  onProfileKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.isDropdownVisible = !this.isDropdownVisible;
    } else if (event.key === 'Escape') {
      this.hideDropdown();
    }
  }
}
