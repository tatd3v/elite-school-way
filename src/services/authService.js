import { jsonp } from '../utils/jsonp';
import { API_CONFIG, AUTH_CONFIG, ERROR_MESSAGES } from '../config/constants';

class AuthService {
  constructor(apiUrl, storageKey) {
    this.apiUrl = apiUrl;
    this.storageKey = storageKey;
  }

  validateCredentials(email, password) {
    if (!email || !password) {
      throw new Error(ERROR_MESSAGES.MISSING_CREDENTIALS);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error(ERROR_MESSAGES.INVALID_EMAIL);
    }
  }

  async authenticate(email, password) {
    this.validateCredentials(email, password);

    const url = new URL(this.apiUrl);
    url.searchParams.set('action', AUTH_CONFIG.LOGIN_ACTION);
    url.searchParams.set('email', email);
    url.searchParams.set('password', password);

    // Race against a dedicated 15s timeout so a slow/unresponsive deployment
    // shows a specific "this is taking too long" notification well before
    // jsonp.js's own generic 30s timeout would otherwise fire.
    const timeout = new Promise((_, reject) => {
      setTimeout(() => reject(new Error(ERROR_MESSAGES.LOGIN_TIMEOUT)), AUTH_CONFIG.LOGIN_TIMEOUT_MS);
    });

    try {
      return await Promise.race([jsonp(url.toString()), timeout]);
    } catch (error) {
      if (error.message === ERROR_MESSAGES.LOGIN_TIMEOUT) {
        throw error;
      }
      throw new Error(ERROR_MESSAGES.CONNECTION_ERROR);
    }
  }

  createAuthData(userInfo) {
    return {
      email: userInfo.email,
      role: userInfo.role,
      name: userInfo.name,
      timestamp: Date.now(),
    };
  }

  async login(email, password) {
    const result = await this.authenticate(email, password);

    if (result.success) {
      const authData = this.createAuthData(result);
      this.saveSession(authData);
      return { success: true, user: authData };
    }

    // The backend replies 'Invalid credentials' in English — translate it so
    // the login notification is always in Spanish. Any other message is a
    // technical backend exception, surfaced as-is for debugging.
    return {
      success: false,
      message:
        !result.message || result.message === 'Invalid credentials'
          ? ERROR_MESSAGES.INVALID_CREDENTIALS
          : result.message,
    };
  }

  saveSession(authData) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(authData));
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  }

  clearSession() {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (error) {
      console.error('Failed to clear session:', error);
    }
  }

  getSession() {
    try {
      const authData = localStorage.getItem(this.storageKey);
      if (!authData) return null;

      const user = JSON.parse(authData);
      return user;
    } catch (error) {
      return null;
    }
  }

  isSessionValid(user) {
    if (!user || !user.timestamp) return false;

    const sessionAge = Date.now() - user.timestamp;
    return sessionAge < AUTH_CONFIG.SESSION_DURATION_MS;
  }

  getCurrentUser() {
    const user = this.getSession();

    if (!user) return null;

    if (!this.isSessionValid(user)) {
      this.clearSession();
      return null;
    }

    return user;
  }

  isAuthenticated() {
    return this.getCurrentUser() !== null;
  }

  logout() {
    this.clearSession();
  }
}

export const authService = new AuthService(
  API_CONFIG.GOOGLE_SCRIPT_URL,
  AUTH_CONFIG.STORAGE_KEY
);

export default authService;
