import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
const navigate = useNavigate; 

interface OfferDetails {
  id: string | null;
  mobileNumber: string;
  projectType: string;
  askOxyOfers: string;
}

const Admin: React.FC = () => {
  const [offers, setOffers] = useState<OfferDetails[]>([]);
  const [filteredOffers, setFilteredOffers] = useState<OfferDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://meta.oxyloans.com/api/auth-service/auth/usersOfferesDetails"
      );
      setOffers(response.data);
      setFilteredOffers(response.data);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || "Failed to fetch data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleFilter = (offerType: string) => {
    const filteredData = offers.filter(
      (offer) => offer.askOxyOfers === offerType
    );
    setFilteredOffers(filteredData);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-4 overflow-y-auto fixed h-screen">
        <h2 className="text-2xl font-semibold text-center mb-8">
          Admin Dashboard
        </h2>
        <ul>
          <li className="mb-4">
            <button className="w-full text-left py-2 px-4 hover:bg-gray-700 rounded">
              Dashboard
            </button>
          </li>
          <li className="mb-4">
            <button className="w-full text-left py-2 px-4 hover:bg-gray-700 rounded">
              Offers
            </button>
          </li>
          <li className="mb-4">
            <Link
              to="/alluserqueries"
              className="w-full text-left py-2 px-4 hover:bg-gray-700 rounded"
            >
              Users Queries
            </Link>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-50 p-6 ml-64">
        {/* Dashboard Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
          <div className="bg-gray-200 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">Total Offers</h3>
            <p className="text-3xl font-bold">{offers.length}</p>
          </div>
          <div className="bg-green-100 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">Free Samples</h3>
            <p className="text-3xl font-bold">
              {
                offers.filter((offer) => offer.askOxyOfers === "FREESAMPLE")
                  .length
              }
            </p>
          </div>
          <div className="bg-purple-100 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">Study Abroad</h3>
            <p className="text-3xl font-bold">
              {
                offers.filter((offer) => offer.askOxyOfers === "STUDYABROAD")
                  .length
              }
            </p>
          </div>
          <div className="bg-blue-100 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">FreeAI & GenAI</h3>
            <p className="text-3xl font-bold">
              {offers.filter((offer) => offer.askOxyOfers === "FREEAI").length}
            </p>
          </div>
          <div className="bg-yellow-100 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">Legal Service</h3>
            <p className="text-3xl font-bold">
              {
                offers.filter((offer) => offer.askOxyOfers === "LEGALSERVICES")
                  .length
              }
            </p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-6 mb-6">
          <button
            onClick={() => handleFilter("FREESAMPLE")}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded shadow w-1/4 sm:w-auto"
          >
            Free Sample
          </button>
          <button
            onClick={() => handleFilter("FREEAI")}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded shadow w-1/4 sm:w-auto"
          >
            Free AI & Gen AI
          </button>
          <button
            onClick={() => handleFilter("STUDYABROAD")}
            className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded shadow w-1/4 sm:w-auto"
          >
            Study Abroad
          </button>
          <button
            onClick={() => handleFilter("LEGALSERVICES")}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded shadow w-1/4 sm:w-auto"
          >
            Legal Services
          </button>
          <button
            onClick={() => setFilteredOffers(offers)}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded shadow w-1/4 sm:w-auto"
          >
            Show All
          </button>
        </div>

        {/* Offers Table */}
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : filteredOffers.length === 0 ? (
          <p className="text-center text-gray-500">No data available</p>
        ) : (
          <table className="table-auto w-full border-collapse border border-gray-300 rounded-md">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="border border-gray-300 px-4 py-2">S.No</th>
                <th className="border border-gray-300 px-4 py-2">
                  Mobile Number
                </th>
                <th className="border border-gray-300 px-4 py-2">
                  Project Type
                </th>
                <th className="border border-gray-300 px-4 py-2">Offer</th>
              </tr>
            </thead>
            <tbody>
              {filteredOffers.map((offer, index) => (
                <tr
                  key={offer.id || index}
                  className="text-center hover:bg-gray-100"
                >
                  <td className="border border-gray-300 px-4 py-2">
                    {index + 1}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {offer.mobileNumber}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {offer.projectType}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {offer.askOxyOfers}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Admin;
