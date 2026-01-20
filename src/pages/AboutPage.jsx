import React, { useEffect, useState } from 'react';

const AboutPage = ({ language }) => {
  const [content, setContent] = useState(null);

  useEffect(() => {
    const aboutData = {
      en: {
        title: "About the Complaint System",
        description: "The Ethiopian Digital Complaint System is a government initiative designed to provide citizens with a transparent and efficient platform to submit complaints and track their resolution across various government departments.",
        objectives: [
          "Provide citizens with easy access to submit complaints online",
          "Ensure transparent tracking of complaint status",
          "Improve government accountability and service delivery",
          "Reduce complaint resolution time through digital processes"
        ],
        howItWorks: [
          "Citizens submit complaints through the online portal",
          "Complaints are assigned to relevant departments",
          "Department officials review and process complaints",
          "Citizens can track complaint status in real-time",
          "Resolved complaints are closed with feedback to citizens",
          "Rejected complaints are closed with feedback to citizens"
        ]
      },
      am: {
        title: "ስለ ቅሬታ ስርዓቱ",
        description: "የኢትዮጵያ ዲጂታል ቅሬታ ስርዓት የመንግስት ተነሳሽነት ሲሆን ዜጎች በተለያዩ የመንግስት አካላት ቅሬታ እንዲያስገቡ፣ ማረሚያውን እንዲከታተሉ ባለግልጽነት እና በብቃት የሚሰራ መድረክ ለመስጠት የተነደፈ ነው።",
        objectives: [
          "ዜጎች በቀላሉ በኦንላይን ቅሬታ እንዲያስገቡ ማቅረብ",
          "የቅሬታ ሁኔታን በባለግልጽነት መከታተልን ማረጋገጥ",
          "የመንግስትን ተጠያቂነት እና አገልግሎት አቅርቦት ማሻሻል",
          "የቅሬታ መፍትሄ ጊዜን በዲጂታል ሂደቶች መቀነስ"
        ],
        howItWorks: [
          "ዜጎች በኦንላይን መግቢያ በኩል ቅሬታ ያስገባሉ",
          "ቅሬታዎች ለተመለከተው የመንግስት አካል ይመደባሉ",
          "የመንግስት አካል ባለሙያዎች ቅሬታዎችን ይገመግማሉ እና ያስከትላሉ",
          "ዜጎች የቅሬታ ሁኔታን በቀጥታ ሊከታተሉ ይችላሉ",
          "የተፈቱ ቅሬታዎች ከዜጎች ጋር በግብረመልስ ይዘጋሉ",
          "የተገረሙ ቅሬታዎች ከዜጎች ጋር በግብረመልስ ይዘጋሉ"
        ]
      }
    };

    setContent(aboutData[language] || aboutData.en);
  }, [language]);

  if (!content) {
    return <div className="loading-spinner">Loading...</div>;
  }

  return (
    <div className="page-content">
      <h2>{content.title}</h2>
      <p>{content.description}</p>
      
      <h3>{language === 'en' ? 'System Objectives' : 'የስርዓቱ ዓላማዎች'}</h3>
      {content.objectives.map((objective, index) => (
        <p key={index}>{index + 1}. {objective}</p>
      ))}
      
      <h3>{language === 'en' ? 'How It Works' : 'እንዴት እንደሚሰራ'}</h3>
      {content.howItWorks.map((step, index) => (
        <p key={index}>{index + 1}. {step}</p>
      ))}
    </div>
  );
};

export default AboutPage;