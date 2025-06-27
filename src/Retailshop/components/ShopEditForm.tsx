// import React, { useState } from 'react';
// import axios from 'axios';

// interface Shop {
//   id: string;
//   name: string;
//   contactNumber: string;
//   locationUrl: string;
//   description: string;
// }

// interface ShopEditFormProps {
//   shop: Shop;
//   onCancel: () => void;
//   onSave: () => void;
// }

// const AUTH_TOKEN =
//   'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJlYzY3OTExYS1iMmIzLTQ3OTMtODZiMy00ZDIxMjg4ODZmYWYiLCJpYXQiOjE3NDkyOTczNzAsImV4cCI6MTc1MDE2MTM3MH0.JVsP0oQxLC0d3TbGozrmcDCvNPmZZC8yW6htCODbdLX2OccSbQWX68SOsxtyeNPPZ47vtfRNEf-VeJ1rpn-k6g';

// const ShopEditForm: React.FC<ShopEditFormProps> = ({ shop, onCancel, onSave }) => {
//   const [form, setForm] = useState({
//     name: shop.name,
//     contactNumber: shop.contactNumber,
//     locationUrl: shop.locationUrl,
//     description: shop.description,
//     image: null as File | null,
//   });

//   const [loading, setLoading] = useState(false);

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0] || null;
//     setForm((prev) => ({ ...prev, image: file }));
//   };

//   const handleSubmit = async () => {
//     if (!form.name.trim()) {
//       alert('Shop name is required');
//       return;
//     }

//     try {
//       setLoading(true);
//       const formData = new FormData();

//       formData.append('name', form.name);
//       formData.append('contactNumber', form.contactNumber);
//       formData.append('locationUrl', form.locationUrl);
//       formData.append('description', form.description);

//       if (form.image) {
//         formData.append('image', form.image);
//       }

//       await axios.put(
//         `https://meta.oxyloans.com/api/riceapp-service/${shop.id}`,
//         formData,
//         {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//             Authorization: AUTH_TOKEN,
//           },
//         }
//       );

//       alert('✅ Shop updated successfully!');
//       onSave();
//     } 
//    catch (error) {
//   const err = error as unknown as { response?: { data?: { message?: string } } };
//   console.error('❌ Update error:', err);
//   alert(err?.response?.data?.message || 'Something went wrong while updating.');
// }

//     finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
//       <h2 className="text-2xl font-bold text-purple-700 mb-6">Edit Shop</h2>

//       <input
//         name="name"
//         value={form.name}
//         onChange={handleChange}
//         placeholder="Shop Name"
//         className="w-full p-3 mb-4 border rounded"
//       />

//       <input
//         name="contactNumber"
//         value={form.contactNumber}
//         onChange={handleChange}
//         placeholder="Contact Number"
//         className="w-full p-3 mb-4 border rounded"
//       />

//       <input
//         name="locationUrl"
//         value={form.locationUrl}
//         onChange={handleChange}
//         placeholder="Location URL"
//         className="w-full p-3 mb-4 border rounded"
//       />

//       <textarea
//         name="description"
//         value={form.description}
//         onChange={handleChange}
//         placeholder="Description"
//         rows={4}
//         className="w-full p-3 mb-4 border rounded"
//       />

//       <input
//         type="file"
//         onChange={handleFileChange}
//         className="mb-4"
//         accept="image/*"
//       />

//       <div className="flex gap-4">
//         <button
//           onClick={handleSubmit}
//           disabled={loading}
//           className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800"
//         >
//           {loading ? 'Updating...' : 'Update Shop'}
//         </button>

//         <button
//           onClick={onCancel}
//           className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
//         >
//           Cancel
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ShopEditForm;




import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

interface Shop {
  id: number;
  name: string;
  contactNumber: string;
  locationUrl: string;
  description: string;
  imageUrl?: string;
  category:string;
}

const AUTH_TOKEN =
  'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJlYzY3OTExYS1iMmIzLTQ3OTMtODZiMy00ZDIxMjg4ODZmYWYiLCJpYXQiOjE3NDkyOTczNzAsImV4cCI6MTc1MDE2MTM3MH0.JVsP0oQxLC0d3TbGozrmcDCvNPmZZC8yW6htCODbdLX2OccSbQWX68SOsxtyeNPPZ47vtfRNEf-VeJ1rpn-k6g';

export default function ShopEditForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    contactNumber: '',
    locationUrl: '',
    description: '',
    image: null as File | null,
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Fetch shop data by ID
//   useEffect(() => {
//     const fetchShop = async () => {
//         console.log("into the fetch call");
//       try {
//         const res = await axios.get(`https://meta.oxyloans.com/api/riceapp-service`, {
//           headers: { Authorization: AUTH_TOKEN },
//         });
//        console.log("get call ",res);
    
   
//         const shop: Shop = res.data;

//         setForm((prev) => ({
//           ...prev,
//           name: shop.name,
//           contactNumber: shop.contactNumber,
//           locationUrl: shop.locationUrl,
//           description: shop.description,
//         }));
//       } catch (err) {
//         alert('❌ Failed to load shop data');
//         console.error(err);
//       } finally {
//         setFetching(false);
//       }
//     };

//     fetchShop();
//   }, [id]);

useEffect(() => {
  const fetchShop = async () => {
    try {
      const res = await axios.get(`https://meta.oxyloans.com/api/riceapp-service`, {
        headers: { Authorization: AUTH_TOKEN },
      });

      const shops = res.data as Shop[];

      const numericId = Number(id); // ✅ Fix the type mismatch

      const shop = shops.find((s) => s.id === numericId);

      if (shop) {
        setForm((prev) => ({
          ...prev,
          name: shop.name,
          contactNumber: shop.contactNumber,
          locationUrl: shop.locationUrl,
          description: shop.description,
          imageUrl: shop.imageUrl,
          category: shop.category,
        }));
      } else {
        alert("❌ No shop found with the provided ID");
      }
    } catch (err) {
      alert("❌ Failed to load shop data");
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  fetchShop();
}, [id]);



  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm((prev) => ({ ...prev, image: file }));
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      alert('Shop name is required');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('contactNumber', form.contactNumber);
      formData.append('locationUrl', form.locationUrl);
      formData.append('description', form.description);
      if (form.image) {
        formData.append('image', form.image);
      }

       const res =await axios.put(
        `https://meta.oxyloans.com/api/riceapp-service/${id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: AUTH_TOKEN,
          },
        }
      );
      console.log("updte call response",res);
      
      alert('✅ Shop updated successfully!');
      navigate('/shop-list');
    } catch (error) {
    //   const err = error as any;
    //   alert(error?.response?.data?.message || 'Something went wrong while updating.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="text-center mt-12">Loading...</div>;

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold text-purple-700 mb-6">Edit Shop</h2>

      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Shop Name"
        className="w-full p-3 mb-4 border rounded"
      />
      <input
        name="contactNumber"
        value={form.contactNumber}
        onChange={handleChange}
        placeholder="Contact Number"
        className="w-full p-3 mb-4 border rounded"
      />
      <input
        name="locationUrl"
        value={form.locationUrl}
        onChange={handleChange}
        placeholder="Location URL"
        className="w-full p-3 mb-4 border rounded"
      />
      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description"
        rows={4}
        className="w-full p-3 mb-4 border rounded"
      />
      <input
        type="file"
        onChange={handleFileChange}
        className="mb-4"
        accept="image/*"
      />

      <div className="flex gap-4">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800"
        >
          {loading ? 'Updating...' : 'Update Shop'}
        </button>

        <button
          onClick={() => navigate('/shop-list')}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

