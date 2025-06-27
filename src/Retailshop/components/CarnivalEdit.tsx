// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate, useLocation } from 'react-router-dom';

// interface Carnival {
//   id: string;
//   title: string;
//   location: string;
//   date: string;
//   description: string;
//   imageUrl: string;
// }

// const CarnivalEdit: React.FC = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const carnival = location.state as Carnival;

//   const [form, setForm] = useState<Carnival>({ ...carnival });

//   const handleChange = (key: keyof Carnival, value: string) => {
//     setForm((prev) => ({ ...prev, [key]: value }));
//   };

//   const handleSubmit = async () => {
//     try {
//       await axios.put(
//         `https://meta.oxyloans.com/api/riceapp-service/carnivals/${form.id}`,
//         form,
//         {
//           headers: {
//             Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJlYzY3OTExYS1iMmIzLTQ3OTMtODZiMy00ZDIxMjg4ODZmYWYiLCJpYXQiOjE3NDkyOTczNzAsImV4cCI6MTc1MDE2MTM3MH0.JVsP0oQxLC0d3TbGozrmcDCvNPmZZC8yW6htCODbdLX2OccSbQWX68SOsxtyeNPPZ47vtfRNEf-VeJ1rpn-k6g`,
//           },
//         }
//       );
//       alert('Carnival updated successfully');
//       navigate('/carnivals');
//     } catch (err) {
//       alert('Error updating carnival');
//       console.error(err);
//     }
//   };

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
//         placeholder="Date"
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
//         onClick={handleSubmit}
//         className="w-full bg-purple-800 text-white py-2 rounded hover:bg-purple-700"
//       >
//         Update Carnival
//       </button>
//     </div>
//   );
// };

// export default CarnivalEdit;




import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

interface Carnival {
  id: number;
  title: string;
  location: string;
  date: string;
  description: string;
  imageUrl: string;
}

const CarnivalEdit: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const carnival = location.state as Carnival;

  const [form, setForm] = useState<Carnival>({ ...carnival });
  const [loading, setLoading] = useState(false);

  const AUTH_TOKEN = `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJlYzY3OTExYS1iMmIzLTQ3OTMtODZiMy00ZDIxMjg4ODZmYWYiLCJpYXQiOjE3NDkyOTczNzAsImV4cCI6MTc1MDE2MTM3MH0.JVsP0oQxLC0d3TbGozrmcDCvNPmZZC8yW6htCODbdLX2OccSbQWX68SOsxtyeNPPZ47vtfRNEf-VeJ1rpn-k6g`;

  const handleChange = (key: keyof Carnival, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!form.title || !form.location || !form.date || !form.description) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);
      await axios.put(
        `https://meta.oxyloans.com/api/riceapp-service/carnivals/${form.id}`,
        form,
        {
          headers: {
            Authorization: AUTH_TOKEN,
          },
        }
      );
      alert('✅ Carnival updated successfully!');
      navigate('/carnivals');
    } catch (err) {
      alert('❌ Error updating carnival.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel? Changes will be lost.")) {
      navigate('/carnivals');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-md shadow-md mt-6">
      <h2 className="text-2xl font-bold text-purple-800 mb-4">📝 Edit Carnival</h2>

      <input
        className="w-full p-2 mb-3 border border-gray-300 rounded"
        placeholder="Title *"
        value={form.title}
        onChange={(e) => handleChange('title', e.target.value)}
      />
      <input
        className="w-full p-2 mb-3 border border-gray-300 rounded"
        placeholder="Location *"
        value={form.location}
        onChange={(e) => handleChange('location', e.target.value)}
      />
      <input
        className="w-full p-2 mb-3 border border-gray-300 rounded"
        type="date"
        value={form.date}
        onChange={(e) => handleChange('date', e.target.value)}
      />
      <textarea
        className="w-full p-2 mb-3 border border-gray-300 rounded"
        placeholder="Description *"
        value={form.description}
        onChange={(e) => handleChange('description', e.target.value)}
        rows={4}
      />
      <input
        className="w-full p-2 mb-4 border border-gray-300 rounded"
        placeholder="Image URL"
        value={form.imageUrl}
        onChange={(e) => handleChange('imageUrl', e.target.value)}
      />

      <div className="flex gap-4">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex-1 bg-purple-700 text-white py-2 rounded hover:bg-purple-800 transition"
        >
          {loading ? "Updating..." : "✅ Update Carnival"}
        </button>
        <button
          onClick={handleCancel}
          className="flex-1 bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400 transition"
        >
          ❌ Cancel
        </button>
      </div>
    </div>
  );
};

export default CarnivalEdit;
