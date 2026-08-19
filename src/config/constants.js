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

export const PAYMENT_QR_IMAGE_URL = 'https://i.imgur.com/Y6fr7uJ.jpeg';
export const PAYMENT_SCREENSHOT_LABEL = 'Comprobante de pago';

export const STAFF_CONFIG = {
  SHEET_NAME: 'Staff',
  ACTIONS: {
    GET_ALL: 'getStaff',
    INCLUDE_HIDDEN_PARAM: 'includeHidden',
    UPDATE: 'updateStaff',
    DELETE: 'deleteStaff',
    TOGGLE_VISIBILITY: 'toggleStaffVisibility',
  },
  HEADERS: {
    NAME: 'Name',
    ROLE: 'Role',
    BIO: 'Bio',
    PHOTO: 'Photo URL',
    SOCIAL_LINKS: 'Social Links',
    DISPLAY_ORDER: 'Display Order',
    IS_VISIBLE: 'Is Visible',
  },
};
