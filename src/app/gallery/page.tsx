'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useData } from '@/context/DataContext';
import UploadModal from '@/components/UploadModal';

export default function Gallery() {
  const { photos } = useData();
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);
  const [filter, setFilter] = useState<string>('all');
  const [mounted, setMounted] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    setMounted(true);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50">
      {/* Floating Hearts Background */}
      {mounted && (
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
      )}

      {/* Header */}
      <div className="relative z-10 pt-8 pb-4 text-center">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Our Photo Gallery 📸
        </h1>
        <p className="text-gray-600 text-lg">Every picture tells our love story</p>
      </div>

      {/* Filter Buttons */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 mb-4">
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
        {photos.length > 0 ? (
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
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📷</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">No Photos Yet</h3>
            <p className="text-gray-600 mb-8">Start building your photo gallery by uploading your first memory!</p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Upload First Photo 📸
            </button>
          </div>
        )}

        {photos.length > 0 && filteredPhotos.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📷</div>
            <p className="text-gray-500 text-lg">No photos in this category yet</p>
          </div>
        )}

        {/* Add More Button */}
        {photos.length > 0 && (
          <div className="text-center mt-8">
            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Upload More Photos 📸
            </button>
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

      {/* Upload Modal */}
      <UploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        type="photo"
      />
    </div>
  );
}
