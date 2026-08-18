import { API_CONFIG, STAFF_CONFIG } from '../config/constants';

function jsonp(url) {
  return new Promise((resolve, reject) => {
    const callback = `eliteCB_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const fullUrl = `${url}${url.includes('?') ? '&' : '?'}callback=${callback}`;
    const script = document.createElement('script');
    script.src = fullUrl;

    const cleanup = () => {
      delete window[callback];
      if (script.parentNode) script.parentNode.removeChild(script);
    };

    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error('JSONP request timed out'));
    }, 30000);

    window[callback] = (data) => {
      clearTimeout(timeout);
      resolve(data);
      cleanup();
    };

    script.onerror = () => {
      clearTimeout(timeout);
      cleanup();
      reject(new Error('JSONP request failed'));
    };

    document.head.appendChild(script);
  });
}

class DashboardService {
  async fetchRegistrations() {
    try {
      const url = new URL(API_CONFIG.GOOGLE_SCRIPT_URL);
      url.searchParams.set('action', 'getRegistrations');
      const data = await jsonp(url.toString());
      return data.registrations || [];
    } catch (error) {
      console.error('Error fetching registrations:', error);
      throw error;
    }
  }

  async fetchStats() {
    try {
      const registrations = await this.fetchRegistrations();

      const uniqueHouses = new Set(
        registrations
          .map(reg => reg.house)
          .filter(house => house && house.trim() !== '')
      );

      return {
        students: registrations.length,
        houses: uniqueHouses.size,
      };
    } catch (error) {
      console.error('Error calculating stats:', error);
      return { students: 0, houses: 0 };
    }
  }

  async fetchStaff() {
    try {
      const url = new URL(API_CONFIG.GOOGLE_SCRIPT_URL);
      url.searchParams.set('action', STAFF_CONFIG.ACTIONS.GET_ALL);
      url.searchParams.set(STAFF_CONFIG.ACTIONS.INCLUDE_HIDDEN_PARAM, 'true');
      const data = await jsonp(url.toString());
      return (data.staff || []).map((m) => this.normalizeStaffMember(m));
    } catch (error) {
      console.error('Error fetching staff:', error);
      throw error;
    }
  }

  async fetchVisibleStaff() {
    try {
      const url = new URL(API_CONFIG.GOOGLE_SCRIPT_URL);
      url.searchParams.set('action', STAFF_CONFIG.ACTIONS.GET_ALL);
      const data = await jsonp(url.toString());
      return (data.staff || []).map((m) => this.normalizeStaffMember(m));
    } catch (error) {
      console.error('Error fetching visible staff:', error);
      throw error;
    }
  }

  normalizeStaffMember(member) {
    return {
      ...member,
      id: member.rowIndex ? String(member.rowIndex) : member.id,
      displayOrder: Number(member.displayOrder) || 0,
      isVisible: member.isVisible === true || member.isVisible === 'TRUE' || member.isVisible === 'true',
    };
  }

  async postStaffAction(action, payload) {
    if (!API_CONFIG.GOOGLE_SCRIPT_URL) {
      if (import.meta.env.DEV) {
        return { status: 'success' };
      }
      throw new Error('Google Script URL not configured');
    }

    await fetch(API_CONFIG.GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ action, ...payload }),
    });

    return { status: 'success' };
  }

  async updateStaff(member) {
    try {
      const result = await this.postStaffAction(STAFF_CONFIG.ACTIONS.UPDATE, {
        rowIndex: member.rowIndex,
        name: member.name,
        role: member.role,
        bio: member.bio,
        photo: member.photo,
        socialLinks: member.socialLinks,
        displayOrder: member.displayOrder,
        isVisible: member.isVisible,
      });
      return { success: result?.status === 'success', data: result };
    } catch (error) {
      console.error('Error updating staff:', error);
      throw error;
    }
  }

  async deleteStaff(rowIndex) {
    try {
      const result = await this.postStaffAction(STAFF_CONFIG.ACTIONS.DELETE, { rowIndex });
      return { success: result?.status === 'success', data: result };
    } catch (error) {
      console.error('Error deleting staff:', error);
      throw error;
    }
  }

  async toggleStaffVisibility(rowIndex, isVisible) {
    try {
      const result = await this.postStaffAction(STAFF_CONFIG.ACTIONS.TOGGLE_VISIBILITY, {
        rowIndex,
        isVisible,
      });
      return { success: result?.status === 'success', data: result };
    } catch (error) {
      console.error('Error toggling staff visibility:', error);
      throw error;
    }
  }
}

export const dashboardService = new DashboardService();
