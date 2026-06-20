import InternshipHero from "./components/InternshipHero";
import WhyChooseInternships from "./components/WhyChooseInternships";
import CountryCards from "./components/CountryCards";
import EligibilitySection from "./components/EligibilitySection";

const InternshipPage: React.FC = () => {
  return (
    <main className="overflow-hidden bg-white text-slate-950">
      <InternshipHero />
      <WhyChooseInternships />
      <CountryCards />
      <EligibilitySection />
    </main>
  );
};

export default InternshipPage;