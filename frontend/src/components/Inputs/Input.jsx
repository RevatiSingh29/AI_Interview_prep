import React from 'react';

const Input = ({ value, onChange, label, placeholder, type }) => {
  return (
    <div className="mb-4"> {/* Added margin-bottom for spacing */}
      <label className="text-[13px] text-slate-800 block">{label}</label> {/* 'block' ensures label is displayed above input */}
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 w-full" 
        // w-full makes the input take up the full width
      />
    </div>
  );
}

export default Input;

