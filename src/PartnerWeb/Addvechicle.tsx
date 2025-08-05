import React, { useState, useEffect } from "react";
import {
  Save,
  Car,
  Edit,
  Plus,
  CheckCircle,
  XCircle,
  X,
  Search,
  Users,
  Truck,
} from "lucide-react";
import BASE_URL from "../Config";

// Types
interface Vehicle {
  id: string;
  vehicleName: string;
  vehicleNumber: string;
}

interface VehicleDriverReport {
  cratedAt: string;
  deliveryBoyId: string;
  firstName: string;
  fuelCost: number;
  fuelLiters: number;
  lastName: string;
  marketAddress: string;
  vehicleEndingReading: number;
  vehicleName: string;
  vehicleNumber: string;
  vehicleStartingReading: number;
}

interface ApiResponse {
  content: VehicleDriverReport[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  pageable: any;
  size: number;
  sort: any;
  totalElements: number;
  totalPages: number;
}

interface FormData {
  vehicleName: string;
  vehicleNumber: string;
}

interface Message {
  type: "success" | "error" | "";
  text: string;
}

// Skeleton Components
const VehicleCardSkeleton: React.FC = () => (
  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm min-h-[180px] flex flex-col justify-between animate-pulse">
    <div>
      <div className="space-y-2">
        <div>
          <div className="h-3 bg-gray-200 rounded w-20 mb-1"></div>
          <div className="h-4 bg-gray-300 rounded w-32"></div>
        </div>
        <div>
          <div className="h-3 bg-gray-200 rounded w-24 mb-1"></div>
          <div className="h-4 bg-gray-300 rounded w-20"></div>
        </div>
      </div>
    </div>
    <div className="mt-4 pt-4 border-t border-gray-100">
      <div className="h-10 bg-gray-200 rounded-lg"></div>
    </div>
  </div>
);

const ReportCardSkeleton: React.FC = () => (
  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm animate-pulse">
    {/* Header */}
    <div className="flex items-center justify-between mb-4">
      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
      <div className="h-3 bg-gray-200 rounded w-16"></div>
    </div>

    {/* Content */}
    <div className="space-y-3">
      <div>
        <div className="h-3 bg-gray-200 rounded w-12 mb-1"></div>
        <div className="h-4 bg-gray-300 rounded w-24"></div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="h-3 bg-gray-200 rounded w-14 mb-1"></div>
          <div className="h-4 bg-gray-300 rounded w-20"></div>
        </div>
        <div>
          <div className="h-3 bg-gray-200 rounded w-12 mb-1"></div>
          <div className="h-4 bg-gray-300 rounded w-16"></div>
        </div>
      </div>

      <div>
        <div className="h-3 bg-gray-200 rounded w-20 mb-1"></div>
        <div className="h-4 bg-gray-300 rounded w-full"></div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="h-3 bg-gray-200 rounded w-18 mb-1"></div>
          <div className="h-4 bg-gray-300 rounded w-12"></div>
        </div>
        <div>
          <div className="h-3 bg-gray-200 rounded w-16 mb-1"></div>
          <div className="h-4 bg-gray-300 rounded w-12"></div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="h-3 bg-gray-200 rounded w-16 mb-1"></div>
          <div className="h-4 bg-gray-300 rounded w-8"></div>
        </div>
        <div>
          <div className="h-3 bg-gray-200 rounded w-14 mb-1"></div>
          <div className="h-4 bg-gray-300 rounded w-10"></div>
        </div>
      </div>

      {/* Distance Calculation */}
      <div className="pt-3 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <div className="h-3 bg-gray-200 rounded w-20"></div>
          <div className="h-4 bg-gray-300 rounded w-12"></div>
        </div>
      </div>
    </div>
  </div>
);

const VehicleManagement: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vehicleReports, setVehicleReports] = useState<VehicleDriverReport[]>([]);
  const [filteredReports, setFilteredReports] = useState<VehicleDriverReport[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingReports, setIsLoadingReports] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [message, setMessage] = useState<Message>({ type: "", text: "" });
  const [modalMode, setModalMode] = useState<"add" | "update">("add");
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [activeTab, setActiveTab] = useState<"vehicles" | "reports">("vehicles");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [formData, setFormData] = useState<FormData>({
    vehicleName: "",
    vehicleNumber: "",
  });

  // Fetch vehicles on component mount
  useEffect(() => {
    fetchVehicles();
    fetchVehicleReports();
  }, []);

  // Filter reports based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredReports(vehicleReports);
    } else {
      const filtered = vehicleReports.filter((report) =>
        report.vehicleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.marketAddress.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredReports(filtered);
    }
  }, [searchTerm, vehicleReports]);

  const fetchVehicles = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${BASE_URL}/user-service/getVehiclesReports`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setVehicles(data.vehicles || data || []);
      } else {
        setMessage({
          type: "error",
          text: "Failed to fetch vehicles. Please try again.",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Network error. Please check your connection.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchVehicleReports = async () => {
    setIsLoadingReports(true);
    try {
      const response = await fetch(
        `${BASE_URL}/user-service/getAllMarketsVahicles`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data: ApiResponse = await response.json();
        setVehicleReports(data.content || []);
        setFilteredReports(data.content || []);
      } else {
        setMessage({
          type: "error",
          text: "Failed to fetch vehicle reports. Please try again.",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Network error. Please check your connection.",
      });
    } finally {
      setIsLoadingReports(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const validateForm = () => {
    if (!formData.vehicleName.trim()) {
      setMessage({ type: "error", text: "Vehicle name is required" });
      return false;
    }
    if (!formData.vehicleNumber.trim()) {
      setMessage({ type: "error", text: "Vehicle number is required" });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      const payload: any = {
        vehicleName: formData.vehicleName.trim(),
        vehicleNumber: formData.vehicleNumber.trim(),
      };

      if (modalMode === "update" && selectedVehicle?.id) {
        payload.id = selectedVehicle.id;
      }

      const response = await fetch(
        `${BASE_URL}/user-service/vehiclesReportUpdate`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        setMessage({
          type: "success",
          text:
            modalMode === "update"
              ? "Vehicle updated successfully!"
              : "Vehicle added successfully!",
        });

        await fetchVehicles();

        setTimeout(() => {
          closeModal();
        }, 1500);
      } else {
        const errorData = await response.json();
        setMessage({
          type: "error",
          text:
            errorData.message || "Failed to save vehicle. Please try again.",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Network error. Please check your connection and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openAddModal = () => {
    setModalMode("add");
    setSelectedVehicle(null);
    setFormData({
      vehicleName: "",
      vehicleNumber: "",
    });
    setMessage({ type: "", text: "" });
    setIsModalOpen(true);
  };

  const openUpdateModal = (vehicle: Vehicle) => {
    setModalMode("update");
    setSelectedVehicle(vehicle);
    setFormData({
      vehicleName: vehicle.vehicleName || "",
      vehicleNumber: vehicle.vehicleNumber || "",
    });
    setMessage({ type: "", text: "" });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({
      vehicleName: "",
      vehicleNumber: "",
    });
    setSelectedVehicle(null);
    setMessage({ type: "", text: "" });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-6">
      {/* Title and Tabs */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Vehicle Management
        </h1>
        
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-blue-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab("vehicles")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === "vehicles"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Car className="h-4 w-4 inline-block mr-2" />
            All Vehicles
          </button>
          <button
            onClick={() => setActiveTab("reports")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === "reports"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Users className="h-4 w-4 inline-block mr-2" />
            Vehicle Drivers Report
          </button>
        </div>
      </div>

      {/* Message Display */}
      {message.text && !isModalOpen && (
        <div
          className={`flex items-center p-4 rounded-lg mb-6 ${
            message.type === "success"  
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          ) : (
            <XCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          )}
          <span className="text-sm font-medium">{message.text}</span>
        </div>
      )}

      {/* Vehicles Tab Content */}
      {activeTab === "vehicles" && (
        <>
          {/* Vehicles Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {/* Add New Vehicle Box - Always show when loading */}
              <div className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center min-h-[180px] opacity-50">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-3">
                  <Plus className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="text-sm font-medium text-gray-400 mb-1">
                  Add New Vehicle
                </h3>
                <p className="text-xs text-gray-400 text-center">
                  Click to add a new vehicle to your fleet
                </p>
              </div>
              
              {/* Vehicle Skeleton Cards */}
              {Array.from({ length: 8 }).map((_, index) => (
                <VehicleCardSkeleton key={index} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {/* Add New Vehicle Box */}
              <div
                onClick={openAddModal}
                className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 min-h-[180px] group"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-200 transition-colors duration-200">
                  <Plus className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">
                  Add New Vehicle
                </h3>
                <p className="text-xs text-gray-500 text-center">
                  Click to add a new vehicle to your fleet
                </p>
              </div>

              {/* Vehicle Boxes */}
              {vehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 min-h-[180px] flex flex-col justify-between"
                >
                  <div>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                          Vehicle Name
                        </p>
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {vehicle.vehicleName || "N/A"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                          Vehicle Number
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {vehicle.vehicleNumber || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => openUpdateModal(vehicle)}
                      className="w-full flex items-center justify-center px-3 py-2 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-100 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Update
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Vehicle Count */}
          {!isLoading && vehicles.length > 0 && (
            <div className="mt-6 text-center text-sm text-gray-500">
              Total Vehicles: {vehicles.length}
            </div>
          )}
        </>
      )}

      {/* Vehicle Drivers Report Tab Content */}
      {activeTab === "reports" && (
        <>
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by vehicle, driver, or address..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                disabled={isLoadingReports}
              />
            </div>
          </div>

          {/* Reports Content */}
          {isLoadingReports ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 9 }).map((_, index) => (
                <ReportCardSkeleton key={index} />
              ))}
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="text-center py-12">
              <Truck className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? "No reports found" : "No vehicle reports available"}
              </h3>
            </div>
          ) : (
            <>
              {/* Reports Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredReports.map((report, index) => (
                  <div
                    key={`${report.deliveryBoyId}-${index}`}
                    className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Car className="h-5 w-5 text-blue-600" />
                      </div>
                      <span className="text-xs text-gray-400">
                        {formatDate(report.cratedAt)}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                          Driver
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {`${report.firstName} ${report.lastName}`.trim() || "N/A"}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">
                            Vehicle
                          </p>
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {report.vehicleName || "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">
                            Number
                          </p>
                          <p className="text-sm font-medium text-gray-900">
                            {report.vehicleNumber || "N/A"}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                          Market Address
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {report.marketAddress || "N/A"}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">
                            Start Reading
                          </p>
                          <p className="text-sm font-medium text-gray-900">
                            {report.vehicleStartingReading || 0} km
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">
                            End Reading
                          </p>
                          <p className="text-sm font-medium text-gray-900">
                            {report.vehicleEndingReading || 0} km
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">
                            Fuel (Liters)
                          </p>
                          <p className="text-sm font-medium text-gray-900">
                            {report.fuelLiters || 0} L
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">
                            Fuel Cost
                          </p>
                          <p className="text-sm font-medium text-gray-900">
                            ₹{report.fuelCost || 0}
                          </p>
                        </div>
                      </div>

                      {/* Distance Calculation */}
                      <div className="pt-3 border-t border-gray-100">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500 uppercase tracking-wide">
                            Distance Covered
                          </span>
                          <span className="text-sm font-medium text-blue-600">
                            {(report.vehicleEndingReading - report.vehicleStartingReading) || 0} km
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reports Count */}
              <div className="mt-6 text-center text-sm text-gray-500">
                {searchTerm 
                  ? `Found ${filteredReports.length} of ${vehicleReports.length} reports`
                  : `Total Reports: ${vehicleReports.length}`
                }
              </div>
            </>
          )}
        </>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {modalMode === "add" ? "Add New Vehicle" : "Update Vehicle"}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="space-y-6">
                {/* Vehicle Name */}
                <div>
                  <label
                    htmlFor="vehicleName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Vehicle Name *
                  </label>
                  <input
                    type="text"
                    id="vehicleName"
                    name="vehicleName"
                    value={formData.vehicleName}
                    onChange={handleInputChange}
                    placeholder="e.g., Toyota Camry, Honda Civic"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                    required
                  />
                </div>

                {/* Vehicle Number */}
                <div>
                  <label
                    htmlFor="vehicleNumber"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Vehicle Number *
                  </label>
                  <input
                    type="text"
                    id="vehicleNumber"
                    name="vehicleNumber"
                    value={formData.vehicleNumber}
                    onChange={handleInputChange}
                    placeholder="e.g., ABC-1234, XYZ-9876"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                    required
                  />
                </div>

                {/* Message Display in Modal */}
                {message.text && (
                  <div
                    className={`flex items-center p-4 rounded-lg ${
                      message.type === "success"
                        ? "bg-green-50 text-green-800 border border-green-200"
                        : "bg-red-50 text-red-800 border border-red-200"
                    }`}
                  >
                    {message.type === "success" ? (
                      <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                    )}
                    <span className="text-sm font-medium">{message.text}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex flex-col sm:flex-row gap-3 p-6 border-t border-gray-200">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {modalMode === "add" ? "Adding..." : "Updating..."}
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5 mr-2" />
                    {modalMode === "add" ? "Add Vehicle" : "Update Vehicle"}
                  </>
                )}
              </button>

              <button
                onClick={closeModal}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleManagement;