// Mock data for development
export const getMockStats = (language = 'en') => {
  return [
    { 
      id: 1, 
      label: language === 'en' ? "Total Complaints" : "ጠቅላላ ቅሬታዎች", 
      count: 1245, 
      icon: "fas fa-file-alt", 
      color: "total" 
    },
    { 
      id: 2, 
      label: language === 'en' ? "Pending for Assignment" : "ለተግባር በመጠባበቅ ላይ", 
      count: 48, 
      icon: "fas fa-user-clock", 
      color: "pending-assignment" 
    },
    { 
      id: 3, 
      label: language === 'en' ? "Pending at LME" : "በLME በመጠባበቅ ላይ", 
      count: 127, 
      icon: "fas fa-users-cog", 
      color: "pending-lme" 
    },
    { 
      id: 4, 
      label: language === 'en' ? "Resolved" : "ተፈቷል", 
      count: 1070, 
      icon: "fas fa-check-circle", 
      color: "resolved" 
    },
    { 
      id: 5, 
      label: language === 'en' ? "Rejected" : "ተጥሏል", 
      count: 200, 
      icon: "fas fa-times-circle", 
      color: "rejected" 
    }
  ];
};

export const getMockDepartments = (language = 'en') => {
  if (language === 'am') {
    return [
      { id: 1, name: "የትምህርት ሚኒስቴር", count: 245 },
      { id: 2, name: "የጤና ሚኒስቴር", count: 198 },
      { id: 3, name: "የትራንስፖርት ሚኒስቴር", count: 167 },
      { id: 4, name: "የፋይናንስ ሚኒስቴር", count: 142 },
      { id: 5, name: "የግብርና ሚኒስቴር", count: 125 },
      { id: 6, name: "የውሃ እና ኢነርጂ ሚኒስቴር", count: 118 },
      { id: 7, name: "አዲስ አበባ ከተማ አስተዳደር", count: 98 },
      { id: 8, name: "የፍትህ ሚኒስቴር", count: 75 },
      { id: 9, name: "የንግድ ሚኒስቴር", count: 62 },
      { id: 10, name: "ሌሎች የመንግስት አካላት", count: 115 }
    ];
  } else {
    return [
      { id: 1, name: "Ministry of Education", count: 245 },
      { id: 2, name: "Ministry of Health", count: 198 },
      { id: 3, name: "Ministry of Transportation", count: 167 },
      { id: 4, name: "Ministry of Finance", count: 142 },
      { id: 5, name: "Ministry of Agriculture", count: 125 },
      { id: 6, name: "Ministry of Water & Energy", count: 118 },
      { id: 7, name: "Addis Ababa City Administration", count: 98 },
      { id: 8, name: "Ministry of Justice", count: 75 },
      { id: 9, name: "Ministry of Trade", count: 62 },
      { id: 10, name: "Other Departments", count: 115 }
    ];
  }
};