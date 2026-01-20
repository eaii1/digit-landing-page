import React from 'react';
import './Footer.css';

const Footer = ({ onNavigate, language }) => {
  const handleNavigation = (page) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h4>{language === 'en' ? 'Ethiopian Digital Complaint System' : 'የኢትዮጵያ ዲጂታል ቅሬታ ስርዓት'}</h4>
            <p>
              {language === 'en' 
                ? 'This digital platform enables citizens to submit complaints and track their resolution process across government departments efficiently and transparently.'
                : 'ይህ ዲጂታል መድረክ ዜጎች በመንግስት አካላት ቅሬታ እንዲያስገቡ እና የመፍትሄ ሂደታቸውን በብቃት እና በባለግልጽነት እንዲከታተሉ ያስችላል።'}
            </p>
          </div>
          <div className="footer-section">
            <h4>{language === 'en' ? 'Quick Links' : 'ፈጣን አገናኞች'}</h4>
            <ul className="footer-links">
              <li>
                <a 
                  href="#home" 
                  className="footer-nav-link" 
                  onClick={(e) => { e.preventDefault(); handleNavigation('home'); }}
                >
                  <i className="fas fa-chevron-right"></i> {language === 'en' ? 'Home' : 'ዋና ገጽ'}
                </a>
              </li>
              <li>
                <a 
                  href="#about" 
                  className="footer-nav-link" 
                  onClick={(e) => { e.preventDefault(); handleNavigation('about'); }}
                >
                  <i className="fas fa-chevron-right"></i> {language === 'en' ? 'About System' : 'ስለ ስርዓቱ'}
                </a>
              </li>
             
              <li>
                <a 
                  href="#faq" 
                  className="footer-nav-link" 
                  onClick={(e) => { e.preventDefault(); handleNavigation('faq'); }}
                >
                  <i className="fas fa-chevron-right"></i> {language === 'en' ? 'FAQ' : 'ተደጋጋሚ ጥያቄዎች'}
                </a>
              </li>
              <li>
                <a 
                  href="#contact" 
                  className="footer-nav-link" 
                  onClick={(e) => { e.preventDefault(); handleNavigation('contact'); }}
                >
                  <i className="fas fa-chevron-right"></i> {language === 'en' ? 'Contact' : 'አግኙን'}
                </a>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>{language === 'en' ? 'Contact Information' : 'የመገኛ መረጃ'}</h4>
            <ul className="footer-links">
              <li><i className="fas fa-map-marker-alt"></i> {language === 'en' ? 'Prime Minister Office, Addis Ababa, Ethiopia' : 'የጠቅላይ ሚኒስትር ቢሮ፣ አዲስ አበባ፣ ኢትዮጵያ'}</li>
              <li><i className="fas fa-phone"></i> +251-11-111-1111</li>
              <li><i className="fas fa-envelope"></i> complaints@pmo.gov.et</li>
              <li><i className="fas fa-clock"></i> {language === 'en' ? 'Mon-Fri: 8:30 AM - 5:30 PM' : 'ሰኞ-አርብ: 8:30 ጥዋት - 5:30 ከሰዓት'}</li>
            </ul>
          </div>
        </div>
       
        <div className="copyright">
          <p>
            &copy; 2026 {language === 'en' ? 'Ethiopian Digital Complaint System' : 'የኢትዮጵያ ዲጂታል ቅሬታ ስርዓት'}. 
            {language === 'en' ? 'All rights reserved.' : 'ሁሉም መብቶች የተጠበቁ ናቸው።'} | 
            {language === 'en' ? 'Ethiopian Digital Complaint System' : 'የኢትዮጵያ ዲጂታል ቅሬታ ስርዓት'}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;