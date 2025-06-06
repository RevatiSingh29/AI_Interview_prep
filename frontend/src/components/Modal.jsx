import React from 'react'

const Modal = ({
  children,
  isOpen,onClose,title
}) => {
  if(!isOpen) return null;
  return ( <div className="fixed inset-0 z-50 flex justify-center items-center w-full h-full bg-black/60 ">
    <div className='relative flex flex-col bg-white shadow-lg rounded-lg overflow-hidden'>
    
<button type="button" onClick={onClose} className="text-gray-600 hover:text-black bg-transparent hover: bg-orange-100 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex justify-center items-center absolute top-3.5 right-3.5 cursor-poiter">
  <svg 
  className="w-3 h-3"
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor" 
  
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M6 18L18 6M6 6l12 12" 
    />
  </svg>
</button>
<div className="flex-1 overflow-y-auto custom-scrollbar">
  {children}
</div>
</div>
</div>
  )
}

export default Modal