export type InternshipFeature = {
  title: string;
  description: string;
  icon: string;
};

export type ProgramSection = {
  title: string;
  content: string | string[];
};

export type CountryCard = {
  id: string;
  flag: string;
  title: string;
  subtitle: string;
  description: string[];
  documents: string[];
  actions: string[];
  accent: string;
  image: string;
  details: string;
  shortDescription?: string;
  programSections?: ProgramSection[];
};

export type EligibilityCard = {
  title: string;
  description: string;
};

export type TimelineStep = {
  title: string;
  description: string;
};

export type DocumentChecklist = {
  country: string;
  items: string[];
};

export type BenefitCard = {
  title: string;
  description: string;
};

export type Testimonial = {
  name: string;
  country: string;
  review: string;
  image: string;
};

export type FAQItem = {
  question: string;
  answer: string;
};

export const heroStats = [
  "8+ Countries",
  "Visa Assistance",
  "Placement Support",
  "End-to-End Guidance",
];

export const internshipFeatures: InternshipFeature[] = [
  {
    title: "Paid Opportunities",
    description: "Access curated internships that offer competitive stipends and real work experience.",
    icon: "DollarSign",
  },
  {
    title: "Global Exposure",
    description: "Work with international teams and build a resume that stands out worldwide.",
    icon: "Globe",
  },
  {
    title: "Visa Support",
    description: "End-to-end visa assistance with document guidance and embassy preparation.",
    icon: "ShieldCheck",
  },
  {
    title: "Career Growth",
    description: "Gain industry-ready skills and mentorship while building your international network.",
    icon: "TrendingUp",
  },
];

export const countryCards: CountryCard[] = [
  {
    id: "usa",
    flag: "🇺🇸",
    title: "USA Internship",
    subtitle: "Hospitality training and cultural exchange.",
    shortDescription: "The USA Internship Program offers international students and young professionals the opportunity to gain practical hospitality industry experience in the United States through the Exchange Visitor Program. Sponsored by the U.S. Department of State, the program combines structured training, mentorship, and cultural exchange while providing exposure to American workplace culture and professional hospitality environments.",
    description: [
      "The USA Internship Program is a structured training and cultural exchange initiative that enables international students and young professionals to gain practical hospitality industry experience in the United States.",
      "Sponsored by the U.S. Department of State, the program offers professional training, mentorship, and exposure to American workplace culture.",
      "Supports participants' educational and professional development through real-world industry experience.",
    ],
    documents: [
      "Passport",
      "SSC & HSC Certificates",
      "Degree Marksheets",
      "Experience Letters",
      "Internship Certificate",
      "Updated Resume",
    ],
    actions: ["Apply Now"],
    accent: "from-blue-500 to-sky-600",
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80",
    details:
      "US Department of State sponsored Visa training/internship program (6–12 months) across Front Office, Culinary, Housekeeping & F&B. Earn USD 8–18/hour with structured mentorship and authentic American work culture exposure. Open to trainees (1+ yr experience) and interns (currently enrolled or graduated within 12 months), aged 18–35.",
    programSections: [
      {
        title: "Why USA?",
        content: [
          "Special opportunity for international students and young professionals to visit the United States.",
          "Allows participants to study, part-time work, and experience American culture.",
          "Opportunity to build skills and make new connections.",
          "Sponsored by the U.S. Department of State.",
          "Supports personal and professional growth through educational and cultural programs.",
          "Opportunity to train in a professional setting.",
          "Opportunity to study at a university.",
          "Opportunity to work as an intern.",
          "Opens doors to new educational and cultural experiences.",
        ],
      },
      {
        title: "Program Overview",
        content: [
          "Industry: Hotel Management",
          "Visa Type: Internship / Training Visa",
          "Location: Throughout USA",
          "Process Duration: 5 to 6 Months",
          "Internship Duration: 6 and 12 Months",
          "Note: Participants will follow a structured training plan and receive mentorship.",
        ],
      },
      {
        title: "Internship Departments",
        content: [
          "Front Office - Gain exposure to guest service and front office operations.",
          "Culinary - Develop practical experience in culinary and kitchen operations.",
          "Housekeeping - Learn housekeeping procedures and operational standards.",
          "Food & Beverage - Gain experience in food and beverage service operations.",
        ],
      },
      {
        title: "Qualification & Eligibility",
        content: [
          "Age: 18 to 35 years.",
          "For Visa Trainees: A degree or professional certificate from a foreign post-secondary institution and a minimum of one year of related work experience outside the USA.",
          "OR: A minimum of five years of relevant work experience outside the USA.",
          "For Visa Interns: Currently enrolled in a foreign degree or certificate-granting institution.",
          "OR: Graduated from such an institution within 12 months before the program start date.",
          "Returning Applicants: Applicants who have completed an internship may apply for a training program after two years of residency outside the USA.",
        ],
      },
      {
        title: "Expected Stipend",
        content: [
          "USD 8 to 18 per hour.",
          "Approx. INR 750 to 1,700 depending on host and department.",
          "Based on 32–40 hours per week.",
        ],
      },
      {
        title: "Program Benefits",
        content: [
          "Structured training plan.",
          "Mentorship during the internship.",
          "Pre-validation of qualifications.",
          "Inclusion in the internship database.",
          "Guidance for CV photo file.",
          "Arrangement of internship.",
          "Certificate of Sponsorship.",
          "Visa support and Embassy interview preparation.",
          "Assistance with accommodation and travel plans.",
        ],
      },
      {
        title: "Additional Costs",
        content: [
          "SEVIS Fee.",
          "Visa Fee.",
          "Flight Tickets.",
          "Accommodation and meals (depends upon the property).",
        ],
      },
      {
        title: "Program Highlights",
        content: [
          "Exchange Visitor Program.",
          "Sponsored by the U.S. Department of State.",
          "Internship and training opportunities in the hospitality industry.",
          "Structured training plan with mentorship.",
          "Available throughout the USA.",
          "Internship duration options of 6 and 12 months.",
          "Opportunity to experience American culture.",
          "Professional and cultural exchange experience.",
          "Visa support and embassy interview preparation.",
          "Certificate of Sponsorship provided.",
        ],
      },
    ],
  },
  {
    id: "newzealand",
    flag: "🇳🇿",
    title: "New Zealand Training Program",
    subtitle: "Build global hospitality skills with practical training in New Zealand.",
    shortDescription:
      "Build global hospitality experience in New Zealand through a professional training program focused on practical learning and industry exposure. Set within a strong hospitality and tourism sector, the program offers an opportunity to enhance operational skills while experiencing life in a safe, English-speaking, and internationally recognized destination.",
    description: [
      "Build global hospitality experience in New Zealand through a professional training program focused on practical learning and industry exposure.",
      "Set within a strong hospitality and tourism sector, the program offers an opportunity to enhance operational skills while experiencing life in a safe, English-speaking, and internationally recognized destination.",
    ],
    documents: [
      "Resume",
      "Passport Photo",
      "Passport",
      "Degree Certificate",
      "Cover Letter",
      "Experience Letters",
      "Parent Undertaking",
      "Institute NOC",
    ],
    actions: ["Apply Now"],
    accent: "from-emerald-500 to-teal-600",
    image: "https://marvel-b1-cdn.bc0a.com/f00000000290162/images.ctfassets.net/2htm8llflwdx/59339XFWyVJlC424edZsWo/4a683e5a909cdefbc1fe8278c047d1c6/SL_Benefits_of_Studying_Abroad_-_SEO.jpg?fit=thumb",
    details:
      "Build global hospitality experience in New Zealand through a professional training program focused on practical learning and industry exposure. Set within a strong hospitality and tourism sector, the program offers an opportunity to enhance operational skills while experiencing life in a safe, English-speaking, and internationally recognized destination.",
    programSections: [
      {
        title: "Why New Zealand?",
        content: [
          "Global Work Experience.",
          "Industry-Relevant Learning.",
          "Strong Hospitality & Tourism Sector.",
          "Work-Life Balance.",
          "Safe & Friendly Environment.",
          "English-Speaking Country.",
          "Unique Lifestyle & Travel.",
        ],
      },
      {
        title: "Program Overview",
        content: [
          "Industry: Hotel Management",
          "Visa Type: Training Visa",
          "Location: Throughout New Zealand",
          "Process Duration: 4 to 5 Months",
          "Internship Duration: 6 & 12 Months",
        ],
      },
      {
        title: "Internship Departments",
        content: [
          "Culinary - gain practical experience in professional kitchen operations.",
          "Food & Beverage - develop hospitality service skills and learn professional F&B operations.",
          "Housekeeping - build operational knowledge and practical experience in housekeeping functions.",
        ],
      },
      {
        title: "Qualification & Eligibility",
        content: [
          "Age: 18 to 27 years old only.",
          "Good English communication skills required.",
          "For Food & Beverage / Housekeeping: OJT student of Hotel Management Diploma or Degree program.",
          "For Kitchen: Student pursuing a 4-year Culinary Arts Degree program.",
          "Experience, if available, is preferred.",
          "Passport with validity of more than 6 months after registration.",
          "Department knowledge required.",
        ],
      },
      {
        title: "Expected Stipend",
        content: [
          "NZD 21 to 22 per hour.",
          "Approx. NZD 3,360 to 3,520 per month (INR 1,86,000 to 1,95,000).",
        ],
      },
      {
        title: "Program Benefits",
        content: [
          "Assistance in resume making.",
          "Interview preparation.",
          "Documentation preparation support.",
          "Assistance and airport pickup/arranged travel plan.",
          "Assistance in booking air tickets.",
          "Shared accommodation depending on rules.",
          "Meals on duty included.",
          "Medical assistance as per New Zealand medical guidelines.",
          "One-point assistance until results arrive.",
          "Uniform as per company policy.",
        ],
      },
      {
        title: "Additional Costs",
        content: [
          "Visa fees.",
          "Airfare.",
          "Travel insurance.",
          "Accommodation.",
        ],
      },
      {
        title: "Program Highlights",
        content: [
          "Hospitality training opportunity in New Zealand.",
          "Available throughout New Zealand.",
          "Internship duration options of 6 or 12 months.",
          "Global work experience.",
          "Industry-relevant learning.",
          "Strong hospitality and tourism sector exposure.",
          "English-speaking environment.",
          "Meals on duty included.",
          "Airport pickup and travel assistance available.",
        ],
      },
    ],
  },
  {
    id: "france",
    flag: "🇫🇷",
    title: "France Internship",
    subtitle: "European internships with premium hospitality placements.",
    shortDescription: "The France Internship Program offers a 6-month hospitality internship with leading hotels across France. Open to Hotel Management students, the program provides hands-on experience in Culinary, Food & Beverage, Housekeeping, and Front Office roles (basic French required). Participants receive a monthly stipend of EUR 600–800, along with accommodation, duty meals, and exposure to luxury hospitality brands.",
    description: [
      "6-month internship throughout France with a stipend of EUR 600–800/month across Culinary, F&B & Housekeeping.",
      "For currently enrolled Hotel Management students; Front Office roles require basic French.",
      "Includes accommodation & duty meals, with exposure to luxury hotels and international hospitality brands.",
    ],
    documents: [
      "CV",
      "Passport",
      "10th & 12th Mark Sheets",
      "Semester Mark Sheets",
      "Bonafide Certificate",
      "NOC",
      "Sponsor Documents",
      "ITR",
      "Bank Statements",
    ],
    actions: ["Apply Now"],
    accent: "from-indigo-500 to-violet-600",
    image: "https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&w=1200&q=80",
    details:
      "6-month internship throughout France with a stipend of EUR 600–800/month across Culinary, F&B & Housekeeping. For currently enrolled Hotel Management students; Front Office roles require basic French. Includes accommodation & duty meals, with exposure to luxury hotels and international hospitality brands.",
    programSections: [
      {
        title: "Why France?",
        content: [
          "Globally recognized hospitality and tourism industry.",
          "Opportunity to gain international hotel work experience.",
          "Exposure to luxury hotels, resorts, and international brands.",
          "Learn European hospitality standards and guest service skills.",
          "Improve communication and intercultural skills.",
          "Attractive monthly stipend and practical training.",
          "Better career opportunities in the global hospitality industry.",
          "Chance to explore French culture, food, and lifestyle.",
          "Develop professional confidence and industry knowledge.",
          "Networking opportunities with international professionals.",
          "Safe and student-friendly environment.",
          "Learn basic French language skills.",
        ],
      },
      {
        title: "Industry",
        content: "Hotel Management",
      },
      {
        title: "Visa Type",
        content: "Internship Visa",
      },
      {
        title: "Location",
        content: "Placements throughout France.",
      },
      {
        title: "Process Duration",
        content: "4–5 Months",
      },
      {
        title: "Internship Duration",
        content: "6 Months",
      },
      {
        title: "Internship Departments",
        content: [
          "Front Office - French language is mandatory.",
          "Culinary - Gain practical experience in kitchen operations and food preparation.",
          "Food & Beverage - Learn international hospitality and guest service standards.",
          "Housekeeping - Develop practical skills in hotel operations and service quality.",
        ],
      },
      {
        title: "Qualification & Eligibility",
        content: [
          "Currently enrolled Degree or Diploma Hotel Management students.",
          "Good English communication skills.",
        ],
      },
      {
        title: "Expected Stipend",
        content: "€600 – €800 per month (Approx. ₹67,000 – ₹90,000)",
      },
      {
        title: "Program Benefits",
        content: [
          "Accommodation.",
          "Duty Meals.",
          "Paid Internship.",
        ],
      },
      {
        title: "Additional Costs",
        content: [
          "Flight Tickets.",
          "Medical & Travel Insurance.",
          "Documentation & Courier Charges.",
          "Visa Fee.",
        ],
      },
      {
        title: "Program Highlights",
        content: [
          "Paid Internship Opportunity.",
          "Accommodation Provided.",
          "Duty Meals Included.",
          "International Hotel Work Experience.",
          "Exposure to Luxury Hotels and International Brands.",
          "Learn European Hospitality Standards.",
          "Develop Intercultural Communication Skills.",
          "Networking Opportunities with International Professionals.",
          "Safe and Student-Friendly Environment.",
          "Learn Basic French Language Skills.",
        ],
      },
    ],
  },
  {
    id: "japan",
    flag: "🇯🇵",
    title: "Japan Internship Program",
    subtitle: "Structured hospitality internships for hotel and culinary students.",
    shortDescription:
      "Gain international hospitality experience in Japan through a structured internship program designed for Hotel Management and Culinary students. Work in professional hospitality environments, develop industry-relevant skills, and experience Japanese service excellence while living and learning in one of the world's most respected hospitality destinations.",
    description: [
      "Gain international hospitality experience in Japan through a structured internship program designed for Hotel Management and Culinary students.",
      "Work in professional hospitality environments, develop industry-relevant skills, and experience Japanese service excellence.",
      "Living and learning in one of the world's most respected hospitality destinations.",
    ],
    documents: [
      "Resume with photo",
      "Video CV",
      "Passport",
      "Aadhaar Card",
      "PAN Card",
      "SSC & HSC Certificates",
      "Semester Mark Sheets",
      "Industrial Training Certificates",
    ],
    actions: ["Apply Now"],
    accent: "from-red-500 to-pink-500",
    image: "https://www.careerlauncher.com/blogs/wp-content/uploads/2024/01/Choose-the-Right-University-for-Study-Abroad.jpg",
    details:
      "Gain international hospitality experience in Japan through a structured internship program designed for Hotel Management and Culinary students. Work in professional hospitality environments, develop industry-relevant skills, and experience Japanese service excellence while living and learning in one of the world's most respected hospitality destinations.",
    programSections: [
      {
        title: "Why Japan?",
        content: [
          "World-class hospitality standards.",
          "Safe and disciplined work environment.",
          "High career growth opportunities.",
          "Strong international exposure.",
        ],
      },
      {
        title: "Program Overview",
        content: [
          "Industry: Hotel Management",
          "Visa Type: Internship Visa",
          "Location: Major cities across Japan, including Tokyo, Osaka, Kyoto, Hokkaido (Resorts & Seasonal Hotels)",
          "Process Duration: Approx. 4–5 months",
          "Internship Duration: 6 Months or 12 Months",
        ],
      },
      {
        title: "Internship Departments",
        content: [
          "Front Office - guest services and front office operations.",
          "Food & Beverage Service - develop service skills and learn hospitality standards.",
          "Housekeeping - build knowledge of housekeeping operations and service quality standards.",
          "Culinary - gain hands-on experience in culinary operations and professional kitchen environments.",
        ],
      },
      {
        title: "Qualification & Eligibility",
        content: [
          "Currently enrolled students in Hotel Management & Culinary Arts.",
          "Age Group: 18–35 years.",
          "Good communication and presentation skills.",
          "English: Good to Advanced mandatory.",
          "Japanese language requirements vary according to the department.",
        ],
      },
      {
        title: "Expected Stipend",
        content: [
          "Rs. 1,00,000 to Rs. 1,15,000 per month.",
          "Monthly stipend is subject to employer standards.",
        ],
      },
      {
        title: "Program Benefits",
        content: [
          "International work experience in Japan.",
          "Monthly stipend (as per employer standards).",
          "Exposure to Japanese hospitality standards.",
          "Opportunity to enhance Japanese language skills.",
          "Certificate of Internship Completion.",
        ],
      },
      {
        title: "Additional Costs",
        content: [
          "Health insurance (National Health Insurance or company health insurance).",
          "Travel Insurance.",
          "Visa Application Fee.",
          "Air Ticket.",
        ],
      },
      {
        title: "Program Highlights",
        content: [
          "Hospitality Industry Internship.",
          "Placement opportunities across major cities in Japan.",
          "Internship duration options of 6 or 12 months.",
          "International work experience in Japan.",
          "Exposure to Japanese hospitality standards.",
          "Opportunity to improve Japanese language skills.",
          "Certificate of Internship Completion.",
          "Multicity placement opportunities including Tokyo, Osaka, Kyoto, and Hokkaido.",
        ],
      },
    ],
  },
  {
    id: "dubai",
    flag: "🇦🇪",
    title: "Dubai Internship",
    subtitle: "Fast-track internships with premium hospitality employers.",
    shortDescription: "The Dubai Internship Program provides Hotel Management graduates with the opportunity to gain 12 months of practical hospitality experience in leading UAE hotels. The program offers a tax-free stipend (AED 750–1700/month), accommodation, meals, medical insurance, and uniforms, along with training opportunities in Culinary, Food & Beverage, Front Office, and Housekeeping. Participants may also receive a full-time job offer upon successful completion.",
    description: [
      "12-month hospitality internship across UAE hotels with tax-free stipend (AED 750–1700) and a possible full-time job offer after completion.",
      "Open to Hotel Management graduates (18–30 yrs) for Culinary, F&B, Front Office & Housekeeping roles.",
      "Includes accommodation, meals, medical insurance & uniforms — no show money required.",
    ],
    documents: [
      "Passport",
      "Resume",
      "Educational Certificates",
      "White Background Photos",
      "Experience Certificates",
    ],
    actions: ["Apply Now"],
    accent: "from-orange-500 to-amber-500",
    image: "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?auto=format&fit=crop&w=1200&q=80",
    details:
      "12-month hospitality internship across UAE hotels with tax-free stipend (AED 750–1700) and a possible full-time job offer after completion. Open to Hotel Management graduates (18–30 yrs) for Culinary, F&B, Front Office & Housekeeping roles. Includes accommodation, meals, medical insurance & uniforms — no show money required.",
    programSections: [
      {
        title: "Why Dubai?",
        content: [
          "International hospitality exposure.",
          "Strong networking opportunities with global professionals.",
          "Safe and modern lifestyle with excellent infrastructure.",
          "Possible full-time job opportunity after internship.",
          "Exposure to luxury tourism, events, and fine dining industry.",
          "Tax-free stipend income.",
          "International work experience certificate.",
        ],
      },
      {
        title: "Industry",
        content: "Hospitality & Catering",
      },
      {
        title: "Visa Type",
        content: "1 Year Internship Work Visa",
      },
      {
        title: "Location",
        content: "Placements organized throughout the UAE.",
      },
      {
        title: "Departments",
        content: [
          "Culinary - Hands-on experience in kitchen operations and food preparation.",
          "Food & Beverage - Experience international standards of hospitality service.",
          "Front Office - Develop customer service and guest relations skills.",
          "Housekeeping - Learn operational standards followed by international hotels.",
        ],
      },
      {
        title: "Process Duration",
        content: "4 to 6 Months",
      },
      {
        title: "Internship Duration",
        content: "12 Months",
      },
      {
        title: "Qualification & Eligibility",
        content: [
          "Graduates with Diploma or Degree in Hotel Management.",
          "Age: 18–30 years.",
          "Intermediate or Advanced English level.",
          "Prior hospitality experience is an advantage.",
        ],
      },
      {
        title: "Expected Stipend",
        content: "AED 750 – AED 1700 (Approximately ₹19,000 – ₹44,000 depending on exchange rates). Note: Stipend depends on experience, communication skills, and interview performance.",
      },
      {
        title: "Program Benefits",
        content: [
          "Accommodation (depending on property).",
          "Meals.",
          "Medical Insurance.",
          "Uniforms.",
          "International exposure.",
          "No Show Money Required.",
          "Possible job offer after internship.",
        ],
      },
      {
        title: "Additional Costs",
        content: [
          "Airfare.",
          "Transaction and transfer charges.",
          "Personal expenses.",
          "GAMCA medical.",
        ],
      },
      {
        title: "Additional Support",
        content: [
          "Guidance & Counselling - Support throughout the application process.",
          "Application Support - Assistance with documentation and submissions.",
          "Sponsor Interview Coordination - Help with interview scheduling and coordination.",
          "Visa Process Assistance - Support during visa processing.",
        ],
      },
    ],
  },
  {
    id: "hongkong",
    flag: "🇭🇰",
    title: "Hong Kong Internship",
    subtitle: "Global internships with strong industry mentorship.",
    shortDescription: "The Hong Kong Internship Program offers a 6-month paid hospitality internship in leading 4-star and 5-star hotels across Hong Kong. Open to final-year and recent Hotel Management graduates, the program provides hands-on experience in Culinary, Food & Beverage, Housekeeping, and Front Office departments. Participants receive a monthly stipend of ₹40,000–50,000, duty meals, and the opportunity to secure a full-time job offer upon successful completion.",
    description: [
      "6-month paid internship in 4 & 5-star Hong Kong properties across Culinary, F&B, Housekeeping & Front Office.",
      "Stipend of ₹40,000–50,000/month, ideal for final-year/recent Hotel Management graduates building a strong international CV.",
      "Duty meals included with strong potential for a job offer post-internship.",
    ],
    documents: [
      "Passport",
      "Resume",
      "Mark Sheets",
      "Bonafide Certificate",
      "NOC",
      "Medical Tests",
      "Police Clearance Certificate",
      "Travel Insurance",
    ],
    actions: ["Apply Now"],
    accent: "from-cyan-500 to-slate-700",
    image: "https://collegerover.com/images/campus-library/336/study%20abroad%20programs.jpg",
    details:
      "6-month paid internship in 4 & 5-star Hong Kong properties across Culinary, F&B, Housekeeping & Front Office. Stipend of ₹40,000–50,000/month, ideal for final-year/recent Hotel Management graduates building a strong international CV. Duty meals included with strong potential for a job offer post-internship.",
    programSections: [
      {
        title: "Why Hong Kong?",
        content: [
          "Exposure to international hospitality standards.",
          "Opportunity to work with luxury hotel brands.",
          "Experience with multicultural guests and an international work environment.",
          "Better career opportunities in the global hospitality industry.",
          "Strong addition to your CV for future placements abroad.",
          "Possibility of future job opportunities in international hotels.",
          "Safe, modern, and highly developed city.",
          "Excellent public transport and infrastructure.",
        ],
      },
      {
        title: "Industry",
        content: "Hotel Management",
      },
      {
        title: "Visa Type",
        content: "Internship Visa",
      },
      {
        title: "Location",
        content: "Placements throughout Hong Kong.",
      },
      {
        title: "Process Duration",
        content: "4–6 Months",
      },
      {
        title: "Internship Duration",
        content: "6 Months",
      },
      {
        title: "Internship Departments",
        content: [
          "Culinary - Gain practical experience in professional kitchen operations.",
          "Food & Beverage - Learn international service standards and guest interaction.",
          "Housekeeping - Develop operational and quality management skills.",
          "Front Office (Limited) - Experience customer service and guest relations in hotel operations.",
        ],
      },
      {
        title: "Qualification & Eligibility",
        content: [
          "Recent pass-out students within 3 to 4 months.",
          "OR",
          "Second-year students currently pursuing a Diploma or Degree in Hotel Management.",
        ],
      },
      {
        title: "Expected Stipend",
        content: "₹40,000 – ₹50,000 per month (Stipend depends on communication skills and interview performance.)",
      },
      {
        title: "Program Benefits",
        content: [
          "Duty Meals.",
          "Possible Job Offer.",
          "International Exposure.",
          "International Working Certificate of 6 Months.",
          "Placement in 4 & 5 Star Properties.",
          "Paid Internship.",
        ],
      },
      {
        title: "Additional Costs",
        content: [
          "Air Tickets.",
          "Medical Expenses.",
          "Accommodation (depending upon the property).",
          "Insurance.",
        ],
      },
      {
        title: "Program Highlights",
        content: [
          "Paid Internship Opportunity.",
          "Exposure to International Hospitality Standards.",
          "Experience with Luxury Hotel Brands.",
          "Multicultural Work Environment.",
          "International Work Experience Certificate.",
          "Placement in 4 & 5 Star Hotels.",
          "Strong Addition to Future Career Opportunities.",
          "Possibility of Future Job Opportunities in International Hotels.",
          "Safe and Modern Living Environment.",
          "Excellent Infrastructure and Public Transport.",
        ],
      },
    ],
  },
  {
    id: "mauritius",
    flag: "🇲🇺",
    title: "Mauritius Internship Program",
    subtitle: "Island hospitality internships in luxury resorts and hotels.",
    shortDescription:
      "Mauritius offers an exceptional environment for hospitality internships, combining a thriving tourism industry with a diverse collection of luxury resorts and hotels. This program provides students with the opportunity to gain practical industry experience, strengthen professional hospitality skills, and experience a unique multicultural island destination while working in an international hospitality setting.",
    description: [
      "Mauritius offers an exceptional environment for hospitality internships, combining a thriving tourism industry with a diverse collection of luxury resorts and hotels.",
      "This program provides students with the opportunity to gain practical industry experience, strengthen professional hospitality skills, and experience a unique multicultural island destination.",
      "Work in an international hospitality setting across Front Office, Culinary, F&B & Housekeeping.",
    ],
    documents: [
      "Passport",
      "Offer Letter",
      "Bonafide Certificate",
      "NOC",
      "Tripartite Agreement",
      "Passport Photos",
    ],
    actions: ["Apply Now"],
    accent: "from-fuchsia-500 to-pink-600",
    image: "https://content.mtfxgroup.com/uploads/large_Oxford_University_Top_15_Foreign_Universities_for_Canadian_Students_Looking_to_Study_Abroad_in_2025_2_f49f6a692f.webp",
    details:
      "The Mauritius Internship Program offers students the opportunity to gain practical hospitality industry experience in a destination known for its thriving tourism sector and luxury resorts. Participants can develop professional skills while experiencing a multicultural environment and the unique island lifestyle of Mauritius.",
    programSections: [
      {
        title: "Why Mauritius?",
        content: [
          "Popular destination for hospitality internships.",
          "Thriving tourism industry.",
          "Diverse range of luxury resorts and hotels.",
          "Opportunity to gain valuable work experience.",
          "Exposure to a new culture.",
          "Experience the island lifestyle.",
        ],
      },
      {
        title: "Program Overview",
        content: [
          "Industry: Hotel Management",
          "Visa Type: Internship Visa",
          "Location: Throughout Mauritius",
          "Process Duration: 4 to 5 Months",
          "Internship Duration: 6 Months",
        ],
      },
      {
        title: "Internship Departments",
        content: [
          "Front Office - develop guest service and hospitality operations skills.",
          "Culinary - gain hands-on exposure to professional kitchen operations.",
          "Food & Beverage - learn hospitality service standards in professional environments.",
          "Housekeeping - build practical knowledge of housekeeping operations and service quality standards.",
        ],
      },
      {
        title: "Qualification & Eligibility",
        content: [
          "Students currently pursuing a Degree in Hotel Management, Culinary Arts, or Tourism & Hospitality Management.",
          "Good English communication skills required.",
        ],
      },
      {
        title: "Expected Stipend",
        content: [
          "MUR 10,000 – 15,000 per month.",
          "Approx. INR 20,000 – 30,000.",
        ],
      },
      {
        title: "Program Benefits",
        content: [
          "International work experience and certification.",
          "Monthly stipend.",
          "Duty meals provided.",
          "Airport pickup and escort to hotel.",
        ],
      },
      {
        title: "Additional Costs",
        content: [
          "Flight tickets.",
          "Accommodation.",
          "Personal expenses.",
        ],
      },
      {
        title: "Program Highlights",
        content: [
          "Hospitality internship opportunity in Mauritius.",
          "Placement opportunities throughout Mauritius.",
          "Exposure to luxury resorts and hotels.",
          "International work experience and certification.",
          "Monthly stipend provided.",
          "Duty meals included.",
          "Airport pickup and hotel escort support.",
          "Multicultural hospitality environment.",
        ],
      },
    ],
  },
  {
    id: "spain",
    flag: "🇪🇸",
    title: "Spain Internship Program",
    subtitle: "Hospitality training in Spain with practical hotel operations exposure.",
    shortDescription:
      "The Spain Internship Program provides students with the opportunity to gain practical hospitality training within Spain's globally recognized hospitality and tourism industry. Participants can experience international hotel operations, develop industry knowledge, and gain exposure to European hospitality standards while living and training in Spain.",
    description: [
      "The Spain Internship Program provides students with the opportunity to gain practical hospitality training within Spain's globally recognized hospitality and tourism industry.",
      "Participants can experience international hotel operations, develop industry knowledge, and gain exposure to European hospitality standards.",
      "Live and train in Spain while improving communication, intercultural skills, and professional confidence.",
    ],
    documents: ["Passport", "Resume", "Academic Certificates", "Visa Documents"],
    actions: ["Apply Now"],
    accent: "from-red-500 to-rose-500",
    image: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1200&q=80",
    details:
      "The Spain Internship Program provides students with the opportunity to gain practical hospitality training within Spain's globally recognized hospitality and tourism industry. Participants can experience international hotel operations, develop industry knowledge, and gain exposure to European hospitality standards while living and training in Spain.",
    programSections: [
      {
        title: "Why Spain?",
        content: [
          "Globally recognized hospitality and tourism industry.",
          "Opportunity to gain international hotel work experience.",
          "Exposure to luxury hotels, resorts, and international brands.",
          "Learn European hospitality standards and guest service skills.",
          "Improve communication and intercultural skills.",
          "Attractive monthly stipend and practical training.",
          "Better career opportunities in global hospitality industry.",
          "Chance to explore Spanish culture, food, and lifestyle.",
          "Develop professional confidence and industry knowledge.",
          "Networking opportunities with international professionals.",
          "Safe and student-friendly environment.",
          "Learn basic Spanish language skills.",
        ],
      },
      {
        title: "Program Overview",
        content: [
          "Industry: Hotel Management",
          "Visa Type: Internship Visa",
          "Location: Throughout Spain",
          "Process Duration: 4 to 5 Months",
          "Internship Duration: 6 and 12 Months",
        ],
      },
      {
        title: "Internship Departments",
        content: [
          "Front Office - gain practical experience in guest services and front office operations. Basic Spanish is mandatory.",
          "Culinary - develop hands-on experience in professional kitchen operations and culinary practices.",
          "Food & Beverage - learn hospitality service standards and food & beverage operations in a professional environment.",
          "Housekeeping - build practical knowledge of housekeeping operations and service standards.",
        ],
      },
      {
        title: "Qualification & Eligibility",
        content: [
          "Candidate must be 18 to 25 years old.",
          "Good to advanced level English is required.",
          "Must be currently studying in college and enrolled in a relevant degree course.",
          "Spain accepts students from 2nd and 3rd year.",
          "Must be enthusiastic, eager to experience new ways of life, and willing to work hard to understand global job competition.",
        ],
      },
      {
        title: "Expected Stipend",
        content: [
          "EURO 300 to 500 per month.",
          "Approx. INR 33,000 to 55,000 depending on the current exchange rate.",
        ],
      },
      {
        title: "Program Benefits",
        content: [
          "Accommodation (depending upon the property).",
          "Meals during duty.",
          "Uniform.",
          "Monthly stipend.",
        ],
      },
      {
        title: "Additional Costs",
        content: [
          "Health insurance.",
          "Visa related expenses.",
          "Flight tickets.",
          "Apostille charges.",
        ],
      },
      {
        title: "Program Highlights",
        content: [
          "Hospitality internship opportunity in Spain.",
          "International hotel work experience.",
          "Exposure to luxury hotels, resorts, and international brands.",
          "Learn European hospitality standards.",
          "Opportunity to improve communication and intercultural skills.",
          "Learn basic Spanish language skills.",
          "Internship duration options of 6 and 12 months.",
          "Monthly stipend provided.",
          "Accommodation available depending upon the property.",
          "Meals during duty included.",
        ],
      },
    ],
  },
];

export const eligibilityCards: EligibilityCard[] = [
  { title: "Students", description: "Open to undergraduate and postgraduate learners pursuing global careers." },
  { title: "Recent Graduates", description: "Designed for fresh graduates eager to start with international exposure." },
  { title: "Hotel Management Students", description: "Specialized pathways for hospitality and hotel management learners." },
  { title: "Tourism Students", description: "Ideal for tourism talent looking to gain global operational experience." },
  { title: "Hospitality Professionals", description: "Career proximity programs for service industry professionals." },
];

export const internshipProcess: TimelineStep[] = [
  { title: "Profile Evaluation", description: "We assess your academic profile and internship readiness." },
  { title: "Application Submission", description: "Submit tailored applications with personalized guidance." },
  { title: "Interview", description: "Prepare for recruiter interviews with mock sessions." },
  { title: "Offer Letter", description: "Receive official internship offers from trusted global partners." },
  { title: "Document Preparation", description: "Get verified documents ready for visa and travel approvals." },
  { title: "Visa Processing", description: "Visa assistance with embassy liaison and follow-up." },
  { title: "Travel Abroad", description: "Get pre-departure support and welcome services abroad." },
  { title: "Start Internship", description: "Begin your international journey with mentorship and support." },
];

export const documentChecklists: DocumentChecklist[] = [
  {
    country: "USA",
    items: [
      "Passport",
      "SSC & HSC Certificates",
      "Degree Marksheets",
      "Experience Letters",
      "Internship Certificate",
      "Updated Resume",
    ],
  },
  {
    country: "Japan",
    items: [
      "Resume with photo",
      "Video CV",
      "Passport",
      "Aadhaar Card",
      "PAN Card",
      "SSC & HSC Certificates",
      "Semester Mark Sheets",
      "Industrial Training Certificates",
    ],
  },
  {
    country: "France",
    items: [
      "CV",
      "Passport",
      "10th & 12th Mark Sheets",
      "Semester Mark Sheets",
      "Bonafide Certificate",
      "NOC",
      "Sponsor Documents",
      "ITR",
      "Bank Statements",
    ],
  },
  {
    country: "Dubai",
    items: [
      "Passport",
      "Resume",
      "Educational Certificates",
      "White Background Photos",
      "Experience Certificates",
    ],
  },
  {
    country: "Hong Kong",
    items: [
      "Passport",
      "Resume",
      "Mark Sheets",
      "Bonafide Certificate",
      "NOC",
      "Medical Tests",
      "Police Clearance Certificate",
      "Travel Insurance",
    ],
  },
  {
    country: "New Zealand",
    items: [
      "Resume",
      "Passport Photo",
      "Passport",
      "Degree Certificate",
      "Cover Letter",
      "Experience Letters",
      "Parent Undertaking",
      "Institute NOC",
    ],
  },
  {
    country: "Mauritius",
    items: [
      "Passport",
      "Offer Letter",
      "Bonafide Certificate",
      "NOC",
      "Tripartite Agreement",
      "Passport Photos",
    ],
  },
  {
    country: "Spain",
    items: [
      "Passport",
      "Resume",
      "Academic Certificates",
      "Visa Documents",
    ],
  },
];

export const benefitCards: BenefitCard[] = [
  { title: "International Experience", description: "Build your resume with cross-border internships and global project exposure." },
  { title: "Professional Networking", description: "Connect with mentors and employers across leading global destinations." },
  { title: "Career Advancement", description: "Boost your job prospects with real international work experience." },
  { title: "Skill Development", description: "Master professional and communication skills valued by top employers." },
  { title: "Cultural Exposure", description: "Learn new cultures and work styles while building global confidence." },
  { title: "Better Employability", description: "Stand out with international experience that accelerates recruitment." },
];

export const testimonialCards: Testimonial[] = [
  {
    name: "Aisha Sharma",
    country: "USA",
    review: "The USA internship gave me a career edge, incredible mentorship, and a stipend that helped me explore the city.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Rohan Patel",
    country: "Japan",
    review: "I gained practical work experience and cultural confidence through the Japan internship program.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Meera Nair",
    country: "France",
    review: "StudyAbroad helped me get a verified offer and smooth visa support for a hospitality internship in France.",
    image: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=400&q=80",
  },
];

export const faqItems: FAQItem[] = [
  {
    question: "Which countries are available?",
    answer: "USA, Japan, France, Dubai, Hong Kong, Spain, New Zealand and Mauritius.",
  },
  {
    question: "Are internships paid?",
    answer: "Many programs provide stipends and accommodation support.",
  },
  {
    question: "Do you provide visa assistance?",
    answer: "Yes. Our team assists with visa documentation, embassy preparation and follow-up.",
  },
  {
    question: "Who can apply?",
    answer: "Students and recent graduates are welcome to apply for our international internship programs.",
  },
];