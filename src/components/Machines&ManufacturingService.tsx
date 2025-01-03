import React, { useState, useEffect } from "react";
import Machine from '../assets/img/manufacturing.png'
const MachinesManufacturingServices = () => {
  // Add any logic or state you need here, if necessary.

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="flex flex-col md:flex-row items-center justify-center mt-10 px-4">
        {/* Left Section: Image */}
        <div className="w-full md:w-1/2 flex justify-center md:justify-end mb-6 md:mb-0">
          <img
            src={Machine}
            alt="Machines Manufacturing Services"
            
          />
        </div>
      </div>
    </div>
  );
};

export default MachinesManufacturingServices;
