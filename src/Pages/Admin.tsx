import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sider";

interface DashboardCardProps {
  title: string;
  count: number;
  color: string;
}

interface User {
  deliveryType: string | null;
  whatsappNumber: string;
  firstName: string;
  lastName: string;
  email: string | null;
  transportType: string | null;
  scriptId: string | null;
  familyCount: number;
}

interface OfferDetails {
  id: string | null;
  projectType: string;
  askOxyOfers: string;
  mobileNumber: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  count,
  color,
}) => {
  return (
    <div className={`bg-${color}-200 p-4 md:p-6 rounded-lg shadow-md`}>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-3xl font-bold">{count}</p>
    </div>
  );
};

const Admin: React.FC = () => {
  const [offers, setOffers] = useState<OfferDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [allOffers, setAllOffers] = useState<OfferDetails[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [combinedData, setCombinedData] = useState<OfferDetails[]>([]);

  // Fetch offers data from the API
  const fetchOffers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://meta.oxyloans.com/api/auth-service/auth/usersOfferesDetails"
      );
      const validUsers = response.data.filter(
        (offerDetails: OfferDetails) =>
          offerDetails.mobileNumber !== null && offerDetails.mobileNumber !== ""
      );
      setOffers(validUsers);
      setAllOffers(validUsers);
      setLoading(false);
    } catch (err: any) {
      setError(err.response?.statusText || "Failed to fetch data");
      setLoading(false);
    }
  };
  const fetchRudrakshaUsers = async () => {
    try {
      const response = await axios.get(
        "https://meta.oxyloans.com/api/auth-service/auth/AllusersAddress"
      );
      setUsers(response.data);
      const validUsers = response.data.filter(
        (user: User) =>
          user.deliveryType !== null &&
          user.deliveryType !== "" &&
          user.whatsappNumber !== null &&
          user.whatsappNumber !== ""
      );

      setFilteredUsers(validUsers);
    } catch (error) {
      console.error("Failed to fetch user addresses:", error);
    }
  };

  useEffect(() => {
    fetchOffers();
    fetchRudrakshaUsers();
  }, []);

  useEffect(() => {
    const allData = [
      ...allOffers,
      ...filteredUsers.map((user, index) => ({
        id: user.scriptId || `${index}`,
        projectType: "ASKOXY",
        mobileNumber: user.whatsappNumber || "N/A",
        askOxyOfers: "Free Rudhraksha",
      })),
    ];
    setOffers(allData);
    setCombinedData(allData);
  }, [allOffers, filteredUsers]);

  const handleFilter = (offerType: string) => {
    if (offerType === "FREERUDRAKSHA") {
      const freeRudrakshaData = filteredUsers.map((user, index) => ({
        id: user.scriptId || `${index}`,
        projectType: "ASKOXY",
        mobileNumber: user.whatsappNumber || "N/A",
        askOxyOfers: "Free Rudhraksha",
      }));
      setOffers(freeRudrakshaData);

      console.log({ offers });
    } else if (offerType === "ALL") {
      const allData = [
        ...allOffers,
        ...filteredUsers.map((user, index) => ({
          id: user.scriptId || `${index}`,
          projectType: "ASKOXY",
          mobileNumber: user.whatsappNumber || "N/A",
          askOxyOfers: "Free Rudhraksha",
        })),
      ];
      setOffers(allData);

      console.log({ offers });
    } else {
      const filteredData = allOffers.filter(
        (offer) => offer.askOxyOfers === offerType
      );
      setOffers(filteredData);

      console.log({ offers });
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 bg-gray-50 p-4 md:p-6 md:ml-55">
        <h1 className="text-2xl font-semibold mb-4">Admin Dashboard</h1>

        {/* Dashboard Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3 mb-4">
          <DashboardCard
            title="Total Offers"
            count={combinedData.length}
            color="blue"
          />
          <DashboardCard
            title="Free Rudraksha"
            count={
              offers.filter((offer) => offer.askOxyOfers === "Free Rudhraksha")
                .length
            }
            color="gray"
          />
          <DashboardCard
            title="Free Samples"
            count={
              offers.filter((offer) => offer.askOxyOfers === "FREESAMPLE")
                .length
            }
            color="green"
          />
          <DashboardCard
            title="FreeAI & GenAI"
            count={
              offers.filter((offer) => offer.askOxyOfers === "FREEAI").length
            }
            color="teal"
          />
          <DashboardCard
            title="Study Abroad"
            count={
              offers.filter((offer) => offer.askOxyOfers === "STUDYABROAD")
                .length
            }
            color="indigo"
          />
          <DashboardCard
            title="Legal Service"
            count={
              offers.filter((offer) => offer.askOxyOfers === "LEGALSERVICES")
                .length
            }
            color="yellow"
          />

          <DashboardCard
            title="My Rotary"
            count={
              offers.filter((offer) => offer.askOxyOfers === "ROTARIAN").length
            }
            color="pink"
          />
          <DashboardCard
            title="We Are Hiring"
            count={
              offers.filter((offer) => offer.askOxyOfers === "WEAREHIRING")
                .length
            }
            color="orange"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={() => handleFilter("FREESAMPLE")}
            className="bg-green-200 hover:bg-blue-600 hover:text-white text-black font-semibold py-2 px-4 rounded shadow w-full sm:w-auto"
          >
            Free Sample
          </button>
          <button
            onClick={() => handleFilter("FREERUDRAKSHA")}
            className="bg-gray-200 hover:bg-gray-700 hover:text-white text-black font-semibold py-2 px-4 rounded shadow w-full sm:w-auto"
          >
            Free Rudhraksha
          </button>
          <button
            onClick={() => handleFilter("FREEAI")}
            className="bg-teal-200 hover:bg-green-600 hover:text-white  text-black font-semibold py-2 px-4 rounded shadow w-full sm:w-auto"
          >
            Free AI & Gen AI
          </button>
          <button
            onClick={() => handleFilter("STUDYABROAD")}
            className="bg-indigo-200 hover:bg-purple-600 hover:text-white text-black font-semibold py-2 px-4 rounded shadow w-full sm:w-auto"
          >
            Study Abroad
          </button>
          <button
            onClick={() => handleFilter("LEGALSERVICES")}
            className="bg-yellow-200 hover:bg-yellow-600 hover:text-white text-black font-semibold py-2 px-4 rounded shadow w-full sm:w-auto"
          >
            Legal Services
          </button>
          <button
            onClick={() => handleFilter("ROTARIAN")}
            className="bg-pink-200 hover:bg-purple-600 hover:text-white text-black font-semibold py-2 px-4 rounded shadow w-full sm:w-auto"
          >
            My Rotary
          </button>
          <button
            onClick={() => handleFilter("WEAREHIRING")}
            className="bg-orange-200 hover:bg-yellow-600 hover:text-white text-black font-semibold py-2 px-4 rounded shadow w-full sm:w-auto"
          >
            We Are Hiring
          </button>
          <button
            onClick={() => handleFilter("ALL")}
            className="bg-gray-500 hover:bg-gray-600 hover:text-white text-black font-semibold py-2 px-4 rounded shadow w-full sm:w-auto"
          >
            Show All
          </button>
        </div>

        {/* Offers Table */}
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : offers.length === 0 ? (
          <p className="text-center text-gray-500">No data available</p>
        ) : (
          <div className="overflow-x-auto overflow-y-auto scrollbar-hide">
            <table className="table-auto w-full border-collapse border border-gray-300 rounded-md">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="border border-gray-300 px-4 py-2">S.No</th>
                  <th className="border border-gray-300 px-4 py-2">
                    Project Type
                  </th>
                  <th className="border border-gray-300 px-4 py-2">
                    Mobile Number
                  </th>
                  <th className="border border-gray-300 px-4 py-2">Offer</th>
                </tr>
              </thead>
              <tbody>
                {offers.map((offer, index) => (
                  <tr
                    key={offer.id || index}
                    className="text-center hover:bg-gray-100"
                  >
                    <td className="border border-gray-300 px-4 py-2">
                      {index + 1}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {offer.projectType}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {offer.mobileNumber}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {offer.askOxyOfers}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
