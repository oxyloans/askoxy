import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sider";
import { Table, TableProps } from "antd";
import "antd/dist/reset.css";
import BASE_URL from "../Config";
import dayjs from "dayjs";

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
  createdAt: string;
  userId: string;
}

interface OfferDetails {
  userId: string | null;
  projectType: string;
  askOxyOfers: string;
  mobileNumber: string;
  registrationDate: string;
  createdAt: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  count,
  color,
}) => {
  return (
    <div
      className={`bg-${color}-200 p-4 md:p-5 rounded-lg shadow-md h-36 md:h-36`}
    >
      <h1 className="text-m py-1 font-bold">{title}</h1>
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
  const [selectedFilter, setSelectedFilter] = useState<string | null>();

  const [dateRange, setDateRange] = useState<{
    startDate: string | null;
    endDate: string | null;
  }>({
    startDate: null,
    endDate: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 50;

  const fetchData = async () => {
    try {
      setLoading(true);

      const formatDate = (dateString: string | number | null) => {
        if (!dateString) return "N/A";
        if (typeof dateString === "number") {
          return new Date(dateString).toLocaleDateString();
        }
        if (typeof dateString === "string" && !isNaN(Date.parse(dateString))) {
          return new Date(dateString).toLocaleDateString();
        }
        return "N/A";
      };

      const responses = await Promise.allSettled([
        axios.get(`${BASE_URL}/auth-service/auth/usersOfferesDetails`),
        axios.get(`${BASE_URL}/auth-service/auth/AllusersAddress`),
        axios.get(
          `${BASE_URL}/marketing-service/campgin/getAllInterestedUsres`
        ),
        axios.get(`${BASE_URL}/marketing-service/campgin/AllusersAddress`),
      ]);

      const offersList: OfferDetails[] = [];

      if (responses[0].status === "fulfilled") {
        const validOffers1 = responses[0].value.data.filter(
          (offer: OfferDetails) =>
            offer.mobileNumber !== null && offer.mobileNumber !== ""
        );

        const formattedOffers1 = validOffers1.map((offer: OfferDetails) => ({
          ...offer,
          createdAt: formatDate(offer.createdAt),
        }));

        offersList.push(...formattedOffers1);
      } else {
        console.warn("Offers API [0] failed.");
      }

      if (responses[2].status === "fulfilled") {
        const validOffers2 = responses[2].value.data.filter(
          (offer: OfferDetails) =>
            offer.userId &&
            offer.mobileNumber &&
            offer.mobileNumber !== "" &&
            offer.userId !== ""
        );

        const formattedOffers2 = validOffers2.map((offer: OfferDetails) => ({
          ...offer,
          createdAt: formatDate(offer.createdAt),
        }));

        offersList.push(...formattedOffers2);
      } else {
        console.warn("Offers API [2] failed.");
      }

      setOffers(offersList);
      setAllOffers(offersList);

      // === USERS (from API 1 and 3) ===
      const usersList: User[] = [];

      if (responses[1].status === "fulfilled") {
        const validUsers1 = responses[1].value.data.filter(
          (user: User) => user.deliveryType && user.whatsappNumber
        );

        const formattedUsers1 = validUsers1.map((user: User) => ({
          ...user,
          createdAt: formatDate(user.createdAt),
        }));

        usersList.push(...formattedUsers1);
      } else {
        console.warn("Users API [1] failed.");
      }

      if (responses[3].status === "fulfilled") {
        const validUsers2 = responses[3].value.data.filter(
          (user: User) => user.deliveryType && user.whatsappNumber
        );

        const formattedUsers2 = validUsers2.map((user: User) => ({
          ...user,
          createdAt: formatDate(user.createdAt),
        }));

        usersList.push(...formattedUsers2);
      } else {
        console.warn("Users API [3] failed.");
      }

      setUsers(usersList);
      setFilteredUsers(usersList);
    } catch (err: any) {
      console.error("An unexpected error occurred:", err);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const allData = [
      ...allOffers,
      ...filteredUsers.map((user, index) => ({
        userId: user.userId || `${index}`,
        projectType: "ASKOXY",
        mobileNumber: user.whatsappNumber || "N/A",
        askOxyOfers: "FREERUDHRAKSHA",
        registrationDate: "N/A",
        createdAt: user.createdAt,
      })),
    ];
    setOffers(allData);
    setCombinedData(allData);
  }, [allOffers, filteredUsers]);

  const formatDate = (dateString: string) => {
    if (!dateString || dateString === "N/A" || isNaN(Date.parse(dateString))) {
      return "N/A";
    }
    return new Date(dateString).toLocaleDateString();
  };

  const knownOfferTypes = [
    "WEAREHIRING",
    "ROTARIAN",
    "MY ROTARY",
    "LEGALSERVICES",
    "LEGAL SERVICE",
    "STUDYABROAD",
    "FREEAI",
    "FREESAMPLE",
    "FREERUDHRAKSHA",
    "FREERUDRAKSHA",
    "FREE RUDHRAKSHA",
  ];

  const isKnownType = (offerName: string) => {
    return knownOfferTypes.some((type) => offerName === type);
  };

  const unknownOffers = allOffers.filter(
    (offer) => !isKnownType(offer.askOxyOfers)
  );

  const labelMap: Record<string, OfferDetails[]> = {};

  unknownOffers.forEach((offer) => {
    const label = offer.askOxyOfers?.trim();
    if (label) {
      if (!labelMap[label]) labelMap[label] = [];
      labelMap[label].push(offer);
    }
  });

  const dynamicLabels = Object.keys(labelMap);

  const getShortLabel = (fullLabel: string): string => {
    const cleaned = fullLabel.trim();

    if (cleaned.includes(" - ")) {
      return cleaned.split(" - ")[1].trim().split(" ").slice(0, 3).join(" ");
    }

    return cleaned.split(" ").slice(0, 3).join(" ");
  };

  const handleFilter = (offerType: string) => {
    setCurrentPage(1);
    setSelectedFilter(offerType);
    if (offerType === "FREERUDRAKSHA") {
      const freeRudrakshaData = filteredUsers.map((user, index) => ({
        userId: user.userId || `${index}`,
        projectType: "ASKOXY",
        mobileNumber: user.whatsappNumber || "N/A",
        askOxyOfers: "FREE RUDHRAKSHA",
        registrationDate: "N/A",
        createdAt: user.createdAt,
      }));

      setOffers(freeRudrakshaData);
    } else if (offerType === "ALL") {
      const allData = [
        ...allOffers,
        ...filteredUsers.map((user, index) => ({
          userId: user.userId || `${index}`,
          projectType: "ASKOXY",
          mobileNumber: user.whatsappNumber || "N/A",
          askOxyOfers: "FREE RUDHRAKSHA",
          registrationDate: "N/A",
          createdAt: user.createdAt,
        })),
      ];
      setOffers(allData);
    } else if (knownOfferTypes.includes(offerType)) {
      const filteredData = allOffers.filter(
        (offer) => offer.askOxyOfers === offerType
      );

      const formattedOffers = filteredData.map((offer) => ({
        ...offer,
        createdAt: formatDate(offer.createdAt),
      }));

      setOffers(formattedOffers);
    } else {
      const filteredData = allOffers.filter(
        (offer) =>
          !isKnownType(offer.askOxyOfers) &&
          offer.askOxyOfers?.trim() === offerType
      );

      const formattedOffers = filteredData.map((offer) => ({
        ...offer,
        createdAt: formatDate(offer.createdAt),
      }));

      setOffers(formattedOffers);
    }
  };

  const columns: TableProps<OfferDetails>["columns"] = [
    {
      title: "S.No",
      dataIndex: "index",
      key: "index",
      align: "center",
      render: (_: any, __: any, index: number) =>
        index + 1 + (currentPage - 1) * pageSize,
    },
    {
      title: "Mobile Number",
      dataIndex: "mobileNumber",
      key: "mobileNumber",
      align: "center",
    },
    {
      title: "Interested In",
      dataIndex: "askOxyOfers",
      key: "askOxyOfers",
      align: "center",
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
      render: (text: string | undefined | null) => {
        const date = dayjs(text);
        return date.isValid() ? date.format("MMM DD YYYY") : "No date";
      },
    },
  ];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const convertToCSV = (data: any[]) => {
    if (data.length === 0) return "";
    const headers = ["S.No", "Mobile Number", "Interested In", "Date"];
    const csvRows = [headers.join(",")];

    data.forEach((item, index) => {
      const row = [
        index + 1,
        item.mobileNumber || "",
        item.askOxyOfers || "",
        item.createdAt || "",
      ];

      const formattedRow = row.map((cell) => {
        const cellStr = cell.toString();
        return cellStr.includes(",") ? `"${cellStr}"` : cellStr;
      });

      csvRows.push(formattedRow.join(","));
    });
    return csvRows.join("\n");
  };

  const handleDownload = () => {
    try {
      if (!offers || offers.length === 0) {
        alert("No data available to download");
        return;
      }

      let filename = "askoxy-data";
      if (selectedFilter) {
        filename += `-${selectedFilter.toLowerCase()}`;
      }
      if (dateRange.startDate) {
        filename += `-${dateRange.startDate}`;
      }
      filename += ".csv";

      const csvData = convertToCSV(offers);

      const BOM = "\uFEFF";
      const blob = new Blob([BOM + csvData], {
        type: "text/csv;charset=utf-8;",
      });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading data:", error);
      alert("Failed to download data. Please try again.");
    }
  };

  return (
    <div className="flex md:flex">
      <div className="flex-1 bg-gray-50 md:p-6 md:ml-55 overflow-hidden">
        <h1 className="text-2xl font-semibold mb-4">Admin Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3 mb-4">
          <DashboardCard
            title="Total Offers"
            count={combinedData.length}
            color="blue"
          />
          <DashboardCard
            title="Free Rudraksha"
            count={
              combinedData.filter(
                (offer) => offer.askOxyOfers === "FREERUDHRAKSHA"
              ).length
            }
            color="gray"
          />
          <DashboardCard
            title="Free Samples"
            count={
              combinedData.filter((offer) => offer.askOxyOfers === "FREESAMPLE")
                .length
            }
            color="green"
          />
          <DashboardCard
            title="FreeAI & GenAI"
            count={
              combinedData.filter((offer) => offer.askOxyOfers === "FREEAI")
                .length
            }
            color="teal"
          />
          <DashboardCard
            title="Study Abroad"
            count={
              combinedData.filter(
                (offer) => offer.askOxyOfers === "STUDYABROAD"
              ).length
            }
            color="indigo"
          />
          <DashboardCard
            title="Legal Service"
            count={
              combinedData.filter(
                (offer) =>
                  offer.askOxyOfers === "LEGALSERVICES" ||
                  offer.askOxyOfers === "LEGAL SERVICE"
              ).length
            }
            color="yellow"
          />

          <DashboardCard
            title="My Rotary"
            count={
              combinedData.filter((offer) => offer.askOxyOfers === "ROTARIAN")
                .length
            }
            color="pink"
          />
          <DashboardCard
            title="We Are Hiring"
            count={
              combinedData.filter(
                (offer) => offer.askOxyOfers === "WEAREHIRING"
              ).length
            }
            color="orange"
          />
          <DashboardCard
            title="Others"
            count={
              combinedData.filter((offer) => !isKnownType(offer.askOxyOfers))
                .length
            }
            color="pink"
          />
        </div>

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

          {dynamicLabels.map((label) => (
            <button
              key={label}
              onClick={() => handleFilter(label)}
              className="bg-pink-200 hover:bg-purple-600 hover:text-white text-black font-semibold py-2 px-4 rounded shadow"
            >
              {getShortLabel(label)}
            </button>
          ))}

          <button
            onClick={() => handleFilter("ALL")}
            className="bg-gray-500 hover:bg-gray-600 hover:text-white text-black font-semibold py-2 px-4 rounded shadow w-full sm:w-auto"
          >
            Show All
          </button>
        </div>

        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handleDownload}
            className="ml-auto px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-blue-600 flex items-center space-x-2 shadow-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            <span>Download CSV</span>
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : offers.length === 0 ? (
          <p className="text-center text-gray-500">No data available</p>
        ) : (
          <div className="overflow-x-auto">
            <Table
              dataSource={offers.map((offer, index) => ({
                ...offer,
                key: `${offer.mobileNumber}-${offer.askOxyOfers}-${index}`,
              }))}
              columns={columns}
              pagination={{
                current: currentPage,
                pageSize: pageSize,
                onChange: handlePageChange,
                showSizeChanger: false,
              }}
              className="shadow-lg rounded-lg text-center"
              // scroll={{ x: window.innerWidth < 768 ? 800 : undefined }}
              scroll={{ x: true }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
