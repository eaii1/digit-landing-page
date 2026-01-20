import React from 'react';
import './DepartmentGrid.css';

const DepartmentGrid = ({ departments, onDepartmentClick, language }) => {
  if (!departments || departments.length === 0) {
    return (
      <div className="department-stats">
        <h3><i className="fas fa-building"></i> {language === 'en' ? 'Complaints by Department' : 'በየመንግስት አካል ቅሬታዎች'}</h3>
        <p>{language === 'en' ? 'No department data available.' : 'የመንግስት አካላት መረጃ አይገኝም።'}</p>
      </div>
    );
  }

  return (
    <div className="department-stats">
      <h3><i className="fas fa-building"></i> {language === 'en' ? 'Complaints by Department' : 'በየመንግስት አካል ቅሬታዎች'}</h3>
      <div className="department-grid">
        {departments.map((department) => (
          <div 
            key={department.id} 
            className="department-item"
            onClick={() => onDepartmentClick && onDepartmentClick(department)}
          >
            <div className="department-name">{department.name}</div>
            <div className="department-count">{department.count.toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DepartmentGrid;