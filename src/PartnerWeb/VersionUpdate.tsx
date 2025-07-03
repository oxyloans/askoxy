import React, { useState, useEffect } from "react";
import {
  RefreshCw,
  Edit,
  Check,
  X,
  Smartphone,
  Apple,
  AlertCircle,
  CheckCircle2,
  ShoppingCart,
  User,
} from "lucide-react";
import BASE_URL from "../Config";

interface Version {
  version: string;
  versionType: "ANDROID" | "IOS";
  createdOn: number;
  userType: "CUSTOMER" | "SELLER";
  currentStatus: boolean;
}

const VersionUpdate: React.FC = () => {
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [editingVersions, setEditingVersions] = useState<{
    [key: string]: string;
  }>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchVersions = async () => {
    setLoading(true);
    setError(null);

    try {
      const [androidCustomerResponse, iosCustomerResponse, androidSellerResponse] = await Promise.all([
        fetch(
          `${BASE_URL}/product-service/getAllVersions?userType=CUSTOMER&versionType=ANDROID`
        ),
        fetch(
          `${BASE_URL}/product-service/getAllVersions?userType=CUSTOMER&versionType=IOS`
        ),
        fetch(
          `${BASE_URL}/product-service/getAllVersions?userType=SELLER&versionType=ANDROID`
        ),
      ]);

      if (!androidCustomerResponse.ok || !iosCustomerResponse.ok || !androidSellerResponse.ok) {
        throw new Error("Failed to fetch versions");
      }

      const androidCustomerData = await androidCustomerResponse.json();
      const iosCustomerData = await iosCustomerResponse.json();
      const androidSellerData = await androidSellerResponse.json();

      setVersions([androidCustomerData, iosCustomerData, androidSellerData]);
    } catch (err) {
      setError("Failed to fetch current versions. Please try again.");
      console.error("Error fetching versions:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateVersion = async (
    versionType: "ANDROID" | "IOS",
    userType: "CUSTOMER" | "SELLER",
    newVersion: string
  ) => {
    const updateKey = `${userType}_${versionType}`;
    setUpdating(updateKey);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(
        `${BASE_URL}/product-service/versionUpdate`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            list: [
              {
                userType: userType,
                version: newVersion,
                versionType: versionType,
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update version");
      }

      setSuccess(`${userType} ${versionType} version updated successfully!`);
      setEditingVersions((prev) => {
        const newState = { ...prev };
        delete newState[updateKey];
        return newState;
      });
      await fetchVersions();
    } catch (err) {
      setError(`Failed to update ${userType} ${versionType} version. Please try again.`);
      console.error("Error updating version:", err);
    } finally {
      setUpdating(null);
    }
  };

  const startEditing = (
    versionType: "ANDROID" | "IOS",
    userType: "CUSTOMER" | "SELLER",
    currentVersion: string
  ) => {
    const updateKey = `${userType}_${versionType}`;
    setEditingVersions((prev) => ({
      ...prev,
      [updateKey]: currentVersion,
    }));
  };

  const cancelEditing = (versionType: "ANDROID" | "IOS", userType: "CUSTOMER" | "SELLER") => {
    const updateKey = `${userType}_${versionType}`;
    setEditingVersions((prev) => {
      const newState = { ...prev };
      delete newState[updateKey];
      return newState;
    });
  };

  const updateEditingVersion = (
    versionType: "ANDROID" | "IOS",
    userType: "CUSTOMER" | "SELLER",
    value: string
  ) => {
    const updateKey = `${userType}_${versionType}`;
    setEditingVersions((prev) => ({
      ...prev,
      [updateKey]: value,
    }));
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const getVersionIcon = (versionType: string) => {
    return versionType === "ANDROID" ? (
      <Smartphone className="w-6 h-6 text-green-600" />
    ) : (
      <Apple className="w-6 h-6 text-gray-800" />
    );
  };

  const getUserTypeIcon = (userType: string) => {
    return userType === "CUSTOMER" ? (
      <User className="w-5 h-5 text-blue-600" />
    ) : (
      <ShoppingCart className="w-5 h-5 text-orange-600" />
    );
  };

  const getUpdateKey = (userType: string, versionType: string) => {
    return `${userType}_${versionType}`;
  };

  useEffect(() => {
    fetchVersions();
  }, []);

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6 max-w-full">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Version Management
              </h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">
                Manage app versions for Customer and Seller platforms
              </p>
            </div>
            <button
              onClick={fetchVersions}
              disabled={loading}
              className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors w-full sm:w-auto"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">Error:</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-green-800">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-medium">Success:</span>
              <span>{success}</span>
            </div>
          </div>
        )}

        {/* Version Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {loading
            ? // Loading skeletons
              Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-sm p-6 animate-pulse"
                >
                  <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              ))
            : versions.map((version) => {
                const updateKey = getUpdateKey(version.userType, version.versionType);
                return (
                  <div
                    key={updateKey}
                    className="bg-white rounded-lg shadow-sm p-6"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      {getVersionIcon(version.versionType)}
                      <div className="flex-1">
                        <h2 className="text-lg font-semibold text-gray-900">
                          {version.versionType === "ANDROID" ? "Android" : "iOS"}
                        </h2>
                        <div className="flex items-center gap-2 mt-1">
                          {getUserTypeIcon(version.userType)}
                          <span className="text-sm font-medium text-gray-600">
                            {version.userType}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Current Version:
                        </span>
                        <span className="font-mono text-lg font-semibold text-gray-900">
                          v{version.version}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Status:</span>
                        <span
                          className={`text-sm font-medium ${
                            version.currentStatus
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {version.currentStatus ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Updated:</span>
                        <span className="text-sm text-gray-900">
                          {formatTimestamp(version.createdOn)}
                        </span>
                      </div>
                    </div>

                    {/* Edit Version */}
                    {editingVersions[updateKey] !== undefined ? (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            New Version Number
                          </label>
                          <input
                            type="text"
                            value={editingVersions[updateKey]}
                            onChange={(e) =>
                              updateEditingVersion(
                                version.versionType,
                                version.userType,
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter new version number"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              updateVersion(
                                version.versionType,
                                version.userType,
                                editingVersions[updateKey]
                              )
                            }
                            disabled={
                              updating === updateKey ||
                              !editingVersions[updateKey]?.trim()
                            }
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <Check className="w-4 h-4" />
                            {updating === updateKey ? "Saving..." : "Save"}
                          </button>
                          <button
                            onClick={() =>
                              cancelEditing(version.versionType, version.userType)
                            }
                            disabled={updating === updateKey}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <X className="w-4 h-4" />
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() =>
                          startEditing(
                            version.versionType,
                            version.userType,
                            version.version
                          )
                        }
                        disabled={updating !== null}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors w-full"
                      >
                        <Edit className="w-4 h-4" />
                        Edit Version
                      </button>
                    )}
                  </div>
                );
              })}
        </div>
      </div>
    </div>
  );
};

export default VersionUpdate;