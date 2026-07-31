import React, { useEffect, useState } from "react";

type GlobalConfigResponse = {
  config?: Record<string, string | number>;
};

const DELIVERY_API_BASE = "https://deliverydistance.onrender.com";
const CONFIG_ENDPOINT = `${DELIVERY_API_BASE}/api/delivery/config`;

export default function DistanceConfig() {
  const [distance, setDistance] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [skipped, setSkipped] = useState<string[]>([]);

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

  useEffect(() => {
    loadDistance();
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

  return (
    <div className="p-6 max-w-xl">
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
    </div>
  );
}
