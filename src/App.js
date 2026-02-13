import React, { useState, useEffect } from 'react';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import DepartmentsPage from './pages/DepartmentsPage';
import FAQPage from './pages/FAQPage';
import ContactPage from './pages/ContactPage';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [language, setLanguage] = useState('en');

  useEffect(() => {
  // Load language preference from localStorage
  const rawLanguage = localStorage.getItem('Digit.locale') || 'en';

  // Split by underscore and take the first part (e.g., "en_ET" -> "en")
  const savedLanguage = rawLanguage.split('_')[0];

  setLanguage(savedLanguage);
}, []);

  const handleNavigation = (page) => {
    setCurrentPage(page);
  };

  const handleNewComplaint = () => {
    // Remove the alert and let Header handle the redirect
    // The Header component already has its own handleSubmitComplaint function
    // that redirects to the actual complaint system
    console.log('Redirecting to complaint submission system...');
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
  };

  const renderPage = () => {
    switch(currentPage) {
      case 'home':
        return (
          <HomePage 
            onNewComplaint={handleNewComplaint}
            language={language}
          />
        );
      case 'about':
        return <AboutPage language={language} />;
      case 'departments':
        return <DepartmentsPage language={language} />;
      case 'faq':
        return <FAQPage language={language} />;
      case 'contact':
        return <ContactPage language={language} />;
      default:
        return (
          <HomePage 
            onNewComplaint={handleNewComplaint}
            language={language}
          />
        );
    }
  };

  return (
    <div className="App">
      <Header 
        onNewComplaint={handleNewComplaint}
        currentPage={currentPage}
        onNavigate={handleNavigation}
        language={language}
        onLanguageChange={handleLanguageChange}
      />
      
      <main className="dashboard">
        <div className="container">
          {renderPage()}
        </div>
      </main>
      
      <Footer onNavigate={handleNavigation} language={language} />
    </div>
  );
}

export default App;