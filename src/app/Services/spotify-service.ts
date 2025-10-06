import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  private clientId = '74c9a58619d7490c88ebeb90616810d5';
  private redirectUri = 'http://127.0.0.1:5173/callback';
  private accessToken: string = '';

  constructor() {
    const stored = localStorage.getItem('access_token');
    if (stored) {
      this.accessToken = stored;
    }
  }

  getClientId(): string {
    return this.clientId;
  }

  async getAccessToken(code: string): Promise<string> {
    const verifier = localStorage.getItem("verifier")!;
    const params = new URLSearchParams();


    params.append("client_id", this.clientId);
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", this.redirectUri);
    params.append("code_verifier", verifier);

    const result = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params
    });

    const { access_token } = await result.json();
    if (access_token) {
      this.setAccessToken(access_token);
    }
    return access_token;
  }

  async fetchProfile(token: string): Promise<any> {
    const result = await fetch("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${token}` }
    });

    return await result.json();
  }

  async fetchTop(token: string, type: string, timeRange: string): Promise<any[]> {
    const result = await fetch(`https://api.spotify.com/v1/me/top/${type}?time_range=${timeRange}&limit=10`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await result.json();
    return data.items || [];
  }

  setAccessToken(token: string) {
    this.accessToken = token;
    try {
      localStorage.setItem('access_token', token);
    } catch {}
  }

  getStoredAccessToken(): string | null {
    return this.accessToken || localStorage.getItem('access_token');
  }

  isAuthenticated(): boolean {
    return Boolean(this.getStoredAccessToken());
  }

async fetchRecentlyPlayed(token?: string): Promise<any[]> {
  const useToken = token || this.accessToken;

  if (!useToken) {
    console.error("No access token available for fetchRecentlyPlayed");
    return [];
  }

  try {
    const result = await fetch(
      "https://api.spotify.com/v1/me/player/recently-played?limit=50",
      {
        headers: { Authorization: `Bearer ${useToken}` }
      }
    );

    const data = await result.json();
    console.log("Recently played response:", data);

    if (data.error) {
      console.error("Spotify API error:", data.error);
      return [];
    }

    return data.items || [];
  } catch (err) {
    console.error("Error fetching recently played tracks:", err);
    return [];
  }
}

async fetchCurrentlyPlaying(token?: string): Promise<any | null> {
  const useToken = token || this.accessToken;

  if (!useToken) {
    console.error("No access token");
    return null;
  }

  try {
    const result = await fetch(
      "https://api.spotify.com/v1/me/player/currently-playing",
      {
        headers: { Authorization: `Bearer ${useToken}` },
      }
    );

    if (result.status === 204) {
      // No track currently playing
      return null;
    }

    if (!result.ok) {
      console.error(`Error ${result.status}: ${result.statusText}`);
      return null;
    }

    return await result.json();
  } catch (error) {
    console.error("Error while fetching currently playing track", error);
    return null;
  }
}


}

  // async fetchCurrentlyPlaying(token: string): Promise<any> {
  //   const result = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
  //     headers: { Authorization: `Bearer ${token}` }
  //   });
  //   if (result.status === 204) return null;
  //   return await result.json();
  // }