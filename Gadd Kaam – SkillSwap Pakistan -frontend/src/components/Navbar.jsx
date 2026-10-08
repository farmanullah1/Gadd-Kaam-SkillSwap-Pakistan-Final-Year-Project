// src/components/Navbar.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { 
  Bell, Menu, X, Globe, Moon, Sun, LogOut, LayoutDashboard, User,
  ChevronDown, LifeBuoy, ShieldCheck, Search, Zap, Sparkles, Check,
  BookOpen, Trophy, Activity, MessageSquare
} from 'lucide-react'; 
import LogoutConfirmationModal from './LogoutConfirmationModal';
import NotificationDropdown from './NotificationDropdown';
import { io } from 'socket.io-client';

function Navbar(props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation(); 
  const isLandingPage = location.pathname === '/';
  
  // ── State ──────────────────────────────────────────────────────────────────
  const [isMenuOpen, setIsMenuOpen]                 = useState(false);
  const [isScrolled, setIsScrolled]                 = useState(false);
  const [scrollProgress, setScrollProgress]         = useState(0);
  const [isDarkMode, setIsDarkMode]                 = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme === 'dark';
    const savedMode = localStorage.getItem('darkMode');
    return savedMode
      ? JSON.parse(savedMode)
      : window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [showLanguageOptions, setShowLanguageOptions] = useState(false);
  const [showProfileMenu, setShowProfileMenu]         = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm]     = useState(false);
  const [isSindhiMode, setIsSindhiMode]               = useState(i18n.language === 'sd');
  const [unreadCount, setUnreadCount]                 = useState(0);
  const [showNotifications, setShowNotifications]     = useState(false);
  const [searchOpen, setSearchOpen]                   = useState(false);
  const [searchQuery, setSearchQuery]                 = useState('');

  // ── Refs ───────────────────────────────────────────────────────────────────
  const profileMenuRef          = useRef(null);
  const notificationRef         = useRef(null);
  const mobileNotificationRef   = useRef(null); 
  const languageRef             = useRef(null);
  const searchInputRef          = useRef(null);

  // ── Scroll handler: smooth compacting + progress bar ───────────────────────
  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    setIsScrolled(scrollY > 20);

    const docH = document.documentElement.scrollHeight - window.innerHeight;
    setScrollProgress(docH > 0 ? Math.min((scrollY / docH) * 100, 100) : 0);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // ── Global Keyboard Shortcut (Ctrl+K or Cmd+K to focus search) ────────────
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
        setTimeout(() => {
          searchInputRef.current?.focus();
        }, 50);
      } else if (e.key === 'Escape' && searchOpen) {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen]);

  // ── Socket + Notifications ─────────────────────────────────────────────────
  useEffect(() => {
    let socketInstance = null;
    const fetchUnreadCount = async () => {
      if (!props.user) return;
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/notifications?page=1`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUnreadCount(res.data.unreadCount || 0);
      } catch (e) {}
    };

    if (props.user) {
      fetchUnreadCount();
      const socketUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      socketInstance = io(socketUrl, { transports: ['websocket'], upgrade: false });
      socketInstance.emit('join_user', props.user.id);
      socketInstance.on('notification_received', (newNotif) => {
        setUnreadCount(prev => prev + 1);
        window.dispatchEvent(new CustomEvent('socket_notification', { detail: newNotif }));
      });
    }
    return () => { if (socketInstance) socketInstance.disconnect(); };
  }, [props.user]);

  useEffect(() => {
    const handleMarkedAllRead    = () => setUnreadCount(0);
    const handleMarkedSingleRead = () => setUnreadCount(prev => Math.max(0, prev - 1));
    window.addEventListener('notifications_marked_all_read', handleMarkedAllRead);
    window.addEventListener('notification_marked_read_single', handleMarkedSingleRead);
    return () => {
      window.removeEventListener('notifications_marked_all_read', handleMarkedAllRead);
      window.removeEventListener('notification_marked_read_single', handleMarkedSingleRead);
    };
  }, []);

  // ── Theme sync ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const handleThemeChange = (e) => {
      if (e.detail && (e.detail === 'dark' || e.detail === 'light'))
        setIsDarkMode(e.detail === 'dark');
    };
    window.addEventListener('theme_changed', handleThemeChange);
    return () => window.removeEventListener('theme_changed', handleThemeChange);
  }, []);

  useEffect(() => {
    if (isDarkMode) document.body.classList.add('dark-mode');
    else document.body.classList.remove('dark-mode');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // ── Language sync ──────────────────────────────────────────────────────────
  useEffect(() => {
    const handleLanguageChange = (lng) => setIsSindhiMode(lng === 'sd');
    i18n.on('languageChanged', handleLanguageChange);
    setIsSindhiMode(i18n.language === 'sd');
    return () => i18n.off('languageChanged', handleLanguageChange);
  }, []);

  // ── Click outside ──────────────────────────────────────────────────────────
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target))
        setShowProfileMenu(false);
      
      const clickedDesktopNotif = notificationRef.current && notificationRef.current.contains(event.target);
      const clickedMobileNotif  = mobileNotificationRef.current && mobileNotificationRef.current.contains(event.target);
      if (!clickedDesktopNotif && !clickedMobileNotif) setShowNotifications(false);

      if (languageRef.current && !languageRef.current.contains(event.target))
        setShowLanguageOptions(false);

      if (searchInputRef.current && !searchInputRef.current.closest('form')?.contains(event.target)) {
        if (!searchQuery.trim()) setSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchQuery]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const toggleDarkMode = (event) => {
    event?.preventDefault();
    event?.stopPropagation();
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    window.dispatchEvent(new CustomEvent('theme_changed', { detail: newTheme ? 'dark' : 'light' }));
  };

  const selectLanguage = (langCode, event) => {
    event?.preventDefault();
    event?.stopPropagation();
    i18n.changeLanguage(langCode);
    setShowLanguageOptions(false);
    window.dispatchEvent(new CustomEvent('language_changed', { detail: langCode }));
  };

  const toggleLanguageOptions = (event) => {
    event?.preventDefault();
    event?.stopPropagation();
    setShowLanguageOptions(prev => !prev);
  };

  const handleSupportClick = (event) => {
    event?.preventDefault();
    event?.stopPropagation();
    if (typeof props.onHelplineClick === 'function') { props.onHelplineClick(); return; }
    navigate('/support');
  };

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/marketplace?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
      setIsMenuOpen(false);
    }
  };

  const handleProfileClick  = () => setShowProfileMenu(prev => !prev);
  const handleLogoutClick   = () => { setShowProfileMenu(false); setIsMenuOpen(false); setShowLogoutConfirm(true); };
  const confirmLogout        = () => { props.onLogout(); setShowLogoutConfirm(false); };
  const cancelLogout         = () => setShowLogoutConfirm(false);

  const handleWomenZoneClick = (e) => {
    if (props.user && props.user.gender !== 'Female') {
      e.preventDefault();
      alert(t('access_restricted_women_zone', 'Access Restricted: This zone is exclusively for female users.'));
    } else if (!props.user) {
      e.preventDefault();
      navigate('/login');
    }
    setIsMenuOpen(false);
  };

  const getProfileUrl = () => {
    if (props.user && props.user.profilePicture) {
      if (props.user.profilePicture.startsWith('http')) return props.user.profilePicture;
      return `${process.env.REACT_APP_API_URL}/${props.user.profilePicture.replace(/\\/g, '/')}`;
    }
    return 'https://placehold.co/150x150/cccccc/ffffff?text=User';
  };

  const shouldShowWomenZone = !props.user || (props.user && props.user.gender === 'Female');
  const isAdmin             = props.user && props.user.role === 'admin';

  const defaultSindhiTextShadow = isSindhiMode ? '[text-shadow:1px_1px_2px_black,-1px_-1px_2px_black] !text-white' : '';
  const defaultSindhiIconColor  = isSindhiMode ? '[filter:drop-shadow(1px_1px_1px_rgba(0,0,0,0.7))] !stroke-white' : '';

  const sindhiNavbarStyle = isSindhiMode ? {
    backgroundImage: `url(/Navbar-sindhi.png)`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  } : {};

  // Active navigation pill class generator
  const getNavPillClass = (path) => {
    const active = location.pathname === path;
    return `relative px-3.5 py-1.5 rounded-full text-[13px] font-bold transition-all duration-200 flex items-center gap-1.5 ${
      active 
        ? 'text-primary-orange bg-orange-500/10 dark:bg-orange-500/15 shadow-sm ring-1 ring-orange-500/20' 
        : 'text-slate-700 dark:text-slate-300 hover:text-primary-orange dark:hover:text-orange-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
    } ${defaultSindhiTextShadow}`;
  };

  // ── Render Mobile Navigation Links ─────────────────────────────────────────
  const renderMobileLinks = () => {
    return (
      <div className="flex flex-col gap-2">
        {/* Mobile Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative mb-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('navbar_search_placeholder', 'Search skills, trades, talents...')}
            className="w-full h-11 pl-10 pr-10 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
          />
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X size={16} />
            </button>
          )}
        </form>

        {/* Navigation Categories */}
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 pt-2">
          {t('menu_navigation', 'Navigation')}
        </div>

        {isLandingPage ? (
          <>
            <Link 
              to="/home" 
              className={`flex items-center justify-between px-4 py-3 rounded-2xl transition-all ${location.pathname === '/home' ? 'bg-orange-500/10 text-primary-orange font-extrabold' : 'bg-slate-50 dark:bg-slate-900/40 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold'}`} 
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>{t('navbar_marketplace', 'Marketplace')}</span>
              </div>
              <span className="text-xs text-slate-400">Explore</span>
            </Link>
            <Link 
              to="/leaderboard" 
              className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900/40 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold transition-all" 
              onClick={() => setIsMenuOpen(false)}
            >
              <Trophy size={18} className="text-amber-500" />
              <span>{t('navbar_leaderboard', 'Leaderboard')}</span>
            </Link>
            <Link 
              to="/support" 
              className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900/40 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold transition-all" 
              onClick={() => setIsMenuOpen(false)}
            >
              <LifeBuoy size={18} className="text-blue-500" />
              <span>{t('navbar_help_center', 'Help Center')}</span>
            </Link>
            <Link 
              to="/stories" 
              className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900/40 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold transition-all" 
              onClick={() => setIsMenuOpen(false)}
            >
              <BookOpen size={18} className="text-emerald-500" />
              <span>{t('navbar_stories', 'Success Stories')}</span>
            </Link>
            <Link 
              to="/status" 
              className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900/40 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold transition-all" 
              onClick={() => setIsMenuOpen(false)}
            >
              <Activity size={18} className="text-purple-500" />
              <span>{t('navbar_status', 'Status')}</span>
            </Link>
          </>
        ) : (
          <>
            <Link 
              to="/marketplace" 
              className={`flex items-center justify-between px-4 py-3 rounded-2xl transition-all ${location.pathname === '/marketplace' ? 'bg-orange-500/10 text-primary-orange font-extrabold' : 'bg-slate-50 dark:bg-slate-900/40 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold'}`} 
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>{t('navbar_marketplace', 'Marketplace')}</span>
              </div>
              <span className="text-xs text-slate-400">Live</span>
            </Link>

            {shouldShowWomenZone && (
              <Link 
                to="/women-zone" 
                className="flex items-center justify-between px-4 py-3 rounded-2xl bg-gradient-to-r from-pink-500/10 to-rose-500/10 border border-pink-500/20 text-pink-600 dark:text-pink-400 font-bold transition-all" 
                onClick={(e) => { handleWomenZoneClick(e); setIsMenuOpen(false); }}
              >
                <div className="flex items-center gap-3">
                  <Sparkles size={18} className="text-pink-500 animate-pulse" />
                  <span>{t('navbar_women_zone', 'Women Zone')}</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-pink-500 text-white font-extrabold">Exclusive</span>
              </Link>
            )}

            <Link 
              to="/about" 
              className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900/40 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold transition-all" 
              onClick={() => setIsMenuOpen(false)}
            >
              <span>{t('navbar_about_us', 'About Us')}</span>
            </Link>
            <Link 
              to="/contact" 
              className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900/40 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold transition-all" 
              onClick={() => setIsMenuOpen(false)}
            >
              <span>{t('navbar_contact', 'Contact')}</span>
            </Link>
          </>
        )}

        <div className="h-px bg-slate-200/60 dark:bg-slate-800/60 my-2" />

        {/* Account Controls */}
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3">
          {t('menu_account', 'Account & Preferences')}
        </div>

        {props.user ? (
          <>
            <Link 
              to="/dashboard" 
              className="flex items-center gap-3 px-4 py-3.5 bg-orange-500/10 hover:bg-orange-500/15 text-primary-orange font-extrabold rounded-2xl border border-orange-500/20 transition-all shadow-sm" 
              onClick={() => setIsMenuOpen(false)}
            >
              <LayoutDashboard size={18} /> 
              <span>{t('navbar_my_dashboard', 'My Dashboard')}</span>
            </Link>
            <Link 
              to="/dashboard/profile" 
              className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900/40 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold transition-all" 
              onClick={() => setIsMenuOpen(false)}
            >
              <User size={18} className="text-slate-500" /> 
              <span>{t('navbar_account_settings', 'Account Settings')}</span>
            </Link>
            {isAdmin && (
              <Link 
                to="/admin" 
                className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-red-500/10 text-red-600 dark:text-red-400 font-bold transition-all" 
                onClick={() => setIsMenuOpen(false)}
              >
                <ShieldCheck size={18} /> 
                <span>{t('navbar_admin_panel', 'Admin Panel')}</span>
              </Link>
            )}
            <button 
              className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-red-500/5 hover:bg-red-500/10 text-red-500 font-bold transition-all w-full text-left cursor-pointer" 
              onClick={handleLogoutClick}
            >
              <LogOut size={18} /> 
              <span>{t('navbar_sign_out', 'Sign Out')}</span>
            </button>
          </>
        ) : (
          <div className="flex flex-col gap-2.5">
            <Link 
              to="/login" 
              className="block text-center py-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-primary-orange font-bold transition-all bg-white dark:bg-slate-900 shadow-sm" 
              onClick={() => setIsMenuOpen(false)}
            >
              {t('navbar_login_btn', 'Log In')}
            </Link>
            <Link 
              to="/signup" 
              className="block text-center py-3.5 rounded-2xl bg-gradient-to-r from-primary-orange via-orange-500 to-amber-500 text-white font-black shadow-lg shadow-orange-500/20 transition-all hover:brightness-105" 
              onClick={() => setIsMenuOpen(false)}
            >
              {t('navbar_signup_btn', 'Join Free')}
            </Link>
          </div>
        )}

        {/* Quick Settings Bar in Mobile Menu */}
        <div className="mt-3 p-3 bg-slate-100/70 dark:bg-slate-900/60 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-2">
              <Moon size={15} className="text-slate-400" /> {t('theme_preference', 'Theme')}
            </span>
            <button
              type="button"
              onClick={toggleDarkMode}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5 text-slate-700 dark:text-slate-200"
            >
              {isDarkMode ? <><Sun size={13} className="text-amber-500" /> {t('navbar_light_mode', 'Light')}</> : <><Moon size={13} /> {t('navbar_dark_mode', 'Dark')}</>}
            </button>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-200/40 dark:border-slate-800/40">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-2">
              <Globe size={15} className="text-slate-400" /> {t('change_language', 'Language')}
            </span>
            <div className="flex items-center gap-1">
              <button 
                type="button" 
                onClick={(e) => { selectLanguage('en', e); setIsMenuOpen(false); }}
                className={`px-2.5 py-1 text-xs rounded-lg font-bold transition-all ${i18n.language?.startsWith('en') ? 'bg-primary-orange text-white shadow-sm' : 'bg-white/60 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300'}`}
              >
                EN
              </button>
              <button 
                type="button" 
                onClick={(e) => { selectLanguage('ur', e); setIsMenuOpen(false); }}
                className={`px-2.5 py-1 text-xs rounded-lg font-bold transition-all ${i18n.language?.startsWith('ur') ? 'bg-primary-orange text-white shadow-sm' : 'bg-white/60 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300'}`}
              >
                اردو
              </button>
              <button 
                type="button" 
                onClick={(e) => { selectLanguage('sd', e); setIsMenuOpen(false); }}
                className={`px-2.5 py-1 text-xs rounded-lg font-bold transition-all ${i18n.language?.startsWith('sd') ? 'bg-primary-orange text-white shadow-sm' : 'bg-white/60 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300'}`}
              >
                سنڌي
              </button>
            </div>
          </div>
        </div>

        {/* Community Swapper Pill */}
        <div className="mt-2 flex items-center justify-center gap-2 py-2 text-[11px] font-bold text-slate-500 dark:text-slate-400">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span><strong>247</strong> {t('navbar_live_swappers', 'Live Swappers online')}</span>
        </div>
      </div>
    );
  };

  return (
    <>
      <header className="sticky top-0 z-[1000] w-full transition-all duration-300">

        {/* ── 1. AMBIENT TOP UTILITY BAR (Smoothly compacts when scrolled) ── */}
        <div className={`w-full bg-slate-100/90 dark:bg-slate-900/90 border-b border-slate-200/50 dark:border-slate-800/50 backdrop-blur-md transition-all duration-300 overflow-hidden ${isScrolled ? 'max-h-0 opacity-0 py-0 border-b-0' : 'max-h-10 opacity-100 py-1.5'}`}>
          <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 flex justify-between items-center text-xs">
            
            {/* Left: Welcoming Announcement / Ticker */}
            <div className="hidden md:flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <span className="inline-block overflow-hidden whitespace-nowrap border-r-2 border-primary-orange text-[11px] font-semibold animate-[type-delete-loop_9s_steps(50)_infinite,blink-caret_0.7s_step-end_infinite]">
                {t('navbar_welcome_msg', 'Welcome to Gadd Kaam — Pakistan\'s #1 Cash-Free Skill Barter Platform')}
              </span>
            </div>

            {/* Right: Live status, Dark mode, Language, Support */}
            <div className="flex items-center gap-2.5 ml-auto md:ml-0">
              {/* Live swappers pill */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 tracking-wide">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
                <Zap size={10} className="text-emerald-500" />
                <span><strong>247</strong> {t('navbar_live_swappers', 'Live Swappers')}</span>
              </div>

              {/* Support / Helpline Button */}
              <button 
                type="button" 
                className={`px-2 py-0.5 bg-white/50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800/60 hover:bg-orange-500/10 hover:border-orange-500/30 text-slate-600 dark:text-slate-300 hover:text-primary-orange rounded-lg cursor-pointer transition-all duration-200 flex items-center gap-1 font-bold text-[11px] ${defaultSindhiTextShadow}`} 
                onClick={handleSupportClick} 
                title={t('navbar_support', 'Helpline & Support')}
              >
                <LifeBuoy size={13} className={defaultSindhiIconColor} />
                <span>{t('navbar_support', 'Support')}</span>
              </button>

              {/* Dark mode toggle */}
              <button 
                type="button" 
                className="w-7 h-7 bg-white/50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800/60 hover:bg-orange-500/10 hover:border-orange-500/30 text-slate-600 dark:text-slate-300 hover:text-primary-orange rounded-lg cursor-pointer transition-all duration-200 flex items-center justify-center" 
                onClick={toggleDarkMode} 
                title={isDarkMode ? t('navbar_light_mode', 'Light Mode') : t('navbar_dark_mode', 'Dark Mode')}
                aria-label="Toggle Theme"
              >
                {isDarkMode ? <Sun size={13} className="text-amber-400 hover:rotate-45 transition-transform duration-300" /> : <Moon size={13} className="hover:rotate-12 transition-transform duration-300" />}
              </button>

              {/* Language Selector Dropdown */}
              <div className="relative" ref={languageRef}>
                <button 
                  type="button" 
                  className={`px-2 py-0.5 bg-white/50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800/60 hover:bg-orange-500/10 hover:border-orange-500/30 text-slate-600 dark:text-slate-300 hover:text-primary-orange rounded-lg cursor-pointer transition-all duration-200 flex items-center gap-1 font-bold text-[11px] ${defaultSindhiTextShadow}`} 
                  onClick={toggleLanguageOptions} 
                  aria-expanded={showLanguageOptions}
                >
                  <Globe size={13} className={defaultSindhiIconColor} />
                  <span>{i18n.language?.startsWith('ur') ? 'اردو' : (i18n.language?.startsWith('sd') ? 'سنڌي' : 'EN')}</span>
                  <ChevronDown size={11} className={`transition-transform duration-200 ${showLanguageOptions ? 'rotate-180' : ''}`} />
                </button>

                {showLanguageOptions && (
                  <div className="absolute top-[calc(100%+6px)] right-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl min-w-[140px] p-1 overflow-hidden z-[100300] animate-alert-pop">
                    <button 
                      type="button" 
                      className="flex items-center justify-between w-full px-3 py-1.5 rounded-lg hover:bg-orange-500/10 text-slate-800 dark:text-slate-200 hover:text-primary-orange font-bold text-xs transition-colors" 
                      onClick={(e) => selectLanguage('en', e)}
                    >
                      <span>🇬🇧 English</span>
                      {i18n.language?.startsWith('en') && <Check size={13} className="text-primary-orange" />}
                    </button>
                    <button 
                      type="button" 
                      className="flex items-center justify-between w-full px-3 py-1.5 rounded-lg hover:bg-orange-500/10 text-slate-800 dark:text-slate-200 hover:text-primary-orange font-bold text-xs transition-colors" 
                      onClick={(e) => selectLanguage('ur', e)}
                    >
                      <span>🇵🇰 اردو</span>
                      {i18n.language?.startsWith('ur') && <Check size={13} className="text-primary-orange" />}
                    </button>
                    <button 
                      type="button" 
                      className="flex items-center justify-between w-full px-3 py-1.5 rounded-lg hover:bg-orange-500/10 text-slate-800 dark:text-slate-200 hover:text-primary-orange font-bold text-xs transition-colors" 
                      onClick={(e) => selectLanguage('sd', e)}
                    >
                      <span>🌾 سنڌي</span>
                      {i18n.language?.startsWith('sd') && <Check size={13} className="text-primary-orange" />}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── 2. MAIN NAVBAR CONTAINER ──────────────────────────────────────── */}
        <nav
          className={`w-full nav-glass border-b border-slate-200/60 dark:border-slate-800/60 transition-all duration-300 flex items-center relative ${
            isScrolled 
              ? 'h-[66px] bg-white/85 dark:bg-slate-950/85 shadow-md shadow-slate-900/5' 
              : 'h-[76px] bg-white/70 dark:bg-slate-950/70 shadow-none'
          }`}
          style={sindhiNavbarStyle}
        >
          {/* Top subtle reading progress bar */}
          <div
            className="absolute bottom-0 left-0 h-[2.5px] bg-gradient-to-r from-primary-orange via-amber-500 to-teal-500 pointer-events-none transition-transform duration-75 origin-left"
            style={{ transform: `scaleX(${scrollProgress / 100})`, width: '100%' }}
            aria-hidden="true"
          />

          <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">

            {/* Brand Logo & Title */}
            <Link 
              to={isLandingPage ? '/' : '/home'} 
              className="flex items-center gap-3 group focus:outline-none" 
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="relative w-11 h-11 flex items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500/15 via-amber-500/5 to-white/60 dark:to-slate-900/40 shadow-sm border border-orange-500/20 group-hover:border-orange-500/40 group-hover:scale-105 group-hover:rotate-3 transition-all duration-300">
                <img
                  src="/Gadd_Kaam.png"
                  alt={t('navbar_brand_alt', 'Gadd Kaam Logo')}
                  className="w-8 h-8 rounded-xl object-contain drop-shadow-sm"
                  onError={(e) => { 
                    e.target.onerror = null; 
                    e.target.src = `https://placehold.co/40x40?text=${encodeURIComponent(t('app_initials', 'GK'))}`; 
                  }}
                />
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className={`text-xl font-black tracking-tight text-slate-900 dark:text-white ${defaultSindhiTextShadow}`}>
                    Gadd <span className="text-primary-orange">Kaam</span>
                  </span>
                  <span className="hidden sm:inline-flex items-center px-1.5 py-0.2 rounded-full text-[9px] font-black uppercase tracking-wider bg-orange-500/10 text-primary-orange border border-orange-500/20">
                    PK
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-400 hidden sm:block -mt-1 tracking-wider uppercase">
                  {t('navbar_brand_tagline', 'SkillSwap Pakistan')}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-1.5">
              {isLandingPage ? (
                <>
                  <Link to="/home" className={getNavPillClass('/home')}>
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                    <span>{t('navbar_marketplace', 'Marketplace')}</span>
                  </Link>
                  <Link to="/leaderboard" className={getNavPillClass('/leaderboard')}>
                    <Trophy size={14} className="text-amber-500" />
                    <span>{t('navbar_leaderboard', 'Leaderboard')}</span>
                  </Link>
                  <Link to="/support" className={getNavPillClass('/support')}>
                    <span>{t('navbar_help_center', 'Help Center')}</span>
                  </Link>
                  <Link to="/stories" className={getNavPillClass('/stories')}>
                    <span>{t('navbar_stories', 'Success Stories')}</span>
                  </Link>
                  <Link to="/status" className={getNavPillClass('/status')}>
                    <span>{t('navbar_status', 'Status')}</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/marketplace" className={getNavPillClass('/marketplace')}>
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                    <span>{t('navbar_marketplace', 'Marketplace')}</span>
                  </Link>

                  {/* Refined Women Zone Button */}
                  {shouldShowWomenZone && (
                    <Link 
                      to="/women-zone" 
                      className={`px-3.5 py-1.5 rounded-full text-[13px] font-bold transition-all duration-200 flex items-center gap-1.5 text-pink-600 dark:text-pink-400 bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/20 shadow-sm hover:shadow-pink-500/10 ${isSindhiMode ? '!text-white' : ''}`} 
                      onClick={handleWomenZoneClick}
                    >
                      <Sparkles size={13} className="text-pink-500 animate-pulse" />
                      <span>{t('navbar_women_zone', 'Women Zone')}</span>
                    </Link>
                  )}

                  <Link to="/about" className={getNavPillClass('/about')}>
                    <span>{t('navbar_about_us', 'About Us')}</span>
                  </Link>
                  <Link to="/contact" className={getNavPillClass('/contact')}>
                    <span>{t('navbar_contact', 'Contact')}</span>
                  </Link>
                  <Link to="/dashboard" className={getNavPillClass('/dashboard')}>
                    <span>{t('navbar_dashboard', 'Dashboard')}</span>
                  </Link>
                </>
              )}
            </div>

            {/* Desktop Actions Cluster (Search, Auth, Notifications, Profile) */}
            <div className="hidden lg:flex items-center gap-3">

              {/* Elevated Spotlight Search Input */}
              <form
                onSubmit={handleSearchSubmit}
                className={`flex items-center border transition-all duration-300 h-9 rounded-full relative ${
                  searchOpen 
                    ? 'w-[250px] xl:w-[280px] bg-white dark:bg-slate-900 border-primary-orange shadow-md shadow-orange-500/10 ring-2 ring-orange-500/20' 
                    : 'w-10 xl:w-[190px] bg-slate-100/60 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800'
                }`}
              >
                <button
                  type="button"
                  className="bg-transparent border-none cursor-pointer flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-primary-orange rounded-full p-2 focus:outline-none"
                  onClick={() => {
                    if (searchOpen && searchQuery.trim()) {
                      handleSearchSubmit();
                    } else {
                      setSearchOpen(true);
                      setTimeout(() => searchInputRef.current?.focus(), 50);
                    }
                  }}
                  title={t('navbar_search_title', 'Search')}
                >
                  <Search size={16} className={defaultSindhiIconColor} />
                </button>

                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchOpen(true)}
                  placeholder={t('navbar_search_placeholder', 'Search skills...')}
                  className={`border-none bg-transparent outline-none text-xs text-slate-900 dark:text-white px-1 py-1 w-full transition-opacity duration-200 ${
                    searchOpen ? 'opacity-100 pointer-events-auto' : 'hidden xl:block opacity-60 pointer-events-auto'
                  }`}
                />

                {/* Keyboard shortcut indicator */}
                {!searchOpen && (
                  <span className="hidden xl:flex items-center mr-2 px-1.5 py-0.5 rounded text-[10px] font-mono font-medium text-slate-400 dark:text-slate-500 bg-slate-200/50 dark:bg-slate-800/80 border border-slate-300/40 dark:border-slate-700/40 pointer-events-none">
                    Ctrl K
                  </span>
                )}

                {searchOpen && searchQuery && (
                  <button
                    type="button"
                    onClick={() => { setSearchQuery(''); searchInputRef.current?.focus(); }}
                    className="p-1 mr-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <X size={14} />
                  </button>
                )}
              </form>

              {props.user ? (
                <>
                  {/* Admin Panel Quick Link */}
                  {isAdmin && (
                    <Link 
                      to="/admin" 
                      className="w-9 h-9 flex items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-500/20 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 shadow-sm" 
                      title={t('navbar_admin_panel', 'Admin Panel')}
                    >
                      <ShieldCheck size={18} />
                    </Link>
                  )}

                  {/* Real-time Notifications Bell */}
                  <div className="relative" ref={notificationRef}>
                    <button 
                      type="button"
                      className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100/60 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800/60 text-slate-600 dark:text-slate-300 hover:text-primary-orange hover:border-orange-500/30 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 focus:outline-none cursor-pointer" 
                      onClick={() => setShowNotifications(!showNotifications)}
                      title={t('navbar_notifications', 'Notifications')}
                    >
                      <Bell size={18} className={unreadCount > 0 ? 'animate-[bellShake_3s_infinite_cubic-bezier(.36,.07,.19,.97)] text-primary-orange' : ''} />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-black h-4.5 w-4.5 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-sm">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      )}
                    </button>

                    {showNotifications && (
                      <div className="absolute top-[calc(100%+12px)] right-0 z-[100400] animate-alert-pop">
                        <NotificationDropdown onClose={() => setShowNotifications(false)} />
                      </div>
                    )}
                  </div>

                  {/* Refined User Profile Dropdown */}
                  <div className="relative" ref={profileMenuRef}>
                    <button 
                      type="button"
                      className="p-[2px] rounded-full bg-gradient-to-r from-primary-orange to-amber-500 transition-all duration-200 hover:scale-105 hover:shadow-md hover:shadow-orange-500/20 focus:outline-none cursor-pointer" 
                      onClick={handleProfileClick} 
                      aria-expanded={showProfileMenu}
                    >
                      <img 
                        src={getProfileUrl()} 
                        alt={t('navbar_profile_alt', 'User profile')} 
                        className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 object-cover" 
                      />
                    </button>

                    {showProfileMenu && (
                      <div className="absolute top-[calc(100%+12px)] right-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-2.5 shadow-2xl w-64 z-[100400] animate-alert-pop">
                        
                        {/* Profile Info Card Header */}
                        <div className="flex items-center gap-3 p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/50 dark:border-slate-800/50 mb-2">
                          <img src={getProfileUrl()} alt="" className="w-10 h-10 rounded-full object-cover border border-orange-500/30" />
                          <div className="flex flex-col min-w-0">
                            <span className="font-extrabold text-sm text-slate-800 dark:text-slate-100 truncate">
                              {props.user.firstName || props.user.username || t('navbar_brand_name', 'Gadd Kaam')}
                            </span>
                            <span className="text-[10px] text-slate-400 dark:text-slate-400 truncate font-mono">
                              {props.user.email || 'Verified Member'}
                            </span>
                          </div>
                        </div>

                        {/* Navigation Links */}
                        <div className="flex flex-col gap-0.5">
                          <Link 
                            to="/dashboard" 
                            className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-orange-500/10 text-slate-700 dark:text-slate-300 hover:text-primary-orange font-bold text-xs transition-colors" 
                            onClick={() => setShowProfileMenu(false)}
                          >
                            <LayoutDashboard size={15} /> 
                            <span>{t('navbar_my_dashboard', 'My Dashboard')}</span>
                          </Link>
                          <Link 
                            to="/dashboard/profile" 
                            className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-orange-500/10 text-slate-700 dark:text-slate-300 hover:text-primary-orange font-bold text-xs transition-colors" 
                            onClick={() => setShowProfileMenu(false)}
                          >
                            <User size={15} /> 
                            <span>{t('navbar_account_settings', 'Account Settings')}</span>
                          </Link>
                          {isAdmin && (
                            <Link 
                              to="/admin" 
                              className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-red-500/10 text-red-600 dark:text-red-400 font-bold text-xs transition-colors" 
                              onClick={() => setShowProfileMenu(false)}
                            >
                              <ShieldCheck size={15} /> 
                              <span>{t('navbar_admin_panel', 'Admin Panel')}</span>
                            </Link>
                          )}
                          <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />
                          <button 
                            onClick={handleLogoutClick} 
                            className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 text-red-500 font-bold text-xs transition-colors w-full text-left cursor-pointer focus:outline-none"
                          >
                            <LogOut size={15} /> 
                            <span>{t('navbar_sign_out', 'Sign Out')}</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                /* Guest Action Buttons */
                <div className="flex items-center gap-2">
                  <Link 
                    to="/login" 
                    className={`px-4 py-2 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-primary-orange hover:text-primary-orange rounded-full font-bold text-xs bg-white/50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-800 transition-all duration-200 ${defaultSindhiTextShadow}`}
                  >
                    {t('navbar_login_btn', 'Log In')}
                  </Link>
                  <Link 
                    to="/signup" 
                    className="px-5 py-2 bg-gradient-to-r from-primary-orange via-orange-500 to-amber-500 text-white font-black hover:brightness-105 rounded-full text-xs shadow-md shadow-orange-500/20 hover:shadow-orange-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                  >
                    {t('navbar_signup_btn', 'Join Free')}
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Actions: Notifications, Avatar, Hamburger Toggle */}
            <div className="flex lg:hidden items-center gap-2">
              {props.user && (
                <div className="relative" ref={mobileNotificationRef}>
                  <button 
                    type="button"
                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100/60 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:text-primary-orange transition-all duration-200 focus:outline-none" 
                    onClick={() => setShowNotifications(!showNotifications)}
                  >
                    <Bell size={18} className={unreadCount > 0 ? 'animate-[bellShake_3s_infinite_cubic-bezier(.36,.07,.19,.97)] text-primary-orange' : ''} />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-black h-4 w-4 rounded-full flex items-center justify-center border border-white dark:border-slate-900">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>
                  {showNotifications && (
                    <div className="absolute top-[calc(100%+10px)] right-0 z-[100400]">
                      <NotificationDropdown onClose={() => setShowNotifications(false)} />
                    </div>
                  )}
                </div>
              )}

              {props.user && (
                <Link to="/dashboard/profile" className="p-[1.5px] rounded-full bg-gradient-to-r from-primary-orange to-amber-500 shadow-sm">
                  <img src={getProfileUrl()} alt={t('navbar_profile_alt', 'User profile')} className="w-7 h-7 rounded-full object-cover border border-white dark:border-slate-900" />
                </Link>
              )}

              <button 
                type="button"
                onClick={() => setIsMenuOpen(!isMenuOpen)} 
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100/60 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800/60 hover:bg-orange-500/10 text-slate-800 dark:text-slate-200 hover:text-primary-orange transition-all duration-200 focus:outline-none cursor-pointer" 
                aria-label="Toggle navigation menu"
              >
                {isMenuOpen ? <X size={20} className="hover:rotate-90 transition-transform duration-300" /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Full-Screen Glass Drawer */}
          <div 
            className={`fixed inset-x-0 bottom-0 top-[66px] bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl z-[99990] transition-all duration-300 lg:hidden overflow-y-auto ${
              isMenuOpen 
                ? 'opacity-100 translate-y-0 pointer-events-auto' 
                : 'opacity-0 -translate-y-4 pointer-events-none'
            }`}
          >
            <div className="p-5 max-w-lg mx-auto">
              {renderMobileLinks()}
            </div>
          </div>
        </nav>
      </header>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmationModal 
        isOpen={showLogoutConfirm} 
        onConfirm={confirmLogout} 
        onCancel={cancelLogout} 
      />
    </>
  );
}

export default Navbar;
