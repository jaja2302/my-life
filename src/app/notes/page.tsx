'use client';

import { useState, useEffect } from 'react';

interface LoveNote {
  id: number;
  title: string;
  content: string;
  date: string;
  from: string;
  color: string;
}

export default function LoveNotes() {
  const [notes, setNotes] = useState<LoveNote[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  // Sample love notes
  const sampleNotes: LoveNote[] = [
    {
      id: 1,
      title: "Good Morning Beautiful",
      content: "Waking up next to you is the best part of my day. Your smile is my sunshine, and your laugh is my favorite sound. I love you more than words can express.",
      date: "Today",
      from: "Your Loving Partner",
      color: "from-pink-400 to-rose-400"
    },
    {
      id: 2,
      title: "Thank You",
      content: "Thank you for being my rock, my best friend, and my greatest love. You make every day better just by being in it. I'm so grateful for you.",
      date: "Yesterday",
      from: "Your Grateful Heart",
      color: "from-purple-400 to-pink-400"
    },
    {
      id: 3,
      title: "I Miss You",
      content: "Even when you're right next to me, I miss you. Your presence fills my heart with so much joy that I can't help but want more of you.",
      date: "2 days ago",
      from: "Your Adoring Partner",
      color: "from-blue-400 to-purple-400"
    },
    {
      id: 4,
      title: "You're Amazing",
      content: "The way you care for others, the way you love me, the way you see the world - everything about you amazes me. You're truly one of a kind.",
      date: "3 days ago",
      from: "Your Biggest Fan",
      color: "from-green-400 to-blue-400"
    }
  ];

  useEffect(() => {
    setNotes(sampleNotes);
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50">
      {/* Floating Hearts Background */}
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

      {/* Header */}
      <div className="relative z-10 pt-8 pb-4 text-center">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Love Notes 💌
        </h1>
        <p className="text-gray-600 text-lg">Sweet messages from the heart</p>
      </div>

      {/* Notes Grid */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 pb-8">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note, index) => (
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

          {/* Add New Note Button */}
          <div className="text-center mt-12">
            <button className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg">
              Write a Love Note 💕
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pb-8">
        <p className="text-gray-500">
          💝 Every note is a piece of our love story
        </p>
      </div>
    </div>
  );
}
