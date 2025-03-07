import React, { useState, useEffect } from "react";
import axios from "axios";

const BMVCOIN = () => {
  const [multichainid, setMultichainid] = useState("");
  const [bmvcoin, setBmvcoin] = useState("");

  // Function to fetch Blockchain ID and BMVCOINS
  const handleMultichainID = () => {
    axios
      .get(
        `http://182.18.139.138:9024/api/user-service/getProfile/${localStorage.getItem(
          "userId"
        )}`
      )
      .then((response) => {
        setMultichainid(response.data.multiChainId);
        setBmvcoin(response.data.coinAllocated);
      })
      .catch((error) => {
        console.error("There was an error making the request:", error);
      });
  };

  // Fetch data on component mount
  useEffect(() => {
    handleMultichainID();
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center space-y-6 bg-gray-50">
      <div className="w-full max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center bg-white shadow-md rounded-lg p-4 border border-gray-200 space-y-4 sm:space-y-0 sm:space-x-4">
        {/* Blockchain ID */}
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <p className="text-sm sm:text-base font-medium text-gray-600">
            <span className="font-bold text-gray-800">Blockchain ID:</span>{" "}
            {multichainid}
          </p>
        </div>

        {/* BMVCOINS */}
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <p className="text-sm sm:text-base font-medium text-gray-600">
            <span className="font-bold text-gray-800">BMVCOINS:</span> {bmvcoin}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row items-center max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6 md:p-8 space-y-6 md:space-y-0 md:space-x-6 border border-gray-200">
        {/* Left Side: Image */}
        <div className="flex-shrink-0 w-full h-64 md:h-auto md:w-1/2 mb-4 md:mb-0">
          {/* <img
            src={BMV}
            alt="BMVCOINS Announcement"
            className="w-full h-full object-contain rounded-lg"
          /> */}
        </div>

        {/* Right Side: Content */}
        <div className="flex flex-col space-y-6 text-gray-700">
          <h1 className="text-2xl md:text-4xl font-bold text-blue-600 text-center md:text-left">
            Introducing BMVCOINS: A Revolutionary Opportunity!
          </h1>
          <p className="text-base md:text-lg text-center md:text-left">
            <span className="font-bold">FREE 10,000 BMVCOINS for You!</span>
            <br />
            We are giving away 10,000 BMVCOINS to every user absolutely free!
            But that’s not all—these coins come with{" "}
            <span className="font-bold">game-changing potential</span>:
          </p>

          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-blue-500">
              Future Value Estimates
            </h2>
            <ul className="list-disc list-inside">
              <li>
                <span className="font-bold">Minimum:</span> ₹10,000
              </li>
              <li>
                <span className="font-bold">Maximum:</span> ₹1,00,000
              </li>
              <li>
                <span className="font-bold">Great Value:</span> $10,000
                (₹8,00,000+)
              </li>
            </ul>
          </div>

          <p className="text-base md:text-lg text-center md:text-left">
            <span className="font-semibold">When does the magic happen?</span>
            <br />
            Once we hit <span className="font-bold">1 million users</span>, we
            will launch BMVCOINS on public tradeable chains. On that very day,
            the coin is expected to open at a{" "}
            <span className="font-bold">minimum of $10 cents USD</span>—and from
            there, the value can skyrocket.
          </p>

          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-blue-500">
              🔗 How are we ensuring growth?
            </h2>
            <ul className="list-disc list-inside">
              <li>
                <span className="font-bold">Private Chain (OXYCHAIN):</span>{" "}
                Until we reach 1 million users, all transactions will be tracked
                securely in our private chain.
              </li>
              <li>
                <span className="font-bold">Public Chain (Ethereum):</span>{" "}
                Post-launch, BMVCOINS will move to Ethereum, one of the world’s
                most trusted blockchain networks.
              </li>
            </ul>
          </div>

          <p className="text-base md:text-lg text-center md:text-left">
            Remember how Bitcoin grew from a few cents to thousands of dollars?{" "}
            <span className="font-bold">
              The same explosive potential lies in BMVCOINS.
            </span>{" "}
            This is your chance to be an early adopter and ride the wave to
            incredible value!
          </p>

          <p className="text-center text-yellow-600 bg-yellow-100 py-3 px-6 rounded-lg font-semibold">
            Don’t wait! Claim your FREE 10,000 BMVCOINS today!
          </p>
        </div>
      </div>
    </div>
  );
};

export default BMVCOIN;
