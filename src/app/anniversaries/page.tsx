'use client';

import { useState, useEffect } from 'react';
import { useData } from '@/context/DataContext';
import UploadModal from '@/components/UploadModal';

export default function Anniversaries() {
  const { anniversaries } = useData();
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    setMounted(true);
  }, []);

  const getAnniversaryIcon = (years: number) => {
    if (years >= 10) return '💎';
    if (years >= 5) return '💍';
    if (years >= 3) return '💕';
    if (years >= 1) return '🌹';
    return '💖';
  };

  const getAnniversaryColor = (years: number) => {
    if (years >= 10) return 'from-purple-500 to-pink-500';
    if (years >= 5) return 'from-pink-500 to-rose-500';
    if (years >= 3) return 'from-rose-500 to-red-500';
    if (years >= 1) return 'from-red-500 to-pink-500';
    return 'from-pink-400 to-purple-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 border-4 border-black">

      {/* Floating Hearts Background */}
      {mounted && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
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
          Our Anniversaries 🎉
        </h1>
        <p className="text-gray-600 text-lg">Special dates that mark our love story</p>
      </div>

      {/* Upcoming Anniversary Alert */}
      {anniversaries.some(a => a.isUpcoming) && (
        <div className="relative z-10 max-w-4xl mx-auto px-4 mb-8">
          <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-3xl p-6 shadow-lg">
            <div className="text-center">
              <div className="text-4xl mb-2">🎊</div>
              <h2 className="text-2xl font-bold mb-2">Upcoming Anniversary!</h2>
              <p className="text-lg">
                {anniversaries.find(a => a.isUpcoming)?.title} is in {anniversaries.find(a => a.isUpcoming)?.daysUntil} days!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Anniversaries Grid */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 pb-8">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {anniversaries.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {anniversaries.map((anniversary, index) => (
              <div
                key={anniversary.id}
                className={`transform transition-all duration-500 hover:scale-105 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 h-full ${
                  anniversary.isUpcoming ? 'ring-2 ring-pink-400' : ''
                }`}>
                  {/* Anniversary Header */}
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-2">{getAnniversaryIcon(anniversary.years)}</div>
                    <div className={`w-full h-2 bg-gradient-to-r ${getAnniversaryColor(anniversary.years)} rounded-full mb-3`}></div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1">
                      {anniversary.title}
                    </h3>
                    <div className="text-pink-600 font-semibold text-lg">
                      {anniversary.date}
                    </div>
                    <div className="text-2xl font-bold text-gray-700">
                      {anniversary.years} {anniversary.years === 1 ? 'Year' : 'Years'}
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed text-center">
                    {anniversary.description}
                  </p>
                  
                  {/* Memories */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-700 mb-2 text-center">Sweet Memories:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {anniversary.memories.map((memory, idx) => (
                        <li key={idx} className="flex items-center">
                          <span className="text-pink-400 mr-2">💕</span>
                          {memory}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {anniversary.isUpcoming && (
                    <div className="text-center">
                      <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl p-3">
                        <div className="text-pink-600 font-semibold">
                          {anniversary.daysUntil} days to go! 🎉
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">No Anniversaries Yet</h3>
              <p className="text-gray-600 mb-8">Start celebrating your special moments together!</p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Add First Anniversary 💕
              </button>
            </div>
          )}

          {/* Add New Anniversary Button */}
          {anniversaries.length > 0 && (
            <div className="text-center mt-12">
              <button
                onClick={() => setShowUploadModal(true)}
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Add New Anniversary 💕
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pb-8">
        <p className="text-gray-500">
          💝 Every anniversary is a milestone in our love story
        </p>
      </div>

      {/* Upload Modal */}
      <UploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        type="anniversary"
      />
    </div>
  );
}
