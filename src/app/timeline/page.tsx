'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface TimelineEvent {
  id: number;
  date: string;
  title: string;
  description: string;
  image: string;
  type: 'milestone' | 'memory' | 'anniversary';
}

export default function Timeline() {
  const [currentEvent, setCurrentEvent] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Sample timeline data - replace with your real memories
  const timelineEvents: TimelineEvent[] = [
    {
      id: 1,
      date: "January 15, 2020",
      title: "First Meeting 💕",
      description: "The day our eyes met and hearts skipped a beat. Little did we know this was the beginning of forever.",
      image: "/api/placeholder/400/300",
      type: 'milestone'
    },
    {
      id: 2,
      date: "February 14, 2020",
      title: "First Date 🌹",
      description: "Our first official date at that cozy café. The conversation flowed like magic, and we knew this was special.",
      image: "/api/placeholder/400/300",
      type: 'memory'
    },
    {
      id: 3,
      date: "June 20, 2020",
      title: "First 'I Love You' 💖",
      description: "Under the stars, you said those three magical words that changed everything. My heart has been yours ever since.",
      image: "/api/placeholder/400/300",
      type: 'milestone'
    },
    {
      id: 4,
      date: "December 25, 2020",
      title: "First Christmas Together 🎄",
      description: "Waking up next to you on Christmas morning was the best gift I could ever ask for.",
      image: "/api/placeholder/400/300",
      type: 'memory'
    },
    {
      id: 5,
      date: "March 15, 2021",
      title: "Moving In Together 🏠",
      description: "The day we became roommates for life. Our little home filled with love, laughter, and endless cuddles.",
      image: "/api/placeholder/400/300",
      type: 'milestone'
    },
    {
      id: 6,
      date: "August 10, 2021",
      title: "Our First Trip ✈️",
      description: "Exploring the world together, hand in hand. Every destination became more beautiful because you were there.",
      image: "/api/placeholder/400/300",
      type: 'memory'
    },
    {
      id: 7,
      date: "February 14, 2022",
      title: "Two Years of Love 💝",
      description: "Two years of growing together, learning about each other, and falling deeper in love every single day.",
      image: "/api/placeholder/400/300",
      type: 'anniversary'
    }
  ];

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const nextEvent = () => {
    setCurrentEvent((prev) => (prev + 1) % timelineEvents.length);
  };

  const prevEvent = () => {
    setCurrentEvent((prev) => (prev - 1 + timelineEvents.length) % timelineEvents.length);
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'milestone': return '⭐';
      case 'memory': return '📸';
      case 'anniversary': return '💍';
      default: return '💕';
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'milestone': return 'from-yellow-400 to-orange-400';
      case 'memory': return 'from-blue-400 to-purple-400';
      case 'anniversary': return 'from-pink-400 to-red-400';
      default: return 'from-pink-400 to-purple-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50">
      {/* Floating Hearts Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute text-pink-200 opacity-30 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${4 + Math.random() * 3}s`
            }}
          >
            💕
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 pt-8 pb-4 text-center">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Our Love Timeline 💕
        </h1>
        <p className="text-gray-600 text-lg">Every moment, every memory, every heartbeat</p>
      </div>

      {/* Timeline Container */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 pb-8">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Current Event Display */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden mb-8">
            <div className="relative">
              {/* Event Image */}
              <div className="h-80 relative overflow-hidden">
                <Image
                  src={timelineEvents[currentEvent].image}
                  alt={timelineEvents[currentEvent].title}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                
                {/* Event Type Badge */}
                <div className={`absolute top-4 right-4 px-4 py-2 rounded-full bg-gradient-to-r ${getEventColor(timelineEvents[currentEvent].type)} text-white font-semibold flex items-center gap-2`}>
                  <span>{getEventIcon(timelineEvents[currentEvent].type)}</span>
                  <span className="capitalize">{timelineEvents[currentEvent].type}</span>
                </div>
              </div>

              {/* Event Content */}
              <div className="p-8">
                <div className="text-center mb-6">
                  <div className="text-2xl font-bold text-gray-800 mb-2">
                    {timelineEvents[currentEvent].title}
                  </div>
                  <div className="text-pink-600 font-semibold text-lg">
                    {timelineEvents[currentEvent].date}
                  </div>
                </div>
                
                <p className="text-gray-600 text-lg leading-relaxed text-center">
                  {timelineEvents[currentEvent].description}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-center items-center gap-4 mb-8">
            <button
              onClick={prevEvent}
              className="bg-white/80 hover:bg-white text-pink-600 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
            >
              ←
            </button>
            
            {/* Event Indicators */}
            <div className="flex gap-2">
              {timelineEvents.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentEvent(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentEvent 
                      ? 'bg-pink-500 scale-125' 
                      : 'bg-pink-200 hover:bg-pink-300'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextEvent}
              className="bg-white/80 hover:bg-white text-pink-600 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
            >
              →
            </button>
          </div>

          {/* Timeline Progress */}
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-2">
              Memory {currentEvent + 1} of {timelineEvents.length}
            </div>
            <div className="w-full bg-pink-100 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-pink-400 to-purple-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${((currentEvent + 1) / timelineEvents.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pb-8">
        <p className="text-gray-500">
          💝 Made with love for our beautiful journey together
        </p>
      </div>
    </div>
  );
}
