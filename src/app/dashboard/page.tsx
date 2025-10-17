'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useData } from '@/context/DataContext';
import DataManager from '@/components/DataManager';
import StorageManager from '@/components/StorageManager';
import PasswordManager from '@/components/PasswordManager';
import { loadConfig } from '@/utils/config';

export default function Dashboard() {
  const { timelineEvents, photos, loveNotes, promises, anniversaries, dreams } = useData();
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('23');
  const router = useRouter();

  useEffect(() => {
    setIsVisible(true);
    setMounted(true);
    
    // Load current password
    const loadCurrentPassword = async () => {
      try {
        const config = await loadConfig();
        setCurrentPassword(config.password);
      } catch (error) {
        console.log('Using default password');
      }
    };
    
    loadCurrentPassword();
  }, []);

  const menuItems = [
    {
      title: "Our Timeline",
      description: "Journey through our love story",
      icon: "💕",
      color: "from-pink-500 to-rose-500",
      href: "/timeline"
    },
    {
      title: "Photo Gallery",
      description: "Beautiful memories captured",
      icon: "📸",
      color: "from-purple-500 to-pink-500",
      href: "/gallery"
    },
    {
      title: "Love Notes",
      description: "Sweet messages to each other",
      icon: "💌",
      color: "from-blue-500 to-purple-500",
      href: "/notes"
    },
    {
      title: "Our Promises",
      description: "Vows and commitments we made",
      icon: "💍",
      color: "from-red-500 to-pink-500",
      href: "/promises"
    },
    {
      title: "Anniversaries",
      description: "Special dates to remember",
      icon: "🎉",
      color: "from-yellow-500 to-orange-500",
      href: "/anniversaries"
    },
    {
      title: "Future Dreams",
      description: "Plans and dreams together",
      icon: "✨",
      color: "from-green-500 to-blue-500",
      href: "/dreams"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50">
      {/* Floating Hearts Background */}
      {mounted && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(25)].map((_, i) => (
            <div
              key={i}
              className="absolute text-pink-200 opacity-20 animate-pulse"
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
      )}

      {/* Header */}
      <div className="relative z-10 pt-4 pb-4 text-center">
        <div className="flex justify-between items-center mb-4">
          <div></div>
          <div className="flex-1">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Welcome Home 💕
            </h1>
            <p className="text-gray-600 text-xl">Our little corner of the internet, filled with love</p>
          </div>
          <div className="flex gap-2">
            <PasswordManager 
              currentPassword={currentPassword} 
              onPasswordUpdate={setCurrentPassword}
            />
            <DataManager />
            <StorageManager />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 pb-8">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg">
              <div className="text-3xl mb-2">💕</div>
              <div className="text-2xl font-bold text-pink-600 mb-1">{timelineEvents.length}</div>
              <div className="text-gray-600">Timeline Events</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg">
              <div className="text-3xl mb-2">📸</div>
              <div className="text-2xl font-bold text-purple-600 mb-1">{photos.length}</div>
              <div className="text-gray-600">Photos Uploaded</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg">
              <div className="text-3xl mb-2">💌</div>
              <div className="text-2xl font-bold text-rose-600 mb-1">{loveNotes.length}</div>
              <div className="text-gray-600">Love Notes</div>
            </div>
          </div>

          {/* Menu Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item, index) => (
              <Link
                key={item.title}
                href={item.href}
                className={`group transform transition-all duration-500 hover:scale-105 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 h-full">
                  <div className="text-center">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${item.color} flex items-center justify-center text-2xl shadow-lg`}>
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-pink-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Love Quote */}
          <div className="mt-12 text-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg max-w-4xl mx-auto">
              <div className="text-4xl mb-4">💕</div>
              <blockquote className="text-xl text-gray-700 italic mb-4">
                "In all the world, there is no heart for me like yours. In all the world, there is no love for you like mine."
              </blockquote>
              <p className="text-pink-600 font-semibold">- Maya Angelou</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pb-8">
        <p className="text-gray-500">
          💝 Made with infinite love for our beautiful journey
        </p>
      </div>
    </div>
  );
}
