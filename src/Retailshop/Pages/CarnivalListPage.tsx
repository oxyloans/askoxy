// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// interface Carnival {
//   id: number;
//   title: string;
//   description: string;
//   location: string;
//   date: string;
//   imageUrl?: string;
// }

// const CarnivalListPage: React.FC = () => {
//   const [carnivals, setCarnivals] = useState<Carnival[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const navigate = useNavigate();

//   const API_URL = "https://meta.oxyloans.com/api/riceapp-service/carnivals";
//   const AUTH_TOKEN = `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJlYzY3OTExYS1iMmIzLTQ3OTMtODZiMy00ZDIxMjg4ODZmYWYiLCJpYXQiOjE3NDkyOTczNzAsImV4cCI6MTc1MDE2MTM3MH0.JVsP0oQxLC0d3TbGozrmcDCvNPmZZC8yW6htCODbdLX2OccSbQWX68SOsxtyeNPPZ47vtfRNEf-VeJ1rpn-k6g`;

//   const fetchCarnivals = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get<Carnival[]>(API_URL, {
//         headers: { Authorization: AUTH_TOKEN },
//       });
//       setCarnivals(response.data || []);
//     } catch (error) {
//       console.error("Error fetching carnivals:", error);
//       alert("❌ Failed to fetch carnival data.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCarnivals();
//   }, []);

//   const handleAddCarnival = () => {
//     navigate("/carnivals/new");
//   };

//   const handleEdit = (carnival: Carnival) => {
//     navigate(`/carnivals/edit/${carnival.id}`, { state: carnival });
//   };

//   const handleDelete = async (id: number) => {
//     const confirm = window.confirm("Are you sure you want to delete this carnival?");
//     if (!confirm) return;

//     try {
//       await axios.delete(`${API_URL}/${id}`, {
//         headers: { Authorization: AUTH_TOKEN },
//       });
//       alert("✅ Carnival deleted successfully");
//       fetchCarnivals(); // refresh list
//     } catch (error) {
//       console.error("Error deleting carnival:", error);
//       alert("❌ Failed to delete carnival");
//     }
//   };

//   const renderCarnivalCard = (carnival: Carnival) => (
//     <div
//       key={carnival.id}
//       className="border rounded-lg shadow-sm p-4 bg-white hover:shadow-md transition duration-200"
//     >
//       <h2 className="text-xl font-semibold text-purple-800">{carnival.title}</h2>
//       <p className="text-sm text-gray-600 mb-1">📅 {carnival.date}</p>
//       <p className="text-gray-700 mb-2">{carnival.description}</p>
//       <p className="text-sm text-gray-500">📍 Location: {carnival.location}</p>
//       {carnival.imageUrl && (
//         <img
//           src={carnival.imageUrl}
//           alt="Carnival"
//           className="mt-3 w-full h-48 object-cover rounded-md border"
//         />
//       )}
//       <div className="mt-4 flex gap-3">
//         <button
//           onClick={() => handleEdit(carnival)}
//           className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
//         >
//           ✏️ Edit
//         </button>
//         <button
//           onClick={() => handleDelete(carnival.id)}
//           className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
//         >
//           🗑️ Delete
//         </button>
//       </div>
//     </div>
//   );

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold text-purple-700">🎉 All Carnivals</h1>
//         <button
//           onClick={handleAddCarnival}
//           className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800 transition"
//         >
//           ➕ Add Carnival
//         </button>
//       </div>

//       {loading ? (
//         <p className="text-center text-gray-600">Loading...</p>
//       ) : carnivals.length === 0 ? (
//         <p className="text-center text-gray-500">No carnivals available.</p>
//       ) : (
//         <>
//           <div className="text-right text-gray-600 font-medium mb-4">
//             Total Carnivals: {carnivals.length}
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {carnivals.map((carnival) => renderCarnivalCard(carnival))}
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default CarnivalListPage;





// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// interface Carnival {
//   id: number;
//   title: string;
//   description: string;
//   location: string;
//   date: string;
//   imageUrl?: string;
// }

// const CarnivalListPage: React.FC = () => {
//   const [carnivals, setCarnivals] = useState<Carnival[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const navigate = useNavigate();

//   const API_URL = "https://meta.oxyloans.com/api/riceapp-service/carnivals";
//   const AUTH_TOKEN = `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJlYzY3OTExYS1iMmIzLTQ3OTMtODZiMy00ZDIxMjg4ODZmYWYiLCJpYXQiOjE3NDkyOTczNzAsImV4cCI6MTc1MDE2MTM3MH0.JVsP0oQxLC0d3TbGozrmcDCvNPmZZC8yW6htCODbdLX2OccSbQWX68SOsxtyeNPPZ47vtfRNEf-VeJ1rpn-k6g`;

//   const fetchCarnivals = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get<Carnival[]>(API_URL, {
//         headers: { Authorization: AUTH_TOKEN },
//       });
//       setCarnivals(response.data || []);
//     } catch (error) {
//       console.error("❌ Error fetching carnivals:", error);
//       alert("❌ Failed to fetch carnival data.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCarnivals();
//   }, []);

//   const handleAddCarnival = () => {
//     navigate("/carnivals/new");
//   };

//   const handleEdit = (carnival: Carnival) => {
//     navigate(`/carnivals/edit/${carnival.id}`, { state: carnival });
//   };

//   const handleDelete = async (id: number) => {
//     const confirmDelete = window.confirm("Are you sure you want to delete this carnival?");
//     if (!confirmDelete) return;

//     try {
//       await axios.delete(`${API_URL}/${id}`, {
//         headers: { Authorization: AUTH_TOKEN },
//       });
//       alert("✅ Carnival deleted successfully");
//       fetchCarnivals(); // Refresh list
//     } catch (error) {
//       console.error("❌ Error deleting carnival:", error);
//       alert("❌ Failed to delete carnival");
//     }
//   };

//   const renderCarnivalCard = (carnival: Carnival) => (
//     <div
//       key={carnival.id}
//       className="border rounded-lg shadow-sm p-4 bg-white hover:shadow-md transition duration-200"
//     >
//       <h2 className="text-xl font-semibold text-purple-800">{carnival.title}</h2>
//       <p className="text-sm text-gray-600 mb-1">📅 {carnival.date}</p>
//       <p className="text-gray-700 mb-2">{carnival.description}</p>
//       <p className="text-sm text-gray-500">📍 Location: {carnival.location}</p>

//       {carnival.imageUrl && (
//         <img
//           src={carnival.imageUrl}
//           alt="Carnival"
//           className="mt-3 w-full h-48 object-cover rounded-md border"
//         />
//       )}

//       <div className="mt-4 flex gap-3">
//         <button
//           onClick={() => handleEdit(carnival)}
//           className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
//         >
//           ✏️ Edit
//         </button>
//         <button
//           onClick={() => handleDelete(carnival.id)}
//           className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
//         >
//           🗑️ Delete
//         </button>
//       </div>
//     </div>
//   );

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold text-purple-700">🎉 All Carnivals</h1>
//         <button
//           onClick={handleAddCarnival}
//           className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800 transition"
//         >
//           ➕ Add Carnival
//         </button>
//       </div>

//       {loading ? (
//         <p className="text-center text-gray-600">Loading carnivals...</p>
//       ) : carnivals.length === 0 ? (
//         <p className="text-center text-gray-500">No carnivals available.</p>
//       ) : (
//         <>
//           <div className="text-right text-gray-600 font-medium mb-4">
//             Total Carnivals: {carnivals.length}
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {carnivals.map((carnival) => renderCarnivalCard(carnival))}
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default CarnivalListPage;




import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Carnival {
  id: number;
  title: string;
  description: string;
  location: string;
  date: string;
  imageUrl?: string;
}

const CarnivalListPage: React.FC = () => {
  const [carnivals, setCarnivals] = useState<Carnival[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const API_URL = "https://meta.oxyloans.com/api/riceapp-service/carnivals";
  const AUTH_TOKEN = `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJlYzY3OTExYS1iMmIzLTQ3OTMtODZiMy00ZDIxMjg4ODZmYWYiLCJpYXQiOjE3NDkyOTczNzAsImV4cCI6MTc1MDE2MTM3MH0.JVsP0oQxLC0d3TbGozrmcDCvNPmZZC8yW6htCODbdLX2OccSbQWX68SOsxtyeNPPZ47vtfRNEf-VeJ1rpn-k6g`;

  const fetchCarnivals = async () => {
    try {
      setLoading(true);
      const response = await axios.get<Carnival[]>(API_URL, {
        headers: { Authorization: AUTH_TOKEN },
      });
      setCarnivals(response.data || []);
    } catch (error) {
      console.error("❌ Error fetching carnivals:", error);
      alert("❌ Failed to fetch carnival data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarnivals();
  }, []);

  const handleEdit = (carnival: Carnival) => {
    navigate(`/carnivals/edit/${carnival.id}`, { state: carnival });
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this carnival?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: AUTH_TOKEN },
      });
      alert("✅ Carnival deleted successfully");
      fetchCarnivals(); // Refresh list
    } catch (error) {
      console.error("❌ Error deleting carnival:", error);
      alert("❌ Failed to delete carnival");
    }
  };

  const renderCarnivalCard = (carnival: Carnival) => (
    <div
      key={carnival.id}
      className="border rounded-lg shadow-sm p-4 bg-white hover:shadow-md transition duration-200"
    >
      <h2 className="text-xl font-semibold text-purple-800">{carnival.title}</h2>
      <p className="text-sm text-gray-600 mb-1">📅 {carnival.date}</p>
      <p className="text-gray-700 mb-2">{carnival.description}</p>
      <p className="text-sm text-gray-500">📍 Location: {carnival.location}</p>

      {carnival.imageUrl && (
        <img
          src={carnival.imageUrl}
          alt="Carnival"
          className="mt-3 w-full h-48 object-cover rounded-md border"
        />
      )}

      <div className="mt-4 flex gap-3">
        <button
          onClick={() => handleEdit(carnival)}
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          ✏️ Edit
        </button>
        <button
          onClick={() => handleDelete(carnival.id)}
          className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-purple-700 mb-6">🎉 All Carnivals</h1>

      {loading ? (
        <p className="text-center text-gray-600">Loading carnivals...</p>
      ) : carnivals.length === 0 ? (
        <p className="text-center text-gray-500">No carnivals available.</p>
      ) : (
        <>
          <div className="text-right text-gray-600 font-medium mb-4">
            Total Carnivals: {carnivals.length}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {carnivals.map((carnival) => renderCarnivalCard(carnival))}
          </div>
        </>
      )}
    </div>
  );
};

export default CarnivalListPage;


