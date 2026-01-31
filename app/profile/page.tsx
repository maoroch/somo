'use client';
import Link from 'next/link';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Share2, 
  Heart, 
  Eye, 
  Play, 
  Moon, 
  Sun, 
  Calendar,
  MapPin,
  Link2,
  Mail,
  Edit,
  Grid3x3,
  List,
  TrendingUp,
  Users,
  Video,
  Clock,
  Download,
  MoreHorizontal
} from 'lucide-react';
import { getInitialTheme, saveTheme, type Theme } from '@/lib/theme-utils';

interface VideoProject {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  views: number;
  likes: number;
  createdAt: string;
  category: string;
}

export default function ProfilePage() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState<'all' | 'trending' | 'recent'>('all');

  // Инициализация темы
  useEffect(() => {
    const initialTheme = getInitialTheme();
    setIsDarkMode(initialTheme === 'dark');
    setIsLoaded(true);
  }, []);

  const toggleTheme = () => {
    const newTheme: Theme = isDarkMode ? 'light' : 'dark';
    setIsDarkMode(!isDarkMode);
    saveTheme(newTheme);
  };

  // Цветовые схемы
  const colors = {
    dark: {
      bg: 'from-slate-950 via-slate-900 to-slate-950',
      navBg: 'bg-slate-950/60',
      navBorder: 'rgba(77, 74, 255, 0.1)',
      text: 'text-white',
      textSecondary: 'text-slate-300',
      textTertiary: 'text-slate-400',
      cardBg: 'linear-gradient(135deg, rgba(77, 74, 255, 0.1), rgba(3, 0, 186, 0.05))',
      cardBorder: 'rgba(77, 74, 255, 0.2)',
      bannerOverlay: 'from-slate-950/60 via-slate-950/40 to-slate-950/80',
    },
    light: {
      bg: 'from-white via-slate-50 to-white',
      navBg: 'bg-white/80',
      navBorder: 'rgba(77, 74, 255, 0.2)',
      text: 'text-slate-900',
      textSecondary: 'text-slate-700',
      textTertiary: 'text-slate-600',
      cardBg: 'linear-gradient(135deg, rgba(77, 74, 255, 0.05), rgba(3, 0, 186, 0.02))',
      cardBorder: 'rgba(77, 74, 255, 0.15)',
      bannerOverlay: 'from-white/60 via-white/40 to-white/80',
    },
  };

  const currentColors = isDarkMode ? colors.dark : colors.light;

  // Моковые данные пользователя
  const userProfile = {
    name: 'Alexandra Williams',
    username: '@alex_creates',
    bio: 'Professional video creator & AI enthusiast. Turning ideas into stunning visual stories with Somo AI.',
    avatar: '👩‍🎨',
    banner: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200',
    joinDate: 'January 2024',
    location: 'San Francisco, CA',
    website: 'alexcreates.com',
    email: 'alex@example.com',
    stats: {
      videos: 127,
      totalViews: '2.4M',
      followers: '48.5K',
      likes: '156K'
    }
  };

  // Моковые проекты
  const videoProjects: VideoProject[] = [
    {
      id: '1',
      title: 'AI Marketing Revolution 2024',
      thumbnail: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600',
      duration: '2:34',
      views: 124500,
      likes: 8920,
      createdAt: '2 days ago',
      category: 'Marketing'
    },
    {
      id: '2',
      title: 'Product Launch Announcement',
      thumbnail: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600',
      duration: '1:45',
      views: 89300,
      likes: 5640,
      createdAt: '5 days ago',
      category: 'Business'
    },
    {
      id: '3',
      title: 'Tech Trends Explained Simply',
      thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600',
      duration: '3:12',
      views: 156700,
      likes: 12340,
      createdAt: '1 week ago',
      category: 'Education'
    },
    {
      id: '4',
      title: 'Social Media Growth Hacks',
      thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600',
      duration: '2:58',
      views: 203400,
      likes: 15680,
      createdAt: '1 week ago',
      category: 'Social Media'
    },
    {
      id: '5',
      title: 'Brand Story: From Idea to Success',
      thumbnail: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600',
      duration: '4:21',
      views: 98200,
      likes: 7230,
      createdAt: '2 weeks ago',
      category: 'Branding'
    },
    {
      id: '6',
      title: 'Creative Design Process 101',
      thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600',
      duration: '3:45',
      views: 112300,
      likes: 8940,
      createdAt: '2 weeks ago',
      category: 'Design'
    },
  ];

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  if (!isLoaded) {
    return (
      <div className={`min-h-screen bg-gradient-to-b ${currentColors.bg}`}></div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-b ${currentColors.bg} ${currentColors.text} transition-colors duration-500`}>
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-96 h-96 rounded-full blur-3xl top-20 left-10 animate-blob transition-all duration-500" 
          style={{background: isDarkMode ? 'rgba(77, 74, 255, 0.2)' : 'rgba(77, 74, 255, 0.1)'}}
        ></div>
        <div 
          className="absolute w-96 h-96 rounded-full blur-3xl top-40 right-20 animate-blob animation-delay-2000 transition-all duration-500" 
          style={{background: isDarkMode ? 'rgba(3, 0, 186, 0.2)' : 'rgba(3, 0, 186, 0.1)'}}
        ></div>
      </div>

      {/* Header */}
      <header className={`relative z-50 backdrop-blur-xl ${currentColors.navBg} border-b transition-all duration-500`} style={{borderColor: currentColors.navBorder}}>
        <nav className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src={isDarkMode ? '/logo-dark.svg' : '/logo-light.svg'}
              alt="Somo Logo"
              width={80}
              height={40}
              className="object-contain transition-opacity duration-300"
            />
          </Link>

          <div className="flex items-center gap-3">
            <button 
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${isDarkMode ? 'bg-slate-900/50 hover:bg-slate-800' : 'bg-slate-200 hover:bg-slate-300'}`}
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-slate-700" />
              )}
            </button>

            <Link href="/sign-in">
              <button className="px-5 py-2 rounded-lg text-sm font-semibold transition-all" style={{color: '#4D4AFF'}}>
                Sign Out
              </button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Banner Section */}
      <section className="relative z-10 h-64 md:h-80 w-full overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <img
            src={userProfile.banner}
            alt="Profile Banner"
            className="w-full h-full object-cover"
          />
          <div className={`absolute inset-0 bg-gradient-to-b ${currentColors.bannerOverlay}`}></div>
        </div>

        {/* Banner Actions */}
        <div className="absolute top-6 right-6 flex gap-3 z-20">
          <button 
            className="p-2.5 rounded-lg backdrop-blur-xl border transition-all hover:scale-110"
            style={{
              background: isDarkMode ? 'rgba(15, 23, 42, 0.6)' : 'rgba(255, 255, 255, 0.6)',
              borderColor: currentColors.cardBorder
            }}
          >
            <Share2 className="w-5 h-5" />
          </button>
          <button 
            className="p-2.5 rounded-lg backdrop-blur-xl border transition-all hover:scale-110"
            style={{
              background: isDarkMode ? 'rgba(15, 23, 42, 0.6)' : 'rgba(255, 255, 255, 0.6)',
              borderColor: currentColors.cardBorder
            }}
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Profile Info Section */}
      <section className="relative z-20 max-w-7xl mx-auto px-6 -mt-20">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          {/* Avatar & Main Info */}
          <div className="flex flex-col items-center md:items-start">
            <div 
              className="w-32 h-32 md:w-40 md:h-40 rounded-2xl border-4 flex items-center justify-center text-6xl md:text-7xl backdrop-blur-xl"
              style={{
                borderColor: isDarkMode ? '#0f172a' : '#ffffff',
                background: currentColors.cardBg,
                boxShadow: '0 20px 60px rgba(77, 74, 255, 0.3)'
              }}
            >
              {userProfile.avatar}
            </div>

            <button 
              className="mt-4 px-6 py-2.5 rounded-lg font-semibold text-white transition-all hover:shadow-xl"
              style={{
                background: 'linear-gradient(135deg, #4D4AFF, #0300BA)',
                boxShadow: '0 10px 30px rgba(77, 74, 255, 0.3)'
              }}
            >
              <Edit className="w-4 h-4 inline mr-2" />
              Edit Profile
            </button>
          </div>

          {/* User Details */}
          <div className="flex-1 space-y-4">
            <div>
              <h1 className={`text-3xl md:text-4xl font-black ${currentColors.text} mb-2`}>
                {userProfile.name}
              </h1>
              <p className={`text-lg ${currentColors.textTertiary} mb-4`}>
                {userProfile.username}
              </p>
              <p className={`${currentColors.textSecondary} text-base max-w-2xl leading-relaxed`}>
                {userProfile.bio}
              </p>
            </div>

            {/* Meta Info */}
            <div className={`flex flex-wrap gap-4 ${currentColors.textTertiary} text-sm`}>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Joined {userProfile.joinDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{userProfile.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Link2 className="w-4 h-4" />
                <a href="#" className="hover:text-blue-500 transition-colors">{userProfile.website}</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>{userProfile.email}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
              {[
                { label: 'Videos', value: userProfile.stats.videos, icon: Video },
                { label: 'Views', value: userProfile.stats.totalViews, icon: Eye },
                { label: 'Followers', value: userProfile.stats.followers, icon: Users },
                { label: 'Likes', value: userProfile.stats.likes, icon: Heart },
              ].map((stat, i) => (
                <div 
                  key={i}
                  className="p-4 rounded-xl border backdrop-blur-xl transition-all "
                  style={{
                    background: currentColors.cardBg,
                    borderColor: currentColors.cardBorder
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <stat.icon className="w-4 h-4" style={{color: '#4D4AFF'}} />
                    <p className={`text-xs ${currentColors.textTertiary} uppercase tracking-wider`}>
                      {stat.label}
                    </p>
                  </div>
                  <p className={`text-2xl font-black ${currentColors.text}`}>
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h2 className={`text-3xl font-black ${currentColors.text} mb-2`}>
              Video Portfolio
            </h2>
            <p className={currentColors.textTertiary}>
              Explore my latest AI-generated video projects
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex gap-1 p-1 rounded-lg" style={{background: isDarkMode ? 'rgba(77, 74, 255, 0.1)' : 'rgba(77, 74, 255, 0.05)'}}>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'text-white' : currentColors.textTertiary}`}
                style={viewMode === 'grid' ? {background: 'linear-gradient(135deg, #4D4AFF, #0300BA)'} : {}}
              >
                <Grid3x3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'text-white' : currentColors.textTertiary}`}
                style={viewMode === 'list' ? {background: 'linear-gradient(135deg, #4D4AFF, #0300BA)'} : {}}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {[
            { id: 'all', label: 'All Videos', icon: Video },
            { id: 'trending', label: 'Trending', icon: TrendingUp },
            { id: 'recent', label: 'Recent', icon: Clock },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-all whitespace-nowrap flex items-center gap-2 ${
                activeTab === tab.id ? 'text-white' : currentColors.textSecondary
              }`}
              style={
                activeTab === tab.id
                  ? {
                      background: 'linear-gradient(135deg, #4D4AFF, #0300BA)',
                      boxShadow: '0 8px 20px rgba(77, 74, 255, 0.3)'
                    }
                  : {
                      background: isDarkMode ? 'rgba(77, 74, 255, 0.1)' : 'rgba(77, 74, 255, 0.05)',
                      borderColor: currentColors.cardBorder
                    }
              }
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Videos Grid */}
        <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {videoProjects.map((video, i) => (
            <div
              key={video.id}
              className={`group rounded-xl border backdrop-blur-xl overflow-hidden transition-all duration-300 animate-fade-in ${
                viewMode === 'list' ? 'flex gap-4' : ''
              }`}
              style={{
                background: currentColors.cardBg,
                borderColor: currentColors.cardBorder,
                animationDelay: `${i * 0.1}s`
              }}
            >
              {/* Thumbnail */}
              <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-64 flex-shrink-0' : 'aspect-video'}`}>
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button className="w-14 h-14 rounded-full flex items-center justify-center text-white transform scale-75 group-hover:scale-100 transition-transform" style={{background: 'linear-gradient(135deg, #4D4AFF, #0300BA)'}}>
                      <Play className="w-6 h-6 ml-1" fill="white" />
                    </button>
                  </div>
                </div>

                {/* Duration Badge */}
                <div className="absolute top-3 right-3 px-2 py-1 rounded-lg text-xs font-bold text-white backdrop-blur-xl" style={{background: 'rgba(0, 0, 0, 0.6)'}}>
                  {video.duration}
                </div>

                {/* Category Badge */}
                <div className="absolute top-3 left-3 px-3 py-1 rounded-lg text-xs font-semibold text-white backdrop-blur-xl" style={{background: 'linear-gradient(135deg, rgba(77, 74, 255, 0.8), rgba(3, 0, 186, 0.8))'}}>
                  {video.category}
                </div>
              </div>

              {/* Video Info */}
              <div className="p-4 flex-1">
                <h3 className={`text-lg font-bold ${currentColors.text} mb-2 line-clamp-2 group-hover:text-blue-500 transition-colors`}>
                  {video.title}
                </h3>

                <div className={`flex items-center gap-4 text-sm ${currentColors.textTertiary} mb-3`}>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{formatNumber(video.views)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    <span>{formatNumber(video.likes)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{video.createdAt}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button 
                    className="flex-1 py-2 px-4 rounded-lg font-semibold text-sm transition-all hover:shadow-lg flex items-center justify-center gap-2"
                    style={{
                      background: 'linear-gradient(135deg, #4D4AFF, #0300BA)',
                      color: 'white'
                    }}
                  >
                    <Play className="w-4 h-4" />
                    Play
                  </button>
                  <button 
                    className="p-2 rounded-lg transition-all hover:scale-110"
                    style={{
                      background: isDarkMode ? 'rgba(77, 74, 255, 0.1)' : 'rgba(77, 74, 255, 0.05)',
                      borderColor: currentColors.cardBorder
                    }}
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button 
                    className="p-2 rounded-lg transition-all hover:scale-110"
                    style={{
                      background: isDarkMode ? 'rgba(77, 74, 255, 0.1)' : 'rgba(77, 74, 255, 0.05)',
                      borderColor: currentColors.cardBorder
                    }}
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="flex justify-center mt-12">
          <button 
            className="px-8 py-3 rounded-lg font-bold transition-all hover:shadow-xl"
            style={{
              background: isDarkMode ? 'rgba(77, 74, 255, 0.1)' : 'rgba(77, 74, 255, 0.05)',
              borderColor: currentColors.cardBorder,
              color: '#4D4AFF'
            }}
          >
            Load More Videos
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className={`relative z-10 border-t backdrop-blur-xl ${isDarkMode ? 'bg-slate-950/80' : 'bg-slate-50'} transition-colors duration-500 mt-20`} style={{borderColor: currentColors.navBorder}}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className={`${currentColors.textTertiary} text-sm`}>
              © 2024 Somo. All rights reserved.
            </p>
            
            <div className={`flex gap-6 text-sm ${currentColors.textTertiary}`}>
              <a href="#" className={`hover:${isDarkMode ? 'text-white' : 'text-slate-900'} transition-colors`}>Privacy</a>
              <a href="#" className={`hover:${isDarkMode ? 'text-white' : 'text-slate-900'} transition-colors`}>Terms</a>
              <a href="#" className={`hover:${isDarkMode ? 'text-white' : 'text-slate-900'} transition-colors`}>Help</a>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}