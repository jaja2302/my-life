'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Photo {
  id: number;
  src: string;
  alt: string;
  date: string;
  caption: string;
  category: 'date' | 'travel' | 'home' | 'special';
}

export default function Gallery() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Sample photo data - replace with your real photos
  const samplePhotos: Photo[] = [
    {
      id: 1,
      src: "/api/placeholder/400/300",
      alt: "First date at the café",
      date: "Feb 14, 2020",
      caption: "Our first date - nervous but excited!",
      category: 'date'
    },
    {
      id: 2,
      src: "/api/placeholder/400/300",
      alt: "Beach sunset",
      date: "Aug 10, 2021",
      caption: "Watching the sunset together in Bali",
      category: 'travel'
    },
    {
      id: 3,
      src: "/api/placeholder/400/300",
      alt: "Cooking together",
      date: "Mar 15, 2021",
      caption: "Our first meal in our new home",
      category: 'home'
    },
    {
      id: 4,
      src: "/api/placeholder/400/300",
      alt: "Anniversary dinner",
      date: "Feb 14, 2022",
      caption: "Two years of love and counting",
      category: 'special'
    },
    {
      id: 5,
      src: "/api/placeholder/400/300",
      alt: "Movie night",
      date: "Dec 25, 2020",
      caption: "Christmas movie marathon",
      category: 'home'
    },
    {
      id: 6,
      src: "/api/placeholder/400/300",
      alt: "Mountain hike",
      date: "Jun 20, 2021",
      caption: "Conquering mountains together",
      category: 'travel'
    },
    {
      id: 7,
      src: "/api/placeholder/400/300",
      alt: "Birthday surprise",
      date: "Jul 15, 2021",
      caption: "The best birthday surprise ever!",
      category: 'special'
    },
    {
      id: 8,
      src: "/api/placeholder/400/300",
      alt: "Coffee date",
      date: "Jan 15, 2020",
      caption: "Where it all began",
      category: 'date'
    }
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setPhotos(samplePhotos);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredPhotos = filter === 'all' 
    ? photos 
    : photos.filter(photo => photo.category === filter);

  const categories = [
    { key: 'all', label: 'All Memories', icon: '📸' },
    { key: 'date', label: 'Dates', icon: '💕' },
    { key: 'travel', label: 'Travel', icon: '✈️' },
    { key: 'home', label: 'Home', icon: '🏠' },
    { key: 'special', label: 'Special', icon: '🎉' }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-pink-600 text-lg">Loading our beautiful memories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50">
      {/* Floating Hearts Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute text-pink-200 opacity-20 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          >
            💕
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 pt-8 pb-4 text-center">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Our Photo Gallery 📸
        </h1>
        <p className="text-gray-600 text-lg">Every picture tells our love story</p>
      </div>

      {/* Filter Buttons */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 mb-8">
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((category) => (
            <button
              key={category.key}
              onClick={() => setFilter(category.key)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                filter === category.key
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg scale-105'
                  : 'bg-white/80 text-gray-600 hover:bg-white hover:scale-105'
              }`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Photo Grid */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPhotos.map((photo, index) => (
            <div
              key={photo.id}
              className="group cursor-pointer transform transition-all duration-500 hover:scale-105"
              onClick={() => setSelectedPhoto(photo)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Photo Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="font-semibold text-sm">{photo.caption}</p>
                    <p className="text-xs opacity-90">{photo.date}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPhotos.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📷</div>
            <p className="text-gray-500 text-lg">No photos in this category yet</p>
          </div>
        )}
      </div>

      {/* Photo Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="relative">
              <Image
                src={selectedPhoto.src}
                alt={selectedPhoto.alt}
                width={800}
                height={600}
                className="w-full h-96 object-cover"
              />
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 bg-white/80 hover:bg-white text-gray-600 p-2 rounded-full transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {selectedPhoto.caption}
              </h3>
              <p className="text-pink-600 font-semibold mb-4">
                {selectedPhoto.date}
              </p>
              <p className="text-gray-600">
                {selectedPhoto.alt}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="text-center pb-8">
        <p className="text-gray-500">
          💝 Every photo is a moment of our love story
        </p>
      </div>
    </div>
  );
}
