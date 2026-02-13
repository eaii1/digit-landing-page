import React, { useEffect, useState } from 'react';

const ContactPage = ({ language }) => {
  const [contactData, setContactData] = useState(null);

  useEffect(() => {
    const contactContent = {
      en: {
        address: {
          title: "Address",
          icon: "fas fa-map-marker-alt",
          details: [
            "Prime Minister Office",
            "Addis Ababa, Ethiopia",
            "P.O. Box 1234"
          ]
        },
        phone: {
          title: "Phone Numbers",
          icon: "fas fa-phone",
          details: [
            "Main Office: 011-1- 54-54-09",
            "Complaint Hotline: 011-1- 54-54-09",
            "Technical Support: 011-1- 54-54-09"
          ]
        },
        email: {
          title: "Email",
          icon: "fas fa-envelope",
          details: [
            "General Inquiries: info@pmo.gov.et",
            "Complaints: info@pmo.gov.et",
            "Technical Support: info@pmo.gov.et"
          ]
        },
        hours: {
          title: "Working Hours",
          icon: "fas fa-clock",
          details: [
            "Monday - Friday: 8:30 AM - 5:30 PM",
            "Saturday: 9:00 AM - 1:00 PM",
            "Sunday: Closed"
          ]
        }
      },
      am: {
        address: {
          title: "አድራሻ",
          icon: "fas fa-map-marker-alt",
          details: [
            "የጠቅላይ ሚኒስትር ቢሮ",
            "አዲስ አበባ፣ ኢትዮጵያ",
            "ፖ.ሳ. 1234"
          ]
        },
        phone: {
          title: "ስልክ ቁጥሮች",
          icon: "fas fa-phone",
          details: [
            "ዋና ቢሮ: 011-1- 54-54-09",
            "የቅሬታ ሆትላይን: 011-1- 54-54-09",
            "የቴክኒካል ድጋፍ: 011-1- 54-54-09"
          ]
        },
        email: {
          title: "ኢሜል",
          icon: "fas fa-envelope",
          details: [
            "አጠቃላይ መረጃ: info@pmo.gov.et",
            "ቅሬታዎች: info@pmo.gov.et",
            "የቴክኒካል ድጋፍ: info@pmo.gov.et"
          ]
        },
        hours: {
          title: "የስራ ሰዓት",
          icon: "fas fa-clock",
          details: [
            "ሰኞ - አርብ: 8:30 ጥዋት - 5:30 ከሰዓት",
            "ቅዳሜ: 9:00 ጥዋት - 1:00 ከሰዓት",
            "እሑድ: ዝግ ነው"
          ]
        }
      }
    };

    setContactData(contactContent[language] || contactContent.en);
  }, [language]);

  if (!contactData) {
    return <div className="loading-spinner">Loading...</div>;
  }

  return (
    <div className="page-content">
      <h2>{language === 'en' ? 'Contact Us' : 'አግኙን'}</h2>
      <p>
        {language === 'en' 
          ? 'If you have any questions or need assistance with the Digital Complaint System, please contact us using the information below:'
          : 'ስለ ዲጂታል ቅሬታ ስርዓቱ ማንኛውም ጥያቄ ካለዎት ወይም እርዳታ ከፈለጉ፣ እባክዎን ከዚህ በታች ባለው መረጃ ያግኙን።'}
      </p>
      
      <div className="contact-grid">
        {Object.values(contactData).map((contact, index) => (
          <div key={index} className="contact-item">
            <h4><i className={contact.icon}></i> {contact.title}</h4>
            {contact.details.map((detail, idx) => (
              <p key={idx}>{detail}</p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactPage;