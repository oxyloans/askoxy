import React, { useState, useEffect } from "react";
import axios from "axios";
import BMV from "../assets/img/bmvcoin.png";

const BMVCOIN = () => {

  return (
    <div className="min-h-screen pt-2 flex flex-col justify-center items-center space-y-6">


      {/* Main Content */}
      <div className="flex flex-col md:flex-row items-center max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6 md:p-8 space-y-6 md:space-y-0 md:space-x-6 border border-gray-200">
        {/* Left Side: Image */}
        <div className="flex-shrink-0 w-full h-64 md:h-auto md:w-1/2 mb-4 md:mb-0">
          <img
            src={BMV}
            alt="BMVCOINS Announcement"
            className="w-full h-full object-contain rounded-lg"
          />
        </div>

        {/* Right Side: Content */}
        <div className="flex flex-col space-y-6 text-gray-700">
                  <button
                      className="w-full p-4 flex items-center justify-center gap-3 bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white font-bold py-3 px-6 rounded-xl shadow-lg transform hover:scale-105 transition duration-300 ease-in-out"
                      onClick={() => window.location.href = "http://bmv.money:2750/"}
                  >
                      <span>Copy Your Blockchain ID & Check in OxyChain Explorer</span>
                  </button>
          <h1 className="text-2xl md:text-4xl font-bold text-purple-600 text-center md:text-left">
          🚀 Introducing BMVCOINS: A Revolutionary Opportunity!
          </h1>
          <p className="text-base md:text-lg text-center md:text-left">
            <span className="font-bold">Get 10,000 BMVCOINS – Absolutely FREE!</span>
            <br />
            We’re giving away 10,000 BMVCOINS to every user at no cost! But this isn’t just any giveaway—these coins hold{" "}
            <span className="font-bold">game-changing potential</span>:
          </p>

          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-purple-500">
            💰 Future Value Estimates
            </h2>
            <ul className="list-inside">
              <li>
                <span className="font-bold"> ✔ Minimum:</span> ₹10,000
              </li>
              <li>
                <span className="font-bold"> ✔ Maximum: </span> ₹1,00,000
              </li>
              <li>
                <span className="font-bold"> ✔ Great Value:</span> $10,000
                (₹8,00,000+)
              </li>
            </ul>
          </div>

          <p className="text-base md:text-lg text-center md:text-left">
            <span className="font-semibold">When Does the Magic Happen?
            </span>
            <br />
            Once we reach <span className="font-bold">1 million users</span>, BMVCOINS will be launched on public tradeable blockchains. On that day, the coin is expected to open at a {" "}
            <span className="font-bold">minimum of $0.10 USD</span>, with the potential to grow exponentially!

          </p>

          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-purple-500">
            🔗 How Are We Ensuring Growth?
            </h2>
            <ul className=" list-inside">
              <li>
                <span className="font-bold">✅ Private Chain (OXYCHAIN):</span>Until we reach 1 million users, 
                all transactions will be securely recorded in our private blockchain.
                securely in our private chain.
              </li>
              <br/>
              <li>
                <span className="font-bold">✅ Public Chain (Ethereum):</span>{" "}
                After launch, BMVCOINS will transition to Ethereum, one of the world’s most trusted blockchain networks.

              </li>
            </ul>
          </div>

          <h2 className="text-lg font-semibold text-purple-500">
          🚀 The Next Big Crypto Opportunity!
            </h2>

          <p className="text-base md:text-lg text-center md:text-left">
          Bitcoin started at just a few cents and skyrocketed to thousands of dollars. {" "}
            <span className="font-bold">
            BMVCOINS hold the same explosive potential!
            </span>{" "}
            This is your chance to be an early adopter and ride the wave to incredible value.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BMVCOIN;
