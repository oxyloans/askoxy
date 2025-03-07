import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sider";
import { Select, Table, TableProps } from "antd";
import "antd/dist/reset.css";
import moment from "moment";

interface DashboardCardProps {
  title: string;
  count: number;
  color: string;
}

interface DateRange {
  startDate: string | null;
  endDate: string | null;
}

interface DateFilterProps {
  selectedFilter: string;
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
  registrationDate: string;
}

interface UserCount {
  userId: string;
  phoneNumber: string;
  projectType: string;
  askOxyOfers: string;
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
  const [userCount, setUserCount] = useState<UserCount[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(
    "REGISTEREDUSERS"
  );
  const [showRegisteredColumn, setShowRegisteredColumn] = useState(true);
  const [registeredUserCount, setRegisteredUserCount] = useState<UserCount[]>(
    []
  );
  const BASE_URL = `https://meta.oxyglobal.tech/api/`;
  const [dateRange, setDateRange] = useState<{
    startDate: string | null;
    endDate: string | null;
  }>({
    startDate: null,
    endDate: null,
  });
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const pageSize = 50;

  const fetchData = async (
    startDate: string | null,
    endDate: string | null
  ) => {
    try {
      setLoading(true);

      // Perform multiple API requests in parallel
      const responses = await Promise.allSettled([
        axios.get(`${BASE_URL}marketing-service/campgin/getAllInterestedUsres`),
        axios.get(`${BASE_URL}marketing-service/campgin/AllusersAddress`),
        axios.post(`${BASE_URL}user-service/getalluserdetailsbyrange`, {
          endingDate: endDate,
          startingDate: startDate,
        }),
      ]);

      // Check the result of each request
      if (responses[0].status === "fulfilled") {
        const validOffers = responses[0].value.data.filter(
          (offerDetails: OfferDetails) =>
            offerDetails.mobileNumber !== null &&
            offerDetails.mobileNumber !== ""
        );
        console.log(validOffers);

        setOffers(validOffers);
        setAllOffers(validOffers);
      } else {
        console.error("Failed to fetch offers:", responses[0].reason);
        setError("Failed to load offers.");
      }

      if (responses[1].status === "fulfilled") {
        setUsers(responses[1].value.data);
        const validUsers = responses[1].value.data.filter(
          (user: User) =>
            user.deliveryType !== null &&
            user.deliveryType !== "" &&
            user.whatsappNumber !== null &&
            user.whatsappNumber !== ""
        );
        setFilteredUsers(validUsers);
      } else {
        console.error("Failed to fetch user addresses:", responses[1].reason);
        setError("Failed to load user addresses.");
      }
      if (responses[2].status === "fulfilled") {
        setUserCount(responses[2].value.data);
        setRegisteredUserCount(responses[2].value.data);
      } else {
        console.error("Failed to fetch user addresses:", responses[2].reason);
        setError("Failed to load user addresses.");
      }
    } catch (err: any) {
      // Handle any unexpected errors
      console.error("An unexpected error occurred:", err);
      setError("An unexpected error occurred.");
    } finally {
      // Ensure loading state is cleared after the process
      setLoading(false);
    }
  };

  const fetchDataByDateRange = async (
    startDate: string | null,
    endDate: string | null
  ) => {
    try {
      setLoading(true);

      const response = await axios.post(
        `${BASE_URL}user-service/getalluserdetailsbyrange`,
        {
          endingDate: endDate,
          startingDate: startDate,
        }
      );

      setUserCount(response.data);
      setLoading(false);
    } catch (err: any) {
      // setError("An unexpected error occurred");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(null, null);
  }, []);

  const handleDateChange = (value: string) => {
    let endDate = moment().format("YYYY-MM-DD"); // Current date
    let startDate: string | null = null;
    console.log(value);

    switch (value) {
      case "today":
        startDate = moment().format("YYYY-MM-DD");
        break;
      case "yesterday":
        startDate = moment().subtract(1, "days").format("YYYY-MM-DD");
        break;
      case "thisWeek":
        startDate = moment().startOf("week").format("YYYY-MM-DD");
        break;
      case "last10Days":
        startDate = moment().subtract(10, "days").format("YYYY-MM-DD");
        break;
      case "thisMonth":
        startDate = moment().startOf("month").format("YYYY-MM-DD");
        break;
      case "lastMonth":
        startDate = moment()
          .subtract(1, "months")
          .startOf("month")
          .format("YYYY-MM-DD");
        endDate = moment()
          .subtract(1, "months")
          .endOf("month")
          .format("YYYY-MM-DD");
        break;
      default:
        startDate = null;
    }

    setDateRange({ startDate, endDate });
    console.log({ startDate, endDate });
    // fetchDataByDateRange(startDate, endDate);
    handleFilter("REGISTEREDUSERS", { startDate, endDate });
  };

  useEffect(() => {
    const allData = [
      ...allOffers,
      ...filteredUsers.map((user, index) => ({
        id: `${index}`,
        projectType: "ASKOXY",
        mobileNumber: user.whatsappNumber || "N/A",
        askOxyOfers: "FREERUDHRAKSHA",
        registrationDate: "N/A",
      })),
    ];
    setOffers(allData);
    setCombinedData(allData);
  }, [allOffers, filteredUsers]);

  useEffect(() => {
    const userCountData = userCount?.map((user, index) => ({
      id: `${index}`,
      projectType: "ASKOXY",
      mobileNumber: user.phoneNumber || "N/A",
      askOxyOfers: "REGISTERED USERS",
      registrationDate: new Date(user.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    }));
    setOffers(userCountData);
  }, [userCount]);

  const handleFilter = (
    offerType: string,
    dates?: { startDate: string | null; endDate: string | null }
  ) => {
    // console.log({ combinedData });

    setCurrentPage(1);
    setSelectedFilter(offerType);
    setShowRegisteredColumn(offerType === "REGISTEREDUSERS");
    if (dates) {
      fetchDataByDateRange(dates.startDate, dates.endDate);
    }
    if (offerType === "FREERUDRAKSHA") {
      const freeRudrakshaData = filteredUsers.map((user, index) => ({
        id: `${index}`,
        projectType: "ASKOXY",
        mobileNumber: user.whatsappNumber || "N/A",
        askOxyOfers: "FREERUDHRAKSHA",
        registrationDate: "N/A",
      }));

      setOffers(freeRudrakshaData);
    } else if (offerType === "ALL") {
      const allData = [
        ...allOffers,
        ...filteredUsers.map((user, index) => ({
          id: `${index}`,
          projectType: "ASKOXY",
          mobileNumber: user.whatsappNumber || "N/A",
          askOxyOfers: "FREERUDHRAKSHA",
          registrationDate: "N/A",
        })),
      ];
      setOffers(allData);

      // console.log({ offers });
    } else if (offerType === "REGISTEREDUSERS") {
      // fetchDataByDateRange(date.startDate, date.endDate);
      const userCountData = userCount?.map((user, index) => ({
        id: `${index}`,
        projectType: "ASKOXY",
        mobileNumber: user.phoneNumber || "N/A",
        askOxyOfers: "REGISTERED USERS",
        registrationDate: new Date(user.createdAt).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      }));
      // console.log({ userCount });

      // console.log({ userCountData });

      setOffers(userCountData);
    } else {
      const filteredData = allOffers.filter(
        (offer) => offer.askOxyOfers === offerType
      );
      setOffers(filteredData);

      console.log({ offers });
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
      title: "Project Type",
      dataIndex: "projectType",
      key: "projectType",
      align: "center",
    },
    {
      title: "Mobile Number",
      dataIndex: "mobileNumber",
      key: "mobileNumber",
      align: "center",
    },
    {
      title: "Offer",
      dataIndex: "askOxyOfers",
      key: "askOxyOfers",
      align: "center",
    },
    ...(showRegisteredColumn
      ? [
          {
            title: "Registration Date",
            dataIndex: "registrationDate",
            key: "registrationDate",
            align: "center" as "center",
          },
        ]
      : []),
  ];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const convertToCSV = (data: any[]) => {
    if (data.length === 0) return "";

    // Get headers excluding unwanted fields
    const headers = ["S.No", "Project Type", "Mobile Number", "Offer"];
    if (showRegisteredColumn) {
      headers.push("Registration Date");
    }

    // Create CSV header row
    const csvRows = [headers.join(",")];

    // Add data rows
    data.forEach((item, index) => {
      const row = [
        index + 1,
        item.projectType || "",
        item.mobileNumber || "",
        item.askOxyOfers || "",
      ];

      if (showRegisteredColumn) {
        row.push(item.registrationDate || "");
      }

      // Handle commas in content by wrapping in quotes
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

      // Generate filename based on selected filter and date
      let filename = "askoxy-data";
      if (selectedFilter) {
        filename += `-${selectedFilter.toLowerCase()}`;
      }
      if (dateRange.startDate) {
        filename += `-${dateRange.startDate}`;
      }
      filename += ".csv";

      const csvData = convertToCSV(offers);

      // Add BOM for Excel to properly recognize UTF-8
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
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 bg-gray-50 p-4 md:p-6 md:ml-55 overflow-hidden">
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
                (offer) => offer.askOxyOfers === "LEGALSERVICES"
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
            title="Registered Users"
            count={registeredUserCount.length}
            color="pink"
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

          <button
            onClick={() => handleFilter("REGISTEREDUSERS")}
            className="bg-indigo-200 hover:bg-indigo-600 hover:text-white text-black font-semibold py-2 px-4 rounded shadow w-full sm:w-auto"
          >
            Registered Users
          </button>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-8">
            {selectedFilter === "REGISTEREDUSERS" && (
              <>
                <Select
                  defaultValue="Select a Date Range"
                  style={{ width: 200 }}
                  onChange={handleDateChange}
                  className="border rounded"
                >
                  <Select.Option value="today">Today</Select.Option>
                  <Select.Option value="thisWeek">This Week</Select.Option>
                  <Select.Option value="last10Days">Last 10 Days</Select.Option>
                  <Select.Option value="thisMonth">This Month</Select.Option>
                  <Select.Option value="lastMonth">Last Month</Select.Option>
                </Select>

                <div className="flex items-center space-x-3">
                  <span className="text-gray-600">Total :</span>
                  <span className="text-2xl font-bold text-black-600">
                    {userCount.length}
                  </span>
                </div>
              </>
            )}
          </div>

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
          <Table
            dataSource={offers.map((offer, index) => ({
              ...offer,
              key: offer.id || index,
            }))}
            columns={columns}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              onChange: handlePageChange,
              showSizeChanger: false,
            }}
            className="shadow-lg rounded-lg text-center"
            scroll={{ x: window.innerWidth < 768 ? 800 : undefined }}
          />
        )}
      </div>
    </div>
  );
};

export default Admin;
