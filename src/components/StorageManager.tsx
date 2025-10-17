'use client';

import { useState } from 'react';
import { useData } from '@/context/DataContext';

interface StorageManagerProps {
  className?: string;
}

export default function StorageManager({ className = '' }: StorageManagerProps) {
  const { timelineEvents, photos, loveNotes, promises, anniversaries, dreams } = useData();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const getStorageSize = () => {
    let totalSize = 0;
    const data = { timelineEvents, photos, loveNotes, promises, anniversaries, dreams };
    
    Object.entries(data).forEach(([key, value]) => {
      const size = new Blob([JSON.stringify(value)]).size;
      totalSize += size;
    });
    
    return {
      total: totalSize,
      formatted: formatBytes(totalSize),
      breakdown: Object.entries(data).map(([key, value]) => ({
        key,
        size: new Blob([JSON.stringify(value)]).size,
        formatted: formatBytes(new Blob([JSON.stringify(value)]).size),
        count: Array.isArray(value) ? value.length : 0
      }))
    };
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const clearOldData = () => {
    try {
      // Clear localStorage and reload
      localStorage.clear();
      setMessage('Storage cleared successfully! Page will reload...');
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      setMessage('Failed to clear storage');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const clearSpecificData = (type: string) => {
    try {
      localStorage.removeItem(type);
      setMessage(`${type} cleared successfully!`);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to clear data');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const storageInfo = getStorageSize();

  return (
    <div className={`relative ${className}`}>
     

      {/* Message */}
      {message && (
        <div className="absolute top-12 right-0 bg-gray-800 text-white px-3 py-2 rounded text-sm whitespace-nowrap z-50">
          {message}
        </div>
      )}
    </div>
  );
}
