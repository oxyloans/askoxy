import React from "react";
import { FaApple, FaGooglePlay } from "react-icons/fa";
import oxy1 from "../assets/img/oxywhite.png";
import askoxy1 from "../assets/img/ask oxy white.png";
import poojitha from "../assets/img/poojitha.png";
import srilalitha from "../assets/img/srihmt.png";
import Kurnoolpremium from "../assets/img/Kurnool.png";
import Gajrajhmt from "../assets/img/gajrajever.png";
import gajrajsona from "../assets/img/gajrajever.png";
import cowbrand from "../assets/img/cowbrand.png";
import jsrpremium from "../assets/img/jsr.png";
import rrihmt from "../assets/img/rri.png";
import sreemaateja from "../assets/img/sreemaateja.png";
import suryajoker from "../assets/img/joker.png";
import shubodayam from "../assets/img/shubodayam.png";
import fivestarpremium from "../assets/img/fivestar.png";
import bawarchibrown from "../assets/img/bawarchi.png";

const RiceSalePage: React.FC = () => {
  const riceVarieties = [
    { name: "Sri Lalitha - HMT-Steam", weight: "26 Kgs", image: srilalitha },
    {
      name: "Kurnool Premium - Sonamasuri - Raw",
      weight: "26 Kgs",
      image: Kurnoolpremium,
    },
    {
      name: "Gajraj Evergreen - HMT-Steam",
      weight: "26 Kgs",
      image: Gajrajhmt,
    },
    {
      name: "Gajraj Evergreen - Sonamasuri - Steam",
      weight: "26 Kgs",
      image: gajrajsona,
    },
    { name: "Cow Brand - HMT-Steam", weight: "26 Kgs", image: cowbrand },
    {
      name: "JSR Premium - Lachkari Kolam - Steam",
      weight: "26 Kgs",
      image: jsrpremium,
    },
    { name: "RRI - HMT-Steam", weight: "26 Kgs", image: rrihmt },
    { name: "Sree Mateja - HMT-Steam", weight: "26 Kgs", image: sreemaateja },
    { name: "Surya Teja - Joker - Steam", weight: "26 Kgs", image: suryajoker },
    { name: "Shubodayam - JSR - Steam", weight: "26 Kgs", image: shubodayam },
    {
      name: "5 Star Premium - Jai Sri Ram Raw - Steam",
      weight: "26 Kgs",
      image: fivestarpremium,
    },
    { name: "Bawarchi - Brown Rice", weight: "26 Kgs", image: bawarchibrown },
  ];

  return (
    <div className="bg-gray-50 py-10 min-h-screen">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-6 md:flex md:gap-8">
        {/* Left Section (Image) */}
        <div>
          <div className="rounded-lg shadow-md">
            <img
              src={poojitha}
              alt="Promotion"
              className="rounded-lg w-full h-auto max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg"
            />
          </div>
        </div>

        {/* Right Section (Content) */}
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold text-purple-800 mb-4 mt-5">
            Dear Poojitha Enclave Residents!!
          </h1>
          <p className="text-lg text-gray-700 mb-4">
            Greetings from <span className="font-bold">OXY GROUP!</span>
          </p>
          <p className="text-gray-700 mb-4">
            We are selling all varieties of quality rice, available in 26kgs.
            <span className="font-bold block">
              YOU SELECT THE BAG, WE WILL DELIVER IT TO YOUR FLAT!
            </span>
            We request you to come and take 1 Kg & 1/2 Kg samples for free.
          </p>
          <a
            href="https://chat.whatsapp.com/Eu6f7wXwWUuA93HGVUhXoa"
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded shadow hover:bg-green-700 transition duration-300"
            target="_blank"
            rel="noopener noreferrer"
          >
            Join WhatsApp Group
          </a>
          <p className="text-gray-700 mt-6">
            <span className="font-bold">Why join the dedicated group?</span>
            <br />
            WE ARE GIVING 28kgs FREE STEEL CONTAINER - Respective details will
            be shared in the group.
          </p>
          <p className="text-gray-700 mt-4">
            <span className="font-bold">We are coming on:</span> 24-01-2025
            <br />
            <span className="font-bold">Timing:</span> 9am to 7pm
          </p>
          <div className="mb-6 md:mb-0 text-center md:text-left p-4">
            <p className="text-lg font-semibold mb-4">
              Download our app to place the order and collect at the stall:
            </p>
            <div className="flex justify-center md:justify-start gap-4">
              <a
                href="https://play.google.com/store/apps/details?id=com.oxyrice.oxyrice_customer"
                className="flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg shadow hover:bg-green-700"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaGooglePlay className="mr-2" />
                Buy Rice From PlayStore
              </a>
              <a
                href="https://apps.apple.com/in/app/e-rice-rice-grocery-delivery/id1566140961"
                className="flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaApple className="mr-2" />
                Buy Rice From AppStore
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Rice Varieties Section */}
      <div className="max-w-7xl mx-auto mt-10 px-6">
        <h2 className="text-center text-2xl font-bold text-gray-800 mb-6">
          We are selling all the following 26 Kg Rice Varieties
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {riceVarieties.map((rice, index) => (
            <div
              key={index}
              className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center shadow hover:shadow-md transition"
            >
              <div className="flex justify-center mb-2">
                <img
                  src={rice.image}
                  alt={rice.name}
                  className="w-25 h-25 object-cover rounded"
                />
              </div>
              <p className="text-sm font-semibold text-purple-800 mb-2">
                {rice.name}
              </p>
              <p className="text-xs font-medium text-gray-700">{rice.weight}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-purple-900 text-white py-8 mt-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div>
            <p className="text-lg font-semibold mb-2 pl-5">Our Platforms:</p>
            <ul className="space-y-1 text-center md:text-left flex justify-center gap-6">
              <li>
                <a
                  href="https://www.askoxy.ai/"
                  className="text-blue-300 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={askoxy1}
                    alt="AskOXY"
                    className="w-60 h-25 object-cover"
                  />
                </a>
              </li>
              <li>
                <a
                  href="https://oxyloans.com/"
                  className="text-blue-300 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={oxy1}
                    alt="OxyLoans"
                    className="w-60 h-25 object-cover"
                  />
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-6 p-2 text-center">
          <p>Thanks Team OXY Group</p>
          <p className="text-sm text-gray-300">
            OXY GROUP latest venture is{" "}
            <a
              href="https://www.askoxy.ai/"
              className="text-blue-300 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              AskOXY.ai
            </a>{" "}
            - We are offering free AI & Gen AI training ++ Free Rudrakshas (5
            for each family).
          </p>
          <p className="mt-2">
            Please feel free to reach us @ Divya - 91541 50725 | Ramya - 91541
            50728
          </p>
        </div>
      </footer>
    </div>
  );
};

export default RiceSalePage;
