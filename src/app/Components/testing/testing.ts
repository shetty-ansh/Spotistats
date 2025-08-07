import { Component } from '@angular/core';
import { SpotifyService } from '../../Services/spotify-service';

@Component({
  selector: 'app-testing',
  standalone: false,
  templateUrl: './testing.html',
  styleUrl: './testing.css'
})
export class Testing {
profile: any = null;

  topTracksShort: any[] = [];
  topTracksMedium: any[] = [];
  topArtistsShort: any[] = [];
  topArtistsMedium: any[] = [];

  isToggled = false;
currentIndex: number = 0;

  constructor(private spotifyService: SpotifyService) { }

  async ngOnInit() {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
      const accessToken = await this.spotifyService.getAccessToken(code);
      this.profile = await this.spotifyService.fetchProfile(accessToken);
      this.topTracksShort = await this.spotifyService.fetchTop(accessToken, 'tracks', 'short_term');
      this.topTracksMedium = await this.spotifyService.fetchTop(accessToken, 'tracks', 'medium_term');
      this.topArtistsShort = await this.spotifyService.fetchTop(accessToken, 'artists', 'short_term');
      this.topArtistsMedium = await this.spotifyService.fetchTop(accessToken, 'artists', 'medium_term');
    }
  }

 toggleSwitch() {
  this.isToggled = !this.isToggled;
  this.currentIndex = 0;
}




visibleTracks() {
  const tracks = this.isToggled ? this.topTracksMedium : this.topTracksShort;
  const start = this.currentIndex - 2;
  const result = [];

  for (let i = start; i < start + 5; i++) {
    const index = (i + tracks.length) % tracks.length;
    result.push(tracks[index]);
  }

  return result;
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
  this.currentIndex = (this.currentIndex + 1) % this.topTracksShort.length;
}

prevSlide() {
  this.currentIndex =
    (this.currentIndex - 1 + this.topTracksShort.length) %
    this.topTracksShort.length;
}


}
