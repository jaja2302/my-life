'use client';

import { useState, useEffect } from 'react';
import { useData } from '@/context/DataContext';
import UploadModal from '@/components/UploadModal';

export default function LoveNotes() {
  const { loveNotes } = useData();
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 lg:ml-80">
      {/* Floating Hearts Background */}
      {mounted && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
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
      <div className="relative z-10 pt-4 pb-4 text-center">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Love Notes 💌
        </h1>
        <p className="text-gray-600 text-lg">Sweet messages from the heart</p>
      </div>

      {/* Notes Grid */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 pb-8">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {loveNotes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loveNotes.map((note, index) => (
                <div
                  key={note.id}
                  className={`transform transition-all duration-500 hover:scale-105 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 h-full">
                    <div className={`w-full h-2 bg-gradient-to-r ${note.color} rounded-full mb-4`}></div>
                    
                    <h3 className="text-xl font-bold text-gray-800 mb-3">
                      {note.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {note.content}
                    </p>
                    
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>{note.date}</span>
                      <span className="font-semibold">{note.from}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">💌</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">No Love Notes Yet</h3>
              <p className="text-gray-600 mb-8">Start writing sweet messages to each other!</p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Write First Love Note 💕
              </button>
            </div>
          )}

          {/* Add New Note Button */}
          {loveNotes.length > 0 && (
            <div className="text-center mt-12">
              <button
                onClick={() => setShowUploadModal(true)}
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Write a Love Note 💕
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pb-8">
        <p className="text-gray-500">
          💝 Every note is a piece of our love story
        </p>
      </div>

      {/* Upload Modal */}
      <UploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        type="note"
      />
    </div>
  );
}
