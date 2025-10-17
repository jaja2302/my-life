'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [particles, setParticles] = useState<Array<{
    width: number;
    height: number;
    left: number;
    top: number;
    delay: number;
    duration: number;
  }>>([]);
  const router = useRouter();

  // Password yang benar (bisa diganti sesuai kebutuhan)
  const correctPassword = 'admin123';

  useEffect(() => {
    setMounted(true);
    // Generate particles setelah mount untuk menghindari hydration error
    const newParticles = [...Array(50)].map(() => ({
      width: Math.random() * 4 + 1,
      height: Math.random() * 4 + 1,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 10,
      duration: 15 + Math.random() * 10
    }));
    setParticles(newParticles);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Simulasi pengecekan password
    setTimeout(() => {
      if (password === correctPassword) {
        // Animasi buka kunci
        setIsUnlocked(true);
        
        // Tunggu animasi kunci selesai, baru buka amplop
        setTimeout(() => {
          setIsOpening(true);
          
          // Tampilkan konten setelah amplop terbuka
          setTimeout(() => {
            setShowContent(true);
            
            // Redirect ke dashboard setelah 2 detik
            setTimeout(() => {
              router.push('/dashboard');
            }, 2000);
          }, 1000);
        }, 800);
      } else {
        setError('❌ Password salah! Coba lagi...');
        // Shake animation
        const envelope = document.getElementById('envelope-container');
        envelope?.classList.add('shake');
        setTimeout(() => {
          envelope?.classList.remove('shake');
        }, 500);
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleReset = () => {
    setPassword('');
    setIsUnlocked(false);
    setIsOpening(false);
    setShowContent(false);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Particles - Only render after mount */}
      {mounted && (
        <div className="absolute inset-0">
          {particles.map((particle, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full opacity-10 animate-float"
              style={{
                width: `${particle.width}px`,
                height: `${particle.height}px`,
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                animationDelay: `${particle.delay}s`,
                animationDuration: `${particle.duration}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Main Container */}
      <div 
        id="envelope-container"
        className="relative z-10"
      >
        {/* Envelope */}
        <div className={`relative w-96 h-64 transition-all duration-1000 ${isOpening ? 'scale-110' : ''}`}>
          {/* Envelope Back */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-amber-50 rounded-lg shadow-2xl">
            {/* Pattern */}
            <div className="absolute inset-2 border-2 border-amber-200 rounded-lg opacity-30"></div>
            <div className="absolute inset-4 border-2 border-amber-200 rounded-lg opacity-20"></div>
          </div>

          {/* Envelope Flap */}
          <div 
            className={`absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-amber-200 to-amber-100 shadow-lg transition-all duration-1000 origin-top ${
              isOpening ? 'rotate-x-180' : ''
            }`}
            style={{
              clipPath: 'polygon(0 0, 50% 100%, 100% 0)',
              transformStyle: 'preserve-3d',
              transform: isOpening ? 'rotateX(-180deg)' : 'rotateX(0deg)'
            }}
          >
            {/* Wax Seal / Lock */}
            {!isUnlocked && (
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
                <div className="relative">
                  {/* Lock Background */}
                  <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-800 rounded-full shadow-xl flex items-center justify-center">
                    {/* Lock Icon */}
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  
                  {/* Glow Effect when Unlocked */}
                  {isUnlocked && (
                    <div className="absolute inset-0 w-16 h-16 bg-green-400 rounded-full animate-ping"></div>
                  )}
                </div>
              </div>
            )}

            {/* Unlocked Icon */}
            {isUnlocked && !isOpening && (
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
                <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-800 rounded-full shadow-xl flex items-center justify-center animate-bounce">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            )}
          </div>

          {/* Letter Content (Shows when opening) */}
          {showContent && (
            <div className="absolute inset-x-4 top-8 bg-white rounded-lg p-6 shadow-xl animate-slideUp">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">🎉 Selamat!</h2>
              <p className="text-gray-600 mb-4">
                Kamu berhasil membuka amplopnya! 
              </p>
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                <span className="ml-3 text-gray-600">Redirecting to dashboard...</span>
              </div>
            </div>
          )}

          {/* Password Form (Below Envelope) */}
          {!isUnlocked && (
            <div className="absolute -bottom-32 left-1/2 transform -translate-x-1/2 w-80">
              <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-2xl">
                <div className="text-center mb-4">
                  <h1 className="text-2xl font-bold text-white mb-1">🔐 Secret Envelope</h1>
                  <p className="text-gray-300 text-sm">Masukkan password untuk membuka</p>
                </div>

                <div className="space-y-4">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password..."
                    className="w-full px-4 py-3 rounded-lg bg-white/20 backdrop-blur text-white placeholder-gray-300 border border-white/30 focus:border-purple-400 focus:outline-none transition-all"
                    required
                    disabled={isLoading}
                  />

                  {error && (
                    <div className="text-red-400 text-sm text-center animate-pulse">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                        </svg>
                        Unlocking...
                      </span>
                    ) : (
                      'Unlock Envelope 🔓'
                    )}
                  </button>
                </div>

                <p className="text-center text-gray-400 text-xs mt-4">
                  Hint: Try "admin123" 😉
                </p>
              </form>
            </div>
          )}

          {/* Success State - Try Again Button */}
          {showContent && (
            <button
              onClick={handleReset}
              className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur text-white px-6 py-2 rounded-lg hover:bg-white/20 transition-all"
            >
              Try Again
            </button>
          )}
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          33% { transform: translateY(-30px) translateX(20px); }
          66% { transform: translateY(30px) translateX(-20px); }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-float {
          animation: float linear infinite;
        }

        .animate-slideUp {
          animation: slideUp 0.5s ease-out;
        }

        .shake {
          animation: shake 0.5s;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
          20%, 40%, 60%, 80% { transform: translateX(10px); }
        }

        .rotate-x-180 {
          transform: rotateX(-180deg) !important;
        }
      `}</style>
    </div>
  );
}