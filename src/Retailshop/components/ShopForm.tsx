import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';

interface ShopFormProps {
  onShopAdded: () => void;
}

const ShopForm: React.FC<ShopFormProps> = ({ onShopAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    contactNumber: '',
    locationUrl: '',
    description: '',
    category: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const { name, contactNumber, locationUrl, description, category } = formData;

    if (!name || !contactNumber || !locationUrl || !description || !category) {
      alert('Please fill in all fields');
      return;
    }

    const data = new FormData();
    data.append('name', name);
    data.append('contactNumber', contactNumber);
    data.append('locationUrl', locationUrl);
    data.append('description', description);
    data.append('category', category);
    data.append('id', '56');
    if (imageFile) {
      data.append('image', imageFile);
    }

    try {
      await axios.post('https://meta.oxyloans.com/api/riceapp-service', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization:
            'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJlYzY3OTExYS1iMmIzLTQ3OTMtODZiMy00ZDIxMjg4ODZmYWYiLCJpYXQiOjE3NDkyOTczNzAsImV4cCI6MTc1MDE2MTM3MH0.JVsP0oQxLC0d3TbGozrmcDCvNPmZZC8yW6htCODbdLX2OccSbQWX68SOsxtyeNPPZ47vtfRNEf-VeJ1rpn-k6g',
        },
      });

      alert('✅ Shop added successfully!');
      onShopAdded();
    } catch (error) {
      console.error('Error uploading shop:', error);
      alert('❌ Failed to upload shop. Check the console for more details.');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto bg-white p-6 shadow-md rounded-md space-y-4"
    >
      <h2 className="text-2xl font-bold text-center text-purple-700">Add Shop</h2>

      <input
        type="text"
        name="name"
        placeholder="Shop Name"
        value={formData.name}
        onChange={handleChange}
        className="w-full p-2 border rounded-md"
      />

      <input
        type="text"
        name="contactNumber"
        placeholder="Contact Number"
        value={formData.contactNumber}
        onChange={handleChange}
        className="w-full p-2 border rounded-md"
      />

      <input
        type="text"
        name="locationUrl"
        placeholder="Location URL"
        value={formData.locationUrl}
        onChange={handleChange}
        className="w-full p-2 border rounded-md"
      />

      <select
  name="category"
  value={formData.category}
  onChange={handleChange}
  className="w-full p-2 border rounded-md"
>
  <option value="">Select Category</option>
  <option value="Shop">Shop</option>
  <option value="Mill">Mill</option>
  <option value="Trader">Trader</option>
</select>

      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        className="w-full p-2 border rounded-md"
        rows={3}
      />

      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="w-full"
      />

      <button
        type="submit"
        className="w-full bg-purple-700 text-white py-2 rounded hover:bg-purple-800 transition"
      >
        Submit
      </button>
    </form>
  );
};

export default ShopForm;
