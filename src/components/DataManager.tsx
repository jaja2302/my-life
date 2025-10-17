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
      

      {/* Message */}
      {message && (
        <div className="absolute top-12 right-0 bg-gray-800 text-white px-3 py-2 rounded text-sm whitespace-nowrap z-50">
          {message}
        </div>
      )}
    </div>
  );
}
