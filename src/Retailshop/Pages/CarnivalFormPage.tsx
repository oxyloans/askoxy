// import React, { useState, ChangeEvent } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const CarnivalFormPage: React.FC = () => {
//   const [carnival, setCarnival] = useState({
//     id: '',
//     title: '',
//     description: '',
//     location: '',
//     date: '',
//   });

//   const [image, setImage] = useState<File | null>(null);
//   const navigate = useNavigate();

//   const handleChange = (
//     e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setCarnival((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       setImage(e.target.files[0]);
//     }
//   };

//   const handleSubmit = async () => {
//     const { id, title, description, location, date } = carnival;

//     if (!id || !title || !description || !location || !date) {
//       alert('All fields except image are required.');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('id', id);
//     formData.append('title', title);
//     formData.append('description', description);
//     formData.append('location', location);
//     formData.append('date', date);
//     if (image) formData.append('image', image);

//     try {
//       await axios.post(
//         'https://meta.oxyloans.com/api/riceapp-service/carnivals',
//         formData,
//         {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//             Authorization:
//               'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJlYzY3OTExYS1iMmIzLTQ3OTMtODZiMy00ZDIxMjg4ODZmYWYiLCJpYXQiOjE3NDkyOTczNzAsImV4cCI6MTc1MDE2MTM3MH0.JVsP0oQxLC0d3TbGozrmcDCvNPmZZC8yW6htCODbdLX2OccSbQWX68SOsxtyeNPPZ47vtfRNEf-VeJ1rpn-k6g',
//           },
//         }
//       );
//       alert('Carnival created successfully!');
//       navigate('/carnivals');
//     } catch (error) {
//       const err = error as unknown as {
//         response?: { data?: { error?: string; message?: string } };
//         message?: string;
//       };
//       console.error('Upload Error:', err.response?.data || err.message);
//       alert(err.response?.data?.error || err.response?.data?.message || 'Upload failed. Try again.');
//     }
//   };

//   return (
//     <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg mt-8">
//       <h1 className="text-2xl font-bold text-purple-700 text-center mb-6">
//         Add Carnival
//       </h1>

//       <input
//         type="text"
//         name="id"
//         placeholder="No"
//         className="input-field"
//         value={carnival.id}
//         onChange={handleChange}
//       />
//       <input
//         type="text"
//         name="title"
//         placeholder="Title"
//         className="input-field"
//         value={carnival.title}
//         onChange={handleChange}
//       />
//       <textarea
//         name="description"
//         placeholder="Description"
//         className="input-field"
//         value={carnival.description}
//         onChange={handleChange}
//       />
//       <input
//         type="text"
//         name="location"
//         placeholder="Location"
//         className="input-field"
//         value={carnival.location}
//         onChange={handleChange}
//       />
//       <input
//         type="date"
//         name="date"
//         className="input-field"
//         value={carnival.date}
//         onChange={handleChange}
//       />
//       <input
//         type="file"
//         accept="image/*"
//         className="mb-4"
//         onChange={handleImageChange}
//       />

//       <button
//         className="bg-purple-700 text-white font-semibold py-2 px-4 rounded w-full mb-3 hover:bg-purple-800 transition"
//         onClick={handleSubmit}
//       >
//         Submit Carnival
//       </button>

//       <button
//         className="bg-yellow-300 text-purple-800 font-semibold py-2 px-4 rounded w-full hover:bg-yellow-400 transition"
//         onClick={() => navigate('/carnival-list')}
//       >
//         View All Carnivals
//       </button>
//     </div>
//   );
// };

// export default CarnivalFormPage;






// import React, { useState, ChangeEvent } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const CarnivalFormPage: React.FC = () => {
//   const [carnival, setCarnival] = useState({
//     title: '',
//     description: '',
//     location: '',
//     date: '',
//   });

//   const [image, setImage] = useState<File | null>(null);
//   const navigate = useNavigate();

//   const handleChange = (
//     e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setCarnival((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       setImage(e.target.files[0]);
//     }
//   };

//   const handleSubmit = async () => {
//     const { title, description, location, date } = carnival;

//     if (!title || !description || !location || !date) {
//       alert('All fields except image are required.');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('title', title);
//     formData.append('description', description);
//     formData.append('location', location);
//     formData.append('date', date);
//     if (image) formData.append('image', image);

//     try {
//       await axios.post(
//         'https://meta.oxyloans.com/api/riceapp-service/carnivals',
//         formData,
//         {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//             Authorization:
//               'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJlYzY3OTExYS1iMmIzLTQ3OTMtODZiMy00ZDIxMjg4ODZmYWYiLCJpYXQiOjE3NDkyOTczNzAsImV4cCI6MTc1MDE2MTM3MH0.JVsP0oQxLC0d3TbGozrmcDCvNPmZZC8yW6htCODbdLX2OccSbQWX68SOsxtyeNPPZ47vtfRNEf-VeJ1rpn-k6g',
//           },
//         }
//       );
//       alert('Carnival created successfully!');
//       navigate('/carnivals');
//     } catch (error) {
//       const err = error as unknown as {
//         response?: { data?: { error?: string; message?: string } };
//         message?: string;
//       };
//       console.error('Upload Error:', err.response?.data || err.message);
//       alert(
//         err.response?.data?.error ||
//         err.response?.data?.message ||
//         'Upload failed. Try again.'
//       );
//     }
//   };

//   return (
//     <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg mt-8">
//       <h1 className="text-2xl font-bold text-purple-700 text-center mb-6">
//         Add Carnival
//       </h1>

//       <input
//         type="text"
//         name="title"
//         placeholder="Title"
//         className="input-field"
//         value={carnival.title}
//         onChange={handleChange}
//       />
//       <textarea
//         name="description"
//         placeholder="Description"
//         className="input-field"
//         value={carnival.description}
//         onChange={handleChange}
//       />
//       <input
//         type="text"
//         name="location"
//         placeholder="Location"
//         className="input-field"
//         value={carnival.location}
//         onChange={handleChange}
//       />
//       <input
//         type="date"
//         name="date"
//         className="input-field"
//         value={carnival.date}
//         onChange={handleChange}
//       />
//       <input
//         type="file"
//         accept="image/*"
//         className="mb-4"
//         onChange={handleImageChange}
//       />

//       <button
//         className="bg-purple-700 text-white font-semibold py-2 px-4 rounded w-full mb-3 hover:bg-purple-800 transition"
//         onClick={handleSubmit}
//       >
//         Submit Carnival
//       </button>

//       <button
//         className="bg-yellow-300 text-purple-800 font-semibold py-2 px-4 rounded w-full hover:bg-yellow-400 transition"
//         onClick={() => navigate('/carnival-list')}
//       >
//         View All Carnivals
//       </button>
//     </div>
//   );
// };

// export default CarnivalFormPage;




import React, { useState, ChangeEvent } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CarnivalFormPage: React.FC = () => {
  const [carnival, setCarnival] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
  });

  const [image, setImage] = useState<File | null>(null);
  const navigate = useNavigate();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCarnival((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    const { title, description, location, date } = carnival;

    if (!title || !description || !location || !date) {
      alert('All fields except image are required.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('location', location);
    formData.append('date', date);
    if (image) {
      formData.append('image', image);
    }

    console.log('📝 Submitting FormData:');
formData.forEach((value, key) => {
  console.log(`${key}:`, value);
});


    try {
      await axios.post(
        'https://meta.oxyloans.com/api/riceapp-service/carnivals',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization:
              'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJlYzY3OTExYS1iMmIzLTQ3OTMtODZiMy00ZDIxMjg4ODZmYWYiLCJpYXQiOjE3NDkyOTczNzAsImV4cCI6MTc1MDE2MTM3MH0.JVsP0oQxLC0d3TbGozrmcDCvNPmZZC8yW6htCODbdLX2OccSbQWX68SOsxtyeNPPZ47vtfRNEf-VeJ1rpn-k6g',
          },
        }
      );
      alert('✅ Carnival created successfully!');
      // navigate('/carnivals');
       navigate('/carnival-list');
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { error?: string; message?: string } };
        message?: string;
      };

      console.error('❌ Upload Error:', err.response?.data || err.message);
      alert(
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Upload failed. Try again.'
      );
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg mt-8">
      <h1 className="text-2xl font-bold text-purple-700 text-center mb-6">
        Add Carnival
      </h1>

      <input
        type="text"
        name="title"
        placeholder="Title"
        className="input-field"
        value={carnival.title}
        onChange={handleChange}
      />
      <textarea
        name="description"
        placeholder="Description"
        className="input-field"
        value={carnival.description}
        onChange={handleChange}
      />
      <input
        type="text"
        name="location"
        placeholder="Location"
        className="input-field"
        value={carnival.location}
        onChange={handleChange}
      />
      <input
        type="date"
        name="date"
        className="input-field"
        value={carnival.date}
        onChange={handleChange}
      />
      <input
        type="file"
        accept="image/*"
        className="mb-4"
        onChange={handleImageChange}
      />

      <button
        className="bg-purple-700 text-white font-semibold py-2 px-4 rounded w-full mb-3 hover:bg-purple-800 transition"
        onClick={handleSubmit}
      >
        Submit Carnival
      </button>

      <button
        className="bg-yellow-300 text-purple-800 font-semibold py-2 px-4 rounded w-full hover:bg-yellow-400 transition"
        onClick={() => navigate('/carnival-list')}
      >
        View All Carnivals
      </button>
    </div>
  );
};

export default CarnivalFormPage;

