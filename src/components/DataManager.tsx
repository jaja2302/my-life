'use client';

import { useState } from 'react';
import { useData } from '@/context/DataContext';
import { exportDataToFile, importDataFromFile, saveDataToFile } from '@/utils/dataStorage';

interface DataManagerProps {
  className?: string;
}

export default function DataManager({ className = '' }: DataManagerProps) {
  const { timelineEvents, photos, loveNotes, promises, anniversaries, dreams } = useData();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const handleExport = () => {
    const data = {
      timelineEvents,
      photos,
      loveNotes,
      promises,
      anniversaries,
      dreams
    };
    
    exportDataToFile(data);
    setMessage('Data exported successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const data = await importDataFromFile(file);
      await saveDataToFile(data);
      setMessage('Data imported successfully! Please refresh the page.');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to import data. Please check the file format.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full font-semibold text-sm hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
      >
        📁 Data Manager
      </button>

      {isOpen && (
        <div className="absolute top-12 right-0 bg-white rounded-lg shadow-xl border p-4 min-w-64 z-50">
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-800 mb-3">Data Management</h3>
            
            {/* Export Button */}
            <button
              onClick={handleExport}
              className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
            >
              📤 Export Data
            </button>
            
            {/* Import Button */}
            <label className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors cursor-pointer block text-center">
              📥 Import Data
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
            
            {/* Data Summary */}
            <div className="text-xs text-gray-600 space-y-1 pt-2 border-t">
              <div>Timeline: {timelineEvents.length} events</div>
              <div>Photos: {photos.length} photos</div>
              <div>Notes: {loveNotes.length} notes</div>
              <div>Promises: {promises.length} promises</div>
              <div>Anniversaries: {anniversaries.length} anniversaries</div>
              <div>Dreams: {dreams.length} dreams</div>
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
