'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Don't show navigation on login page
  if (pathname === '/') {
    return null;
  }

  const navItems = [
    { href: '/dashboard', label: 'Home', icon: '🏠' },
    { href: '/timeline', label: 'Timeline', icon: '💕' },
    { href: '/gallery', label: 'Gallery', icon: '📸' },
    { href: '/notes', label: 'Notes', icon: '💌' },
    { href: '/promises', label: 'Promises', icon: '💍' },
    { href: '/anniversaries', label: 'Anniversaries', icon: '🎉' },
    { href: '/dreams', label: 'Dreams', icon: '✨' }
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 lg:hidden"
      >
        <div className="w-6 h-6 flex flex-col justify-center items-center">
          <span className={`block w-5 h-0.5 bg-pink-600 transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-1' : ''}`}></span>
          <span className={`block w-5 h-0.5 bg-pink-600 transition-all duration-300 mt-1 ${isOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block w-5 h-0.5 bg-pink-600 transition-all duration-300 mt-1 ${isOpen ? '-rotate-45 -translate-y-1' : ''}`}></span>
        </div>
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Navigation Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-white/95 backdrop-blur-lg shadow-2xl z-50 transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:static lg:shadow-none lg:bg-transparent`}>
        <div className="p-6 h-full flex flex-col">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Our Love Story 💕
            </h1>
            <p className="text-gray-500 text-sm mt-1">Made with love</p>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                      pathname === item.href
                        ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
                        : 'text-gray-600 hover:bg-pink-50 hover:text-pink-600'
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <div className="mt-auto pt-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-gray-500 text-sm">
                💝 Every moment is precious
              </p>
            </div>
          </div>
        </div>
      </div>

    </>
  );
}
