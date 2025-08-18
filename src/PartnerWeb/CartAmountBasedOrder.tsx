import React, { useEffect, useState } from "react";
import { supabase } from "../kart/supabaseClient";

interface Slab {
  id: number;
  min_km: number;
  max_km: number | null;
  min_order_value: number;
  active: boolean;
  created_at: string;
}

export default function WalletEligibilitySlabs() {
  const [slabs, setSlabs] = useState<Slab[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Partial<Slab>>({
    min_km: 0,
    max_km: null,
    min_order_value: 0,
    active: true,
  });
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchSlabs();
  }, []);

  const fetchSlabs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("wallet_eligibility_slabs")
      .select("*")
      .order("min_km", { ascending: true });
    if (!error && data) {
      setSlabs(data as Slab[]);
    }
    setLoading(false);
  };

  const validateForm = () => {
    if (form.min_km === undefined || form.min_km < 0) {
      return "Min KM must be 0 or greater";
    }
    if (form.max_km != null && form.max_km <= (form.min_km ?? 0)) {
  return "Max KM must be greater than Min KM";
}
    if (!form.min_order_value || form.min_order_value < 0) {
      return "Min Order Value must be 0 or greater";
    }
    // Check overlap
    const overlap = slabs.some((s) => {
      if (editingId && s.id === editingId) return false;
      const sMax = s.max_km ?? Infinity;
      const fMax = form.max_km ?? Infinity;
      return (
        form.min_km! < sMax &&
        fMax > s.min_km
      );
    });
    if (overlap) {
      return "KM range overlaps with an existing slab";
    }
    return "";
  };

  const handleSave = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    if (editingId) {
      const { error } = await supabase
        .from("wallet_eligibility_slabs")
        .update({
          min_km: form.min_km,
          max_km: form.max_km,
          min_order_value: form.min_order_value,
          active: form.active,
        })
        .eq("id", editingId);
      if (!error) {
        fetchSlabs();
        setShowModal(false);
      }
    } else {
      const { error } = await supabase.from("wallet_eligibility_slabs").insert([
        {
          min_km: form.min_km,
          max_km: form.max_km,
          min_order_value: form.min_order_value,
          active: form.active,
        },
      ]);
      if (!error) {
        fetchSlabs();
        setShowModal(false);
      }
    }
  };

 const handleDelete = async (id: number) => {
  if (!window.confirm("Delete this slab?")) return;
  const { error } = await supabase
    .from("wallet_eligibility_slabs")
    .delete()
    .eq("id", id);

  if (!error) {
    fetchSlabs();
  }
};


  const openModal = (slab?: Slab) => {
    if (slab) {
      setForm(slab);
      setEditingId(slab.id);
    } else {
      setForm({ min_km: 0, max_km: null, min_order_value: 0, active: true });
      setEditingId(null);
    }
    setError("");
    setShowModal(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-bold">Based on KM and Order Value</h1>
        <button
          onClick={() => openModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Slab
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="table-auto w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Min KM</th>
              <th className="border px-4 py-2">Max KM</th>
              <th className="border px-4 py-2">Min Order Value</th>
              <th className="border px-4 py-2">Active</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {slabs.map((slab) => (
              <tr key={slab.id}>
                <td className="border px-4 py-2">{slab.min_km}</td>
                <td className="border px-4 py-2">
                  {slab.max_km !== null ? slab.max_km : "∞"}
                </td>
                <td className="border px-4 py-2">{slab.min_order_value}</td>
                <td className="border px-4 py-2">
                  {slab.active ? "Yes" : "No"}
                </td>
                <td className="border px-4 py-2 space-x-2">
                  <button
                    onClick={() => openModal(slab)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(slab.id)}
                    className="bg-red-600 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-96">
            <h2 className="text-lg font-bold mb-4">
              {editingId ? "Edit Slab" : "Add Slab"}
            </h2>
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            <div className="mb-2">
              <label className="block">Min KM</label>
              <input
                type="number"
                className="border p-2 w-full"
                value={form.min_km ?? ""}
                onChange={(e) =>
                  setForm({ ...form, min_km: Number(e.target.value) })
                }
              />
            </div>
            <div className="mb-2">
              <label className="block">Max KM (leave empty for ∞)</label>
              <input
                type="number"
                className="border p-2 w-full"
                value={form.max_km ?? ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    max_km: e.target.value
                      ? Number(e.target.value)
                      : null,
                  })
                }
              />
            </div>
            <div className="mb-2">
              <label className="block">Min Order Value</label>
              <input
                type="number"
                className="border p-2 w-full"
                value={form.min_order_value ?? ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    min_order_value: Number(e.target.value),
                  })
                }
              />
            </div>
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={form.active ?? false}
                  onChange={(e) =>
                    setForm({ ...form, active: e.target.checked })
                  }
                />
                Active
              </label>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
