import { Injectable } from '@angular/core';
import {
  UserManager,
  UserManagerSettings,
  User,
  WebStorageStateStore,
} from 'oidc-client';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  //userStore: new WebStorageStateStore({ store: window.localStorage });
  private manager = new UserManager(getClientSettings());
  private user: User = null;

  constructor() {
    this.manager.getUser().then((user) => {
      this.user = user;
    });
  }

  isLoggedIn(): boolean {
    return this.user != null && !this.user.expired;
  }

  getClaims(): any {
    return this.user.profile;
  }

  getAuthorizationHeaderValue(): string {
    return `${this.user.token_type} ${this.user.access_token}`;
  }

  startAuthentication(): Promise<void> {
    return this.manager.signinRedirect();
  }

  completeAuthentication(): Promise<void> {
    return this.manager.signinRedirectCallback().then((user) => {
      this.user = user;
    });
  }
}

export function getClientSettings(): UserManagerSettings {
  return {
    authority: 'http://localhost:44348/',
    client_id: 'datos',
    redirect_uri:
      'https://david-peretz.github.io/authSequencePKCE/auth-callback',
    post_logout_redirect_uri:
      'https://david-peretz.github.io/authSequencePKCE/',
    response_type: 'code',
    scope: 'openid profile Profile OfflineAccess',
    filterProtocolClaims: true,
    loadUserInfo: true,
  };
}
