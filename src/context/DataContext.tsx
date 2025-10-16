'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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

export interface Promise {
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
  promises: Promise[];
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
  addPromise: (promise: Omit<Promise, 'id' | 'createdAt'>) => void;
  updatePromise: (id: string, promise: Partial<Promise>) => void;
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
  const [promises, setPromises] = useState<Promise[]>([]);
  const [anniversaries, setAnniversaries] = useState<Anniversary[]>([]);
  const [dreams, setDreams] = useState<Dream[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const loadData = () => {
      try {
        const timelineData = localStorage.getItem('timelineEvents');
        const photosData = localStorage.getItem('photos');
        const notesData = localStorage.getItem('loveNotes');
        const promisesData = localStorage.getItem('promises');
        const anniversariesData = localStorage.getItem('anniversaries');
        const dreamsData = localStorage.getItem('dreams');

        if (timelineData) setTimelineEvents(JSON.parse(timelineData));
        if (photosData) setPhotos(JSON.parse(photosData));
        if (notesData) setLoveNotes(JSON.parse(notesData));
        if (promisesData) setPromises(JSON.parse(promisesData));
        if (anniversariesData) setAnniversaries(JSON.parse(anniversariesData));
        if (dreamsData) setDreams(JSON.parse(dreamsData));
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, []);

  // Save data to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('timelineEvents', JSON.stringify(timelineEvents));
  }, [timelineEvents]);

  useEffect(() => {
    localStorage.setItem('photos', JSON.stringify(photos));
  }, [photos]);

  useEffect(() => {
    localStorage.setItem('loveNotes', JSON.stringify(loveNotes));
  }, [loveNotes]);

  useEffect(() => {
    localStorage.setItem('promises', JSON.stringify(promises));
  }, [promises]);

  useEffect(() => {
    localStorage.setItem('anniversaries', JSON.stringify(anniversaries));
  }, [anniversaries]);

  useEffect(() => {
    localStorage.setItem('dreams', JSON.stringify(dreams));
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

  const deleteTimelineEvent = (id: string) => {
    setTimelineEvents(prev => prev.filter(e => e.id !== id));
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

  const deletePhoto = (id: string) => {
    setPhotos(prev => prev.filter(p => p.id !== id));
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

  const deleteLoveNote = (id: string) => {
    setLoveNotes(prev => prev.filter(n => n.id !== id));
  };

  // Promise Actions
  const addPromise = (promise: Omit<Promise, 'id' | 'createdAt'>) => {
    const newPromise: Promise = {
      ...promise,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setPromises(prev => [...prev, newPromise]);
  };

  const updatePromise = (id: string, promise: Partial<Promise>) => {
    setPromises(prev => prev.map(p => p.id === id ? { ...p, ...promise } : p));
  };

  const deletePromise = (id: string) => {
    setPromises(prev => prev.filter(p => p.id !== id));
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

  const deleteAnniversary = (id: string) => {
    setAnniversaries(prev => prev.filter(a => a.id !== id));
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

  const deleteDream = (id: string) => {
    setDreams(prev => prev.filter(d => d.id !== id));
  };

  // Upload Photo
  const uploadPhoto = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        resolve(result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
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
