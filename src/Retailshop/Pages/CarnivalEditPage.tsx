// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useParams, useNavigate } from 'react-router-dom';

// interface Carnival {
//   id: number;
//   title: string;
//   location: string;
//   date: string;
//   description: string;
//   imageUrl: string;
// }

// const CarnivalEditPage: React.FC = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [form, setForm] = useState<Carnival>({
//     id: Number(id),
//     title: '',
//     location: '',
//     date: '',
//     description: '',
//     imageUrl: '',
//   });
//   const [loading, setLoading] = useState<boolean>(true);

//   const AUTH_TOKEN = `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJlYzY3OTExYS1iMmIzLTQ3OTMtODZiMy00ZDIxMjg4ODZmYWYiLCJpYXQiOjE3NDkyOTczNzAsImV4cCI6MTc1MDE2MTM3MH0.JVsP0oQxLC0d3TbGozrmcDCvNPmZZC8yW6htCODbdLX2OccSbQWX68SOsxtyeNPPZ47vtfRNEf-VeJ1rpn-k6g`;

//   useEffect(() => {
//     const fetchCarnival = async () => {
//       try {
//         const response = await axios.get<Carnival>(
//           `https://meta.oxyloans.com/api/riceapp-service/carnivals/${id}`,
//           {
//             headers: { Authorization: AUTH_TOKEN },
//           }
//         );
//         setForm(response.data);
//       } catch (error) {
//         alert('❌ Failed to fetch carnival details');
//         console.error(error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) {
//       fetchCarnival();
//     }
//   }, [id]);

//   const handleChange = (key: keyof Carnival, value: string) => {
//     setForm((prev) => ({ ...prev, [key]: value }));
//   };

//   const handleUpdate = async () => {
//     try {
//       await axios.put(
//         `https://meta.oxyloans.com/api/riceapp-service/carnivals/${form.id}`,
//         form,
//         {
//           headers: { Authorization: AUTH_TOKEN },
//         }
//       );
//       alert('✅ Carnival updated successfully');
//       navigate('/carnival-list');
//     } catch (err) {
//       alert('❌ Error updating carnival');
//       console.error('Update error:', err);
//     }
//   };

//   if (loading) {
//     return <p className="text-center mt-10 text-gray-500">Loading carnival data...</p>;
//   }

//   return (
//     <div className="max-w-xl mx-auto p-4">
//       <h2 className="text-2xl font-bold text-purple-800 mb-4">Edit Carnival</h2>

//       <input
//         className="w-full p-2 mb-3 border border-gray-300 rounded"
//         placeholder="Title"
//         value={form.title}
//         onChange={(e) => handleChange('title', e.target.value)}
//       />
//       <input
//         className="w-full p-2 mb-3 border border-gray-300 rounded"
//         placeholder="Location"
//         value={form.location}
//         onChange={(e) => handleChange('location', e.target.value)}
//       />
//       <input
//         className="w-full p-2 mb-3 border border-gray-300 rounded"
//         type="date"
//         value={form.date}
//         onChange={(e) => handleChange('date', e.target.value)}
//       />
//       <textarea
//         className="w-full p-2 mb-3 border border-gray-300 rounded"
//         placeholder="Description"
//         value={form.description}
//         onChange={(e) => handleChange('description', e.target.value)}
//       />
//       <input
//         className="w-full p-2 mb-3 border border-gray-300 rounded"
//         placeholder="Image URL"
//         value={form.imageUrl}
//         onChange={(e) => handleChange('imageUrl', e.target.value)}
//       />

//       <button
//         onClick={handleUpdate}
//         className="w-full bg-purple-800 text-white py-2 rounded hover:bg-purple-700"
//       >
//         Update Carnival
//       </button>
//     </div>
//   );
// };

// export default CarnivalEditPage;









// import React, { useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import axios from 'axios';

// interface Carnival {
//   id: number;
//   title: string;
//   location: string;
//   date: string;
//   description: string;
//   imageUrl: string;
// }

// const CarnivalEditPage: React.FC = () => {
//   const { state } = useLocation(); // 👈 read carnival object from navigation state
//   const navigate = useNavigate();

//   const AUTH_TOKEN = `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJlYzY3OTExYS1iMmIzLTQ3OTMtODZiMy00ZDIxMjg4ODZmYWYiLCJpYXQiOjE3NDkyOTczNzAsImV4cCI6MTc1MDE2MTM3MH0.JVsP0oQxLC0d3TbGozrmcDCvNPmZZC8yW6htCODbdLX2OccSbQWX68SOsxtyeNPPZ47vtfRNEf-VeJ1rpn-k6g`;

//   const carnival = state as Carnival;

//   const [form, setForm] = useState<Carnival>({
//     id: carnival.id,
//     title: carnival.title,
//     location: carnival.location,
//     date: carnival.date,
//     description: carnival.description,
//     imageUrl: carnival.imageUrl || "",
//   });

//   const handleChange = (key: keyof Carnival, value: string) => {
//     setForm((prev) => ({ ...prev, [key]: value }));
//   };

//   const handleUpdate = async () => {
//     try {
//       await axios.put(
//         `https://meta.oxyloans.com/api/riceapp-service/carnivals/${form.id}`,
//         form,
//         {
//           headers: {
//             Authorization: AUTH_TOKEN,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       alert('✅ Carnival updated successfully');
//       navigate('/carnival-list');
//     } catch (err) {
//       alert('❌ Error updating carnival');
//       console.error('Update error:', err);
//     }
//   };

//   if (!state) {
//     return (
//       <p className="text-center mt-10 text-red-600">
//         ❌ Carnival data not found. Please go back to the list and try again.
//       </p>
//     );
//   }

//   return (
//     <div className="max-w-xl mx-auto p-4">
//       <h2 className="text-2xl font-bold text-purple-800 mb-4">Edit Carnival</h2>

//       <input
//         className="w-full p-2 mb-3 border border-gray-300 rounded"
//         placeholder="Title"
//         value={form.title}
//         onChange={(e) => handleChange('title', e.target.value)}
//       />
//       <input
//         className="w-full p-2 mb-3 border border-gray-300 rounded"
//         placeholder="Location"
//         value={form.location}
//         onChange={(e) => handleChange('location', e.target.value)}
//       />
//       <input
//         className="w-full p-2 mb-3 border border-gray-300 rounded"
//         type="date"
//         value={form.date}
//         onChange={(e) => handleChange('date', e.target.value)}
//       />
//       <textarea
//         className="w-full p-2 mb-3 border border-gray-300 rounded"
//         placeholder="Description"
//         value={form.description}
//         onChange={(e) => handleChange('description', e.target.value)}
//       />
//       <input
//         className="w-full p-2 mb-3 border border-gray-300 rounded"
//         placeholder="Image URL"
//         value={form.imageUrl}
//         onChange={(e) => handleChange('imageUrl', e.target.value)}
//       />

//       <button
//         onClick={handleUpdate}
//         className="w-full bg-purple-800 text-white py-2 rounded hover:bg-purple-700"
//       >
//         Update Carnival
//       </button>
//     </div>
//   );
// };

// export default CarnivalEditPage;






import React, { useState, ChangeEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Carnival {
  id: number;
  title: string;
  description: string;
  location: string;
  date: string;
  imageUrl?: string;
}

const CarnivalEditPage: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const carnival = state as Carnival;

  const [form, setForm] = useState({
    title: carnival.title,
    location: carnival.location,
    date: carnival.date,
    description: carnival.description,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | undefined>(carnival.imageUrl);

  const AUTH_TOKEN = `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJlYzY3OTExYS1iMmIzLTQ3OTMtODZiMy00ZDIxMjg4ODZmYWYiLCJpYXQiOjE3NDkyOTczNzAsImV4cCI6MTc1MDE2MTM3MH0.JVsP0oQxLC0d3TbGozrmcDCvNPmZZC8yW6htCODbdLX2OccSbQWX68SOsxtyeNPPZ47vtfRNEf-VeJ1rpn-k6g`; // short for clarity

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewImageUrl(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async () => {
    const data = new FormData();
    data.append('title', form.title);
    data.append('location', form.location);
    data.append('date', form.date);
    data.append('description', form.description);
    if (imageFile) {
      data.append('image', imageFile);
    }

    try {
      await axios.put(
        `https://meta.oxyloans.com/api/riceapp-service/carnivals/${carnival.id}`,
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: AUTH_TOKEN,
          },
        }
      );
      alert('✅ Carnival updated successfully');
      navigate('/carnival-list');
    } catch (error) {
      alert('❌ Error updating carnival');
      console.error('Update error:', error);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-purple-800 mb-4">✏️ Edit Carnival</h2>

      <input
        className="w-full p-2 mb-3 border border-gray-300 rounded"
        name="title"
        placeholder="Title"
        value={form.title}
        onChange={handleChange}
      />
      <input
        className="w-full p-2 mb-3 border border-gray-300 rounded"
        name="location"
        placeholder="Location"
        value={form.location}
        onChange={handleChange}
      />
      <input
        className="w-full p-2 mb-3 border border-gray-300 rounded"
        name="date"
        type="date"
        value={form.date}
        onChange={handleChange}
      />
      <textarea
        className="w-full p-2 mb-3 border border-gray-300 rounded"
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
      />

      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="mb-3"
      />

      {previewImageUrl && (
        <img
          src={previewImageUrl}
          alt="Carnival"
          className="mb-4 w-full h-48 object-cover rounded border"
        />
      )}

      <button
        onClick={handleUpdate}
        className="w-full bg-purple-800 text-white py-2 rounded hover:bg-purple-700"
      >
        Update Carnival
      </button>
    </div>
  );
};

export default CarnivalEditPage;
