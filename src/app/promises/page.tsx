'use client';

import { useState, useEffect } from 'react';

interface Promise {
  id: number;
  title: string;
  description: string;
  date: string;
  status: 'kept' | 'in-progress' | 'future';
  category: 'love' | 'support' | 'adventure' | 'growth';
}

export default function OurPromises() {
  const [promises, setPromises] = useState<Promise[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [filter, setFilter] = useState<string>('all');

  // Sample promises
  const samplePromises: Promise[] = [
    {
      id: 1,
      title: "Always Support Your Dreams",
      description: "I promise to always be your biggest cheerleader and support you in pursuing your dreams, no matter how big or small.",
      date: "Jan 15, 2020",
      status: 'kept',
      category: 'support'
    },
    {
      id: 2,
      title: "Love You Unconditionally",
      description: "I promise to love you through the good times and the challenging ones, accepting you completely as you are.",
      date: "Feb 14, 2020",
      status: 'kept',
      category: 'love'
    },
    {
      id: 3,
      title: "Travel the World Together",
      description: "I promise we'll explore at least one new country every year, creating memories and adventures together.",
      date: "Aug 10, 2021",
      status: 'in-progress',
      category: 'adventure'
    },
    {
      id: 4,
      title: "Grow Together",
      description: "I promise we'll always work on growing as individuals and as a couple, learning and evolving together.",
      date: "Mar 15, 2021",
      status: 'in-progress',
      category: 'growth'
    },
    {
      id: 5,
      title: "Build Our Dream Home",
      description: "I promise we'll create a beautiful home together, filled with love, laughter, and our favorite memories.",
      date: "Future",
      status: 'future',
      category: 'love'
    },
    {
      id: 6,
      title: "Always Communicate",
      description: "I promise to always communicate openly and honestly, sharing my thoughts, feelings, and concerns with you.",
      date: "Jun 20, 2021",
      status: 'kept',
      category: 'love'
    }
  ];

  useEffect(() => {
    setPromises(samplePromises);
    setIsVisible(true);
  }, []);

  const filteredPromises = filter === 'all' 
    ? promises 
    : promises.filter(promise => promise.status === filter);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'kept': return '✅';
      case 'in-progress': return '🔄';
      case 'future': return '⭐';
      default: return '💕';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'kept': return 'from-green-400 to-emerald-400';
      case 'in-progress': return 'from-blue-400 to-cyan-400';
      case 'future': return 'from-purple-400 to-pink-400';
      default: return 'from-pink-400 to-rose-400';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'love': return '💕';
      case 'support': return '🤝';
      case 'adventure': return '✈️';
      case 'growth': return '🌱';
      default: return '💝';
    }
  };

  const filters = [
    { key: 'all', label: 'All Promises', icon: '💝' },
    { key: 'kept', label: 'Kept', icon: '✅' },
    { key: 'in-progress', label: 'In Progress', icon: '🔄' },
    { key: 'future', label: 'Future', icon: '⭐' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50">
      {/* Floating Hearts Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(18)].map((_, i) => (
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
          Our Promises 💍
        </h1>
        <p className="text-gray-600 text-lg">Vows and commitments we made to each other</p>
      </div>

      {/* Filter Buttons */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 mb-8">
        <div className="flex flex-wrap justify-center gap-3">
          {filters.map((filterItem) => (
            <button
              key={filterItem.key}
              onClick={() => setFilter(filterItem.key)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                filter === filterItem.key
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg scale-105'
                  : 'bg-white/80 text-gray-600 hover:bg-white hover:scale-105'
              }`}
            >
              <span className="mr-2">{filterItem.icon}</span>
              {filterItem.label}
            </button>
          ))}
        </div>
      </div>

      {/* Promises Grid */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 pb-8">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPromises.map((promise, index) => (
              <div
                key={promise.id}
                className={`transform transition-all duration-500 hover:scale-105 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 h-full">
                  {/* Status Badge */}
                  <div className={`w-full h-2 bg-gradient-to-r ${getStatusColor(promise.status)} rounded-full mb-4`}></div>
                  
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getCategoryIcon(promise.category)}</span>
                      <span className="text-2xl">{getStatusIcon(promise.status)}</span>
                    </div>
                    <span className="text-sm text-gray-500 capitalize">{promise.status.replace('-', ' ')}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {promise.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {promise.description}
                  </p>
                  
                  <div className="text-sm text-gray-500">
                    {promise.date}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredPromises.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">💍</div>
              <p className="text-gray-500 text-lg">No promises in this category yet</p>
            </div>
          )}

          {/* Add New Promise Button */}
          <div className="text-center mt-12">
            <button className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg">
              Make a New Promise 💕
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pb-8">
        <p className="text-gray-500">
          💝 Every promise is a commitment to our forever
        </p>
      </div>
    </div>
  );
}
