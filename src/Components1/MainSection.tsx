import React from "react";


const MainSection: React.FC<{ content: string }> = ({ content }) => {
  return (
    <main className="flex-1 sm:p-4 lg:ml-64">
      <div className="space-y-2">
        <p className="text-gray-600">{content}</p>
      </div>
    </main>
  );
};

export default MainSection;
