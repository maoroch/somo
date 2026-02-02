'use client';
import React, { useState } from 'react';
import { X, Upload, Loader } from 'lucide-react';
import { useProfileUpdate, useUploadAvatar } from '@/lib/hooks/';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: {
    name: string;
    username: string;
    bio: string;
    location: string;
    website: string;
    avatar_url: string;
  };
  onProfileUpdated: () => void;
  isDarkMode: boolean;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  profile,
  onProfileUpdated,
  isDarkMode
}: EditProfileModalProps) {
  const [formData, setFormData] = useState(profile);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(profile.avatar_url);
  
  const { updating: profileUpdating, error: profileError, updateProfile } = useProfileUpdate();
  const { uploading: avatarUploading, error: avatarError, uploadAvatar } = useUploadAvatar();

  const isLoading = profileUpdating || avatarUploading;
  const hasError = profileError || avatarError;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Загрузка аватара если был выбран
      if (avatarFile) {
        await uploadAvatar(avatarFile);
      }

      // Обновление профиля
      await updateProfile({
        name: formData.name,
        username: formData.username,
        bio: formData.bio,
        location: formData.location,
        website: formData.website
      });

      onProfileUpdated();
      onClose();
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };

  if (!isOpen) return null;

  const bgColor = isDarkMode ? 'bg-slate-900' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const labelColor = isDarkMode ? 'text-slate-300' : 'text-slate-700';
  const inputBg = isDarkMode ? 'bg-slate-800' : 'bg-slate-50';
  const inputBorder = isDarkMode ? 'border-slate-700' : 'border-slate-200';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className={`${bgColor} rounded-2xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b" style={{borderColor: isDarkMode ? 'rgba(77, 74, 255, 0.1)' : 'rgba(77, 74, 255, 0.15)'}}>
          <h2 className={`text-xl font-bold ${textColor}`}>Edit Profile</h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className={`p-2 rounded-lg transition-all ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-slate-600">
              {previewUrl ? (
                <img src={previewUrl} alt="Avatar preview" className="w-full h-full object-cover" />
              ) : (
                <div className={`w-full h-full flex items-center justify-center text-3xl ${inputBg}`}>
                  👤
                </div>
              )}
            </div>
            <label className="flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-all" style={{background: 'linear-gradient(135deg, #4D4AFF, #0300BA)', color: 'white'}}>
              <Upload className="w-4 h-4" />
              <span className="text-sm font-semibold">Change Avatar</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                disabled={isLoading}
                className="hidden"
              />
            </label>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className={`block text-sm font-semibold ${labelColor} mb-2`}>
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={isLoading}
                className={`w-full px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textColor} transition-all focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Your full name"
              />
            </div>

            {/* Username */}
            <div>
              <label className={`block text-sm font-semibold ${labelColor} mb-2`}>
                Username
              </label>
              <div className="flex items-center">
                <span className={`pr-3 ${labelColor}`}>@</span>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className={`flex-1 px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textColor} transition-all focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="username"
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className={`block text-sm font-semibold ${labelColor} mb-2`}>
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                disabled={isLoading}
                rows={3}
                className={`w-full px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textColor} transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none`}
                placeholder="Tell us about yourself"
              />
            </div>

            {/* Location */}
            <div>
              <label className={`block text-sm font-semibold ${labelColor} mb-2`}>
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                disabled={isLoading}
                className={`w-full px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textColor} transition-all focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="City, Country"
              />
            </div>

            {/* Website */}
            <div>
              <label className={`block text-sm font-semibold ${labelColor} mb-2`}>
                Website
              </label>
              <div className="flex items-center">
                <span className={`pr-3 ${labelColor}`}>https://</span>
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className={`flex-1 px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textColor} transition-all focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="example.com"
                />
              </div>
            </div>
          </div>

          {/* Error Message */}
          {hasError && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
              <p className="text-sm text-red-500">{profileError || avatarError}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className={`flex-1 px-4 py-2.5 rounded-lg font-semibold transition-all ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200'} ${textColor}`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 rounded-lg font-semibold text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              style={{background: 'linear-gradient(135deg, #4D4AFF, #0300BA)'}}
            >
              {isLoading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============================================
// ПРИМЕР ИСПОЛЬЗОВАНИЯ В PROFILE PAGE
// ============================================

/*
import EditProfileModal from '@/components/EditProfileModal';

export default function ProfilePage() {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { profile, refetch } = useProfile();

  return (
    <>
      <button 
        onClick={() => setIsEditOpen(true)}
        className="px-6 py-2.5 rounded-lg font-semibold text-white"
        style={{background: 'linear-gradient(135deg, #4D4AFF, #0300BA)'}}
      >
        Edit Profile
      </button>

      {profile && (
        <EditProfileModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          profile={profile}
          onProfileUpdated={() => {
            setIsEditOpen(false);
            refetch();
          }}
          isDarkMode={isDarkMode}
        />
      )}
    </>
  );
}
*/