import React from "react";

const EmptyProfiles = () => {
  return (
    <div className="mx-auto flex justify-center space-y-3 flex-col items-center mt-10 w-[90%] max-w-[500px] shadow-2xl h-[70vh] rounded-xl overflow-hidden">
      <img className="w-40" loading="lazy" src="/assets/sad-face.webp" alt="" />

      <p className="text-lg font-bold">No more profiles</p>
    </div>
  );
};

export default EmptyProfiles;
