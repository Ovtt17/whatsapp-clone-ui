import Keycloak from 'keycloak-js';

export class KeycloakService {
  private _keycloak: Keycloak | undefined;

  constructor() { }

  get keycloak() {
    if (!this._keycloak) {
      this._keycloak = new Keycloak({
        realm: import.meta.env.VITE_KEYCLOAK_REALM,
        url: import.meta.env.VITE_KEYCLOAK_URL,
        clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID
      });
    }
    return this._keycloak;
  }

  async init() {
    if (this.keycloak.authenticated) return true;
    return await this.keycloak.init({ onLoad: 'login-required' });
  }

  async login() {
    await this.keycloak.login();
  }

  async logout() {
    await this.keycloak.logout({ redirectUri: import.meta.env.VITE_APP_URL });
  }

  isTokenValid() {
    return !this.keycloak.isTokenExpired();
  }

  async accountManagement() {
    await this.keycloak.accountManagement();
  }

  get userId(): string | null {
    return this.keycloak.tokenParsed?.sub || null;
  }

  get fullName(): string | null {
    return this.keycloak.tokenParsed?.['name'] || null;
  }

  get token(): string | null {
    return this.keycloak.token || null;
  }
}