import React, { useState, useEffect } from 'react';
import StatsCards from '../components/StatsCards/StatsCards';
import { DepartmentChart, TrendChart } from '../components/Charts';
import DepartmentGrid from '../components/DepartmentGrid/DepartmentGrid';
import './HomePage.css';

const HomePage = ({ onNewComplaint, language }) => {
  const [filter, setFilter] = useState('all');
  const [stats, setStats] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [trendData, setTrendData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [showDepartmentPopup, setShowDepartmentPopup] = useState(false);

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching data from API...');
      // In development, use the proxy (/api) to avoid CORS issues
      // The proxy forwards /api requests to http://localhost:9260
      // In production, use REACT_APP_API_URL or default to http://localhost:9260
      let baseUrl;
      if (process.env.NODE_ENV === 'development') {
        // Use proxy in development to avoid CORS
        baseUrl = '/api';
        console.log('Using proxy (/api) to avoid CORS in development');
      } else {
        // In production, use REACT_APP_API_URL or default
        baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:9260';
        // Validate and correct the API URL if it's pointing to the wrong port
        if (baseUrl.includes(':3000') || baseUrl.includes(':5000')) {
          console.warn(`REACT_APP_API_URL (${baseUrl}) points to wrong port. Using http://localhost:9260 for pgr-analytics API.`);
          baseUrl = 'http://localhost:9260';
        }
      }
      
      const url = `${baseUrl}/pgr-analytics/v1/_summary?tenantId=ethiopia.citya`;
      console.log('Fetching from URL:', url);
      console.log('REACT_APP_API_URL from env:', process.env.REACT_APP_API_URL || 'not set');
      console.log('Using baseUrl:', baseUrl);
      console.log('NODE_ENV:', process.env.NODE_ENV);
      
      const response = await fetch(url);
      
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      // Check Content-Type before parsing
      const contentType = response.headers.get('content-type');
      
      if (!response.ok) {
        // For error responses, read as text to see what we got
        const errorText = await response.text();
        console.error('Error response body:', errorText.substring(0, 500));
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText.substring(0, 200)}`);
      }
      
      if (!contentType || !contentType.includes('application/json')) {
        // If not JSON, read as text to see what we got
        const text = await response.text();
        console.error('Received non-JSON response:', text.substring(0, 500));
        throw new Error(`Server returned ${contentType || 'unknown content type'} instead of JSON. The endpoint may not exist or the server may be returning an error page. Response preview: ${text.substring(0, 200)}`);
      }
      
      const data = await response.json();
      console.log('API Response data:', data);
      
      // Process the new Elasticsearch JSON structure
      processElasticsearchData(data);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      console.error('Error details:', error.message);
      
      if (error.message.includes('Failed to fetch') || error.message.includes('CORS')) {
        setError(`CORS Error: Browser blocked the request. Make sure the API server is running and CORS is configured.`);
      } else if (error.message.includes('instead of JSON') || error.message.includes('text/html')) {
        // Calculate the correct API URL (same logic as above)
        let apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:9260';
        if (apiUrl.includes(':3000') || apiUrl.includes(':5000')) {
          apiUrl = 'http://localhost:9260';
        }
        setError(`Server returned HTML instead of JSON. This usually means:
1. The API server is not running at ${apiUrl}
2. The endpoint /pgr-analytics/v1/_summary does not exist
3. The request is hitting the React app instead of the API server

Please check:
- Is the API server running at http://localhost:9260?
- Test with: curl "http://localhost:9260/pgr-analytics/v1/_summary?tenantId=ethiopia.citya"
- Update your .env file: REACT_APP_API_URL=http://localhost:9260 (or remove it to use default)
- Did you restart the dev server after changing .env?
- Current API URL being used: ${apiUrl}`);
      } else {
        setError(`Failed to load dashboard data: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const processElasticsearchData = (data) => {
    console.log('Processing API data:', data);
    
    // Safely extract data from the actual API response structure
    // Handle cases where structure might be slightly different or missing
    const grandTotal = Number(data.aggregations?.["Grand Total Complaints"]) || 0;
    const serviceBreakdown = data.aggregations?.["Service Breakdown"] || {};
    
    // Validate that serviceBreakdown is an object
    if (typeof serviceBreakdown !== 'object' || Array.isArray(serviceBreakdown)) {
      console.warn('Service Breakdown is not in expected format:', serviceBreakdown);
      setError('Invalid data format received from API');
      return;
    }
    
    // Calculate totals from service breakdown
    let totalPendingAssignment = 0;
    let totalPendingLME = 0;
    let totalResolved = 0;
    let totalRejected = 0;
    
    // Create department data from service breakdown - fully dynamic
    // This will handle any number of services, new services, deleted services, etc.
    const departmentData = Object.entries(serviceBreakdown)
      .filter(([serviceName, serviceData]) => {
        // Filter out any invalid entries (defensive programming)
        return serviceName && serviceData && typeof serviceData === 'object';
      })
      .map(([serviceName, serviceData]) => {
        // Safely extract values with defaults - handles missing or null values
        const totalComplaints = Number(serviceData["Total Complaints"]) || 0;
        const pendingAssignment = Number(serviceData["Pending for Assignment"]) || 0;
        const pendingLME = Number(serviceData["Pending at LME"]) || 0;
        const resolved = Number(serviceData["Resolved"]) || 0;
        const rejected = Number(serviceData["Rejected"]) || 0;
        
        // Add to totals
        totalPendingAssignment += pendingAssignment;
        totalPendingLME += pendingLME;
        totalResolved += resolved;
        totalRejected += rejected;
        
        // Generate a unique key from service name (lowercase, no spaces, handle special chars)
        // This ensures consistent IDs even if service names change slightly
        const serviceKey = serviceName
          .toLowerCase()
          .replace(/\s+/g, '')
          .replace(/[^a-z0-9]/g, '')
          .substring(0, 50); // Limit length to prevent issues
        
        return {
          id: serviceKey || `service-${Math.random().toString(36).substr(2, 9)}`, // Fallback ID if empty
          name: serviceName || 'Unknown Service', // Use service name as-is from API
          count: totalComplaints,
          complaintsByStatus: {
            pending_assignment: pendingAssignment,
            pending_lme: pendingLME,
            resolved: resolved,
            rejected: rejected
          }
        };
      })
      .sort((a, b) => {
        // Sort by count (descending) so most active services appear first
        // This makes the UI more useful and handles dynamic ordering
        return b.count - a.count;
      });
    
    // Set departments state - this will automatically update UI with any services
    setDepartments(departmentData);
    
    // Log for debugging - shows what services were found
    console.log(`Processed ${departmentData.length} services dynamically`);
    console.log('Services found:', departmentData.map(d => d.name));
    
    // Create stats data - always the same structure regardless of services
    const statsData = [
      {
        id: 'total-complaints',
        label: language === 'en' ? 'Total Complaints' : 'ጠቅላላ ቅሬታዎች',
        count: grandTotal,
        icon: 'fas fa-file-alt',
        color: 'blue'
      },
      {
        id: 'pending-assignment',
        label: language === 'en' ? 'Pending Assignment' : 'ለተግባር በመጠባበቅ ላይ',
        count: totalPendingAssignment,
        icon: 'fas fa-clock',
        color: 'orange'
      },
      {
        id: 'pending-lme',
        label: language === 'en' ? 'Pending at LME' : 'በLME በመጠባበቅ ላይ',
        count: totalPendingLME,
        icon: 'fas fa-user-clock',
        color: 'yellow'
      },
      {
        id: 'resolved',
        label: language === 'en' ? 'Resolved' : 'ተፈቷል',
        count: totalResolved,
        icon: 'fas fa-check-circle',
        color: 'green'
      },
      {
        id: 'rejected',
        label: language === 'en' ? 'Rejected' : 'ተጥሏል',
        count: totalRejected,
        icon: 'fas fa-times-circle',
        color: 'red'
      }
    ];
    
    setStats(statsData);
    
    // Create trend data
    const months = language === 'en' 
      ? ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb']
      : ['መስከ', 'ጥቅ', 'ህዳ', 'ታህ', 'ጥር', 'የካ'];
    
    // Distribute the data across months for visualization
    const resolvedData = distributeValues(totalResolved, 6);
    const pendingData = distributeValues(totalPendingAssignment + totalPendingLME, 6);
    
    const trendDataObj = {
      labels: months,
      datasets: [
        {
          label: language === 'en' ? 'Resolved' : 'ተፈቷል',
          data: resolvedData,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4
        },
        {
          label: language === 'en' ? 'Pending' : 'በመጠባበቅ ላይ',
          data: pendingData,
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          tension: 0.4
        }
      ]
    };
    
    setTrendData(trendDataObj);
  };

  // Updated formatServiceName function for new service codes
  const formatServiceName = (key) => {
    const nameMap = {
      'radiationattack': 'Radiation Attack',
      'householdordomesticdispute': 'Household/Domestic Dispute',
      'goodgovernance': 'Good Governance',
      'landownershipdispute': 'Land Ownership Dispute',
      'legalprotection': 'Legal Protection',
      'miscellaneous': 'Miscellaneous',
      'pensionandotherbenefits': 'Pension and Other Benefits',
      'compensationclaim': 'Compensation Claim',
      'displacementsecuritythreatsandpropertydestruction': 'Displacement/Security Threats/Property Destruction',
      'housingassistancerequestandsupport': 'Housing Assistance Request and Support',
      'identityandstructuralissues': 'Identity and Structural Issues',
      'justiceorlegalproblems': 'Justice or Legal Problems',
      'religionrelatedissues': 'Religion Related Issues',
      'taxandcustoms': 'Tax and Customs'
    };
    
    const amharicMap = {
      'radiationattack': 'የጨረር ጥቃት',
      'householdordomesticdispute': 'የቤት ውስጥ/የቤተሰብ ክርክር',
      'goodgovernance': 'መልካም አስተዳደር',
      'landownershipdispute': 'የመሬት ባለቤትነት ክርክር',
      'legalprotection': 'ሕጋዊ ጥበቃ',
      'miscellaneous': 'የተለያዩ',
      'pensionandotherbenefits': 'ጡረታ እና ሌሎች ጥቅማጥቅሞች',
      'compensationclaim': 'የካሳ ጥያቄ',
      'displacementsecuritythreatsandpropertydestruction': 'መፈናቀል/የደህንነት አደጋዎች/የንብረት ማፍረስ',
      'housingassistancerequestandsupport': 'የመኖሪያ እርዳታ ጥያቄ እና ድጋፍ',
      'identityandstructuralissues': 'እንዲነት እና መዋቅራዊ ጉዳዮች',
      'justiceorlegalproblems': '�ትህየት ወይም ሕጋዊ ችግሮች',
      'religionrelatedissues': 'የሃይማኖት ጉዳዮች',
      'taxandcustoms': 'ግብር እና ባንዲራ'
    };
    
    // Dynamic handling: For English, use service name as-is (API provides readable names)
    // For Amharic, try translation or fallback to service name
    if (language === 'en') {
      return key || 'Unknown Service';
    } else {
      // Try to find translation, otherwise use the service name
      return amharicMap[key] || key || 'ያልታወቀ አገልግሎት';
    }
  };

  // Helper function to distribute values across months
  const distributeValues = (total, months) => {
    if (total === 0) {
      return Array(months).fill(0);
    }
    
    const values = [];
    let remaining = total;
    
    for (let i = 0; i < months; i++) {
      if (i === months - 1) {
        values.push(remaining);
      } else {
        const val = Math.floor(Math.random() * (remaining / (months - i))) + Math.floor(remaining / months);
        values.push(val);
        remaining -= val;
      }
    }
    
    return values;
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    
    if (stats) {
      const updatedStats = stats.map(stat => ({
        ...stat,
        active: stat.id === newFilter
      }));
      setStats(updatedStats);
    }
  };

  const handleDepartmentClick = (department) => {
    setSelectedDepartment(department);
    setShowDepartmentPopup(true);
  };

  const handleClosePopup = () => {
    setShowDepartmentPopup(false);
    setSelectedDepartment(null);
  };

  const DepartmentPopup = () => {
    if (!selectedDepartment) return null;

    const resolutionRate = selectedDepartment.count > 0 
      ? Math.round((selectedDepartment.complaintsByStatus?.resolved || 0) / selectedDepartment.count * 100)
      : 0;

    return (
      <div className="department-popup-overlay" onClick={handleClosePopup}>
        <div className="department-popup" onClick={(e) => e.stopPropagation()}>
          <button className="popup-close" onClick={handleClosePopup}>
            <i className="fas fa-times"></i>
          </button>
          
          <div className="popup-header">
  <h3>
    <i className="fas fa-university"></i>
    <span className="popup-department-name">{selectedDepartment.name}</span>
  </h3>
  <div className="department-total">
    {language === 'en' ? 'Total Complaints:' : 'ጠቅላላ ቅሬታዎች:'}
    <span className="total-count">{selectedDepartment.count.toLocaleString()}</span>
  </div>
</div>

          <div className="popup-body">
            <div className="status-breakdown">
              <h4><i className="fas fa-chart-pie"></i> {language === 'en' ? 'Complaint Status Breakdown' : 'የቅሬታ ሁኔታ ትንተና'}</h4>
              
              <div className="status-item status-pending-assignment">
                <div className="status-label">
                  <span className="status-dot"></span>
                  {language === 'en' ? 'Pending Assignment' : 'ለተግባር በመጠባበቅ ላይ'}
                </div>
                <div className="status-count">
                  {selectedDepartment.complaintsByStatus?.pending_assignment || 0}
                </div>
              </div>
              
              <div className="status-item status-pending-lme">
                <div className="status-label">
                  <span className="status-dot"></span>
                  {language === 'en' ? 'Pending at LME' : 'በLME በመጠባበቅ ላይ'}
                </div>
                <div className="status-count">
                  {selectedDepartment.complaintsByStatus?.pending_lme || 0}
                </div>
              </div>
              
              <div className="status-item status-resolved">
                <div className="status-label">
                  <span className="status-dot"></span>
                  {language === 'en' ? 'Resolved' : 'ተፈቷል'}
                </div>
                <div className="status-count resolved">
                  {selectedDepartment.complaintsByStatus?.resolved || 0}
                </div>
              </div>
              
              <div className="status-item status-rejected">
                <div className="status-label">
                  <span className="status-dot"></span>
                  {language === 'en' ? 'Rejected' : 'ተጥሏል'}
                </div>
                <div className="status-count rejected">
                  {selectedDepartment.complaintsByStatus?.rejected || 0}
                </div>
              </div>
            </div>

            <div className="progress-section">
              <h4>{language === 'en' ? 'Resolution Rate' : 'የመፍትሄ መጠን'}</h4>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{
                    width: `${resolutionRate}%`
                  }}
                ></div>
              </div>
              <div className="progress-text">
                <i className="fas fa-chart-line"></i>
                {resolutionRate}% {language === 'en' ? 'complaints resolved' : 'ቅሬታዎች ተፈትተዋል'}
              </div>
            </div>
          </div>

          <div className="popup-footer">
            <button className="btn-popup-close" onClick={handleClosePopup}>
              <i className="fas fa-times"></i>
              {language === 'en' ? 'Close' : 'ዝጋ'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="home-page-background">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>{language === 'en' ? 'Loading dashboard data...' : 'የሳጥኑ ውሂብ በመጫን ላይ...'}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-page-background">
        <div className="error-message">
          <h3>{language === 'en' ? 'Connection Error' : 'የግንኙነት ስህተት'}</h3>
          <pre style={{ whiteSpace: 'pre-wrap', textAlign: 'left', fontSize: '14px' }}>{error}</pre>
          
          <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
            <button onClick={fetchDashboardData} className="retry-btn">
              {language === 'en' ? 'Retry Connection' : 'አገናኝ እንደገና ይሞክሩ'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page-background">
      <div className="home-page-overlay">
        <div className="home-page">
          <div className="dashboard-header">
            <h2>{language === 'en' ? 'Complaint Management Dashboard' : 'የቅሬታ መቆጣጠሪያ ሳጥን'}</h2>
            <p>
              {language === 'en' 
                ? 'Welcome to the Ethiopian Digital Complaint Management System. This platform allows citizens to submit, track, and monitor complaints across various government departments.'
                : 'የኢትዮጵያ ዲጂታል ቅሬታ አስተዳደር ስርዓት እንኳን በደህና መጡ። ይህ መድረክ ዜጎች በተለያዩ የመንግስት አካላት ቅሬታ እንዲያስገቡ፣ እንዲከታተሉ እና እንዲቆጣጠሩ ያስችላል።'}
            </p>
          </div>

          {stats && (
            <StatsCards 
              stats={stats} 
              filter={filter}
              onFilterChange={handleFilterChange}
              language={language}
            />
          )}

          <div className="charts-section">
            {departments.length > 0 && <DepartmentChart data={departments} language={language} />}
          </div>

          {departments.length > 0 && (
            <DepartmentGrid 
              departments={departments}
              onDepartmentClick={handleDepartmentClick}
              language={language}
            />
          )}

          <div className="system-info">
            <div className="info-card">
              <i className="fas fa-paper-plane"></i>
              <h4>{language === 'en' ? 'Submit Complaint' : 'ቅሬታ አስገባ'}</h4>
              <p>
                {language === 'en' 
                  ? 'Easily submit your complaint through our online system. You can track its progress at any time.'
                  : 'በእኛ የኦንላይን ስርዓት ቅሬታዎን በቀላሉ ያስገቡ። ሂደቱን በማንኛውም ጊዜ መከታተል ይችላሉ።'}
              </p>
            </div>
            <div className="info-card">
              <i className="fas fa-chart-line"></i>
              <h4>{language === 'en' ? 'Track Status' : 'ሁኔታ ከተከታተል'}</h4>
              <p>
                {language === 'en' 
                  ? 'Monitor the status of your complaint in real-time as it moves through the resolution process.'
                  : 'ቅሬታዎ በመፍትሄ ሂደት ላይ በሚሄድበት ጊዜ ሁኔታውን በቀጥታ ይከታተሉ።'}
              </p>
            </div>
            <div className="info-card">
              <i className="fas fa-clock"></i>
              <h4>{language === 'en' ? 'Quick Response' : 'ፈጣን ምላሽ'}</h4>
              <p>
                {language === 'en' 
                  ? 'Our system ensures timely responses and efficient handling of all complaints.'
                  : 'ስርዓታችን ወቅታዊ ምላሽ እና ቅሬታዎችን በብቃት ማስተዳደር ያረጋግጣል።'}
              </p>
            </div>
          </div>
        </div>
      </div>
      {showDepartmentPopup && <DepartmentPopup />}
    </div>
  );
};

export default HomePage;