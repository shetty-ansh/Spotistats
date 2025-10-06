// import { Component, OnInit } from '@angular/core';
// import { SpotifyService } from '../../Services/spotify-service';

// @Component({
//   selector: 'app-dashboard',
//   standalone: false,
//   templateUrl: './dashboard.html',
//   styleUrls: ['./dashboard.css']
// })
// export class Dashboard {
//   token: string | null = null;
//   profile: any = null;

//   // Top items
//   topTracksShort: any[] = [];
//   topTracksMedium: any[] = [];
//   topArtistsShort: any[] = [];
//   topArtistsMedium: any[] = [];

//   // Recents and current playback
//   recentTracks: any[] = [];
//   currentlyPlaying: any | null = null;

//   // UI state
//   isTracksToggled = false; // false -> short_term, true -> medium_term
//   isArtistsToggled = false; // false -> short_term, true -> medium_term
//   loading = true;
//   error: string | null = null;

//   constructor(private spotifyService: SpotifyService) {}

//   // Metrics
//   totalRecentMs: number = 0;
//   distinctRecentArtists: number = 0;
//   averageTrackPopularity: number = 0;
//   topGenreCounts: { label: string, count: number }[] = [];

//   // Charts
//   private tracksChart: any = null;
//   private genresChart: any = null;
//   private recentsChart: any = null;

//   async ngOnInit() {
//     try {
//       const params = new URLSearchParams(window.location.search);
//       const code = params.get('code');
//       const hash = window.location.hash;
//       const tokenFromHash = new URLSearchParams(hash.substring(1)).get('access_token');

//       const stored = this.spotifyService.getStoredAccessToken();
//       if (stored && !tokenFromHash) {
//         this.token = stored;
//         await this.fetchUserData();
//         if (code) {
//           window.history.replaceState({}, document.title, window.location.pathname);
//         }
//         this.loading = false;
//         return;
//       }

//       if (code) {
//         const accessToken = await this.spotifyService.getAccessToken(code);
//         this.token = accessToken;
//         if (!accessToken) {
//           this.error = 'Failed to get access token.';
//           this.loading = false;
//           return;
//         }
//         await this.fetchUserData();
//       }

//       if (tokenFromHash) {
//         this.spotifyService.setAccessToken(tokenFromHash);
//         this.token = tokenFromHash;
//         await this.fetchUserData();
//         window.history.replaceState({}, document.title, window.location.pathname);
//       } else if (!code) {
//         const fallback = this.spotifyService.getStoredAccessToken();
//         if (fallback) {
//           this.token = fallback;
//           await this.fetchUserData();
//           window.history.replaceState({}, document.title, window.location.pathname);
//         }
//       }
//     } catch (e) {
//       this.error = 'Something went wrong while loading your dashboard.';
//     } finally {
//       this.loading = false;
//     }
//   }

//   async fetchUserData() {
//     if (!this.token) return;
//     this.profile = await this.spotifyService.fetchProfile(this.token);
//     [this.topTracksShort, this.topTracksMedium] = await Promise.all([
//       this.spotifyService.fetchTop(this.token, 'tracks', 'short_term'),
//       this.spotifyService.fetchTop(this.token, 'tracks', 'medium_term')
//     ]);
//     [this.topArtistsShort, this.topArtistsMedium] = await Promise.all([
//       this.spotifyService.fetchTop(this.token, 'artists', 'short_term'),
//       this.spotifyService.fetchTop(this.token, 'artists', 'medium_term')
//     ]);
//     this.recentTracks = await this.spotifyService.fetchRecentlyPlayed(this.token);
//     this.currentlyPlaying = await this.spotifyService.fetchCurrentlyPlaying(this.token);

//     this.computeMetrics();
//     // Defer chart rendering to allow template to paint canvases
//     setTimeout(() => this.renderCharts(), 0);
//   }

//   tracksList() {
//     return this.isTracksToggled ? this.topTracksMedium : this.topTracksShort;
//   }

//   artistsList() {
//     return this.isArtistsToggled ? this.topArtistsMedium : this.topArtistsShort;
//   }

//   toggleTracksRange() {
//     this.isTracksToggled = !this.isTracksToggled;
//     this.updateChartsOnToggle();
//   }

//   toggleArtistsRange() {
//     this.isArtistsToggled = !this.isArtistsToggled;
//     this.updateChartsOnToggle();
//   }

//   formatDuration(ms: number): string {
//     const totalSeconds = Math.floor(ms / 1000);
//     const minutes = Math.floor(totalSeconds / 60);
//     const seconds = totalSeconds % 60;
//     return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
//   }

//   toTitleCase(str: string): string {
//     return str.replace(/\b\w/g, char => char.toUpperCase());
//   }

//   private computeMetrics() {
//     // Total listening time from recent tracks
//     this.totalRecentMs = (this.recentTracks || []).reduce((sum: number, item: any) => {
//       const dur = item?.track?.duration_ms || 0;
//       return sum + dur;
//     }, 0);

//     // Distinct recent artists
//     const artistSet = new Set<string>();
//     (this.recentTracks || []).forEach((item: any) => {
//       const name = item?.track?.artists?.[0]?.name;
//       if (name) artistSet.add(name);
//     });
//     this.distinctRecentArtists = artistSet.size;

//     // Average popularity from current tracks list (selected range)
//     const tracks = this.tracksList();
//     if (tracks && tracks.length) {
//       const totalPopularity = tracks.reduce((acc: number, t: any) => acc + (t?.popularity || 0), 0);
//       this.averageTrackPopularity = Math.round(totalPopularity / tracks.length);
//     } else {
//       this.averageTrackPopularity = 0;
//     }

//     // Top genres from artists list (selected range)
//     const artists = this.artistsList() || [];
//     const counts: Record<string, number> = {};
//     artists.forEach((a: any) => {
//       (a?.genres || []).slice(0, 3).forEach((g: string) => {
//         const key = this.toTitleCase(g);
//         counts[key] = (counts[key] || 0) + 1;
//       });
//     });
//     this.topGenreCounts = Object.entries(counts)
//       .map(([label, count]) => ({ label, count }))
//       .sort((a, b) => b.count - a.count)
//       .slice(0, 6);
//   }

//   private destroyCharts() {
//     [this.tracksChart, this.genresChart, this.recentsChart].forEach((c: any) => {
//       if (c && typeof c.destroy === 'function') c.destroy();
//     });
//     this.tracksChart = this.genresChart = this.recentsChart = null;
//   }

//   private renderCharts() {
//     const Chart = (window as any)?.Chart;
//     if (!Chart) return;

//     this.destroyCharts();

//     // Top Tracks popularity bar
//     const tracks = this.tracksList() || [];
//     const tCtx = (document.getElementById('tracksChart') as HTMLCanvasElement | null)?.getContext('2d');
//     if (tCtx && tracks.length) {
//       this.tracksChart = new Chart(tCtx, {
//         type: 'bar',
//         data: {
//           labels: tracks.slice(0, 10).map((t: any) => t.name),
//           datasets: [{
//             label: 'Popularity',
//             data: tracks.slice(0, 10).map((t: any) => t.popularity || 0),
//             backgroundColor: 'rgba(255,255,255,0.25)'
//           }]
//         },
//         options: {
//           responsive: true,
//           plugins: { legend: { display: false } },
//           scales: {
//             x: { ticks: { color: '#ddd', maxRotation: 45, minRotation: 0 } },
//             y: { ticks: { color: '#ddd' }, beginAtZero: true, max: 100 }
//           }
//         }
//       });
//     }

//     // Genres doughnut
//     const gCtx = (document.getElementById('genresChart') as HTMLCanvasElement | null)?.getContext('2d');
//     if (gCtx && this.topGenreCounts.length) {
//       const labels = this.topGenreCounts.map(g => g.label);
//       const data = this.topGenreCounts.map(g => g.count);
//       this.genresChart = new Chart(gCtx, {
//         type: 'doughnut',
//         data: {
//           labels,
//           datasets: [{
//             data,
//             backgroundColor: ['#66c2a5','#fc8d62','#8da0cb','#e78ac3','#a6d854','#ffd92f']
//           }]
//         },
//         options: {
//           plugins: { legend: { labels: { color: '#ddd' } } }
//         }
//       });
//     }

//     // Recents by hour line
//     const rCtx = (document.getElementById('recentsChart') as HTMLCanvasElement | null)?.getContext('2d');
//     if (rCtx && (this.recentTracks || []).length) {
//       const hours = new Array(24).fill(0);
//       (this.recentTracks || []).forEach((item: any) => {
//         const ts = item?.played_at ? new Date(item.played_at) : null;
//         if (ts) hours[ts.getHours()]++;
//       });
//       this.recentsChart = new Chart(rCtx, {
//         type: 'line',
//         data: {
//           labels: hours.map((_v, i) => `${i}:00`),
//           datasets: [{
//             label: 'Plays',
//             data: hours,
//             borderColor: '#ffffff',
//             backgroundColor: 'rgba(255,255,255,0.15)',
//             fill: true,
//             tension: 0.3
//           }]
//         },
//         options: {
//           plugins: { legend: { labels: { color: '#ddd' } } },
//           scales: {
//             x: { ticks: { color: '#ddd' } },
//             y: { ticks: { color: '#ddd' }, beginAtZero: true }
//           }
//         }
//       });
//     }
//   }

//   private updateChartsOnToggle() {
//     this.computeMetrics();
//     setTimeout(() => this.renderCharts(), 0);
//   }
// }


import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../../Services/spotify-service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {
  token: string | null = null;
  profile: any = null;

  topTracksShort: any[] = [];
  topTracksMedium: any[] = [];
  topArtistsShort: any[] = [];
  topArtistsMedium: any[] = [];

  recentTracks: any[] = [];
  currentlyPlaying: any | null = null;

  isTracksToggled = false;
  isArtistsToggled = false;
  loading = true;
  error: string | null = null;

  totalRecentMs: number = 0;
  distinctRecentArtists: number = 0;
  averageTrackPopularity: number = 0;
  tracksChart: any;
  genresChart: any;
  recentsChart: any;
  topGenreCounts: { label: string; count: number }[] = [];

  constructor(private spotifyService: SpotifyService) {}

  async ngOnInit() {
    try {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const hash = window.location.hash;
      const tokenFromHash = new URLSearchParams(hash.substring(1)).get('access_token');

      const stored = this.spotifyService.getStoredAccessToken();
      if (stored && !tokenFromHash) {
        this.token = stored;
        await this.fetchUserData();
        if (code) {
          window.history.replaceState({}, document.title, window.location.pathname);
        }
        this.loading = false;
        return;
      }

      if (code) {
        const accessToken = await this.spotifyService.getAccessToken(code);
        this.token = accessToken;
        if (!accessToken) {
          this.error = 'Failed to get access token.';
          this.loading = false;
          return;
        }
        await this.fetchUserData();
      }

      if (tokenFromHash) {
        this.spotifyService.setAccessToken(tokenFromHash);
        this.token = tokenFromHash;
        await this.fetchUserData();
        window.history.replaceState({}, document.title, window.location.pathname);
      } else if (!code) {
        const fallback = this.spotifyService.getStoredAccessToken();
        if (fallback) {
          this.token = fallback;
          await this.fetchUserData();
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }
    } catch (e) {
      this.error = 'Something went wrong while loading your dashboard.';
    } finally {
      this.loading = false;
    }
  }

  async fetchUserData() {
    if (!this.token) return;
    this.profile = await this.spotifyService.fetchProfile(this.token);
    
    [this.topTracksShort, this.topTracksMedium] = await Promise.all([
      this.spotifyService.fetchTop(this.token, 'tracks', 'short_term'),
      this.spotifyService.fetchTop(this.token, 'tracks', 'medium_term')
    ]);
    
    [this.topArtistsShort, this.topArtistsMedium] = await Promise.all([
      this.spotifyService.fetchTop(this.token, 'artists', 'short_term'),
      this.spotifyService.fetchTop(this.token, 'artists', 'medium_term')
    ]);
    
    this.recentTracks = await this.spotifyService.fetchRecentlyPlayed(this.token);
    this.currentlyPlaying = await this.spotifyService.fetchCurrentlyPlaying(this.token);

    this.computeMetrics();
    // Defer chart rendering to allow canvases to be in the DOM
    setTimeout(() => this.renderCharts(), 0);
  }

  tracksList() {
    return this.isTracksToggled ? this.topTracksMedium : this.topTracksShort;
  }

  artistsList() {
    return this.isArtistsToggled ? this.topArtistsMedium : this.topArtistsShort;
  }

  toggleTracksRange() {
    this.isTracksToggled = !this.isTracksToggled;
    this.updateChartsOnToggle();
  }

  toggleArtistsRange() {
    this.isArtistsToggled = !this.isArtistsToggled;
    this.updateChartsOnToggle();
  }

  formatDuration(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  toTitleCase(str: string): string {
    return str.replace(/\b\w/g, char => char.toUpperCase());
  }

  private computeMetrics() {
    this.totalRecentMs = (this.recentTracks || []).reduce((sum: number, item: any) => {
      const dur = item?.track?.duration_ms || 0;
      return sum + dur;
    }, 0);

    const artistSet = new Set<string>();
    (this.recentTracks || []).forEach((item: any) => {
      const name = item?.track?.artists?.[0]?.name;
      if (name) artistSet.add(name);
    });
    this.distinctRecentArtists = artistSet.size;

    const tracks = this.tracksList();
    if (tracks && tracks.length) {
      const totalPopularity = tracks.reduce((acc: number, t: any) => acc + (t?.popularity || 0), 0);
      this.averageTrackPopularity = Math.round(totalPopularity / tracks.length);
    } else {
      this.averageTrackPopularity = 0;
    }

    // Compute top genres for the selected artists list
    const artists = this.artistsList() || [];
    const counts: Record<string, number> = {};
    artists.forEach((a: any) => {
      (a?.genres || []).slice(0, 3).forEach((g: string) => {
        const key = this.toTitleCase(g);
        counts[key] = (counts[key] || 0) + 1;
      });
    });
    this.topGenreCounts = Object.entries(counts)
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }

  
  private destroyCharts() {
    [this.tracksChart, this.genresChart, this.recentsChart].forEach((c: any) => {
      if (c && typeof c.destroy === 'function') c.destroy();
    });
    this.tracksChart = this.genresChart = this.recentsChart = null;
  }

  private renderCharts() {
    const Chart = (window as any)?.Chart;
    if (!Chart) return;

    this.destroyCharts();

    // Top Tracks popularity bar
    const tracks = this.tracksList() || [];
    const tCanvas = document.getElementById('tracksChart') as HTMLCanvasElement | null;
    if (tCanvas) {
      // Fix canvas size to avoid hover-induced resizing and blurriness
      tCanvas.height = 240;
      tCanvas.width = tCanvas.clientWidth || 400;
    }
    const tCtx = tCanvas?.getContext('2d');
    if (tCtx && tracks.length) {
      this.tracksChart = new Chart(tCtx, {
        type: 'bar',
        data: {
          labels: tracks.slice(0, 10).map((t: any) => t.name),
          datasets: [{
            label: 'Popularity',
            data: tracks.slice(0, 10).map((t: any) => t.popularity || 0),
            backgroundColor: 'rgba(255,255,255,0.25)'
          }]
        },
        options: {
          responsive: false,
          animation: { duration: 0 },
          plugins: { legend: { display: false } },
          scales: {
            x: { ticks: { display: false, color: '#ddd', maxRotation: 0, minRotation: 0 }, grid: { display: false } },
            y: { ticks: { color: '#ddd' }, beginAtZero: true, max: 100 }
          }
        }
      });
    }

    // Genres doughnut
    const gCanvas = document.getElementById('genresChart') as HTMLCanvasElement | null;
    if (gCanvas) {
      gCanvas.height = 240;
      gCanvas.width = gCanvas.clientWidth || 400;
    }
    const gCtx = gCanvas?.getContext('2d');
    if (gCtx && this.topGenreCounts.length) {
      const labels = this.topGenreCounts.map((g: { label: string; count: number }) => g.label);
      const data = this.topGenreCounts.map((g: { label: string; count: number }) => g.count);
      this.genresChart = new Chart(gCtx, {
        type: 'doughnut',
        data: {
          labels,
          datasets: [{
            data,
            backgroundColor: ['#66c2a5','#fc8d62','#8da0cb','#e78ac3','#a6d854','#ffd92f']
          }]
        },
        options: {
          responsive: false,
          animation: { duration: 0 },
          plugins: { legend: { display: false } }
        }
      });
    }

    // Recents by hour line
    const rCanvas = document.getElementById('recentsChart') as HTMLCanvasElement | null;
    if (rCanvas) {
      rCanvas.height = 240;
      rCanvas.width = rCanvas.clientWidth || 400;
    }
    const rCtx = rCanvas?.getContext('2d');
    if (rCtx && (this.recentTracks || []).length) {
      const hours = new Array(24).fill(0);
      (this.recentTracks || []).forEach((item: any) => {
        const ts = item?.played_at ? new Date(item.played_at) : null;
        if (ts) hours[ts.getHours()]++;
      });
      this.recentsChart = new Chart(rCtx, {
        type: 'line',
        data: {
          labels: hours.map((_v, i) => `${i}:00`),
          datasets: [{
            label: 'Plays',
            data: hours,
            borderColor: '#ffffff',
            backgroundColor: 'rgba(255,255,255,0.15)',
            fill: true,
            tension: 0.3
          }]
        },
        options: {
          responsive: false,
          animation: { duration: 0 },
          plugins: { legend: { labels: { color: '#ddd' } } },
          scales: {
            x: { ticks: { color: '#ddd' } },
            y: { ticks: { color: '#ddd' }, beginAtZero: true }
          }
        }
      });
    }
  }

  private updateChartsOnToggle() {
    this.computeMetrics();
    setTimeout(() => this.renderCharts(), 0);
  }
}