import React from "react";
import JPLHeader from "../JPL/JPLHeader";
import JPLHeroSection from "../JPL/JPLHero";
import JobSearchSection from "../JPL/JPLSearch";
import AIExamSection from "../JPL/ExamSection";
import MentoringSection from "../JPL/MentoringSection";
import LeagueHighlightsSection from "./LeagueHighlightsSection";

const JPLLandingPage: React.FC = () => {
  return (
    <div className="overflow-x-hidden bg-[#f5f7f4]">
      <JPLHeader />
      <JPLHeroSection />
      <LeagueHighlightsSection />
      <JobSearchSection />
      <AIExamSection />
      <MentoringSection />
    </div>
  );
};

export default JPLLandingPage;