import Lottie from "lottie-react";
import travelLoader from "../../assets/travel.json";

const TravelLoader = () => {
  return (
    <div className="w-full min-h-[calc(100vh-70px)] flex flex-col items-center justify-center">
      
      <div className="w-64 h-64">
        <Lottie
          animationData={travelLoader}
          loop
          autoplay
        />
      </div>

      <h3 className="text-slate-100 text-lg font-semibold mt-4">
        Planning Your Journey
      </h3>

      <p className="text-slate-400 text-sm mt-1 animate-pulse">
        Flights • Routes • Hotels • Activities
      </p>

    </div>
  );
};

export default TravelLoader;
