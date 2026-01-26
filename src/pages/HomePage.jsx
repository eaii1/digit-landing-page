import React, { useState, useEffect } from 'react';
import StatsCards from '../components/StatsCards/StatsCards';
import { DepartmentChart, TrendChart } from '../components/Charts';
import DepartmentGrid from '../components/DepartmentGrid/DepartmentGrid';
import { getTenantId } from '../utils/tenantUtils';
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
  const [tenantId, setTenantId] = useState(getTenantId());

  // Listen for URL changes (e.g., when tenant ID changes in query params)
  useEffect(() => {
    const handleLocationChange = () => {
      const newTenantId = getTenantId();
      setTenantId(prevTenantId => {
        if (newTenantId !== prevTenantId) {
          return newTenantId;
        }
        return prevTenantId;
      });
    };

    // Check for URL changes (browser back/forward)
    window.addEventListener('popstate', handleLocationChange);
    
    // Also check on mount
    handleLocationChange();

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [language, tenantId]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching data from API...');
      
      // Get current tenant ID dynamically
      const currentTenantId = getTenantId();
      setTenantId(currentTenantId);
      
      const backendBaseUrl = process.env.REACT_APP_BACKEND_BASE_URL || 'http://localhost:9260';
      const analyticsApiPath = process.env.REACT_APP_ANALYTICS_API_PATH || '/pgr-analytics/v1/_summary';
      
      const apiUrl = `${backendBaseUrl}${analyticsApiPath}?tenantId=${currentTenantId}`;
      console.log('API URL:', apiUrl);
      console.log('Tenant ID:', currentTenantId);
      
      const response = await fetch(apiUrl);
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API Response data:', data);
      
      // Process the new Elasticsearch JSON structure
      processElasticsearchData(data);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      console.error('Error details:', error.message);
      
      // Generic error handling - CORS is handled by browser/backend configuration
      setError(`Failed to load dashboard data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const processElasticsearchData = (data) => {
    console.log('Processing Elasticsearch data:', data);
    
    // Extract data from aggregations
    const grandTotal = data.aggregations?.grand_total_complaints?.value || 0;
    const serviceBuckets = data.aggregations?.by_service_code?.buckets || [];
    
    // Calculate totals from buckets
    let totalPendingAssignment = 0;
    let totalPendingLME = 0;
    let totalResolved = 0;
    let totalRejected = 0;
    
    // Create department data from buckets
    const departmentData = serviceBuckets.map(bucket => {
      const serviceKey = bucket.key;
      const totalComplaints = bucket.doc_count;
      
      // Initialize status counts
      let pendingAssignment = 0;
      let pendingLME = 0;
      let resolved = 0;
      let rejected = 0;
      
      // Process status breakdown
      if (bucket.status_breakdown?.buckets) {
        bucket.status_breakdown.buckets.forEach(statusBucket => {
          const status = statusBucket.key;
          const count = statusBucket.doc_count;
          
          switch(status) {
            case 'PENDINGFORASSIGNMENT':
              pendingAssignment = count;
              totalPendingAssignment += count;
              break;
            case 'PENDINGATLME':
              pendingLME = count;
              totalPendingLME += count;
              break;
            case 'RESOLVED':
              resolved = count;
              totalResolved += count;
              break;
            case 'REJECTED':
              rejected = count;
              totalRejected += count;
              break;
          }
        });
      }
      
      return {
        id: serviceKey,
        name: serviceKey,
        count: totalComplaints,
        complaintsByStatus: {
          pending_assignment: pendingAssignment,
          pending_lme: pendingLME,
          resolved: resolved,
          rejected: rejected
        }
      };
    });
    
    // Set departments state
    setDepartments(departmentData);
    
    // Create stats data
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
    
    return language === 'en' 
      ? (nameMap[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()))
      : (amharicMap[key] || key);
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