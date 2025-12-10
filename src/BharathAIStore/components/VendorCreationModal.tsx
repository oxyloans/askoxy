import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import BASE_URL from "../../Config";

interface VendorCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VendorCreationModal: React.FC<VendorCreationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [accountHolder, setAccountHolder] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [pan, setPan] = useState("");
  const [remarks, setRemarks] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const userId = localStorage.getItem("userId") || "";
  const token = localStorage.getItem("accessToken") || localStorage.getItem("token") || "";

  useEffect(() => {
    if (isOpen && userId) {
      getVendorId();
    }
  }, [isOpen, userId]);

  const getVendorId = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/ai-service/vendorDetails?userId=${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (response.ok && data.vendorId) {
        const statusResponse = await fetch(
          `${BASE_URL}/ai-service/getVendorStatus?vendorId=${data.vendorId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const vendorStatusData = await statusResponse.json();
        if (
          statusResponse.ok &&
          vendorStatusData.status !== "BANK_VALIDATION_FAILED"
        ) {
          setAccountHolder(vendorStatusData?.bank?.account_holder || "");
          setAccountNumber(vendorStatusData?.bank?.account_number || "");
          setIfsc(vendorStatusData?.bank?.ifsc || "");
          const panDoc = vendorStatusData?.related_docs?.find(
            (doc: any) => doc.doc_name === "PAN"
          );
          setPan(panDoc?.doc_value || "");
        } else {
          setRemarks(vendorStatusData?.remarks || "");
           setAccountHolder(vendorStatusData?.bank?.account_holder || "");
          setAccountNumber(vendorStatusData?.bank?.account_number || "");
          setIfsc(vendorStatusData?.bank?.ifsc || "");
          const panDoc = vendorStatusData?.related_docs?.find(
            (doc: any) => doc.doc_name === "PAN"
          );
          setPan(panDoc?.doc_value || "");
        }
      }
    } catch (error) {
      console.error("Error fetching vendor details:", error);
    }
  };

  const validateFields = () => {
    const newErrors: Record<string, string> = {};
    if (!accountHolder.trim())
      newErrors.accountHolder = "Account holder name is required";
    if (!/^[0-9]{8,20}$/.test(accountNumber))
      newErrors.accountNumber = "Enter valid account number (8-20 digits)";
    if (!ifsc.trim()) {
      newErrors.ifsc = "IFSC code is required";
    } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc.trim().toUpperCase())) {
      newErrors.ifsc = "Enter valid IFSC (e.g., YESB0000262)";
    }
    if (!pan.trim()) {
      newErrors.pan = "PAN number is required";
    } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan.trim().toUpperCase())) {
      newErrors.pan = "Enter valid PAN (e.g., ABCPV1234D)";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateFields()) return;

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/ai-service/createVendor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bank: {
            account_holder: accountHolder.trim(),
            account_number: accountNumber.trim(),
            ifsc: ifsc.toUpperCase().trim(),
          },
          dashboard_access: true,
          kyc_details: {
            pan: pan.toUpperCase().trim(),
          },
          userId,
          verify_account: true,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to create vendor");
      }
      alert("Success: Vendor KYC details captured.");
      getVendorId();
    } catch (error: any) {
      alert("Error: " + (error.message || "Something went wrong"));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto m-4">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Vendor Creation</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Account Holder Name
            </label>
            <input
              type="text"
              value={accountHolder}
              onChange={(e) => setAccountHolder(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Account Holder Name"
            />
            {errors.accountHolder && (
              <p className="text-red-600 text-xs mt-1">{errors.accountHolder}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Account Number
            </label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Account Number"
            />
            {errors.accountNumber && (
              <p className="text-red-600 text-xs mt-1">{errors.accountNumber}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              IFSC Code
            </label>
            <input
              type="text"
              value={ifsc}
              onChange={(e) => setIfsc(e.target.value.toUpperCase())}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="IFSC Code"
            />
            {errors.ifsc && (
              <p className="text-red-600 text-xs mt-1">{errors.ifsc}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              PAN Number
            </label>
            <input
              type="text"
              value={pan}
              onChange={(e) => setPan(e.target.value.toUpperCase())}
              maxLength={10}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="PAN Number"
            />
            {errors.pan && (
              <p className="text-red-600 text-xs mt-1">{errors.pan}</p>
            )}
          </div>

          {remarks && (
            <p className="text-red-600 text-sm text-center">{remarks}</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Submitting..." : "Create Vendor"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VendorCreationModal;
