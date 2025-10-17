'use client';

import { useRouter } from 'next/navigation';

interface BackButtonProps {
  className?: string;
}

export default function BackButton({ className = '' }: BackButtonProps) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push('/dashboard')}
      className={`
        fixed top-4 left-4 z-50
        bg-gradient-to-r from-pink-500 to-purple-500 
        text-white px-4 py-2 rounded-full
        font-semibold text-sm
        hover:from-pink-600 hover:to-purple-600
        transition-all duration-300
        transform hover:scale-105
        shadow-lg hover:shadow-xl
        backdrop-blur-sm
        border border-white/20
        ${className}
      `}
    >
      ← Back to Dashboard
    </button>
  );
}
