import authService from '../services/authService';

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
