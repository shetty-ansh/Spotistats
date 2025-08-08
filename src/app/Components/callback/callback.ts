// import { Component, OnInit } from '@angular/core';
// import { SpotifyService } from '../../Services/spotify-service';

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
//   currentIndex: number = 0;

//   constructor(private spotifyService: SpotifyService) { }

//   async ngOnInit() {
//     const params = new URLSearchParams(window.location.search);
//     const code = params.get("code");
//     const hash = window.location.hash;
//   const token = new URLSearchParams(hash.substring(1)).get('access_token');

//     if (code) {
//       const accessToken = await this.spotifyService.getAccessToken(code);
//       this.profile = await this.spotifyService.fetchProfile(accessToken);
//       this.topTracksShort = await this.spotifyService.fetchTop(accessToken, 'tracks', 'short_term');
//       this.topTracksMedium = await this.spotifyService.fetchTop(accessToken, 'tracks', 'medium_term');
//       this.topArtistsShort = await this.spotifyService.fetchTop(accessToken, 'artists', 'short_term');
//       this.topArtistsMedium = await this.spotifyService.fetchTop(accessToken, 'artists', 'medium_term');
//     }

//     if (token) {
//     localStorage.setItem('access_token', token);
//     this.spotifyService.setAccessToken(token);
//     this.fetchUserData(); // load profile + top tracks
//   }

//   }
//   fetchUserData() {
//     throw new Error('Method not implemented.');
//   }

//   toggleSwitch() {
//     this.isToggled = !this.isToggled;
//     this.currentIndex = 0;
//   }




//   visibleTracks() {
//     const tracks = this.isToggled ? this.topTracksMedium : this.topTracksShort;
//     const start = this.currentIndex - 2;
//     const result = [];

//     for (let i = start; i < start + 5; i++) {
//       const index = (i + tracks.length) % tracks.length;
//       result.push(tracks[index]);
//     }

//     return result;
//   }


//   getCardClass(i: number): string {
//     switch (i) {
//       case 0:
//         return 'far-left';
//       case 1:
//         return 'left';
//       case 2:
//         return 'center';
//       case 3:
//         return 'right';
//       case 4:
//         return 'far-right';
//       default:
//         return '';
//     }
//   }

//   nextSlide() {
//     this.currentIndex = (this.currentIndex + 1) % this.topTracksShort.length;
//   }

//   prevSlide() {
//     this.currentIndex =
//       (this.currentIndex - 1 + this.topTracksShort.length) %
//       this.topTracksShort.length;
//   }


// }


//////////////////////////////////////////////////////////////////////////////////////


// import { Component, OnInit } from '@angular/core';
// import { SpotifyService } from '../../Services/spotify-service';

// @Component({
//   selector: 'app-callback',
//   standalone: false,
//   templateUrl: './callback.html',
//   styleUrl: './callback.css'
// })
// export class Callback implements OnInit {
//   recentTracks: any[] = [];
//   token: string | null = null;

//   constructor(private spotifyService: SpotifyService) { }

//   async ngOnInit() {
//     const params = new URLSearchParams(window.location.search);
//     const code = params.get("code");
//     const hash = window.location.hash;
//     const token = new URLSearchParams(hash.substring(1)).get('access_token');
//     console.log(this.recentTracks)

//     if (code) {
//       const accessToken = await this.spotifyService.getAccessToken(code);
//       this.token = accessToken;
//       this.recentTracks = await this.spotifyService.fetchRecentlyPlayed(this.token);
//     }

//     if (token) {
//       localStorage.setItem('access_token', token);
//       this.spotifyService.setAccessToken(token);
//       this.token = token;
//       this.recentTracks = await this.spotifyService.fetchRecentlyPlayed(this.token);
//     }
//   }
// }



///////////////////////////////////////////////////////////////////////////////////////////////////////////


import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../../Services/spotify-service';

@Component({
  selector: 'app-callback',
  standalone: false,
  templateUrl: './callback.component.html',
  styleUrl: './callback.component.css'
})
export class Callback implements OnInit {
  recentTracks: any[] = [];
  token: string | null = null;
  isLoading: boolean = true;
  error: string | null = null;

  constructor(private spotifyService: SpotifyService) { }

  async ngOnInit() {
    try {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      const hash = window.location.hash;
      const token = new URLSearchParams(hash.substring(1)).get('access_token');
      console.log(this.recentTracks);

      if (code) {
        const accessToken = await this.spotifyService.getAccessToken(code);
        this.token = accessToken;
        await this.loadRecentTracks();
      }

      if (token) {
        localStorage.setItem('access_token', token);
        this.spotifyService.setAccessToken(token);
        this.token = token;
        await this.loadRecentTracks();
      }

      if (!code && !token) {
        this.error = 'No authentication token found';
        this.isLoading = false;
      }
    } catch (error) {
      console.error('Error initializing component:', error);
      this.error = 'Failed to load Spotify data';
      this.isLoading = false;
    }
  }

private async loadRecentTracks() {
  try {
    this.isLoading = true;
    if (!this.token) throw new Error('No token available');
    this.recentTracks = await this.spotifyService.fetchRecentlyPlayed(this.token);
    console.log('Loaded tracks:', this.recentTracks);
  } catch (error) {
    console.error('Error loading recent tracks:', error);
    this.error = 'Failed to load recent tracks';
  } finally {
    this.isLoading = false;
  }
}

  // Helper method to get first track
  get firstTrack() {
    return this.recentTracks && this.recentTracks.length > 0 ? this.recentTracks[0] : null;
  }

  // Helper method to get scrollable tracks (excluding first, up to 50 total)
  get scrollableTracks() {
    if (!this.recentTracks || this.recentTracks.length <= 1) {
      return [];
    }
    return this.recentTracks.slice(1, 50); // Get up to 49 more songs after the first
  }

  // Helper method to get album image URL
  getAlbumImageUrl(track: any, sizeIndex: number = 0): string {
    if (track?.track?.album?.images && track.track.album.images.length > sizeIndex) {
      return track.track.album.images[sizeIndex].url;
    }
    return '';
  }

  // Helper method to get track name
  getTrackName(track: any): string {
    return track?.track?.name || 'Unknown Track';
  }

  // Helper method to get artist name
  getArtistName(track: any): string {
    return track?.track?.artists?.[0]?.name || 'Unknown Artist';
  }

  // Helper method to format played time
  getPlayedAt(track: any): string {
    if (track?.played_at) {
      return new Date(track.played_at).toLocaleTimeString();
    }
    return '';
  }
}