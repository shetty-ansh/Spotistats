// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-callback',
//   standalone: false,
//   templateUrl: './callback.html',
//   styleUrl: './callback.css'
// })
// export class Callback implements OnInit {
//   profile: any = null;

//   topTracksShort: any[] = [];
//   topTracksMedium: any[] = [];
//   topArtistsShort: any[] = [];
//   topArtistsMedium: any[] = [];

//   isToggled = false;

//   async ngOnInit() {
//     const clientId = "74c9a58619d7490c88ebeb90616810d5";
//     const params = new URLSearchParams(window.location.search);
//     const code = params.get("code");

//     if (code) {
//       const accessToken = await this.getAccessToken(clientId, code);
//       const profile = await this.fetchProfile(accessToken);
//       this.profile = profile;
//       this.topTracksShort = await this.fetchTop(accessToken, 'tracks', 'short_term');
//       this.topTracksMedium = await this.fetchTop(accessToken, 'tracks', 'medium_term');
//       this.topArtistsShort = await this.fetchTop(accessToken, 'artists', 'short_term');
//       this.topArtistsMedium = await this.fetchTop(accessToken, 'artists', 'medium_term');

//     }
//   }

//   async getAccessToken(clientId: string, code: string): Promise<string> {
//     const verifier = localStorage.getItem("verifier")!;
//     const params = new URLSearchParams();
//     params.append("client_id", clientId);
//     params.append("grant_type", "authorization_code");
//     params.append("code", code);
//     params.append("redirect_uri", "http://127.0.0.1:5173/callback");
//     params.append("code_verifier", verifier);

//     const result = await fetch("https://accounts.spotify.com/api/token", {
//       method: "POST",
//       headers: { "Content-Type": "application/x-www-form-urlencoded" },
//       body: params
//     });

//     const { access_token } = await result.json();
//     return access_token;
//   }

//   async fetchProfile(token: string): Promise<any> {
//     const result = await fetch("https://api.spotify.com/v1/me", {
//       method: "GET",
//       headers: { Authorization: `Bearer ${token}` }
//     });

//     return await result.json();
//   }

//   async fetchTop(token: string, type: string, timeRange: string): Promise<any[]> {
//     const result = await fetch(`https://api.spotify.com/v1/me/top/${type}?time_range=${timeRange}&limit=10`, {
//       method: "GET",
//       headers: { Authorization: `Bearer ${token}` }
//     });
//     const data = await result.json();
//     return data.items || [];
//   }

//   toggleSwitch() {
//   this.isToggled = !this.isToggled;
// }

// }











import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../../Services/spotify-service';

@Component({
  selector: 'app-callback',
  standalone: false,
  templateUrl: './callback.html',
  styleUrl: './callback.css'
})
export class Callback implements OnInit {
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
    const hash = window.location.hash;
  const token = new URLSearchParams(hash.substring(1)).get('access_token');

    if (code) {
      const accessToken = await this.spotifyService.getAccessToken(code);
      this.profile = await this.spotifyService.fetchProfile(accessToken);
      this.topTracksShort = await this.spotifyService.fetchTop(accessToken, 'tracks', 'short_term');
      this.topTracksMedium = await this.spotifyService.fetchTop(accessToken, 'tracks', 'medium_term');
      this.topArtistsShort = await this.spotifyService.fetchTop(accessToken, 'artists', 'short_term');
      this.topArtistsMedium = await this.spotifyService.fetchTop(accessToken, 'artists', 'medium_term');
    }

    if (token) {
    localStorage.setItem('access_token', token);
    this.spotifyService.setAccessToken(token);
    this.fetchUserData(); // load profile + top tracks
  }
  
  }
  fetchUserData() {
    throw new Error('Method not implemented.');
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
