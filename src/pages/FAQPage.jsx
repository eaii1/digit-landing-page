import React, { useState, useEffect } from 'react';

const FAQPage = ({ language }) => {
  const [activeFaq, setActiveFaq] = useState(1);
  const [faqData, setFaqData] = useState([]);

  useEffect(() => {
    const faqContent = {
      en: [
        {
          id: 1,
          question: "How do I submit a complaint?",
          answer: "Click on the 'Submit Complaint' button on the homepage. You will need to login or register first, then fill out the complaint form with details about your issue."
        },
        {
          id: 2,
          question: "How long does it take to resolve a complaint?",
          answer: "Resolution time varies depending on the complexity of the issue and the department handling it. Simple complaints may be resolved within 3-5 working days, while complex issues may take longer."
        },
        {
          id: 3,
          question: "Can I track the status of my complaint?",
          answer: "Yes, once you submit a complaint, you will receive a tracking number. You can use this number to check the status of your complaint at any time."
        },
        {
          id: 4,
          question: "What types of complaints can I submit?",
          answer: "You can submit complaints related to government services, public utilities, administrative issues, and any other matters that fall under government jurisdiction."
        },
        {
          id: 5,
          question: "Is my personal information secure?",
          answer: "Yes, we use secure encryption to protect your personal information. Your data is only used for processing your complaint and will not be shared with third parties."
        }
      ],
      am: [
        {
          id: 1,
          question: "ቅሬታ እንዴት አስገባ?",
          answer: "በዋናው ገጽ ላይ 'ቅሬታ አስገባ' የሚለውን ቁልፍ ይጫኑ። መጀመሪያ መግባት ወይም መመዝገብ ያስፈልግዎታል፣ ከዚያም የቅሬታ ቅጹን በጉዳይዎ ዝርዝሮች ይሙሉ።"
        },
        {
          id: 2,
          question: "ቅሬታ ለመፍታት ምን ያህል ጊዜ ይወስዳል?",
          answer: "የመፍትሄው ጊዜ በጉዳዩ ውስብስብነት እና በሚያስተዳድረው የመንግስት አካል ላይ የተመሰረተ ነው። ቀላል ቅሬታዎች በ3-5 የስራ ቀናት ውስጥ ሊፈቱ ይችላሉ፣ ውስብስብ ጉዳዮች ግን ረዘም ያለ ጊዜ ሊወስዱ ይችላሉ።"
        },
        {
          id: 3,
          question: "የቅሬታዬን ሁኔታ መከታተል እችላለሁ?",
          answer: "አዎ፣ ቅሬታ ከሰጡ በኋላ የመከታተል ቁጥር ይቀበላሉ። ይህን ቁጥር በመጠቀም የቅሬታዎን ሁኔታ በማንኛውም ጊዜ መፈተሽ ይችላሉ።"
        },
        {
          id: 4,
          question: "ምን ዓይነት ቅሬታዎች ማስገባት እችላለሁ?",
          answer: "ከመንግስት አገልግሎቶች፣ የህዝብ አገልግሎቶች፣ አስተዳደራዊ ጉዳዮች እና በመንግስት ፍቃድ የሚገኙ ሌሎች ነገሮች ጋር የተያያዙ ቅሬታዎችን ማስገባት ይችላሉ።"
        },
        {
          id: 5,
          question: "የግል መረጃዬ ጸድቋል?",
          answer: "አዎ፣ የግል መረጃዎን ለመጠበቅ ጸድቅ ያለ ኢንክሪፕሽን እንጠቀማለን። ውሂብዎ ለቅሬታዎ ሂደት ብቻ ያገለግላል እና ለሶስተኛ ወገኖች አይካፈልም።"
        }
      ]
    };

    setFaqData(faqContent[language] || faqContent.en);
  }, [language]);

  const toggleFaq = (id) => {
    setActiveFaq(activeFaq === id ? null : id);
  };

  return (
    <div className="page-content">
      <h2>{language === 'en' ? 'Frequently Asked Questions' : 'ተደጋጋሚ ጥያቄዎች'}</h2>
      
      {faqData.map((faq) => (
        <div 
          key={faq.id} 
          className={`faq-item ${activeFaq === faq.id ? 'active' : ''}`}
        >
          <h4 onClick={() => toggleFaq(faq.id)}>
            {faq.question} <span>{activeFaq === faq.id ? '−' : '+'}</span>
          </h4>
          {activeFaq === faq.id && <p>{faq.answer}</p>}
        </div>
      ))}
    </div>
  );
};

export default FAQPage;