import React from 'react';

interface CarnivalCardProps {
  title: string;
  location: string;
  date: string;
  description: string;
  imageUrl: string;
}

const CarnivalCard: React.FC<CarnivalCardProps> = ({ title, location, date, description, imageUrl }) => {
  return (
    <div className="bg-white shadow-md rounded-md overflow-hidden">
      <img src={imageUrl} alt={title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-xl font-bold text-purple-800 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-1">Location: {location}</p>
        <p className="text-sm text-gray-600 mb-1">Date: {date}</p>
        <p className="text-sm text-gray-700 mt-2">{description}</p>
      </div>
    </div>
  );
};

export default CarnivalCard;