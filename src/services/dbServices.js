import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const dbService = {
  // Get complaints data
  async getComplaints() {
    try {
      const response = await axios.get(`${API_BASE_URL}/complaints`);
      return response.data;
    } catch (error) {
      console.error('Error fetching complaints:', error);
      throw error;
    }
  },

  // Get dashboard statistics
  async getDashboardStats() {
    try {
      const response = await axios.get(`${API_BASE_URL}/dashboard/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Return mock data if API fails
      return {
        total: 1245,
        pendingAssignment: 48,
        pendingLME: 127,
        resolved: 1070,
        rejected: 200
      };
    }
  },

  // Get department statistics
  async getDepartmentStats() {
    try {
      const response = await axios.get(`${API_BASE_URL}/departments/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching department stats:', error);
      // Return mock data if API fails
      return [
        { id: 1, name: "Ministry of Education", count: 245 },
        { id: 2, name: "Ministry of Health", count: 198 },
        { id: 3, name: "Ministry of Transportation", count: 167 },
        { id: 4, name: "Ministry of Finance", count: 142 },
        { id: 5, name: "Ministry of Agriculture", count: 125 },
        { id: 6, name: "Ministry of Water & Energy", count: 118 },
        { id: 7, name: "Addis Ababa City Administration", count: 98 },
        { id: 8, name: "Ministry of Justice", count: 75 },
        { id: 9, name: "Ministry of Trade", count: 62 },
        { id: 10, name: "Other Departments", count: 115 }
      ];
    }
  },

  // Get trend data
  async getTrendData() {
    try {
      const response = await axios.get(`${API_BASE_URL}/dashboard/trend`);
      return response.data;
    } catch (error) {
      console.error('Error fetching trend data:', error);
      // Return mock data if API fails
      return {
        labels: ['Day 1', 'Day 5', 'Day 10', 'Day 15', 'Day 20', 'Day 25', 'Day 30'],
        datasets: [
          {
            label: 'New Complaints',
            data: [45, 52, 48, 67, 58, 62, 55],
            borderColor: 'rgb(0, 51, 160)',
            backgroundColor: 'rgba(0, 51, 160, 0.1)',
            tension: 0.4,
            fill: true
          },
          {
            label: 'Resolved Complaints',
            data: [32, 38, 41, 45, 52, 48, 55],
            borderColor: 'rgb(7, 137, 48)',
            backgroundColor: 'rgba(7, 137, 48, 0.1)',
            tension: 0.4,
            fill: true
          }
        ]
      };
    }
  },

  // Submit new complaint
  async submitComplaint(complaintData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/complaints`, complaintData);
      return response.data;
    } catch (error) {
      console.error('Error submitting complaint:', error);
      throw error;
    }
  }
};

export default dbService;