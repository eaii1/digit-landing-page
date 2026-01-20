import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';

const TrendChart = ({ data, language }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartRef.current && data) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      
      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
          responsive: true,
          interaction: {
            mode: 'index',
            intersect: false,
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: language === 'en' ? 'Number of Complaints' : 'የቅሬታዎች ብዛት'
              }
            }
          },
          plugins: {
            tooltip: {
              mode: 'index',
              intersect: false
            }
          }
        }
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, language]);

  if (!data) {
    return (
      <div className="chart-container">
        <h3><i className="fas fa-chart-line"></i> {language === 'en' ? 'Complaints Trend (Last 30 Days)' : 'የቅሬታዎች አዝማሚያ (የመጨረሻው 30 ቀን)'}</h3>
        <div className="chart-placeholder">
          <p>{language === 'en' ? 'No trend data available' : 'አዝማሚያ መረጃ አይገኝም'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <h3><i className="fas fa-chart-line"></i> {language === 'en' ? 'Complaints Trend (Last 30 Days)' : 'የቅሬታዎች አዝማሚያ (የመጨረሻው 30 ቀን)'}</h3>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default TrendChart;