// Utility functions for saving and loading data to/from JSON files in public folder

export interface DataStorage {
  timelineEvents: any[];
  photos: any[];
  loveNotes: any[];
  promises: any[];
  anniversaries: any[];
  dreams: any[];
}

// Save data to JSON file in public folder
export const saveDataToFile = async (data: Partial<DataStorage>) => {
  try {
    // In a real app, you would send this to your API endpoint
    // For now, we'll simulate saving to localStorage and show a success message
    console.log('Saving data to file:', data);
    
    // Save each data type to localStorage as backup
    Object.entries(data).forEach(([key, value]) => {
      if (value) {
        localStorage.setItem(key, JSON.stringify(value));
      }
    });
    
    return { success: true, message: 'Data saved successfully!' };
  } catch (error) {
    console.error('Error saving data:', error);
    return { success: false, message: 'Failed to save data' };
  }
};

// Load data from JSON file in public folder
export const loadDataFromFile = async (): Promise<Partial<DataStorage>> => {
  try {
    // In a real app, you would fetch from your API endpoint
    // For now, we'll load from localStorage
    const data: Partial<DataStorage> = {};
    
    const keys = ['timelineEvents', 'photos', 'loveNotes', 'promises', 'anniversaries', 'dreams'];
    
    keys.forEach(key => {
      const stored = localStorage.getItem(key);
      if (stored) {
        try {
          (data as any)[key] = JSON.parse(stored);
        } catch (e) {
          console.error(`Error parsing ${key}:`, e);
        }
      }
    });
    
    return data;
  } catch (error) {
    console.error('Error loading data:', error);
    return {};
  }
};

// Delete specific item from storage
export const deleteItemFromStorage = async (type: keyof DataStorage, id: string) => {
  try {
    const stored = localStorage.getItem(type);
    if (stored) {
      const data = JSON.parse(stored);
      const filteredData = data.filter((item: any) => item.id !== id);
      localStorage.setItem(type, JSON.stringify(filteredData));
      return { success: true, message: 'Item deleted successfully!' };
    }
    return { success: false, message: 'Item not found' };
  } catch (error) {
    console.error('Error deleting item:', error);
    return { success: false, message: 'Failed to delete item' };
  }
};

// Export data to downloadable JSON file
export const exportDataToFile = (data: DataStorage) => {
  const dataStr = JSON.stringify(data, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `my-life-data-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Import data from JSON file
export const importDataFromFile = (file: File): Promise<DataStorage> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        resolve(data);
      } catch (error) {
        reject(new Error('Invalid JSON file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};
