'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // Romantic questions as passwords
  const questions = [
    "What was our first date?",
    "Where did we first meet?",
    "What's our anniversary date?",
    "What's my favorite flower?",
    "What's our special song?"
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate romantic password check
    setTimeout(() => {
      if (answer.toLowerCase().includes('love') || answer.toLowerCase().includes('forever')) {
        router.push('/dashboard');
      } else {
        setError('💔 That\'s not quite right... Try again with your heart 💕');
        setCurrentQuestion((prev) => (prev + 1) % questions.length);
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-rose-100 flex items-center justify-center p-4">
      {/* Floating Hearts Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute text-pink-300 opacity-20 animate-pulse"
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

      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 max-w-md w-full text-center relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-pink-200 rounded-full opacity-30"></div>
        <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-200 rounded-full opacity-30"></div>
        
        <div className="relative z-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Our Love Story 💕
          </h1>
          <p className="text-gray-600 mb-8">Enter our special world</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <label className="block text-lg font-medium text-gray-700">
                {questions[currentQuestion]}
              </label>
              <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer with love..."
                className="w-full px-4 py-3 rounded-xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none transition-colors text-center text-lg"
                required
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm animate-bounce">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-xl font-semibold text-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Checking our love...
                </span>
              ) : (
                'Enter Our World 💖'
              )}
            </button>
          </form>

          <p className="text-sm text-gray-500 mt-6">
            💝 This is our private space, filled with memories and promises
          </p>
        </div>
      </div>
    </div>
  );
}
