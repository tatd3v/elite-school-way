import { API_CONFIG } from '../config/constants';

class DashboardService {
  async fetchRegistrations() {
    try {
      const response = await fetch(`${API_CONFIG.GOOGLE_SCRIPT_URL}?action=getRegistrations`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch registrations');
      }

      const data = await response.json();
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
      return {
        students: 0,
        houses: 0,
      };
    }
  }

  async fetchStaff() {
    try {
      const response = await fetch(`${API_CONFIG.GOOGLE_SCRIPT_URL}?action=getStaff`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch staff');
      }

      const data = await response.json();
      return data.staff || [];
    } catch (error) {
      console.error('Error fetching staff:', error);
      throw error;
    }
  }
}

export const dashboardService = new DashboardService();
