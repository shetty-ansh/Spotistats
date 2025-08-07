import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  private clientId = '74c9a58619d7490c88ebeb90616810d5';
  private redirectUri = 'http://127.0.0.1:5173/callback';
  private accessToken: string = '';

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
}

}
