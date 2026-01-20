import React from 'react';
import './StatsCards.css';

const StatsCards = ({ stats, filter, onFilterChange, language }) => {
  const filterOptions = [
    { value: 'all', label: language === 'en' ? 'All Complaints' : 'ሁሉም ቅሬታዎች' },
    { value: 'pending-assignment', label: language === 'en' ? 'Pending for Assignment' : 'ለተግባር በመጠባበቅ ላይ' },
    { value: 'pending-lme', label: language === 'en' ? 'Pending at LME' : 'በLME በመጠባበቅ ላይ' },
    { value: 'resolved', label: language === 'en' ? 'Resolved' : 'ተፈቷል' },
    { value: 'rejected', label: language === 'en' ? 'Rejected' : 'ተጥሏል' }
  ];

  if (!stats || stats.length === 0) {
    return (
      <div className="stats-section">
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-icon total">
              <i className="fas fa-file-alt"></i>
            </div>
            <div className="stat-info">
              <h3>{language === 'en' ? 'Total Complaints' : 'ጠቅላላ ቅሬታዎች'}</h3>
              <div className="count">0</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="stats-section">
      <div className="stats-container">
        {stats.map((stat) => (
          <div key={stat.id} className="stat-card">
            <div className={`stat-icon ${stat.color}`}>
              <i className={stat.icon}></i>
            </div>
            <div className="stat-info">
              <h3>{stat.label}</h3>
              <div className="count">{stat.count.toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>
      
      
    </div>
  );
};

export default StatsCards;