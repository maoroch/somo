'use client';
import Link from 'next/link';
import Image from 'next/image';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
  MoreHorizontal,
  Loader
} from 'lucide-react';
import { getInitialTheme, saveTheme, type Theme } from '@/lib/theme-utils';
import { createClient } from '@/lib/supabase/client';

const PAGE_SIZE = 6;

export default function ProfilePage() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState<'all' | 'trending' | 'recent'>('all');
  
  // Состояние для данных
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [videos, setVideos] = useState<any[]>([]);
  const [visibleVideos, setVisibleVideos] = useState(PAGE_SIZE);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Инициализация темы
  useEffect(() => {
    const initialTheme = getInitialTheme();
    setIsDarkMode(initialTheme === 'dark');
    setIsLoaded(true);
  }, []);

  // Загрузка ВСЕХ данных одним запросом (оптимизировано)
  useEffect(() => {
    if (!isLoaded) return;

    const fetchAllData = async () => {
      try {
        setLoading(true);
        const supabase = createClient();

        // Получаем текущего пользователя
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
          setError('User not authenticated');
          setLoading(false);
          return;
        }

        // Загружаем ВСЕ данные параллельно (не последовательно!)
        const [profileRes, statsRes, videosRes] = await Promise.all([
          // Профиль
          supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single(),
          
          // Статистика
          supabase
            .from('user_stats')
            .select('videos, total_views, followers, likes')
            .eq('user_id', user.id)
            .single(),
          
          // Видео (только первые PAGE_SIZE для быстрой загрузки)
          supabase
            .from('video_projects')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(PAGE_SIZE)
        ]);

        // Обрабатываем профиль
        if (profileRes.data) {
          setProfile(profileRes.data);
        } else if (profileRes.error) {
          console.error('Profile error:', profileRes.error);
        }

        // Обрабатываем статистику
        if (statsRes.data) {
          setStats({
            videos: statsRes.data.videos || 0,
            totalViews: statsRes.data.total_views || 0,
            followers: statsRes.data.followers || 0,
            likes: statsRes.data.likes || 0
          });
        }

        // Обрабатываем видео
        if (videosRes.data) {
          setVideos(videosRes.data.map(v => ({
            id: v.id,
            title: v.title,
            thumbnail: v.thumbnail_url,
            duration: v.duration || '0:00',
            views: v.views || 0,
            likes: v.likes || 0,
            createdAt: formatDate(v.created_at),
            category: v.category || 'Uncategorized'
          })));
        }

        setError(null);
        setLoading(false);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load data');
        setLoading(false);
      }
    };

    fetchAllData();
  }, [isLoaded]);

  // Загрузка ещё видео при нажатии "Load More"
  const handleLoadMore = useCallback(async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { data: moreVideos } = await supabase
        .from('video_projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .range(visibleVideos, visibleVideos + PAGE_SIZE - 1);

      if (moreVideos) {
        const formattedVideos = moreVideos.map(v => ({
          id: v.id,
          title: v.title,
          thumbnail: v.thumbnail_url,
          duration: v.duration || '0:00',
          views: v.views || 0,
          likes: v.likes || 0,
          createdAt: formatDate(v.created_at),
          category: v.category || 'Uncategorized'
        }));
        
        setVideos(prev => [...prev, ...formattedVideos]);
        setVisibleVideos(prev => prev + PAGE_SIZE);
      }
    } catch (err) {
      console.error('Error loading more videos:', err);
    }
  }, [visibleVideos]);

  const toggleTheme = useCallback(() => {
    const newTheme: Theme = isDarkMode ? 'light' : 'dark';
    setIsDarkMode(!isDarkMode);
    saveTheme(newTheme);
  }, [isDarkMode]);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const formatJoinDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Мемоизируем цвета чтобы не пересчитывать
  const colors = useMemo(() => ({
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
  }), []);

  const currentColors = useMemo(() => 
    isDarkMode ? colors.dark : colors.light,
    [isDarkMode, colors]
  );

  if (!isLoaded) {
    return <div className={`min-h-screen bg-gradient-to-b ${currentColors.bg}`}></div>;
  }

  return (
    <div className={`min-h-screen bg-gradient-to-b ${currentColors.bg} ${currentColors.text} transition-colors duration-500`}>
      {/* Header */}
      <header className={`relative z-50 backdrop-blur-xl ${currentColors.navBg} border-b transition-all duration-500`} style={{borderColor: currentColors.navBorder}}>
        <nav className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="text-2xl font-bold" style={{color: '#4D4AFF'}}>Somo</div>
          </Link>

          <div className="flex items-center gap-3">
            <button 
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${isDarkMode ? 'bg-slate-900/50 hover:bg-slate-800' : 'bg-slate-200 hover:bg-slate-300'}`}
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

      {/* Banner */}
      <section className="relative z-10 h-64 md:h-80 w-full overflow-hidden bg-slate-800">
        {!loading && profile?.banner_url && (
          <>
            <img
              src={profile.banner_url}
              alt="Banner"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className={`absolute inset-0 bg-gradient-to-b ${currentColors.bannerOverlay}`}></div>
          </>
        )}
        
        {loading && (
          <div className="w-full h-full flex items-center justify-center">
            <Loader className="w-8 h-8 animate-spin" style={{color: '#4D4AFF'}} />
          </div>
        )}

        {/* Banner Actions */}
        <div className="absolute top-6 right-6 flex gap-3 z-20">
          <button className="p-2.5 rounded-lg backdrop-blur-xl border transition-all hover:scale-110"
            style={{background: isDarkMode ? 'rgba(15, 23, 42, 0.6)' : 'rgba(255, 255, 255, 0.6)', borderColor: currentColors.cardBorder}}>
            <Share2 className="w-5 h-5" />
          </button>
          <button className="p-2.5 rounded-lg backdrop-blur-xl border transition-all hover:scale-110"
            style={{background: isDarkMode ? 'rgba(15, 23, 42, 0.6)' : 'rgba(255, 255, 255, 0.6)', borderColor: currentColors.cardBorder}}>
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Profile Info */}
      <section className="relative z-20 max-w-7xl mx-auto px-6 -mt-20">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader className="w-8 h-8 animate-spin" style={{color: '#4D4AFF'}} />
          </div>
        ) : profile ? (
          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            {/* Avatar */}
            <div className="flex flex-col items-center md:items-start">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl border-4 flex items-center justify-center text-6xl md:text-7xl backdrop-blur-xl overflow-hidden"
                style={{borderColor: isDarkMode ? '#0f172a' : '#ffffff', background: currentColors.cardBg, boxShadow: '0 20px 60px rgba(77, 74, 255, 0.3)'}}>
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" loading="lazy" />
                ) : '👤'}
              </div>

              <button className="mt-4 px-6 py-2.5 rounded-lg font-semibold text-white transition-all hover:shadow-xl"
                style={{background: 'linear-gradient(135deg, #4D4AFF, #0300BA)', boxShadow: '0 10px 30px rgba(77, 74, 255, 0.3)'}}>
                <Edit className="w-4 h-4 inline mr-2" />
                Edit Profile
              </button>
            </div>

            {/* Info */}
            <div className="flex-1 space-y-4">
              <div>
                <h1 className={`text-3xl md:text-4xl font-black ${currentColors.text} mb-2`}>
                  {profile.name || profile.full_name || 'User'}
                </h1>
                <p className={`text-lg ${currentColors.textTertiary} mb-4`}>
                  {profile.username ? `@${profile.username}` : '@user'}
                </p>
                {profile.bio && <p className={`${currentColors.textSecondary}`}>{profile.bio}</p>}
              </div>

              {/* Meta */}
              <div className={`flex flex-wrap gap-4 ${currentColors.textTertiary} text-sm`}>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {formatJoinDate(profile.created_at)}</span>
                </div>
                {profile.location && <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /><span>{profile.location}</span></div>}
                {profile.website && <div className="flex items-center gap-2"><Link2 className="w-4 h-4" /><a href={`https://${profile.website}`} target="_blank" rel="noopener noreferrer" className="hover:text-blue-500">{profile.website}</a></div>}
              </div>

              {/* Stats */}
              {stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                  {[
                    { label: 'Videos', value: stats.videos, icon: Video },
                    { label: 'Views', value: formatNumber(stats.totalViews), icon: Eye },
                    { label: 'Followers', value: formatNumber(stats.followers), icon: Users },
                    { label: 'Likes', value: formatNumber(stats.likes), icon: Heart },
                  ].map((stat, i) => (
                    <div key={i} className="p-4 rounded-xl border backdrop-blur-xl"
                      style={{background: currentColors.cardBg, borderColor: currentColors.cardBorder}}>
                      <div className="flex items-center gap-2 mb-1">
                        <stat.icon className="w-4 h-4" style={{color: '#4D4AFF'}} />
                        <p className={`text-xs ${currentColors.textTertiary} uppercase`}>{stat.label}</p>
                      </div>
                      <p className={`text-2xl font-black ${currentColors.text}`}>{stat.value}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : null}
      </section>

      {/* Videos */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h2 className={`text-3xl font-black ${currentColors.text} mb-2`}>Video Portfolio</h2>
            <p className={currentColors.textTertiary}>My latest projects</p>
          </div>

          <div className="flex gap-1 p-1 rounded-lg" style={{background: isDarkMode ? 'rgba(77, 74, 255, 0.1)' : 'rgba(77, 74, 255, 0.05)'}}>
            <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg ${viewMode === 'grid' ? 'text-white' : currentColors.textTertiary}`}
              style={viewMode === 'grid' ? {background: 'linear-gradient(135deg, #4D4AFF, #0300BA)'} : {}}>
              <Grid3x3 className="w-5 h-5" />
            </button>
            <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg ${viewMode === 'list' ? 'text-white' : currentColors.textTertiary}`}
              style={viewMode === 'list' ? {background: 'linear-gradient(135deg, #4D4AFF, #0300BA)'} : {}}>
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Videos Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader className="w-8 h-8 animate-spin" style={{color: '#4D4AFF'}} />
          </div>
        ) : videos.length > 0 ? (
          <>
            <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {videos.slice(0, visibleVideos).map(video => (
                <div key={video.id} className="group rounded-xl border backdrop-blur-xl overflow-hidden" style={{background: currentColors.cardBg, borderColor: currentColors.cardBorder}}>
                  <div className="relative overflow-hidden aspect-video">
                    <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <button className="w-14 h-14 rounded-full flex items-center justify-center text-white" style={{background: 'linear-gradient(135deg, #4D4AFF, #0300BA)'}}>
                        <Play className="w-6 h-6 ml-1" fill="white" />
                      </button>
                    </div>
                    <div className="absolute top-3 right-3 px-2 py-1 rounded-lg text-xs font-bold text-white" style={{background: 'rgba(0, 0, 0, 0.6)'}}>
                      {video.duration}
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className={`text-lg font-bold ${currentColors.text} mb-2`}>{video.title}</h3>
                    <div className={`flex items-center gap-4 text-sm ${currentColors.textTertiary} mb-3`}>
                      <div className="flex items-center gap-1"><Eye className="w-4 h-4" /><span>{formatNumber(video.views)}</span></div>
                      <div className="flex items-center gap-1"><Heart className="w-4 h-4" /><span>{formatNumber(video.likes)}</span></div>
                      <div className="flex items-center gap-1"><Clock className="w-4 h-4" /><span>{video.createdAt}</span></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {visibleVideos < videos.length && (
              <div className="flex justify-center mt-8">
                <button onClick={handleLoadMore} className="px-8 py-3 rounded-lg font-bold" style={{background: isDarkMode ? 'rgba(77, 74, 255, 0.1)' : 'rgba(77, 74, 255, 0.05)', color: '#4D4AFF'}}>
                  Load More Videos
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <Video className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className={currentColors.textTertiary}>No videos yet</p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className={`relative z-10 border-t backdrop-blur-xl ${isDarkMode ? 'bg-slate-950/80' : 'bg-slate-50'} mt-20`} style={{borderColor: currentColors.navBorder}}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <p className={`${currentColors.textTertiary} text-sm`}>© 2024 Somo. All rights reserved.</p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}