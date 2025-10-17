'use client';

import { useState } from 'react';

interface DeleteButtonProps {
  onDelete: () => void;
  itemTitle: string;
  className?: string;
}

export default function DeleteButton({ onDelete, itemTitle, className = '' }: DeleteButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = () => {
    if (showConfirm) {
      onDelete();
      setShowConfirm(false);
    } else {
      setShowConfirm(true);
      // Auto-hide confirmation after 3 seconds
      setTimeout(() => setShowConfirm(false), 3000);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={handleDelete}
        className={`
          px-3 py-1.5 rounded-full text-xs font-semibold
          transition-all duration-300 transform hover:scale-105
          ${showConfirm 
            ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg' 
            : 'bg-red-100 hover:bg-red-200 text-red-600 border border-red-200'
          }
        `}
      >
        {showConfirm ? 'Click to Confirm' : '🗑️ Delete'}
      </button>
      
      {showConfirm && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
          Delete "{itemTitle}"?
        </div>
      )}
    </div>
  );
}
