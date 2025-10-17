// API utilities for fetching and saving data to JSON files in public folder

const API_BASE = '/api/data';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Fetch data from JSON file
export const fetchData = async <T>(filename: string): Promise<ApiResponse<T[]>> => {
  try {
    const response = await fetch(`${API_BASE}?filename=${filename}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${filename}`);
    }
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error(`Error fetching ${filename}:`, error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// Save data to JSON file
export const saveData = async <T>(filename: string, data: T[]): Promise<ApiResponse<T[]>> => {
  try {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ filename, data }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to save ${filename}`);
    }
    
    const result = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error(`Error saving ${filename}:`, error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// Upload photo to public folder
export const uploadPhotoToPublic = async (file: File): Promise<ApiResponse<string>> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Failed to upload photo');
    }
    
    const result = await response.json();
    
    if (result.success) {
      return { success: true, data: result.url };
    } else {
      return { success: false, error: result.error || 'Upload failed' };
    }
  } catch (error) {
    console.error('Error uploading photo:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// Delete data from JSON file
export const deleteData = async (filename: string, id: string): Promise<ApiResponse<boolean>> => {
  try {
    const response = await fetch(`${API_BASE}?filename=${filename}&id=${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete from ${filename}`);
    }
    
    const result = await response.json();
    return { success: true, data: true };
  } catch (error) {
    console.error(`Error deleting from ${filename}:`, error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};
