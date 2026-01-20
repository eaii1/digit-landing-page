import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const apiService = {
  // Get all dashboard data in one endpoint
  async getDashboardData() {
    try {
      const response = await axios.get(`${API_BASE_URL}/dashboard`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Return mock data if API fails for development
      return this.getMockDashboardData();
    }
  },

  // Get filtered complaints by status
  async getFilteredComplaints(filter) {
    try {
      const response = await axios.get(`${API_BASE_URL}/dashboard/filter?status=${filter}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching filtered complaints:', error);
      throw error;
    }
  },

  // Get department details
  async getDepartmentDetails(departmentId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/departments/${departmentId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching department details:', error);
      throw error;
    }
  },

  // Mock data for development
  getMockDashboardData() {
    // This is temporary - replace with real API data
    return {
      stats: [
        {
          id: 1,
          label: "Total Complaints",
          label_am: "ጠቅላላ ቅሬታዎች",
          count: 1245,
          icon: "fas fa-file-alt",
          color: "total",
          status: "total"
        },
        {
          id: 2,
          label: "Pending for Assignment",
          label_am: "ለተግባር በመጠባበቅ ላይ",
          count: 48,
          icon: "fas fa-user-clock",
          color: "pending-assignment",
          status: "pending_assignment"
        },
        {
          id: 3,
          label: "Pending at LME",
          label_am: "በLME በመጠባበቅ ላይ",
          count: 127,
          icon: "fas fa-users-cog",
          color: "pending-lme",
          status: "pending_lme"
        },
        {
          id: 4,
          label: "Resolved",
          label_am: "ተፈቷል",
          count: 1070,
          icon: "fas fa-check-circle",
          color: "resolved",
          status: "resolved"
        },
        {
          id: 5,
          label: "Rejected",
          label_am: "ተጥሏል",
          count: 200,
          icon: "fas fa-times-circle",
          color: "rejected",
          status: "rejected"
        }
      ],
      departments: [
        {
          id: 1,
          code: "MOE",
          name: "Ministry of Education",
          name_am: "የትምህርት ሚኒስቴር",
          totalComplaints: 245,
          complaintsByStatus: {
            pending_assignment: 12,
            pending_lme: 35,
            resolved: 185,
            rejected: 13
          },
          description: "Handles complaints related to education services, schools, and educational policies",
          description_am: "ከትምህርት አገልግሎቶች፣ ትምህርት ቤቶች እና የትምህርት ፖሊሲዎች ጋር የተያያዙ ቅሬታዎችን ያስተዳድራል"
        },
        {
          id: 2,
          code: "MOH",
          name: "Ministry of Health",
          name_am: "የጤና ሚኒስቴር",
          totalComplaints: 198,
          complaintsByStatus: {
            pending_assignment: 8,
            pending_lme: 28,
            resolved: 155,
            rejected: 7
          },
          description: "Manages complaints about healthcare services, hospitals, and public health issues",
          description_am: "ከጤና አገልግሎቶች፣ ሆስፒታሎች እና የህዝብ ጤና ጉዳዮች ጋር የተያያዙ ቅሬታዎችን ያስተዳድራል"
        },
        {
          id: 3,
          code: "MOT",
          name: "Ministry of Transportation",
          name_am: "የትራንስፖርት ሚኒስቴር",
          totalComplaints: 167,
          complaintsByStatus: {
            pending_assignment: 7,
            pending_lme: 22,
            resolved: 132,
            rejected: 6
          },
          description: "Addresses complaints regarding road infrastructure, public transport, and traffic issues",
          description_am: "ከመንገድ ሃይል አዋቂያ፣ የህዝብ ትራንስፖርት እና የትራፊክ ጉዳዮች ጋር የተያያዙ ቅሬታዎችን ያስተዳድራል"
        },
        {
          id: 4,
          code: "MOF",
          name: "Ministry of Finance",
          name_am: "የፋይናንስ ሚኒስቴር",
          totalComplaints: 142,
          complaintsByStatus: {
            pending_assignment: 5,
            pending_lme: 18,
            resolved: 115,
            rejected: 4
          },
          description: "Handles financial matters, taxation, and economic policy complaints",
          description_am: "የፋይናንስ፣ ግብር እና የኢኮኖሚ ፖሊሲ ቅሬታዎችን ያስተዳድራል"
        },
        {
          id: 5,
          code: "MOA",
          name: "Ministry of Agriculture",
          name_am: "የግብርና ሚኒስቴር",
          totalComplaints: 125,
          complaintsByStatus: {
            pending_assignment: 4,
            pending_lme: 15,
            resolved: 102,
            rejected: 4
          },
          description: "Manages agricultural issues, farming concerns, and rural development complaints",
          description_am: "የግብርና ጉዳዮች፣ የማሳ እና የገጠር ልማት ቅሬታዎችን ያስተዳድራል"
        },
        {
          id: 6,
          code: "MOWE",
          name: "Ministry of Water & Energy",
          name_am: "የውሃ እና ኢነርጂ ሚኒስቴር",
          totalComplaints: 118,
          complaintsByStatus: {
            pending_assignment: 3,
            pending_lme: 12,
            resolved: 100,
            rejected: 3
          },
          description: "Addresses complaints about water supply, electricity, and energy services",
          description_am: "ከውሃ አቅርቦት፣ ኤሌክትሪክ እና ኢነርጂ አገልግሎቶች ጋር የተያያዙ ቅሬታዎችን ያስተዳድራል"
        },
        {
          id: 7,
          code: "AACA",
          name: "Addis Ababa City Administration",
          name_am: "አዲስ አበባ ከተማ አስተዳደር",
          totalComplaints: 98,
          complaintsByStatus: {
            pending_assignment: 2,
            pending_lme: 10,
            resolved: 83,
            rejected: 3
          },
          description: "Handles municipal complaints within Addis Ababa city limits",
          description_am: "በአዲስ አበባ ከተማ ውስጥ የከተማ ቅሬታዎችን ያስተዳድራል"
        },
        {
          id: 8,
          code: "MOJ",
          name: "Ministry of Justice",
          name_am: "የፍትህ ሚኒስቴር",
          totalComplaints: 75,
          complaintsByStatus: {
            pending_assignment: 1,
            pending_lme: 8,
            resolved: 64,
            rejected: 2
          },
          description: "Manages legal and judicial system complaints",
          description_am: "የሕግ እና የፍርድ ስርዓት ቅሬታዎችን ያስተዳድራል"
        },
        {
          id: 9,
          code: "MOTR",
          name: "Ministry of Trade",
          name_am: "የንግድ ሚኒስቴር",
          totalComplaints: 62,
          complaintsByStatus: {
            pending_assignment: 1,
            pending_lme: 6,
            resolved: 54,
            rejected: 1
          },
          description: "Addresses business, commerce, and trade-related complaints",
          description_am: "ከንግድ፣ የንግድ እና የንግድ ጉዳዮች ጋር የተያያዙ ቅሬታዎችን ያስተዳድራል"
        },
        {
          id: 10,
          code: "OTHER",
          name: "Other Departments",
          name_am: "ሌሎች የመንግስት አካላት",
          totalComplaints: 115,
          complaintsByStatus: {
            pending_assignment: 5,
            pending_lme: 13,
            resolved: 94,
            rejected: 3
          },
          description: "Various other government departments and agencies",
          description_am: "ተለያዩ ሌሎች የመንግስት አካላት እና አጀንሲዎች"
        }
      ],
      trend: {
        labels: ['Day 1', 'Day 5', 'Day 10', 'Day 15', 'Day 20', 'Day 25', 'Day 30'],
        datasets: [
          {
            label: 'New Complaints',
            label_am: 'አዲስ ቅሬታዎች',
            data: [45, 52, 48, 67, 58, 62, 55],
            borderColor: 'rgb(0, 51, 160)',
            backgroundColor: 'rgba(0, 51, 160, 0.1)',
            tension: 0.4,
            fill: true
          },
          {
            label: 'Resolved Complaints',
            label_am: 'የተፈቱ ቅሬታዎች',
            data: [32, 38, 41, 45, 52, 48, 55],
            borderColor: 'rgb(7, 137, 48)',
            backgroundColor: 'rgba(7, 137, 48, 0.1)',
            tension: 0.4,
            fill: true
          }
        ]
      },
      summary: {
        pending_assignment_percentage: 3.9,
        pending_lme_percentage: 10.2,
        resolved_percentage: 85.9,
        rejected_percentage: 16.1,
        avg_resolution_time: "3.5 days",
        avg_resolution_time_am: "3.5 ቀን",
        total_complaints_this_month: 245,
        complaints_resolved_this_month: 210
      }
    };
  }
};

export default apiService;