'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from './AudioPlayer.module.css';

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
    const handleCanPlay = () => setIsLoaded(true);
    const handleError = () => {
      console.log('Audio loading error');
      setIsLoaded(true); // Set loaded even on error to show controls
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  // Fallback to set loaded after timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isLoaded) {
        console.log('Audio loading timeout, setting loaded state');
        setIsLoaded(true);
      }
    }, 3000); // 3 second timeout

    return () => clearTimeout(timer);
  }, [isLoaded]);

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
      
      <div className={`${styles.audioPlayer} ${isExpanded ? styles.expanded : ''}`}>
        <div className={styles.audioPlayerContent}>
          {/* Song info */}
          <div className={styles.songInfo} onClick={() => setIsExpanded(!isExpanded)}>
            <div className={`${styles.songIcon} ${isPlaying ? styles.spinning : ''}`}>🎵</div>
            <div className={styles.songDetails}>
              <div className={styles.songTitle}>{title}</div>
              <div className={styles.songStatus}>
                {!isLoaded ? 'Memuat...' : 
                 autoplay && !autoplayAttempted ? 'Siap autoplay...' :
                 isPlaying ? 'Sedang diputar' : 'Dijeda'}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className={styles.audioControls}>
            <button 
              className={styles.playBtn} 
              onClick={togglePlay}
              disabled={!isLoaded}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {!isLoaded ? '⏳' : isPlaying ? '⏸️' : '▶️'}
            </button>
            
            {isExpanded && isLoaded && (
              <>
                <div className={styles.timeInfo}>
                  <span>{formatTime(currentTime)}</span>
                  <span>/</span>
                  <span>{formatTime(duration)}</span>
                </div>
                
                <div className={styles.progressContainer}>
                  <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleSeek}
                    className={styles.progressBar}
                  />
                </div>
                
                <button 
                  className={styles.volumeBtn} 
                  onClick={toggleMute}
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? '🔇' : '🔊'}
                </button>
                
                <div className={styles.volumeContainer}>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className={styles.volumeBar}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

    </>
  );
}
