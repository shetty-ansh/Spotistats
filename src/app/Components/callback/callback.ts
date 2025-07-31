import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-callback',
  standalone: false,
  templateUrl: './callback.html',
  styleUrl: './callback.css'
})
export class Callback implements OnInit{
  profile: any = null;

  async ngOnInit() {
    const clientId = "74c9a58619d7490c88ebeb90616810d5";
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
      const accessToken = await this.getAccessToken(clientId, code);
      const profile = await this.fetchProfile(accessToken);
      this.profile = profile;
    }
  }

  async getAccessToken(clientId: string, code: string): Promise<string> {
    const verifier = localStorage.getItem("verifier")!;
    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", "http://127.0.0.1:5173/callback");
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
      method: "GET",
      headers: { Authorization: `Bearer ${token}` }
    });

    return await result.json();
  }
}
