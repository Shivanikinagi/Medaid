/**
 * OAuth Service for Google and GitHub authentication
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const GITHUB_CLIENT_ID = process.env.REACT_APP_GITHUB_CLIENT_ID;

export interface OAuthConfig {
  google: {
    client_id: string;
    enabled: boolean;
  };
  github: {
    client_id: string;
    enabled: boolean;
  };
}

class OAuthService {
  /**
   * Get OAuth configuration from backend
   */
  async getOAuthConfig(): Promise<OAuthConfig> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/oauth/config/`);
      if (!response.ok) {
        throw new Error('Failed to fetch OAuth config');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching OAuth config:', error);
      return {
        google: { client_id: '', enabled: false },
        github: { client_id: '', enabled: false }
      };
    }
  }

  /**
   * Initiate Google OAuth flow
   */
  initiateGoogleLogin() {
    const clientId = GOOGLE_CLIENT_ID;
    if (!clientId || clientId === 'your_google_client_id_here') {
      throw new Error('Google OAuth not configured. Please set REACT_APP_GOOGLE_CLIENT_ID');
    }

    const redirectUri = `${window.location.origin}/auth/google/callback`;
    const scope = 'email profile';
    const responseType = 'code';
    
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${encodeURIComponent(clientId)}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=${responseType}` +
      `&scope=${encodeURIComponent(scope)}` +
      `&access_type=online` +
      `&prompt=select_account`;

    window.location.href = authUrl;
  }

  /**
   * Initiate GitHub OAuth flow
   */
  initiateGitHubLogin() {
    const clientId = GITHUB_CLIENT_ID;
    if (!clientId || clientId === 'your_github_client_id_here') {
      throw new Error('GitHub OAuth not configured. Please set REACT_APP_GITHUB_CLIENT_ID');
    }

    const redirectUri = `${window.location.origin}/auth/github/callback`;
    const scope = 'user:email';
    
    const authUrl = `https://github.com/login/oauth/authorize?` +
      `client_id=${encodeURIComponent(clientId)}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&scope=${encodeURIComponent(scope)}`;

    window.location.href = authUrl;
  }

  /**
   * Handle Google OAuth callback
   */
  async handleGoogleCallback(code: string): Promise<any> {
    try {
      const redirectUri = `${window.location.origin}/auth/google/callback`;
      const response = await fetch(`${API_BASE_URL}/auth/google/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, redirect_uri: redirectUri }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Google authentication failed');
      }

      const data = await response.json();
      
      // Store tokens
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      
      return data;
    } catch (error) {
      console.error('Google OAuth error:', error);
      throw error;
    }
  }

  /**
   * Handle GitHub OAuth callback
   */
  async handleGitHubCallback(code: string): Promise<any> {
    try {
      const redirectUri = `${window.location.origin}/auth/github/callback`;
      const response = await fetch(`${API_BASE_URL}/auth/github/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, redirect_uri: redirectUri }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'GitHub authentication failed');
      }

      const data = await response.json();
      
      // Store tokens
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      
      return data;
    } catch (error) {
      console.error('GitHub OAuth error:', error);
      throw error;
    }
  }
}

const oauthService = new OAuthService();
export default oauthService;
