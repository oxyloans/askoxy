import React, { useState } from "react";
import { Button, Input, Select, Card, message, Spin, Divider } from "antd";
import { UserOutlined, PhoneOutlined, PlusOutlined } from "@ant-design/icons";
import BASE_URL from "../Config";

const { Option } = Select;

interface UserData {
  userId: string;
  userName: string;
  mobileNumber: string;
  whastappNumber: string;
  email: string;
  userType: string;
  ericeCustomerId: string;
  address: string;
  pincode: string;
  lastFourDigitsUserId: string;
  userRegisterCreatedDate: string;
  userRegisterDate: string;
}

interface ReferenceData {
  refereeId: string;
  refereeNumber: string;
  referenceStatus: string;
  referrerId: string;
}

const AddReference: React.FC = () => {
  const [searchInput, setSearchInput] = useState("");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);
  const [referenceLoading, setReferenceLoading] = useState(false);

  const [referenceData, setReferenceData] = useState<ReferenceData>({
    refereeId: "",
    refereeNumber: "",
    referenceStatus: "Invited",
    referrerId: "",
  });

  const handleGetUserData = async () => {
    if (!searchInput.trim()) {
      message.warning(
        "Please enter mobile number, WhatsApp number, or User ID"
      );
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${BASE_URL}/user-service/getDataWithMobileOrWhatsappOrUserId`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            number: searchInput,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const data = await response.json();

      if (data.activeUsersResponse && data.activeUsersResponse.length > 0) {
        setUserData(data.activeUsersResponse[0]);
        message.success("User data fetched successfully");
      } else {
        message.error("No user found with the provided information");
        setUserData(null);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      message.error("Failed to fetch user data");
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAddReference = async () => {
    if (
      !referenceData.refereeId ||
      !referenceData.refereeNumber ||
      !referenceData.referrerId
    ) {
      message.warning("Please fill all required fields");
      return;
    }

    setReferenceLoading(true);
    try {
      const response = await fetch(
        `${BASE_URL}/reference-service/add_reference_mapping`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(referenceData),
        }
      );

      const result = await response.json();

      if (!response.ok || result.success === false) {
        throw new Error(result.message || "Failed to add reference");
      }

      message.success(result.message || "Reference added successfully");

      // Reset reference form
      setReferenceData({
        refereeId: "",
        refereeNumber: "",
        referenceStatus: "Invited",
        referrerId: "",
      });
    } catch (error) {
      console.error("Error adding reference:", error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Something went wrong while adding reference";

      message.error(errorMessage);
    } finally {
      setReferenceLoading(false);
    }
  };

  const handleReferenceInputChange = (
    field: keyof ReferenceData,
    value: string
  ) => {
    setReferenceData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6 md:mb-8 text-center px-2">
          Add Reference
        </h1>

        {/* User Search Section */}
        <Card className="mb-4 sm:mb-6 shadow-lg">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center">
            <UserOutlined className="mr-2" />
            Search User
          </h2>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4">
            <Input
              placeholder="Enter mobile number, WhatsApp number, or User ID"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="flex-1"
              size="large"
            />
            <Button
              type="primary"
              size="large"
              onClick={handleGetUserData}
              loading={loading}
              className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
            >
              Get Data
            </Button>
          </div>

          {/* User Data Display */}
          {userData && (
            <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-blue-800">
                User Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                <div className="break-words">
                  <span className="font-medium text-gray-700 text-sm sm:text-base">
                    User ID:
                  </span>
                  <p className="text-gray-900 text-sm sm:text-base break-all">
                    {userData.userId}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-700 text-sm sm:text-base">
                    Mobile Number:
                  </span>
                  <p className="text-gray-900 text-sm sm:text-base">
                    {userData.mobileNumber}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-700 text-sm sm:text-base">
                    Name:
                  </span>
                  <p className="text-gray-900 text-sm sm:text-base">
                    {userData.userName}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-700 text-sm sm:text-base">
                    Registration Date:
                  </span>
                  <p className="text-gray-900 text-sm sm:text-base break-all">
                    {new Date(userData.userRegisterDate).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-700 text-sm sm:text-base">
                    WhatsApp:
                  </span>
                  <p className="text-gray-900 text-sm sm:text-base">
                    {userData.whastappNumber}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-700 text-sm sm:text-base">
                    User Type:
                  </span>
                  <p className="text-gray-900 text-sm sm:text-base">
                    {userData.userType}
                  </p>
                </div>
              </div>
            </div>
          )}
        </Card>

        <Divider className="my-4 sm:my-6" />

        {/* Reference Mapping Section */}
        <Card className="shadow-lg">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center">
            <PlusOutlined className="mr-2" />
            Add Reference Mapping
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Referee User ID *
              </label>
              <Input
                placeholder="Enter referee user ID"
                value={referenceData.refereeId}
                onChange={(e) =>
                  handleReferenceInputChange("refereeId", e.target.value)
                }
                size="large"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Referee Number *
              </label>
              <Input
                placeholder="Enter referee number"
                value={referenceData.refereeNumber}
                onChange={(e) =>
                  handleReferenceInputChange("refereeNumber", e.target.value)
                }
                size="large"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reference Status *
              </label>
              <Select
                value={referenceData.referenceStatus}
                onChange={(value) =>
                  handleReferenceInputChange("referenceStatus", value)
                }
                size="large"
                className="w-full"
              >
                <Option value="REGISTERED">REGISTERED</Option>
                <Option value="SUCCESS">SUCCESS</Option>
                <Option value="Invited">INVITED</Option>
                <Option value="ORDERED">ORDERED</Option>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Referrer ID *
              </label>
              <Input
                placeholder="Enter referrer ID"
                value={referenceData.referrerId}
                onChange={(e) =>
                  handleReferenceInputChange("referrerId", e.target.value)
                }
                size="large"
              />
            </div>
          </div>

          <div className="mt-6 text-center">
            <Button
              type="primary"
              size="large"
              onClick={handleAddReference}
              loading={referenceLoading}
              className="bg-green-600 hover:bg-green-700 px-6 sm:px-8 w-full sm:w-auto"
            >
              Add Reference
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AddReference;
