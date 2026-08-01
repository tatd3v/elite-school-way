export const AUTH_CONFIG = {
  STORAGE_KEY: 'adminAuth',
  SESSION_DURATION_MS: 24 * 60 * 60 * 1000,
  LOGIN_ACTION: 'login',
};

export const API_CONFIG = {
  GOOGLE_SCRIPT_URL: import.meta.env.VITE_GOOGLE_SCRIPT_URL,
};

export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid credentials',
  CONNECTION_ERROR: 'Connection error. Please try again.',
  SESSION_EXPIRED: 'Session expired. Please login again.',
  MISSING_CREDENTIALS: 'Email and password are required',
};

export const DEFAULT_ADMIN = {
  EMAIL: 'admin@elite.com',
  PASSWORD: 'admin123',
};

export const CATEGORIES_COUNT = 12;
