'use client';

import React, { useState, useRef, useEffect } from 'react';

interface AudioPlayerProps {
  src: string;
  title?: string;
  autoplay?: boolean;
}

export default function AudioPlayer({ src, title = "Our Love Song", autoplay = false }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [autoplayAttempted, setAutoplayAttempted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => {
      setDuration(audio.duration);
      setIsLoaded(true);
    };
    const handleEnded = () => setIsPlaying(false);
    const handleLoadStart = () => setIsLoaded(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadstart', handleLoadStart);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadstart', handleLoadStart);
    };
  }, []);

  // Autoplay effect
  useEffect(() => {
    if (autoplay && isLoaded && !isPlaying && !autoplayAttempted) {
      const audio = audioRef.current;
      if (audio) {
        setAutoplayAttempted(true);
        audio.play().then(() => {
          setIsPlaying(true);
        }).catch((error) => {
          console.log('Autoplay failed:', error);
          // Autoplay might be blocked by browser, that's okay
        });
      }
    }
  }, [autoplay, isLoaded, isPlaying, autoplayAttempted]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.log('Audio play failed:', error);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = parseFloat(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newVolume = parseFloat(e.target.value);
    audio.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.volume = volume;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={src}
        loop
        preload="metadata"
        onLoadedMetadata={() => {
          if (audioRef.current) {
            audioRef.current.volume = volume;
          }
        }}
      />
      
      <div className={`audio-player ${isExpanded ? 'expanded' : ''}`}>
        <div className="audio-player-content">
          {/* Song info */}
          <div className="song-info" onClick={() => setIsExpanded(!isExpanded)}>
            <div className={`song-icon ${isPlaying ? 'spinning' : ''}`}>🎵</div>
            <div className="song-details">
              <div className="song-title">{title}</div>
              <div className="song-status">
                {!isLoaded ? 'Memuat...' : 
                 autoplay && !autoplayAttempted ? 'Siap autoplay...' :
                 isPlaying ? 'Sedang diputar' : 'Dijeda'}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="audio-controls">
            <button 
              className="play-btn" 
              onClick={togglePlay}
              disabled={!isLoaded}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {!isLoaded ? '⏳' : isPlaying ? '⏸️' : '▶️'}
            </button>
            
            {isExpanded && isLoaded && (
              <>
                <div className="time-info">
                  <span>{formatTime(currentTime)}</span>
                  <span>/</span>
                  <span>{formatTime(duration)}</span>
                </div>
                
                <div className="progress-container">
                  <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleSeek}
                    className="progress-bar"
                  />
                </div>
                
                <button 
                  className="volume-btn" 
                  onClick={toggleMute}
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? '🔇' : '🔊'}
                </button>
                
                <div className="volume-container">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="volume-bar"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .audio-player {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background: linear-gradient(135deg, rgba(255, 111, 163, 0.95), rgba(255, 138, 182, 0.95));
          backdrop-filter: blur(20px);
          border-radius: 25px;
          padding: 12px 16px;
          box-shadow: 0 8px 32px rgba(255, 111, 163, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.2);
          z-index: 1000;
          transition: all 0.3s ease;
          min-width: 200px;
          max-width: 400px;
          animation: slideInUp 0.5s ease-out;
        }

        .audio-player.expanded {
          padding: 16px 20px;
          min-width: 350px;
        }

        .audio-player-content {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .song-info {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          flex: 1;
          min-width: 0;
        }

        .song-icon {
          font-size: 20px;
          transition: transform 0.3s ease;
        }

        .song-icon.spinning {
          animation: spin 2s linear infinite;
        }

        .song-icon:not(.spinning) {
          animation: pulse 2s ease-in-out infinite;
        }

        .song-details {
          flex: 1;
          min-width: 0;
        }

        .song-title {
          font-weight: 600;
          color: white;
          font-size: 14px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .song-status {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.8);
          margin-top: 2px;
        }

        .audio-controls {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .play-btn {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          border-radius: 50%;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 14px;
        }

        .play-btn:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.3);
          transform: scale(1.1);
        }

        .play-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .time-info {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          color: rgba(255, 255, 255, 0.9);
          font-family: monospace;
        }

        .progress-container {
          flex: 1;
          min-width: 100px;
        }

        .progress-bar {
          width: 100%;
          height: 4px;
          border-radius: 2px;
          background: rgba(255, 255, 255, 0.3);
          outline: none;
          cursor: pointer;
          -webkit-appearance: none;
        }

        .progress-bar::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }

        .progress-bar::-moz-range-thumb {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }

        .volume-btn {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          border-radius: 50%;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 12px;
        }

        .volume-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: scale(1.1);
        }

        .volume-container {
          width: 60px;
        }

        .volume-bar {
          width: 100%;
          height: 3px;
          border-radius: 2px;
          background: rgba(255, 255, 255, 0.3);
          outline: none;
          cursor: pointer;
          -webkit-appearance: none;
        }

        .volume-bar::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
        }

        .volume-bar::-moz-range-thumb {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: none;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        @media (max-width: 768px) {
          .audio-player {
            bottom: 10px;
            right: 10px;
            left: 10px;
            max-width: none;
          }
          
          .audio-player.expanded {
            min-width: auto;
          }
        }
      `}</style>
    </>
  );
}
