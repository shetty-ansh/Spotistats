
import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../../Services/spotify-service';

@Component({
  selector: 'app-artists',
  standalone: false,
  templateUrl: './artists.html',
  styleUrls: ['./artists.css']
})
export class Artists implements OnInit {

  topArtistsShort: any[] = [];
  topArtistsMedium: any[] = [];
  token: string | null = null;
  isArtistsToggled = false;
  currentIndex: number = 0;

  constructor(private spotifyService: SpotifyService) { }

  async ngOnInit() {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const hash = window.location.hash;
    const token = new URLSearchParams(hash.substring(1)).get('access_token');

    // Prefer already-stored token (refresh-safe)
    const storedToken = this.spotifyService.getStoredAccessToken();
    if (storedToken && !token) {
      this.token = storedToken;
      await this.fetchUserData();
      // Clean URL if stale code remains
      if (code) {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
      return;
    }

    if (code) {
      const accessToken = await this.spotifyService.getAccessToken(code);
      this.token = accessToken;
      
      this.topArtistsShort = await this.spotifyService.fetchTop(accessToken, 'artists', 'short_term');
      this.topArtistsMedium = await this.spotifyService.fetchTop(accessToken, 'artists', 'medium_term');

      if (!accessToken) {
        console.error("Failed to get access token. Check token exchange process.");
        // Fallback: try stored token if present
        const fallback = this.spotifyService.getStoredAccessToken();
        if (fallback) {
          this.token = fallback;
          await this.fetchUserData();
        }
        return;
      }
    }

    if (token) {
      this.spotifyService.setAccessToken(token);
      this.token = token;
      await this.fetchUserData();
      // Remove hash/code from URL after acquiring token
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (!code) {
      const stored = this.spotifyService.getStoredAccessToken();
      if (stored) {
        this.token = stored;
        await this.fetchUserData();
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }

  async fetchUserData() {
    if (!this.token) return;
    this.topArtistsShort = await this.spotifyService.fetchTop(this.token, 'artists', 'short_term');
    this.topArtistsMedium = await this.spotifyService.fetchTop(this.token, 'artists', 'medium_term');
  }

  toggleArtistSwitch() {
    this.isArtistsToggled = !this.isArtistsToggled;
    this.currentIndex = 0;
  }

  visibleArtists() {
    const artists = this.isArtistsToggled ? this.topArtistsMedium : this.topArtistsShort;
    const start = this.currentIndex - 2;
    const result = [];

    for (let i = start; i < start + 5; i++) {
      const index = (i + artists.length) % artists.length;
      result.push(artists[index]);
    }

    return result;
  }

  toTitleCase(str: string): string {
    return str.replace(/\b\w/g, char => char.toUpperCase());
  }

  getCardClass(i: number): string {
    switch (i) {
      case 0:
        return 'far-left';
      case 1:
        return 'left';
      case 2:
        return 'center';
      case 3:
        return 'right';
      case 4:
        return 'far-right';
      default:
        return '';
    }
  }

  nextSlide() {
    const artists = this.isArtistsToggled ? this.topArtistsMedium : this.topArtistsShort;
    this.currentIndex = (this.currentIndex + 1) % artists.length;
  }

  prevSlide() {
    const artists = this.isArtistsToggled ? this.topArtistsMedium : this.topArtistsShort;
    this.currentIndex = (this.currentIndex - 1 + artists.length) % artists.length;
  }
}
