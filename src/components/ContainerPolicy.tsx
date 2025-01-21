import React from "react";

const Container = () => {
  const fileUrl = `https://drive.google.com/file/d/1x_0b6DIt5-rbq1fubeHcIMO5Grxr46p1/preview`;

  return (
    <div className="flex justify-center items-center my-14">
      <iframe
        src={fileUrl}
        frameBorder="0"
        className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 h-[500px] sm:h-[600px] md:h-[800px] lg:h-[1000px] max-w-full rounded-lg shadow-lg"
              title="PDF Viewer"
              
      />
    </div>
  );
};

export default Container;
