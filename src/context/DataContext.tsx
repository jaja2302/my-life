'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchData, saveData, uploadPhotoToPublic, deleteData } from '@/utils/api';

// Types
export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  image: string;
  type: 'milestone' | 'memory' | 'anniversary';
  createdAt: string;
}

export interface Photo {
  id: string;
  src: string;
  alt: string;
  date: string;
  caption: string;
  category: 'date' | 'travel' | 'home' | 'special';
  createdAt: string;
}

export interface LoveNote {
  id: string;
  title: string;
  content: string;
  date: string;
  from: string;
  color: string;
  createdAt: string;
}

export interface LovePromise {
  id: string;
  title: string;
  description: string;
  date: string;
  status: 'kept' | 'in-progress' | 'future';
  category: 'love' | 'support' | 'adventure' | 'growth';
  createdAt: string;
}

export interface Anniversary {
  id: string;
  title: string;
  date: string;
  years: number;
  description: string;
  memories: string[];
  isUpcoming: boolean;
  daysUntil: number;
  createdAt: string;
}

export interface Dream {
  id: string;
  title: string;
  description: string;
  category: 'travel' | 'home' | 'career' | 'family' | 'adventure';
  priority: 'high' | 'medium' | 'low';
  targetDate: string;
  progress: number;
  steps: string[];
  createdAt: string;
}

interface DataContextType {
  // Data
  timelineEvents: TimelineEvent[];
  photos: Photo[];
  loveNotes: LoveNote[];
  promises: LovePromise[];
  anniversaries: Anniversary[];
  dreams: Dream[];
  
  // Timeline Actions
  addTimelineEvent: (event: Omit<TimelineEvent, 'id' | 'createdAt'>) => void;
  updateTimelineEvent: (id: string, event: Partial<TimelineEvent>) => void;
  deleteTimelineEvent: (id: string) => void;
  
  // Photo Actions
  addPhoto: (photo: Omit<Photo, 'id' | 'createdAt'>) => void;
  updatePhoto: (id: string, photo: Partial<Photo>) => void;
  deletePhoto: (id: string) => void;
  
  // Love Note Actions
  addLoveNote: (note: Omit<LoveNote, 'id' | 'createdAt'>) => void;
  updateLoveNote: (id: string, note: Partial<LoveNote>) => void;
  deleteLoveNote: (id: string) => void;
  
  // Promise Actions
  addPromise: (promise: Omit<LovePromise, 'id' | 'createdAt'>) => void;
  updatePromise: (id: string, promise: Partial<LovePromise>) => void;
  deletePromise: (id: string) => void;
  
  // Anniversary Actions
  addAnniversary: (anniversary: Omit<Anniversary, 'id' | 'createdAt'>) => void;
  updateAnniversary: (id: string, anniversary: Partial<Anniversary>) => void;
  deleteAnniversary: (id: string) => void;
  
  // Dream Actions
  addDream: (dream: Omit<Dream, 'id' | 'createdAt'>) => void;
  updateDream: (id: string, dream: Partial<Dream>) => void;
  deleteDream: (id: string) => void;
  
  // Upload Actions
  uploadPhoto: (file: File) => Promise<string>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loveNotes, setLoveNotes] = useState<LoveNote[]>([]);
  const [promises, setPromises] = useState<LovePromise[]>([]);
  const [anniversaries, setAnniversaries] = useState<Anniversary[]>([]);
  const [dreams, setDreams] = useState<Dream[]>([]);

  // Load data from JSON files on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch all data from JSON files
        const [timelineResult, photosResult, notesResult, promisesResult, anniversariesResult, dreamsResult] = await Promise.all([
          fetchData<TimelineEvent>('timeline-events.json'),
          fetchData<Photo>('photos.json'),
          fetchData<LoveNote>('love-notes.json'),
          fetchData<LovePromise>('promises.json'),
          fetchData<Anniversary>('anniversaries.json'),
          fetchData<Dream>('dreams.json')
        ]);

        if (timelineResult.success && timelineResult.data) setTimelineEvents(timelineResult.data);
        if (photosResult.success && photosResult.data) setPhotos(photosResult.data);
        if (notesResult.success && notesResult.data) setLoveNotes(notesResult.data);
        if (promisesResult.success && promisesResult.data) setPromises(promisesResult.data);
        if (anniversariesResult.success && anniversariesResult.data) setAnniversaries(anniversariesResult.data);
        if (dreamsResult.success && dreamsResult.data) setDreams(dreamsResult.data);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, []);

  // Save data to JSON files whenever data changes
  const saveToJsonFile = async (filename: string, data: any[]) => {
    try {
      // Clean old data before saving
      const cleanedData = cleanOldData(data);
      await saveData(filename, cleanedData);
    } catch (error) {
      console.error(`Error saving ${filename}:`, error);
    }
  };

  useEffect(() => {
    if (timelineEvents.length > 0) {
      saveToJsonFile('timeline-events.json', timelineEvents);
    }
  }, [timelineEvents]);

  useEffect(() => {
    if (photos.length > 0) {
      saveToJsonFile('photos.json', photos);
    }
  }, [photos]);

  useEffect(() => {
    if (loveNotes.length > 0) {
      saveToJsonFile('love-notes.json', loveNotes);
    }
  }, [loveNotes]);

  useEffect(() => {
    if (promises.length > 0) {
      saveToJsonFile('promises.json', promises);
    }
  }, [promises]);

  useEffect(() => {
    if (anniversaries.length > 0) {
      saveToJsonFile('anniversaries.json', anniversaries);
    }
  }, [anniversaries]);

  useEffect(() => {
    if (dreams.length > 0) {
      saveToJsonFile('dreams.json', dreams);
    }
  }, [dreams]);

  // Timeline Actions
  const addTimelineEvent = (event: Omit<TimelineEvent, 'id' | 'createdAt'>) => {
    const newEvent: TimelineEvent = {
      ...event,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setTimelineEvents(prev => [...prev, newEvent]);
  };

  const updateTimelineEvent = (id: string, event: Partial<TimelineEvent>) => {
    setTimelineEvents(prev => prev.map(e => e.id === id ? { ...e, ...event } : e));
  };

  const deleteTimelineEvent = async (id: string) => {
    try {
      const result = await deleteData('timeline-events.json', id);
      if (result.success) {
        setTimelineEvents(prev => prev.filter(e => e.id !== id));
      }
    } catch (error) {
      console.error('Error deleting timeline event:', error);
    }
  };

  // Photo Actions
  const addPhoto = (photo: Omit<Photo, 'id' | 'createdAt'>) => {
    const newPhoto: Photo = {
      ...photo,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setPhotos(prev => [...prev, newPhoto]);
  };

  const updatePhoto = (id: string, photo: Partial<Photo>) => {
    setPhotos(prev => prev.map(p => p.id === id ? { ...p, ...photo } : p));
  };

  const deletePhoto = async (id: string) => {
    try {
      const result = await deleteData('photos.json', id);
      if (result.success) {
        setPhotos(prev => prev.filter(p => p.id !== id));
      }
    } catch (error) {
      console.error('Error deleting photo:', error);
    }
  };

  // Love Note Actions
  const addLoveNote = (note: Omit<LoveNote, 'id' | 'createdAt'>) => {
    const newNote: LoveNote = {
      ...note,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setLoveNotes(prev => [...prev, newNote]);
  };

  const updateLoveNote = (id: string, note: Partial<LoveNote>) => {
    setLoveNotes(prev => prev.map(n => n.id === id ? { ...n, ...note } : n));
  };

  const deleteLoveNote = async (id: string) => {
    try {
      const result = await deleteData('love-notes.json', id);
      if (result.success) {
        setLoveNotes(prev => prev.filter(n => n.id !== id));
      }
    } catch (error) {
      console.error('Error deleting love note:', error);
    }
  };

  // Promise Actions
  const addPromise = (promise: Omit<LovePromise, 'id' | 'createdAt'>) => {
    const newPromise: LovePromise = {
      ...promise,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setPromises(prev => [...prev, newPromise]);
  };

  const updatePromise = (id: string, promise: Partial<LovePromise>) => {
    setPromises(prev => prev.map(p => p.id === id ? { ...p, ...promise } : p));
  };

  const deletePromise = async (id: string) => {
    try {
      const result = await deleteData('promises.json', id);
      if (result.success) {
        setPromises(prev => prev.filter(p => p.id !== id));
      }
    } catch (error) {
      console.error('Error deleting promise:', error);
    }
  };

  // Anniversary Actions
  const addAnniversary = (anniversary: Omit<Anniversary, 'id' | 'createdAt'>) => {
    const newAnniversary: Anniversary = {
      ...anniversary,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setAnniversaries(prev => [...prev, newAnniversary]);
  };

  const updateAnniversary = (id: string, anniversary: Partial<Anniversary>) => {
    setAnniversaries(prev => prev.map(a => a.id === id ? { ...a, ...anniversary } : a));
  };

  const deleteAnniversary = async (id: string) => {
    try {
      const result = await deleteData('anniversaries.json', id);
      if (result.success) {
        setAnniversaries(prev => prev.filter(a => a.id !== id));
      }
    } catch (error) {
      console.error('Error deleting anniversary:', error);
    }
  };

  // Dream Actions
  const addDream = (dream: Omit<Dream, 'id' | 'createdAt'>) => {
    const newDream: Dream = {
      ...dream,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setDreams(prev => [...prev, newDream]);
  };

  const updateDream = (id: string, dream: Partial<Dream>) => {
    setDreams(prev => prev.map(d => d.id === id ? { ...d, ...dream } : d));
  };

  const deleteDream = async (id: string) => {
    try {
      const result = await deleteData('dreams.json', id);
      if (result.success) {
        setDreams(prev => prev.filter(d => d.id !== id));
      }
    } catch (error) {
      console.error('Error deleting dream:', error);
    }
  };

  // Clean old data to prevent quota exceeded
  const cleanOldData = (data: any[], maxItems: number = 50) => {
    if (data.length > maxItems) {
      // Keep only the most recent items
      return data
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, maxItems);
    }
    return data;
  };

  // Upload Photo to public folder
  const uploadPhoto = async (file: File): Promise<string> => {
    const result = await uploadPhotoToPublic(file);
    if (result.success && result.data) {
      return result.data;
    }
    throw new Error(result.error || 'Failed to upload photo');
  };

  const value: DataContextType = {
    timelineEvents,
    photos,
    loveNotes,
    promises,
    anniversaries,
    dreams,
    addTimelineEvent,
    updateTimelineEvent,
    deleteTimelineEvent,
    addPhoto,
    updatePhoto,
    deletePhoto,
    addLoveNote,
    updateLoveNote,
    deleteLoveNote,
    addPromise,
    updatePromise,
    deletePromise,
    addAnniversary,
    updateAnniversary,
    deleteAnniversary,
    addDream,
    updateDream,
    deleteDream,
    uploadPhoto,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
