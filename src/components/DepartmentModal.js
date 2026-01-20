import React from 'react';
import './DepartmentModal.css';

const DepartmentModal = ({ department, onClose, language }) => {
  if (!department) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
        
        <div className="modal-header">
          <h3><i className="fas fa-building"></i> {department.name}</h3>
          <div className="department-total">
            {language === 'en' ? 'Total Complaints:' : 'ጠቅላላ ቅሬታዎች:'}
            <span className="total-count">{department.count.toLocaleString()}</span>
          </div>
        </div>

        <div className="modal-body">
          <p className="department-description">{department.description}</p>
          
          <div className="status-breakdown">
            <h4>{language === 'en' ? 'Complaint Status Breakdown' : 'የቅሬታ ሁኔታ ትንተና'}</h4>
            
            <div className="status-item status-pending-assignment">
              <div className="status-label">
                <span className="status-dot"></span>
                {language === 'en' ? 'Pending Assignment' : 'ለተግባር በመጠባበቅ ላይ'}
              </div>
              <div className="status-count">
                {department.complaintsByStatus?.pending_assignment || 0}
              </div>
            </div>
            
            <div className="status-item status-pending-lme">
              <div className="status-label">
                <span className="status-dot"></span>
                {language === 'en' ? 'Pending at LME' : 'በLME በመጠባበቅ ላይ'}
              </div>
              <div className="status-count">
                {department.complaintsByStatus?.pending_lme || 0}
              </div>
            </div>
            
            <div className="status-item status-resolved">
              <div className="status-label">
                <span className="status-dot"></span>
                {language === 'en' ? 'Resolved' : 'ተፈቷል'}
              </div>
              <div className="status-count">
                {department.complaintsByStatus?.resolved || 0}
              </div>
            </div>
            
            <div className="status-item status-rejected">
              <div className="status-label">
                <span className="status-dot"></span>
                {language === 'en' ? 'Rejected' : 'ተጥሏል'}
              </div>
              <div className="status-count">
                {department.complaintsByStatus?.rejected || 0}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="progress-section">
            <h4>{language === 'en' ? 'Resolution Rate' : 'የመፍትሄ መጠን'}</h4>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{
                  width: `${department.count > 0 ? 
                    ((department.complaintsByStatus?.resolved || 0) / department.count * 100) : 0}%`
                }}
              ></div>
            </div>
            <div className="progress-text">
              {department.count > 0 ? 
                Math.round((department.complaintsByStatus?.resolved || 0) / department.count * 100) : 0}%
              {language === 'en' ? ' complaints resolved' : ' ቅሬታዎች ተፈትተዋል'}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            {language === 'en' ? 'Close' : 'ዝጋ'}
          </button>
          <button className="btn-primary">
            <i className="fas fa-eye"></i>
            {language === 'en' ? ' View Detailed Report' : ' ዝርዝር ሪፖርት ይመልከቱ'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DepartmentModal;