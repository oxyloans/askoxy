import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface Shop {
  id: string;
  name: string;
  contactNumber: string;
  locationUrl: string;
  description: string;
  category: string;
  imageUrl?: string;
}

export default function ShopListPage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [filteredShops, setFilteredShops] = useState<Shop[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [loading, setLoading] = useState(false);

  const BASE_URL = 'https://meta.oxyloans.com/api/riceapp-service';
  const IMAGE_URL = 'https://oxybricksv1test.s3.ap-south-1.amazonaws.com/null/';
  const TOKEN = `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJlYzY3OTExYS1iMmIzLTQ3OTMtODZiMy00ZDIxMjg4ODZmYWYiLCJpYXQiOjE3NDkyOTczNzAsImV4cCI6MTc1MDE2MTM3MH0.JVsP0oQxLC0d3TbGozrmcDCvNPmZZC8yW6htCODbdLX2OccSbQWX68SOsxtyeNPPZ47vtfRNEf-VeJ1rpn-k6g`;



const fetchShops = useCallback(async () => {
  setLoading(true);
  try {
    const res = await axios.get(BASE_URL, {
      headers: { Authorization: TOKEN },
    });

    let shopsData: Shop[] = [];

    // Case 1: API returns a plain array
    if (Array.isArray(res.data)) {
      shopsData = res.data as Shop[];

    // Case 2: API returns { data: [...] }
    } 
    else if (
  res.data &&
  typeof res.data === 'object' &&
  Array.isArray((res.data as { data: unknown }).data)
) {
  shopsData = (res.data as { data: Shop[] }).data;
}

    else {
      console.warn("Unexpected API response:", res.data);
    }

    const dataWithImages = shopsData.map((shop) => ({
      ...shop,
      imageUrl: shop.imageUrl?.startsWith('http')
        ? shop.imageUrl
        : `${IMAGE_URL}${shop.imageUrl}`,
    }));

    setShops(dataWithImages);
    setFilteredShops(dataWithImages);
  } catch (error) {
    console.error('Error fetching shops:', error);
    alert('Failed to fetch shops');
  } finally {
    setLoading(false);
  }
}, []);






  useEffect(() => {
    fetchShops();
  }, [fetchShops]);

  useEffect(() => {
    let filtered = [...shops];
    if (categoryFilter !== 'All') {
      filtered = filtered.filter(
        (shop) => shop.category?.toLowerCase() === categoryFilter.toLowerCase()
      );
    }
    if (searchTerm.trim()) {
      filtered = filtered.filter((shop) =>
        shop.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredShops(filtered);
  }, [searchTerm, categoryFilter, shops]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this shop?')) return;
    try {
      await axios.delete(`${BASE_URL}/${id}`, {
        headers: { Authorization: TOKEN },
      });
      fetchShops();
    } catch (err) {
      console.error(err);
      alert('Failed to delete shop');
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-purple-800 text-center mb-2">🏬 All Shops</h1>
      <p className="text-center mb-6 text-gray-600">Total: {filteredShops.length}</p>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="🔍 Search by name"
          className="w-full sm:w-1/2 px-4 py-2 border rounded shadow"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full sm:w-1/3 px-4 py-2 border rounded shadow"
        >
          <option value="All">All Categories</option>
          <option value="Shop">Shop</option>
          <option value="Traders">Traders</option>
          <option value="Mills">Mills</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center mt-12">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredShops.map((shop) => (
            <div key={shop.id} className="bg-white p-4 rounded shadow border">
              {shop.imageUrl ? (
                <img
                  src={shop.imageUrl}
                  alt={shop.name}
                  className="w-full h-48 object-cover rounded mb-2"
                />
              ) : (
                <p className="italic text-center text-gray-500 mb-2">❌ No Image</p>
              )}

              <h2 className="text-xl font-semibold text-purple-700">
                {shop.name} ({shop.category})
              </h2>
              <p className="text-gray-700 mt-1">📞 {shop.contactNumber}</p>
              <a
                href={shop.locationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline block mt-1"
              >
                📍 View Location
              </a>
              <div className="bg-gray-100 p-2 mt-2 rounded">
                <strong>📝 Description:</strong>
                <p className="text-sm text-gray-700">{shop.description}</p>
              </div>

              <div className="flex justify-between mt-4">
                <Link
                  to={`/shop-edit/${shop.id}`}
                  className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-500"
                >
                  ✏️ Edit
                </Link>
                <button
                  onClick={() => handleDelete(shop.id)}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-500"
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

