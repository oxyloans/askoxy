import React from 'react';

const Testimonials: React.FC = () => {
  return (
    <section className="p-6 md:p-10 bg-gray-100 text-gray-800 mb-8">
      <h2 className="text-center text-xl md:text-2xl font-bold mb-6">Testimonials</h2>
      <div className="relative overflow-hidden">
        {/* Scrolling wrapper */}
        <div className="flex animate-scroll whitespace-nowrap">
          {/* Testimonial 1 */}
          <div className="w-3/4 sm:w-1/2 md:w-1/4 h-48 sm:h-56 md:h-64 p-4 bg-white shadow-lg mx-4 rounded-lg flex flex-col justify-center items-center">
            <p className="text-sm italic text-center">
              "A seamless experience from start to finish."
              <br />
              <span className="block text-center text-blue-500 font-semibold">- Client 1</span>
            </p>
          </div>

          {/* Testimonial 2 */}
          <div className="w-3/4 sm:w-1/2 md:w-1/4 h-48 sm:h-56 md:h-64 p-4 bg-white shadow-lg mx-4 rounded-lg flex flex-col justify-center items-center">
            <p className="text-sm italic text-center">
              "Outstanding support and great results!"
              <br />
              <span className="block text-center text-blue-500 font-semibold">- Client 2</span>
            </p>
          </div>

          {/* Testimonial 3 */}
          <div className="w-3/4 sm:w-1/2 md:w-1/4 h-48 sm:h-56 md:h-64 p-4 bg-white shadow-lg mx-4 rounded-lg flex flex-col justify-center items-center">
            <p className="text-sm italic text-center">
              "The service was amazing! Highly recommend."
              <br />
              <span className="block text-center text-blue-500 font-semibold">- Client 3</span>
            </p>
          </div>

          {/* Duplicating testimonials for continuous scrolling */}
          <div className="w-3/4 sm:w-1/2 md:w-1/4 h-48 sm:h-56 md:h-64 p-4 bg-white shadow-lg mx-4 rounded-lg flex flex-col justify-center items-center">
            <p className="text-sm italic text-center">
              "A seamless experience from start to finish."
              <br />
              <span className="block text-center text-blue-500 font-semibold">- Client 1</span>
            </p>
          </div>

          <div className="w-3/4 sm:w-1/2 md:w-1/4 h-48 sm:h-56 md:h-64 p-4 bg-white shadow-lg mx-4 rounded-lg flex flex-col justify-center items-center">
            <p className="text-sm italic text-center">
              "Outstanding support and great results!"
              <br />
              <span className="block text-center text-blue-500 font-semibold">- Client 2</span>
            </p>
          </div>

          <div className="w-3/4 sm:w-1/2 md:w-1/4 h-48 sm:h-56 md:h-64 p-4 bg-white shadow-lg mx-4 rounded-lg flex flex-col justify-center items-center">
            <p className="text-sm italic text-center">
              "The service was amazing! Highly recommend."
              <br />
              <span className="block text-center text-blue-500 font-semibold">- Client 3</span>
            </p>
          </div>
        </div>
      </div>

      <style>
        {`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll {
          animation: scroll 30s linear infinite;
        }

        @media (max-width: 640px) {
          .animate-scroll {
            animation: scroll 45s linear infinite;
          }
        }

        @media (max-width: 768px) {
          .animate-scroll {
            animation: scroll 35s linear infinite;
          }
        }
        `}
      </style>
    </section>
  );
};

export default Testimonials;