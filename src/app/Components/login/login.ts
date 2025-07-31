import { Component , OnInit} from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit{
  profile: any = null;
  clientId = '74c9a58619d7490c88ebeb90616810d5';

  async ngOnInit() {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (!code) {
      this.redirectToAuthCodeFlow(this.clientId);
    } else {
      const accessToken = await this.getAccessToken(this.clientId, code);
      const profile = await this.fetchProfile(accessToken);
      this.populateUI(profile);
    }
  }

  redirectToAuthCodeFlow(clientId: string) {
    const verifier = this.generateCodeVerifier(128);
    this.generateCodeChallenge(verifier).then(challenge => {
      localStorage.setItem("verifier", verifier);

      const params = new URLSearchParams();
      params.append("client_id", clientId);
      params.append("response_type", "code");
      params.append("redirect_uri", "http://127.0.0.1:5173/callback");
      params.append("scope", "user-read-private user-read-email");
      params.append("code_challenge_method", "S256");
      params.append("code_challenge", challenge);

      document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
    });
  }

  generateCodeVerifier(length: number) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  async generateCodeChallenge(codeVerifier: string) {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
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

  populateUI(profile: any) {
    this.profile = profile;
  }
  
}
