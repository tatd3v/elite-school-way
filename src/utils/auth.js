import authService from '../services/authService';
import { AUTH_CONFIG } from '../config/constants';

export async function loginAdmin(email, password) {
  return authService.login(email, password);
}

export function logoutAdmin() {
  authService.logout();
}

export function getAuthUser() {
  return authService.getCurrentUser();
}

export function isAuthenticated() {
  return authService.isAuthenticated();
}

// Check if the app version has changed and clear all data if so
// Call this when the app loads to ensure users get a fresh state
// after major updates (e.g., when adding new registration statuses)
export function checkVersionAndClearData() {
  try {
    const storedVersion = localStorage.getItem('appVersion');
    const currentVersion = AUTH_CONFIG.VERSION;

    if (storedVersion && storedVersion !== String(currentVersion)) {
      // Version changed - clear all localStorage data
      localStorage.clear();
      console.log('App version changed, clearing all cached data');
    }

    // Store current version
    localStorage.setItem('appVersion', String(currentVersion));
  } catch (error) {
    console.error('Failed to check version:', error);
  }
}
