'use client';

import { useState, useEffect } from 'react';

interface Dream {
  id: number;
  title: string;
  description: string;
  category: 'travel' | 'home' | 'career' | 'family' | 'adventure';
  priority: 'high' | 'medium' | 'low';
  targetDate: string;
  progress: number;
  steps: string[];
}

export default function FutureDreams() {
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const [mounted, setMounted] = useState(false);

  // Sample dreams
  const sampleDreams: Dream[] = [
    {
      id: 1,
      title: "Travel to Japan Together",
      description: "Experience the cherry blossoms, try authentic ramen, and explore Tokyo's vibrant culture hand in hand.",
      category: 'travel',
      priority: 'high',
      targetDate: "Spring 2025",
      progress: 30,
      steps: ["Save money", "Plan itinerary", "Book flights", "Learn basic Japanese"]
    },
    {
      id: 2,
      title: "Buy Our Dream Home",
      description: "A cozy house with a garden, a reading nook, and a kitchen where we can cook together every day.",
      category: 'home',
      priority: 'high',
      targetDate: "2026",
      progress: 15,
      steps: ["Save for down payment", "Research neighborhoods", "Get pre-approved", "Start house hunting"]
    },
    {
      id: 3,
      title: "Start a Family",
      description: "Welcome little ones into our love story and watch them grow up surrounded by our love.",
      category: 'family',
      priority: 'medium',
      targetDate: "2027",
      progress: 5,
      steps: ["Discuss timeline", "Prepare financially", "Create a loving home", "Plan for the future"]
    },
    {
      id: 4,
      title: "Learn to Dance Together",
      description: "Take ballroom dancing lessons and surprise everyone at our next anniversary party.",
      category: 'adventure',
      priority: 'low',
      targetDate: "Summer 2024",
      progress: 0,
      steps: ["Find a dance studio", "Book lessons", "Practice at home", "Plan surprise performance"]
    },
    {
      id: 5,
      title: "Start a Business Together",
      description: "Turn our shared passion into a business that allows us to work side by side every day.",
      category: 'career',
      priority: 'medium',
      targetDate: "2025",
      progress: 10,
      steps: ["Identify our passion", "Research market", "Create business plan", "Launch together"]
    },
    {
      id: 6,
      title: "Visit All 7 Continents",
      description: "Embark on the ultimate adventure and explore every continent together, creating memories worldwide.",
      category: 'travel',
      priority: 'low',
      targetDate: "2030",
      progress: 0,
      steps: ["Plan continent order", "Save for each trip", "Research destinations", "Start with Antarctica"]
    }
  ];

  useEffect(() => {
    setDreams(sampleDreams);
    setIsVisible(true);
    setMounted(true);
  }, []);

  const filteredDreams = filter === 'all' 
    ? dreams 
    : dreams.filter(dream => dream.category === filter);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'travel': return '✈️';
      case 'home': return '🏠';
      case 'career': return '💼';
      case 'family': return '👶';
      case 'adventure': return '🎯';
      default: return '💫';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'from-red-400 to-pink-400';
      case 'medium': return 'from-yellow-400 to-orange-400';
      case 'low': return 'from-green-400 to-blue-400';
      default: return 'from-pink-400 to-purple-400';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'travel': return 'from-blue-400 to-cyan-400';
      case 'home': return 'from-green-400 to-emerald-400';
      case 'career': return 'from-purple-400 to-pink-400';
      case 'family': return 'from-pink-400 to-rose-400';
      case 'adventure': return 'from-orange-400 to-red-400';
      default: return 'from-pink-400 to-purple-400';
    }
  };

  const categories = [
    { key: 'all', label: 'All Dreams', icon: '💫' },
    { key: 'travel', label: 'Travel', icon: '✈️' },
    { key: 'home', label: 'Home', icon: '🏠' },
    { key: 'career', label: 'Career', icon: '💼' },
    { key: 'family', label: 'Family', icon: '👶' },
    { key: 'adventure', label: 'Adventure', icon: '🎯' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50">
      {/* Floating Hearts Background */}
      {mounted && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(22)].map((_, i) => (
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
              ✨
            </div>
          ))}
        </div>
      )}

      {/* Header */}
      <div className="relative z-10 pt-8 pb-4 text-center">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Future Dreams ✨
        </h1>
        <p className="text-gray-600 text-lg">Plans and dreams we'll achieve together</p>
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

      {/* Dreams Grid */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 pb-8">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDreams.map((dream, index) => (
              <div
                key={dream.id}
                className={`transform transition-all duration-500 hover:scale-105 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 h-full">
                  {/* Dream Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getCategoryIcon(dream.category)}</span>
                      <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${getPriorityColor(dream.priority)}`}></div>
                    </div>
                    <span className="text-sm text-gray-500 capitalize">{dream.priority} priority</span>
                  </div>
                  
                  <div className={`w-full h-2 bg-gradient-to-r ${getCategoryColor(dream.category)} rounded-full mb-4`}></div>
                  
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {dream.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {dream.description}
                  </p>
                  
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-gray-700">Progress</span>
                      <span className="text-sm text-gray-500">{dream.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full bg-gradient-to-r ${getCategoryColor(dream.category)} transition-all duration-500`}
                        style={{ width: `${dream.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {/* Target Date */}
                  <div className="text-sm text-gray-500 mb-4">
                    Target: {dream.targetDate}
                  </div>
                  
                  {/* Steps */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-700 mb-2 text-sm">Next Steps:</h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {dream.steps.slice(0, 2).map((step, idx) => (
                        <li key={idx} className="flex items-center">
                          <span className="text-pink-400 mr-2">✨</span>
                          {step}
                        </li>
                      ))}
                      {dream.steps.length > 2 && (
                        <li className="text-gray-400 text-xs">
                          +{dream.steps.length - 2} more steps
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredDreams.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">✨</div>
              <p className="text-gray-500 text-lg">No dreams in this category yet</p>
            </div>
          )}

          {/* Add New Dream Button */}
          <div className="text-center mt-12">
            <button className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg">
              Add New Dream ✨
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pb-8">
        <p className="text-gray-500">
          💝 Every dream is a promise of our future together
        </p>
      </div>
    </div>
  );
}
