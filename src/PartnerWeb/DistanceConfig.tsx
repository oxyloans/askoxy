import React, { useEffect, useState } from "react";

type GlobalConfigResponse = {
  config?: Record<string, string | number>;
};

type DeliveryMessageRow = {
  code: string;
  message: string;
  active?: boolean;
  updated_at?: string;
};

type DeliveryMessagesResponse = {
  messages?: Record<string, string>;
  rows?: DeliveryMessageRow[];
};

const DELIVERY_API_BASE = "https://deliverydistance.onrender.com";
const CONFIG_ENDPOINT = `${DELIVERY_API_BASE}/api/delivery/config`;
const MESSAGES_ENDPOINT = `${DELIVERY_API_BASE}/api/delivery/messages`;
const DELIVERY_MESSAGE_CODES = [
  "NO_ACTIVE_STORES",
  "OUT_OF_SERVICE_RANGE",
  "NO_DELIVERY_FEE",
  "DELIVERY_FEE_AVAILABLE",
];

export default function DistanceConfig() {
  const [distance, setDistance] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [skipped, setSkipped] = useState<string[]>([]);
  const [deliveryMessages, setDeliveryMessages] = useState<Record<string, string>>({});
  const [messageRows, setMessageRows] = useState<DeliveryMessageRow[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [savingMessages, setSavingMessages] = useState(false);
  const [messageError, setMessageError] = useState("");
  const [messageStatus, setMessageStatus] = useState("");
  const [feeLat, setFeeLat] = useState("");
  const [feeLng, setFeeLng] = useState("");
  const [feeLoading, setFeeLoading] = useState(false);
  const [feeResult, setFeeResult] = useState<string>("");
  const [feeError, setFeeError] = useState("");

  const loadDistance = async () => {
    setLoading(true);
    setError("");
    setMessage("");
    setSkipped([]);

    try {
      const response = await fetch(CONFIG_ENDPOINT, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to load config: ${response.status}`);
      }

      const data = (await response.json()) as GlobalConfigResponse;
      const currentDistance = data.config?.max_distance_km;
      setDistance(currentDistance != null ? String(currentDistance) : "");
      setMessage("Current distance loaded");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load distance");
    } finally {
      setLoading(false);
    }
  };

  const loadDeliveryMessages = async () => {
    setLoadingMessages(true);
    setMessageError("");
    setMessageStatus("");

    try {
      const response = await fetch(MESSAGES_ENDPOINT, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to load delivery messages: ${response.status}`);
      }

      const data = (await response.json()) as DeliveryMessagesResponse;
      setDeliveryMessages(data.messages || {});
      setMessageRows(Array.isArray(data.rows) ? data.rows : []);
      setMessageStatus("Delivery messages loaded");
    } catch (err) {
      setMessageError(err instanceof Error ? err.message : "Failed to load delivery messages");
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    loadDistance();
    loadDeliveryMessages();
  }, []);

  const handleSave = async () => {
    const parsed = Number(distance);

    if (!distance.trim() || Number.isNaN(parsed) || parsed < 0) {
      setError("Please enter a valid distance value");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");
    setSkipped([]);

    try {
      const response = await fetch(CONFIG_ENDPOINT, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key: "max_distance_km",
          value: parsed,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || `Failed to update config: ${response.status}`);
      }

      setMessage(data.message || "Distance updated successfully");
      setSkipped(Array.isArray(data.skipped) ? data.skipped : []);

      const updatedDistance = data.config?.max_distance_km;
      if (updatedDistance != null) {
        setDistance(String(updatedDistance));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update distance");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveMessage = async (code: string) => {
    const currentMessage = deliveryMessages[code]?.trim();

    if (!currentMessage) {
      setMessageError(`Please enter a message for ${code}`);
      return;
    }

    setSavingMessages(true);
    setMessageError("");
    setMessageStatus("");

    try {
      const response = await fetch(MESSAGES_ENDPOINT, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          message: currentMessage,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || `Failed to update message: ${response.status}`);
      }

      setMessageStatus(data.message || `${code} updated successfully`);
      if (data.messages) {
        setDeliveryMessages((prev) => ({ ...prev, ...data.messages }));
      }
      await loadDeliveryMessages();
    } catch (err) {
      setMessageError(err instanceof Error ? err.message : "Failed to update delivery message");
    } finally {
      setSavingMessages(false);
    }
  };

  const handleCheckFee = async () => {
    const lat = Number(feeLat);
    const lng = Number(feeLng);

    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      setFeeError("Please enter valid latitude and longitude values");
      return;
    }

    setFeeLoading(true);
    setFeeError("");
    setFeeResult("");

    try {
      const response = await fetch(`${DELIVERY_API_BASE}/api/delivery/calculate-distance-fee`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userLat: lat,
          userLng: lng,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || `Failed to calculate distance fee: ${response.status}`);
      }

      setFeeResult(JSON.stringify(data, null, 2));
    } catch (err) {
      setFeeError(err instanceof Error ? err.message : "Failed to calculate distance fee");
    } finally {
      setFeeLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Distance Config</h1>
          <p className="text-sm text-gray-500">Show and update `max_distance_km`</p>
        </div>
        <button
          type="button"
          onClick={loadDistance}
          className="rounded bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
        >
          Refresh
        </button>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        {loading ? (
          <p className="text-sm text-gray-500">Loading current distance...</p>
        ) : (
          <>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Max Distance KM
            </label>
            <input
              type="number"
              min={0}
              step="0.01"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
              placeholder="Enter max distance in KM"
            />

            <div className="mt-4 flex items-center gap-3">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving..." : "Update Distance"}
              </button>
              <button
                type="button"
                onClick={loadDistance}
                className="rounded bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
              >
                Reload
              </button>
            </div>

            {message ? (
              <p className="mt-4 text-sm text-green-600">{message}</p>
            ) : null}

            {skipped.length > 0 ? (
              <p className="mt-2 text-sm text-amber-600">
                Skipped keys: {skipped.join(", ")}
              </p>
            ) : null}

            {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
          </>
        )}
      </div>

      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Delivery Messages</h2>
            <p className="text-sm text-gray-500">
              Messages used by `/api/delivery/calculate-distance-fee`
            </p>
          </div>
          <button
            type="button"
            onClick={loadDeliveryMessages}
            className="rounded bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            Refresh Messages
          </button>
        </div>

        {loadingMessages ? (
          <p className="text-sm text-gray-500">Loading delivery messages...</p>
        ) : (
          <div className="space-y-4">
            {DELIVERY_MESSAGE_CODES.map((code) => (
              <div key={code} className="rounded border border-gray-200 p-4">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{code}</p>
                    <p className="text-xs text-gray-500">
                      {messageRows.find((row) => row.code === code)?.active === false
                        ? "Inactive"
                        : "Active"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSaveMessage(code)}
                    disabled={savingMessages}
                    className="rounded bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {savingMessages ? "Saving..." : "Save"}
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={deliveryMessages[code] || ""}
                  onChange={(e) =>
                    setDeliveryMessages((prev) => ({
                      ...prev,
                      [code]: e.target.value,
                    }))
                  }
                  className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                  placeholder={`Enter message for ${code}`}
                />
              </div>
            ))}

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={loadDeliveryMessages}
                className="rounded bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
              >
                Reload Messages
              </button>
            </div>

            {messageStatus ? <p className="text-sm text-green-600">{messageStatus}</p> : null}
            {messageError ? <p className="text-sm text-red-600">{messageError}</p> : null}
          </div>
        )}
      </div>

      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Distance Fee API Tester</h2>
          <p className="text-sm text-gray-500">
            Test `/api/delivery/calculate-distance-fee` with live coordinates
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Latitude</label>
            <input
              type="number"
              step="0.000001"
              value={feeLat}
              onChange={(e) => setFeeLat(e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
              placeholder="Enter latitude"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Longitude</label>
            <input
              type="number"
              step="0.000001"
              value={feeLng}
              onChange={(e) => setFeeLng(e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
              placeholder="Enter longitude"
            />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={handleCheckFee}
            disabled={feeLoading}
            className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {feeLoading ? "Checking..." : "Check Fee"}
          </button>
        </div>

        {feeError ? <p className="mt-4 text-sm text-red-600">{feeError}</p> : null}

        {feeResult ? (
          <pre className="mt-4 overflow-auto rounded border border-gray-200 bg-gray-50 p-4 text-xs text-gray-800">
            {feeResult}
          </pre>
        ) : null}
      </div>
    </div>
  );
}
