import React from 'react';
import { LuX } from 'react-icons/lu';

const Drawer = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  return (
    <div
      className={`fixed top-[64px] right-0 z-40 h-[calc(100dvh-64px)] p-4 transition-transform bg-white w-full md:w-[40vw] shadow-2xl shadow-cyan-800/10 border-r border-l-gray-800 transform flex flex-col ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
      tabIndex="-1"
      aria-labelledby="drawer-right-label"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <h5 className="flex items-center text-base font-semibold text-black" id="drawer-right-label">
          {title}
        </h5>
        <button
          className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex items-center justify-center"
          type="button"
          onClick={onClose}
        >
          <LuX className="text-lg" />
        </button>
      </div>

      {/* Scrollable content with medium-tone ultra-thin scrollbar */}
      <div
        className="flex-grow overflow-auto text-sm mx-3 mb-6"
        style={{
          scrollbarWidth: 'thin',               // Firefox
          scrollbarColor: '#999 transparent'   // Firefox - medium gray thumb
        }}
      >
        <style>
          {`
            /* WebKit (Chrome, Edge, Safari) */
            div::-webkit-scrollbar {
              width: 2px;
              height: 2px;  /* Horizontal scrollbar thickness */
            }
            div::-webkit-scrollbar-track {
              background: transparent;
            }
            div::-webkit-scrollbar-thumb {
              background-color: #999;  /* Medium gray */
              border-radius: 10px;
            }
            div::-webkit-scrollbar-thumb:hover {
              background-color: #777;  /* Darker gray on hover */
            }
          `}
        </style>
        {children}
      </div>
    </div>
  );
};

export default Drawer;
