import React from 'react';
import { useNavigate } from 'react-router-dom';
import ShopForm from '../components/ShopForm';

const ShopFormPage: React.FC = () => {
  const navigate = useNavigate();

  const handleShopAdded = () => {
    navigate('/shop-list');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-bold text-purple-800 text-center mb-4">Add Shop</h2>

      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
        <ShopForm onShopAdded={handleShopAdded} />
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={() => navigate('/shop-list')}
          className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800"
        >
          View All Shops
        </button>
      </div>
    </div>
  );
};

export default ShopFormPage;


