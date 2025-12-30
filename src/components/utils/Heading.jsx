import React from "react";

const Heading = ({ text }) => {
  return (
    <div className="relative inline-block rounded-full mb-6">
      <div className="absolute -inset-[1px] rounded-full bg-gradient-to-r from-indigo-500 via-sky-400 to-emerald-400 opacity-30 blur-sm"></div>
      <div className="relative inline-flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm text-slate-800 text-sm font-semibold rounded-full ring-1 ring-slate-200 shadow">
        <span className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-sky-500"></span>
        {text}
      </div>
    </div>
  );
};

export default Heading;
