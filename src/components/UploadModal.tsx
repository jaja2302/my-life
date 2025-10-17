'use client';

import { useState, useRef } from 'react';
import { useData } from '@/context/DataContext';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'timeline' | 'photo' | 'note' | 'promise' | 'anniversary' | 'dream';
  onSuccess?: () => void;
}

export default function UploadModal({ isOpen, onClose, type, onSuccess }: UploadModalProps) {
  const { addTimelineEvent, addPhoto, addLoveNote, addPromise, addAnniversary, addDream, uploadPhoto } = useData();
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: Record<string, any>) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      let imageUrl = '';
      
      if (selectedFile) {
        imageUrl = await uploadPhoto(selectedFile);
      }

      const now = new Date().toISOString().split('T')[0];

      switch (type) {
        case 'timeline':
          addTimelineEvent({
            date: formData.date || now,
            title: formData.title || '',
            description: formData.description || '',
            image: imageUrl || '/api/placeholder/400/300',
            type: formData.type || 'memory',
          });
          break;
        case 'photo':
          addPhoto({
            src: imageUrl || '/api/placeholder/400/300',
            alt: formData.alt || '',
            date: formData.date || now,
            caption: formData.caption || '',
            category: formData.category || 'special',
          });
          break;
        case 'note':
          addLoveNote({
            title: formData.title || '',
            content: formData.content || '',
            date: formData.date || now,
            from: formData.from || 'Your Loving Partner',
            color: formData.color || 'from-pink-400 to-rose-400',
          });
          break;
        case 'promise':
          addPromise({
            title: formData.title || '',
            description: formData.description || '',
            date: formData.date || now,
            status: formData.status || 'future',
            category: formData.category || 'love',
          });
          break;
        case 'anniversary':
          addAnniversary({
            title: formData.title || '',
            date: formData.date || now,
            years: parseInt(formData.years) || 1,
            description: formData.description || '',
            memories: formData.memories ? formData.memories.split(',').map((m: string) => m.trim()) : [],
            isUpcoming: formData.isUpcoming === 'true',
            daysUntil: parseInt(formData.daysUntil) || 0,
          });
          break;
        case 'dream':
          addDream({
            title: formData.title || '',
            description: formData.description || '',
            category: formData.category || 'adventure',
            priority: formData.priority || 'medium',
            targetDate: formData.targetDate || '',
            progress: parseInt(formData.progress) || 0,
            steps: formData.steps ? formData.steps.split(',').map((s: string) => s.trim()) : [],
          });
          break;
      }

      onSuccess?.();
      onClose();
      setFormData({});
      setSelectedFile(null);
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Add New {type.charAt(0).toUpperCase() + type.slice(1)}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* File Upload */}
            {(type === 'timeline' || type === 'photo') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Photo
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:border-pink-400 focus:outline-none"
                />
                {selectedFile && (
                  <p className="text-sm text-gray-500 mt-1">
                    Selected: {selectedFile.name}
                  </p>
                )}
              </div>
            )}

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title || ''}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:border-pink-400 focus:outline-none"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description || ''}
                onChange={handleInputChange}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-xl focus:border-pink-400 focus:outline-none"
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date || ''}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:border-pink-400 focus:outline-none"
              />
            </div>

            {/* Type-specific fields */}
            {type === 'timeline' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <select
                  name="type"
                  value={formData.type || ''}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:border-pink-400 focus:outline-none"
                >
                  <option value="memory">Memory</option>
                  <option value="milestone">Milestone</option>
                  <option value="anniversary">Anniversary</option>
                </select>
              </div>
            )}

            {type === 'photo' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category || ''}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:border-pink-400 focus:outline-none"
                >
                  <option value="date">Date</option>
                  <option value="travel">Travel</option>
                  <option value="home">Home</option>
                  <option value="special">Special</option>
                </select>
              </div>
            )}

            {type === 'photo' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Caption
                </label>
                <input
                  type="text"
                  name="caption"
                  value={formData.caption || ''}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:border-pink-400 focus:outline-none"
                />
              </div>
            )}

            {type === 'note' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From
                </label>
                <input
                  type="text"
                  name="from"
                  value={formData.from || ''}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:border-pink-400 focus:outline-none"
                />
              </div>
            )}

            {type === 'promise' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status || ''}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:border-pink-400 focus:outline-none"
                  >
                    <option value="future">Future</option>
                    <option value="in-progress">In Progress</option>
                    <option value="kept">Kept</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category || ''}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:border-pink-400 focus:outline-none"
                  >
                    <option value="love">Love</option>
                    <option value="support">Support</option>
                    <option value="adventure">Adventure</option>
                    <option value="growth">Growth</option>
                  </select>
                </div>
              </>
            )}

            {type === 'anniversary' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Years
                  </label>
                  <input
                    type="number"
                    name="years"
                    value={formData.years || ''}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:border-pink-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Memories (comma separated)
                  </label>
                  <input
                    type="text"
                    name="memories"
                    value={formData.memories || ''}
                    onChange={handleInputChange}
                    placeholder="Memory 1, Memory 2, Memory 3"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:border-pink-400 focus:outline-none"
                  />
                </div>
              </>
            )}

            {type === 'dream' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category || ''}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:border-pink-400 focus:outline-none"
                  >
                    <option value="travel">Travel</option>
                    <option value="home">Home</option>
                    <option value="career">Career</option>
                    <option value="family">Family</option>
                    <option value="adventure">Adventure</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    name="priority"
                    value={formData.priority || ''}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:border-pink-400 focus:outline-none"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Date
                  </label>
                  <input
                    type="date"
                    name="targetDate"
                    value={formData.targetDate || ''}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:border-pink-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Progress (%)
                  </label>
                  <input
                    type="number"
                    name="progress"
                    min="0"
                    max="100"
                    value={formData.progress || ''}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:border-pink-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Steps (comma separated)
                  </label>
                  <input
                    type="text"
                    name="steps"
                    value={formData.steps || ''}
                    onChange={handleInputChange}
                    placeholder="Step 1, Step 2, Step 3"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:border-pink-400 focus:outline-none"
                  />
                </div>
              </>
            )}

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUploading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl hover:from-pink-600 hover:to-purple-600 transition-all disabled:opacity-50"
              >
                {isUploading ? 'Uploading...' : 'Add'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
