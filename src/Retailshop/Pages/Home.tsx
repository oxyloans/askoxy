// src/pages/HomePage.tsx
// import React from 'react';
// import { useNavigate } from 'react-router-dom';

// const HomePage: React.FC = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-[#020024] via-[#090979] to-[#00d4ff] flex items-center justify-center px-4">
//       <div className="text-center space-y-6">
//         <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">OXY RICE RETAILS</h1>

//         <button
//           className="bg-purple-800 text-white py-3 px-8 rounded-full w-full max-w-xs hover:bg-purple-900"
//           onClick={() => navigate('/ShopFormPage')}
//         >
//           Add Shops
//         </button>

//         <button
//           className="bg-yellow-400 text-black py-3 px-8 rounded-full w-full max-w-xs hover:bg-yellow-500"
//           onClick={() => navigate('/shop-list')}
//         >
//           View All Shops
//         </button>

//         <button
//           className="bg-purple-800 text-white py-3 px-8 rounded-full w-full max-w-xs hover:bg-purple-900"
//           onClick={() => navigate('/carnival-form')}
//         >
//           Add Carnival
//         </button>

//         <button
//           className="bg-yellow-400 text-black py-3 px-8 rounded-full w-full max-w-xs hover:bg-yellow-500"
//           onClick={() => navigate('/carnival-list')}
//         >
//           View All Carnivals
//         </button>
//       </div>
//     </div>
//   );
// };

// export default HomePage;






// import React from 'react';
// import { useNavigate } from 'react-router-dom';

// const HomePage: React.FC = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-[#020024] via-[#090979] to-[#00d4ff] flex items-center justify-center px-4">
//       <div className="text-center space-y-6">
//         <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">OXY RICE RETAILS</h1>

//         <button
//           className="bg-purple-800 text-white py-3 px-8 rounded-full w-full max-w-xs hover:bg-purple-900"
//           onClick={() => navigate('/shop-form')}
//         >
//           Add Shops
//         </button>

//         <button
//           className="bg-yellow-400 text-black py-3 px-8 rounded-full w-full max-w-xs hover:bg-yellow-500"
//           onClick={() => navigate('/shop-list')}
//         >
//           View All Shops
//         </button>

//         <button
//           className="bg-purple-800 text-white py-3 px-8 rounded-full w-full max-w-xs hover:bg-purple-900"
//           onClick={() => navigate('/carnival-form')}
//         >
//           Add Carnival
//         </button>

//         <button
//           className="bg-yellow-400 text-black py-3 px-8 rounded-full w-full max-w-xs hover:bg-yellow-500"
//           onClick={() => navigate('/carnival-list')}
//         >
//           View All Carnivals
//         </button>
//       </div>
//     </div>
//   );
// };

// export default HomePage;




import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-yellow-400 flex items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-2xl p-10 w-full max-w-lg space-y-6">
        <h1 className="text-4xl font-bold text-purple-800 text-center">🌾 OXY RICE RETAILS</h1>

        <button
          className="bg-purple-700 text-white py-3 px-6 rounded-full w-full hover:bg-purple-800 transition"
          onClick={() => navigate('/shop-form')}
        >
          ➕ Add Shop
        </button>

        <button
          className="bg-yellow-400 text-black py-3 px-6 rounded-full w-full hover:bg-yellow-500 transition"
          onClick={() => navigate('/shop-list')}
        >
          🏬 View All Shops
        </button>

        <button
          className="bg-purple-700 text-white py-3 px-6 rounded-full w-full hover:bg-purple-800 transition"
          onClick={() => navigate('/carnival-form')}
        >
          🎉 Add Carnival
        </button>

        <button
          className="bg-yellow-400 text-black py-3 px-6 rounded-full w-full hover:bg-yellow-500 transition"
          onClick={() => navigate('/carnival-list')}
        >
          🗓 View All Carnivals
        </button>
      </div>
    </div>
  );
};

export default HomePage;
