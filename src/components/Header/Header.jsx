import React, { useState, useEffect, useRef } from 'react';
import './Header.css';

const Header = ({ onNewComplaint, currentPage, onNavigate, language, onLanguageChange }) => {
  const [currentDate, setCurrentDate] = useState('');
  const [showPromotion, setShowPromotion] = useState(true);
  const [scrollText, setScrollText] = useState('');
  const [shouldScroll, setShouldScroll] = useState(false);
  const textContainerRef = useRef(null);
  const textRef = useRef(null);
  const animationRef = useRef(null);

  const promotionMessages = {
    en: [
      "Submit your complaints online and track their progress in real-time.",
      "Your feedback helps improve government services for all citizens.",
      "Average complaint resolution time: 3.5 working days.",
      "Complaint system available 24/7 for your convenience.",
      "Need help? Contact our support team at 011-111-1111."
    ],
    am: [
      "ቅሬታዎን በኦንላይን ያስገቡ እና እድገቱን በቀጥታ ይከታተሉ።",
      "ግብረመልስዎ ለሁሉም ዜጎች የመንግስት አገልግሎቶችን ለማሻሻል ይረዳል።",
      "አማካይ የቅሬታ መፍትሄ ጊዜ: 3.5 የስራ ቀናት።",
      "ቅሬታ ስርዓት ለመጠቀም ምቾትዎ 24/7 ይገኛል።",
      "እርዳታ ይፈልጋሉ? የድጋፍ ቡድናችንን በ011-111-1111 ይደውሉ።"
    ]
  };

  useEffect(() => {
    setCurrentDate(getCurrentDate(language));
    
    // Save language preference to localStorage
    saveLanguagePreference(language);
    
    // Check if text needs to scroll
    checkTextWidth();
    
    // Start the alternating animation
    const interval = setInterval(() => {
      setShowPromotion(prev => !prev);
    }, 5000); // Switch every 5 seconds

    // Cleanup function
    return () => {
      clearInterval(interval);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [language]);

  useEffect(() => {
    if (shouldScroll && showPromotion) {
      startScrolling();
    } else {
      stopScrolling();
    }
  }, [shouldScroll, showPromotion]);

  // Function to save language preference to localStorage
  const saveLanguagePreference = (lang) => {
    // Save to localStorage for persistence
    localStorage.setItem('dashboard_language', lang);
    
    // Map our language codes to Digit UI language codes
    const digitLanguageCode = lang === 'am' ? 'am_ET' : 'en_ET';
    
    // Save Digit UI compatible language code
    localStorage.setItem('digit_language', digitLanguageCode);
    
    // Also save to sessionStorage for immediate use
    sessionStorage.setItem('digit_language', digitLanguageCode);
    
    console.log(`Language preference saved: ${lang} -> ${digitLanguageCode}`);
  };

  // Function to load language preference from localStorage
  const loadLanguagePreference = () => {
    const savedLang = localStorage.getItem('dashboard_language');
    if (savedLang && onLanguageChange) {
      onLanguageChange(savedLang);
    }
  };

  // Load language preference on component mount
  useEffect(() => {
    loadLanguagePreference();
  }, []);

  const getCurrentDate = (lang) => {
    const now = new Date();
    
    if (lang === 'am') {
      // Ethiopian months and weekdays
      const ethiopianMonths = ['መስከረም', 'ጥቅምት', 'ኅዳር', 'ታህሣሥ', 'ጥር', 'የካቲት', 'መጋቢት', 'ሚያዝያ', 'ግንቦት', 'ሰኔ', 'ሐምሌ', 'ነሐሴ', 'ጳጉሜ'];
      const ethiopianWeekdays = ['እሑድ', 'ሰኞ', 'ማክሰኞ', 'ረቡዕ', 'ሐሙስ', 'አርብ', 'ቅዳሜ'];
      
      const ethDay = ethiopianWeekdays[now.getDay()];
      const ethMonth = ethiopianMonths[now.getMonth()];
      const ethDate = now.getDate();
      const ethYear = now.getFullYear() - 8; // Rough conversion to Ethiopian calendar
      
      return `${ethDay}፣ ${ethMonth} ${ethDate}፣ ${ethYear} ዓ.ም`;
    } else {
      // English date
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      return now.toLocaleDateString('en-US', options);
    }
  };

  const checkTextWidth = () => {
    if (textRef.current && textContainerRef.current) {
      const textWidth = textRef.current.scrollWidth;
      const containerWidth = textContainerRef.current.offsetWidth;
      setShouldScroll(textWidth > containerWidth);
    }
  };

  const startScrolling = () => {
    let position = 0;
    const speed = 30; // pixels per second
    let lastTime = 0;
    let textElement = textRef.current;
    let containerElement = textContainerRef.current;

    if (!textElement || !containerElement) return;

    const animate = (currentTime) => {
      if (!lastTime) lastTime = currentTime;
      const deltaTime = currentTime - lastTime;
      
      if (deltaTime > 16) { // ~60fps
        position -= (speed * deltaTime) / 1000;
        
        // Get the total width of the scrolling content
        const textWidth = textElement.scrollWidth;
        
        // Reset position when text has completely scrolled out twice
        if (Math.abs(position) >= textWidth * 2) {
          position = 0;
          // Switch to date for a moment
          setShowPromotion(false);
          setTimeout(() => {
            setShowPromotion(true);
          }, 3000);
        }
        
        textElement.style.transform = `translateX(${position}px)`;
        lastTime = currentTime;
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
  };

  const stopScrolling = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    if (textRef.current) {
      textRef.current.style.transform = 'translateX(0)';
    }
  };

  const getPromotionText = () => {
    const messages = promotionMessages[language] || promotionMessages.en;
    const randomIndex = Math.floor(Math.random() * messages.length);
    return messages[randomIndex];
  };

  const handleLanguageSelect = (e) => {
    const newLanguage = e.target.value;
    if (onLanguageChange) {
      onLanguageChange(newLanguage);
    }
    
    // Save preference when language is changed
    saveLanguagePreference(newLanguage);
  };

  const handleNavigation = (page) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

const handleSubmitComplaint = () => {
  // Get the Digit UI language code
  const digitLanguage = language === 'am' ? 'am_ET' : 'en_ET';
  
  console.log(`Setting language to: ${digitLanguage}`);
  
  // Set locale in localStorage
  localStorage.setItem('locale', digitLanguage);
  localStorage.setItem('Citizen.locale', digitLanguage);
  
  // Also set a special flag for the external site to know we're forcing language
  localStorage.setItem('force_language_from_header', digitLanguage);
  
  // Redirect with language in URL
const baseUrl = process.env.REACT_APP_BASE_URL;

  const urlWithLocale = `${baseUrl}?locale=${digitLanguage}&force=true&timestamp=${Date.now()}`;
  
  setTimeout(() => {
    window.location.href = urlWithLocale;
    
    if (onNewComplaint) {
      onNewComplaint();
    }
  }, 100);
};
  return (
    <header>
      <div className="header-top">
        <div className="container">
          <div className="header-top-content">
            <div className="promotion-container">
              <div 
                className="text-container"
                ref={textContainerRef}
                style={{ 
                  overflow: shouldScroll && showPromotion ? 'hidden' : 'visible',
                  whiteSpace: shouldScroll ? 'nowrap' : 'normal'
                }}
              >
                {showPromotion ? (
                  <div 
                    ref={textRef}
                    className={`promotion-text ${shouldScroll ? 'scrolling' : ''}`}
                    style={{
                      display: 'inline-block',
                      transition: shouldScroll ? 'none' : 'opacity 0.5s ease',
                      opacity: showPromotion ? 1 : 0
                    }}
                  >
                    <i className="fas fa-bullhorn"></i>
                    <span className="promotion-message">{getPromotionText()}</span>
                  </div>
                ) : (
                  <div className="current-date-display">
                    <i className="fas fa-calendar-alt"></i>
                    <span>{currentDate}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="header-top-links">
              <a href="tel:0111111111"><i className="fas fa-phone"></i> 011-111-1111</a>
              <a href="mailto:complaints@pmo.gov.et"><i className="fas fa-envelope"></i> complaints@pmo.gov.et</a>
            </div>
          </div>
        </div>
      </div>
      
      <div className="header-main">
        <div className="container">
          <div className="header-main-content">
            <div className="logo-container">
              <div className="ethiopian-flag">
                <img src="https://upload.wikimedia.org/wikipedia/commons/7/71/Flag_of_Ethiopia.svg" alt="Ethiopian Flag" />
              </div>
              <div className="logo-text">
                <h1>የኢትዮጵያ ዲጂታል ቅሬታ ስርዓት</h1>
                <span>{language === 'en' ? 'Ethiopian Digital Complaint System' : 'የኢትዮጵያ ዲጂታል ቅሬታ ስርዓት'}</span>
              </div>
            </div>
            <div className="header-actions">
              <button 
                className="btn-new-complaint" 
                onClick={handleSubmitComplaint}
              >
                <i className="fas fa-plus-circle"></i> 
                {language === 'en' ? 'Submit or Track Complaint' : 'ቅሬታ አስገባ ወይም ተከታተል'}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <nav>
        <div className="container">
          <div className="nav-content">
            <ul className="nav-links">
              <li>
                <a 
                  href="#home" 
                  className={`nav-link ${currentPage === 'home' ? 'active' : ''}`} 
                  onClick={(e) => { e.preventDefault(); handleNavigation('home'); }}
                >
                  {language === 'en' ? 'Home' : 'ዋና ገጽ'}
                </a>
              </li>
              <li>
                <a 
                  href="#about" 
                  className={`nav-link ${currentPage === 'about' ? 'active' : ''}`} 
                  onClick={(e) => { e.preventDefault(); handleNavigation('about'); }}
                >
                  {language === 'en' ? 'About System' : 'ስለ ስርዓቱ'}
                </a>
              </li>
             
              <li>
                <a 
                  href="#faq" 
                  className={`nav-link ${currentPage === 'faq' ? 'active' : ''}`} 
                  onClick={(e) => { e.preventDefault(); handleNavigation('faq'); }}
                >
                  {language === 'en' ? 'FAQ' : 'ተደጋጋሚ ጥያቄዎች'}
                </a>
              </li>
              <li>
                <a 
                  href="#contact" 
                  className={`nav-link ${currentPage === 'contact' ? 'active' : ''}`} 
                  onClick={(e) => { e.preventDefault(); handleNavigation('contact'); }}
                >
                  {language === 'en' ? 'Contact' : 'አግኙን'}
                </a>
              </li>
            </ul>
            <div className="language-selector">
              <select 
                id="languageSelect" 
                value={language} 
                onChange={handleLanguageSelect}
              >
                <option value="en">English</option>
                <option value="am">አማርኛ</option>
              </select>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;