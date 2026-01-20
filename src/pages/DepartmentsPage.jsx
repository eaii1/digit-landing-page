import React, { useEffect, useState } from 'react';

const DepartmentsPage = ({ language }) => {
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const departmentsData = {
      en: [
        {
          id: 1,
          name: "Ministry of Education",
          count: 245,
          description: "Handles complaints related to education services, schools, and educational policies"
        },
        {
          id: 2,
          name: "Ministry of Health",
          count: 198,
          description: "Manages complaints about healthcare services, hospitals, and public health issues"
        },
        {
          id: 3,
          name: "Ministry of Transportation",
          count: 167,
          description: "Addresses complaints regarding road infrastructure, public transport, and traffic issues"
        },
        {
          id: 4,
          name: "Ministry of Finance",
          count: 142,
          description: "Handles financial matters, taxation, and economic policy complaints"
        },
        {
          id: 5,
          name: "Ministry of Agriculture",
          count: 125,
          description: "Manages agricultural issues, farming concerns, and rural development complaints"
        },
        {
          id: 6,
          name: "Ministry of Water & Energy",
          count: 118,
          description: "Addresses complaints about water supply, electricity, and energy services"
        },
        {
          id: 7,
          name: "Addis Ababa City Administration",
          count: 98,
          description: "Handles municipal complaints within Addis Ababa city limits"
        },
        {
          id: 8,
          name: "Ministry of Justice",
          count: 75,
          description: "Manages legal and judicial system complaints"
        },
        {
          id: 9,
          name: "Ministry of Trade",
          count: 62,
          description: "Addresses business, commerce, and trade-related complaints"
        },
        {
          id: 10,
          name: "Other Departments",
          count: 115,
          description: "Various other government departments and agencies"
        }
      ],
      am: [
        {
          id: 1,
          name: "የትምህርት ሚኒስቴር",
          count: 245,
          description: "ከትምህርት አገልግሎቶች፣ ትምህርት ቤቶች እና የትምህርት ፖሊሲዎች ጋር የተያያዙ ቅሬታዎችን ያስተዳድራል"
        },
        {
          id: 2,
          name: "የጤና ሚኒስቴር",
          count: 198,
          description: "ከጤና አገልግሎቶች፣ ሆስፒታሎች እና የህዝብ ጤና ጉዳዮች ጋር የተያያዙ ቅሬታዎችን ያስተዳድራል"
        },
        {
          id: 3,
          name: "የትራንስፖርት ሚኒስቴር",
          count: 167,
          description: "ከመንገድ ሃይል አዋቂያ፣ የህዝብ ትራንስፖርት እና የትራፊክ ጉዳዮች ጋር የተያያዙ ቅሬታዎችን ያስተዳድራል"
        },
        {
          id: 4,
          name: "የፋይናንስ ሚኒስቴር",
          count: 142,
          description: "የፋይናንስ፣ ግብር እና የኢኮኖሚ ፖሊሲ ቅሬታዎችን ያስተዳድራል"
        },
        {
          id: 5,
          name: "የግብርና ሚኒስቴር",
          count: 125,
          description: "የግብርና ጉዳዮች፣ የማሳ እና የገጠር ልማት ቅሬታዎችን ያስተዳድራል"
        },
        {
          id: 6,
          name: "የውሃ እና ኢነርጂ ሚኒስቴር",
          count: 118,
          description: "ከውሃ አቅርቦት፣ ኤሌክትሪክ እና ኢነርጂ አገልግሎቶች ጋር የተያያዙ ቅሬታዎችን ያስተዳድራል"
        },
        {
          id: 7,
          name: "አዲስ አበባ ከተማ አስተዳደር",
          count: 98,
          description: "በአዲስ አበባ ከተማ ውስጥ የከተማ ቅሬታዎችን ያስተዳድራል"
        },
        {
          id: 8,
          name: "የፍትህ ሚኒስቴር",
          count: 75,
          description: "የሕግ እና የፍርድ ስርዓት ቅሬታዎችን ያስተዳድራል"
        },
        {
          id: 9,
          name: "የንግድ ሚኒስቴር",
          count: 62,
          description: "ከንግድ፣ የንግድ እና የንግድ ጉዳዮች ጋር የተያያዙ ቅሬታዎችን ያስተዳድራል"
        },
        {
          id: 10,
          name: "ሌሎች የመንግስት አካላት",
          count: 115,
          description: "ተለያዩ ሌሎች የመንግስት አካላት እና አጀንሲዎች"
        }
      ]
    };

    setDepartments(departmentsData[language] || departmentsData.en);
  }, [language]);

  const handleDepartmentClick = (department) => {
    alert(language === 'en' 
      ? `Department: ${department.name}\n\nComplaints: ${department.count.toLocaleString()}\n\nDescription: ${department.description}\n\nClicking would show detailed department information and specific complaints.`
      : `የመንግስት አካል: ${department.name}\n\nቅሬታዎች: ${department.count.toLocaleString()}\n\nመግለጫ: ${department.description}\n\nጠቅ በማድረግ ዝርዝር የመንግስት አካል መረጃ እና የተለየ ቅሬታዎች ይታያል።`);
  };

  return (
    <div className="page-content">
      <h2>{language === 'en' ? 'Government Departments' : 'የመንግስት አካላት'}</h2>
      <p>
        {language === 'en' 
          ? 'The following government departments are part of the Digital Complaint System. Each department has specific responsibilities for handling complaints related to their area of service.'
          : 'የሚከተሉት የመንግስት አካላት የዲጂታል ቅሬታ ስርዓት አካል ናቸው። እያንዳንዱ አካል ለአገልግሎት መስክ የተያያዙ ቅሬታዎችን ለመከላከል የተወሰኑ ሃላፊነቶች አሉት።'}
      </p>
      
      <div className="department-grid" id="departmentsList">
        {departments.map((department) => (
          <div 
            key={department.id} 
            className="department-item"
            onClick={() => handleDepartmentClick(department)}
          >
            <div>
              <div className="department-name">{department.name}</div>
              <p style={{ fontSize: '14px', color: 'var(--ethio-gray)', marginTop: '5px' }}>
                {department.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DepartmentsPage;