import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../../Services/spotify-service';
import { AfterViewInit, ElementRef, QueryList, ViewChildren } from '@angular/core';
 
@Component({
  selector: 'app-tracks',
  standalone: false,
  templateUrl: './tracks.html',
  styleUrl: './tracks.css'
})
export class Tracks implements OnInit {
  profile: any = null;
  topTracks: boolean = true
  topArtists: boolean = false
  listeningHistory: boolean = false

  topTracksShort: any[] = [];
  topTracksMedium: any[] = [];
  topArtistsShort: any[] = [];
  topArtistsMedium: any[] = []
  recentTracks: any[] = [];
  topByFreq: any;
  selectedTrack: any;
  currentSong: any;
  currentSongData: any;
  token: string | null = null;

  isToggled = false;
  isArtistsToggled = false;
  currentIndex: number = 0;

  @ViewChildren('scrollItem') items!: QueryList<ElementRef>;

  ngAfterViewInit() {
    this.items.forEach(el => {
      const element = el.nativeElement;
      if (element.scrollWidth > element.clientWidth) {
        element.parentElement.classList.add('marquee');
      }
    });
  }


  constructor(private spotifyService: SpotifyService) { }

  async ngOnInit() {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const hash = window.location.hash;
    const token = new URLSearchParams(hash.substring(1)).get('access_token');
    console.log(this.recentTracks)

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
      
      this.profile = await this.spotifyService.fetchProfile(accessToken);
      this.topTracksShort = await this.spotifyService.fetchTop(accessToken, 'tracks', 'short_term');
      this.topTracksMedium = await this.spotifyService.fetchTop(accessToken, 'tracks', 'medium_term');
      this.topArtistsShort = await this.spotifyService.fetchTop(accessToken, 'artists', 'short_term');
      this.topArtistsMedium = await this.spotifyService.fetchTop(accessToken, 'artists', 'medium_term');
      this.recentTracks = await this.spotifyService.fetchRecentlyPlayed(this.token);
      this.currentSongData = await this.spotifyService.fetchCurrentlyPlaying(this.token);
      this.topByFreq = this.getTopTrackByFrequency();

       if (!accessToken) {
        console.error("Failed to get access token. Check token exchange process.");
        // Fallback: try stored token if present
        const fallback = this.spotifyService.getStoredAccessToken();
        if (fallback) {
          this.token = fallback;
          await this.fetchUserData();
        }
        return;
      } else {
        console.log(`Access Token - ${accessToken}`)
      }

    }

    if (this.currentSongData && this.currentSongData.item) {
      this.currentSong = this.currentSongData.item;
    } else if (this.recentTracks.length > 0) {
      this.currentSong = this.recentTracks[0].track;
    } else {
      this.currentSong = null;
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

    if (!this.recentTracks) {
      console.log("Didn't fetch recent tracks")
    }
    else {
      console.log("ABABABAB")
      console.log(this.recentTracks)
      console.log('Code from URL:', code);
      console.log('Token from hash:', token);

    }

    if (this.recentTracks.length > 0) {
      this.onTrackClick(this.recentTracks[0].track.id);
    }

  }


  async fetchUserData() {
    if (!this.token) return;
    this.profile = await this.spotifyService.fetchProfile(this.token);
    this.topTracksShort = await this.spotifyService.fetchTop(this.token, 'tracks', 'short_term');
    this.topTracksMedium = await this.spotifyService.fetchTop(this.token, 'tracks', 'medium_term');
    this.topArtistsShort = await this.spotifyService.fetchTop(this.token, 'artists', 'short_term');
    this.topArtistsMedium = await this.spotifyService.fetchTop(this.token, 'artists', 'medium_term');
    this.recentTracks = await this.spotifyService.fetchRecentlyPlayed(this.token);
    this.currentSongData = await this.spotifyService.fetchCurrentlyPlaying(this.token);
    if (this.currentSongData && this.currentSongData.item) {
      this.currentSong = this.currentSongData.item;
    }
    this.topByFreq = this.getTopTrackByFrequency();
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

    getTopTrackByFrequency() {
    if (!this.recentTracks.length) return null;

    const counts: {
      [id: string]: {
        name: string;
        artist: string;
        image: string;
        count: number;
      }
    } = {};

    this.recentTracks.forEach(item => {
      const id = item.track.id;
      if (!counts[id]) {
        counts[id] = {
          name: item.track.name,
          artist: item.track.artists[0]?.name || 'Unknown Artist',
          image: item.track.album?.images?.[0]?.url || '',
          count: 0
        };
      }
      counts[id].count++;
    });

    return Object.values(counts).reduce((max, curr) => curr.count > max.count ? curr : max);
  }

  onTrackClick(trackId: string) {
    const trackItem = this.recentTracks.find(item => item.track.id === trackId);
    if (!trackItem) return;

    const track = trackItem.track;
    this.selectedTrack = {
      name: track.name,
      popularity: this.popularityScale100to10(track.popularity),
      album: track.album,
      duration_ms: track.duration_ms,
      played_at: trackItem.played_at,
      artists: track.artists
    };
  }

  onImageError(event: Event) {
    const target = event.target as HTMLImageElement | null;
    if (target) {
      target.style.display = 'none';
    }
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


  popularityScale100to10(popularity: number): number {
    return Math.round(popularity / 10);
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
