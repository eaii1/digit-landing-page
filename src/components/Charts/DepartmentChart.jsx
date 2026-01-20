import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';

const DepartmentChart = ({ data, language }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartRef.current && data && data.length > 0) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      
      const departmentLabels = data.map(dept => dept.name);
      const departmentCounts = data.map(dept => dept.count);
      
   const departmentColors = [
  'rgb(3, 75, 100)',
  'rgb(10, 85, 110)',
  'rgb(20, 95, 120)',
  'rgb(30, 105, 130)',
  'rgb(40, 115, 140)',
  'rgb(50, 125, 150)',
  'rgb(65, 135, 160)',
  'rgb(80, 145, 170)',
  'rgb(95, 155, 180)',
  'rgb(110, 165, 190)',
  'rgb(130, 175, 200)',
  'rgb(150, 185, 210)',
  'rgb(170, 195, 220)',
];

      
      chartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: departmentLabels,
          datasets: [{
            label: language === 'en' ? 'Number of Complaints' : 'የቅሬታዎች ብዛት',
            data: departmentCounts,
            backgroundColor: departmentColors,
            borderColor: 'rgba(0, 51, 160, 1)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: language === 'en' ? 'Number of Complaints' : 'የቅሬታዎች ብዛት'
              }
            },
            x: {
              ticks: {
                maxRotation: 45,
                minRotation: 45
              }
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

  return (
    <div className="chart-container">
      <h3><i className="fas fa-chart-pie"></i> {language === 'en' ? 'Complaints by Department' : 'በየመንግስት አካል ቅሬታዎች'}</h3>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default DepartmentChart;