// import { Component, OnInit } from '@angular/core';
// import { SpotifyService } from '../../Services/spotify-service';

// @Component({
//   selector: 'app-testing',
//   standalone: false,
//   templateUrl: './testing.html',
//   styleUrls: ['./testing.css']
// })
// export class Testing implements OnInit {
//   currentTrack: any = null;
//   recentTracks: any[] = [];
//   token: string | null = null;

//   isToggled = false;
//   currentIndex: number = 0;

//   constructor(private spotifyService: SpotifyService) {}

//   async ngOnInit() {
//     const hash = window.location.hash;
//     this.token = new URLSearchParams(hash.substring(1)).get('access_token');

//     if (this.token) {
//       localStorage.setItem('access_token', this.token);
//       this.spotifyService.setAccessToken(this.token);
//       await this.fetchTrackData();
//     }
//   }

//   async fetchTrackData() {
//     if (!this.token) return;

//     this.currentTrack = await this.spotifyService.fetchCurrentlyPlaying(this.token);
//     this.recentTracks = await this.spotifyService.fetchProfile(this.token);
//   }

 
// }


