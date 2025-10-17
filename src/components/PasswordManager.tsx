'use client';

import { useState, useEffect } from 'react';
import { updatePassword } from '@/utils/config';
import { createPortal } from 'react-dom';

interface PasswordManagerProps {
  currentPassword: string;
  onPasswordUpdate?: (newPassword: string) => void;
}

export default function PasswordManager({ currentPassword, onPasswordUpdate }: PasswordManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState('');
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted before rendering portal
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setMessage('Password tidak cocok!');
      return;
    }

    if (newPassword.length < 2) {
      setMessage('Password minimal 2 karakter!');
      return;
    }

    setIsUpdating(true);
    setMessage('');

    try {
      const success = await updatePassword(newPassword);
      if (success) {
        setMessage('Password berhasil diubah!');
        setNewPassword('');
        setConfirmPassword('');
        onPasswordUpdate?.(newPassword);
        setTimeout(() => {
          setIsOpen(false);
          setMessage('');
        }, 2000);
      } else {
        setMessage('Gagal mengubah password!');
      }
    } catch (error) {
      setMessage('Terjadi error saat mengubah password!');
    } finally {
      setIsUpdating(false);
    }
  };

  const modalContent = isOpen && mounted ? (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300"
      style={{ zIndex: 99999 }}
      onClick={() => setIsOpen(false)}
    >
      <div 
        className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-4 duration-300"
        style={{ zIndex: 100000 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            🔐 Ganti Password
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password Saat Ini
            </label>
            <input
              type="text"
              value={currentPassword}
              disabled
              className="w-full p-3 border border-gray-300 rounded-xl bg-gray-100 text-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password Baru
            </label>
            <input
              type="text"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl focus:border-pink-400 focus:outline-none"
              placeholder="Masukkan password baru..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Konfirmasi Password
            </label>
            <input
              type="text"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl focus:border-pink-400 focus:outline-none"
              placeholder="Ulangi password baru..."
              required
            />
          </div>

          {message && (
            <div className={`p-3 rounded-xl text-sm ${
              message.includes('berhasil') 
                ? 'bg-green-100 text-green-700 border border-green-200' 
                : 'bg-red-100 text-red-700 border border-red-200'
            }`}>
              {message}
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl hover:from-pink-600 hover:to-purple-600 transition-all disabled:opacity-50"
            >
              {isUpdating ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  ) : null;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all"
      >
        🔐 Ganti Password
      </button>
      {modalContent && mounted && createPortal(modalContent, document.body)}
    </>
  );
}
