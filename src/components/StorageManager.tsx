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
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full font-semibold text-sm hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
      >
        🗂️ Storage ({storageInfo.formatted})
      </button>

      {isOpen && (
        <div className="absolute top-12 right-0 bg-white rounded-lg shadow-xl border p-4 min-w-80 z-50">
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-800 mb-3">Storage Management</h3>
            
            {/* Storage Summary */}
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-sm font-semibold text-gray-700 mb-2">
                Total Storage: {storageInfo.formatted}
              </div>
              <div className="space-y-1">
                {storageInfo.breakdown.map((item) => (
                  <div key={item.key} className="flex justify-between text-xs text-gray-600">
                    <span className="capitalize">{item.key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                    <span>{item.formatted} ({item.count} items)</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Clear Individual Data */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-700">Clear Individual Data:</h4>
              {storageInfo.breakdown.map((item) => (
                <button
                  key={item.key}
                  onClick={() => clearSpecificData(item.key)}
                  className="w-full bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded text-xs transition-colors"
                >
                  Clear {item.key.replace(/([A-Z])/g, ' $1').trim()} ({item.formatted})
                </button>
              ))}
            </div>
            
            {/* Clear All Data */}
            <button
              onClick={clearOldData}
              className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
            >
              🗑️ Clear All Data
            </button>
            
            {/* Warning */}
            <div className="text-xs text-gray-500 bg-yellow-50 p-2 rounded">
              ⚠️ Clearing data will permanently delete all stored information. This action cannot be undone.
            </div>
          </div>
        </div>
      )}

      {/* Message */}
      {message && (
        <div className="absolute top-12 right-0 bg-gray-800 text-white px-3 py-2 rounded text-sm whitespace-nowrap z-50">
          {message}
        </div>
      )}
    </div>
  );
}
