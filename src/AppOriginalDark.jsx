import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Heart, 
  Volume2, 
  VolumeX, 
  Calendar, 
  MapPin, 
  Clock, 
  Sparkles, 
  Send, 
  Share2, 
  Compass, 
  CheckCircle2, 
  PartyPopper,
  Music,
  ArrowDown,
  Camera,
  MessageCircleHeart,
  ExternalLink,
  ChevronRight,
  X
} from 'lucide-react';

// Default High-Fashion / Romantic Couple Photos (Placeholders ready to be swapped with user's images)
const DEFAULT_COUPLE_PHOTOS = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85',
    caption: 'The Beginning of Forever',
    tag: 'CHAPTER 01',
    aspect: 'aspect-[3/4]',
    rotation: '-rotate-1'
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=85',
    caption: 'Two Souls, One Promise',
    tag: 'CHAPTER 02',
    aspect: 'aspect-[4/5]',
    rotation: 'rotate-2'
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85',
    caption: 'A Celebration Under The Stars',
    tag: 'CHAPTER 03',
    aspect: 'aspect-[3/4]',
    rotation: '-rotate-2'
  }
];

export default function App() {
  // Couple Information State (Customizable)
  const [couple, setCouple] = useState({
    groom: 'AARAV',
    bride: 'MEERA',
    weddingDateText: 'Saturday, 12th December 2026',
    dateIso: '2026-12-12T18:30:00',
    ringExchangeTime: '6:30 PM Onwards',
    dinnerTime: '8:00 PM Feasting & Music',
    venueName: 'The Royal Heritage Palace & Gardens',
    venueAddress: 'Palace Road, Central Boulevard, Udaipur',
    dressCode: 'Royal Elegance / Black Tie & Champagne Gold',
    mapsUrl: 'https://maps.google.com/?q=The+Royal+Heritage+Palace',
  });

  // Photos State (Allows live image replacement right from the UI!)
  const [photos, setPhotos] = useState(DEFAULT_COUPLE_PHOTOS);

  // Audio Player State (Web Audio API Synthesized Ambient Music)
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const audioCtxRef = useRef(null);
  const synthIntervalRef = useRef(null);

  // Blessings & Modal State
  const [isBlessingModalOpen, setIsBlessingModalOpen] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [blessingMessage, setBlessingMessage] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('💖');
  const [attendance, setAttendance] = useState('attending');
  const [blessingsList, setBlessingsList] = useState([
    {
      id: 1,
      name: 'Priya & Kabir',
      message: 'So incredibly happy for both of you! Wishing you a lifetime of laughter, joy, and endless adventures together! ✨',
      emoji: '🥂',
      time: 'Just now'
    },
    {
      id: 2,
      name: 'Rohan Sharma',
      message: 'Can’t wait to celebrate the grand evening! Heartiest congratulations to Aarav & Meera! 💍❤️',
      emoji: '💖',
      time: '1 hour ago'
    }
  ]);
  const [hasSentBlessing, setHasSentBlessing] = useState(false);

  // Countdown State
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date(couple.dateIso).getTime();
    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [couple.dateIso]);

  // Ambient Romantic Music Synthesizer (Zero-dependency Web Audio chord progression)
  const toggleMusic = () => {
    if (isPlayingMusic) {
      if (synthIntervalRef.current) clearInterval(synthIntervalRef.current);
      if (audioCtxRef.current) audioCtxRef.current.close();
      audioCtxRef.current = null;
      setIsPlayingMusic(false);
    } else {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContext();
        audioCtxRef.current = ctx;

        // Gentle, dreamy romantic pentatonic notes (Ethereal celesta/piano sound)
        const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99]; // C, E, G, C5, E5, G5
        let noteIndex = 0;

        const playTone = () => {
          if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') return;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          const freq = notes[noteIndex % notes.length];
          noteIndex = (noteIndex + 1 + Math.floor(Math.random() * 2));
          osc.frequency.setValueAtTime(freq, ctx.currentTime);

          gain.gain.setValueAtTime(0.001, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.3);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.8);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start();
          osc.stop(ctx.currentTime + 3.0);
        };

        playTone();
        synthIntervalRef.current = setInterval(playTone, 1400);
        setIsPlayingMusic(true);
      } catch (e) {
        console.error('Audio playback error', e);
      }
    }
  };

  // Trigger Festive Gold & Heart Confetti
  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#D4AF37', '#F5E6BE', '#FF6B6B', '#FFFFFF', '#E6C687']
    });
  };

  const handleSendBlessing = (e) => {
    e.preventDefault();
    if (!guestName.trim()) return;

    const newBlessing = {
      id: Date.now(),
      name: guestName,
      message: blessingMessage || 'Sending all my love and blessings to the lovely couple! 💕',
      emoji: selectedEmoji,
      time: 'Just now'
    };

    setBlessingsList([newBlessing, ...blessingsList]);
    setHasSentBlessing(true);
    triggerConfetti();

    setTimeout(() => {
      setIsBlessingModalOpen(false);
      setHasSentBlessing(false);
      setGuestName('');
      setBlessingMessage('');
    }, 2000);
  };

  // Add to Calendar Helper
  const handleAddToCalendar = () => {
    const title = encodeURIComponent(`${couple.bride} & ${couple.groom}'s Engagement Celebration`);
    const details = encodeURIComponent(`You are joyfully invited to celebrate the engagement ceremony of ${couple.bride} & ${couple.groom}.`);
    const location = encodeURIComponent(`${couple.venueName}, ${couple.venueAddress}`);
    const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=20261212T130000Z/20261212T180000Z`;
    window.open(googleCalUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-[#f7f5f0] selection:bg-[#d4af37] selection:text-black font-sans-clean relative overflow-x-hidden">
      
      {/* Background Subtle Halftone Grain & Ambient Warm Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-gradient-to-b from-[#d4af37]/10 via-[#c59b27]/5 to-transparent blur-[140px] rounded-full"></div>
        <div className="absolute top-1/2 right-[-200px] w-[500px] h-[500px] bg-[#d4af37]/5 blur-[120px] rounded-full"></div>
        <div className="absolute inset-0 bg-grain opacity-40"></div>
      </div>

      {/* Floating Audio & Navigation Bar (Shutabug Pill Aesthetic) */}
      <nav className="fixed top-6 inset-x-0 z-40 px-4 md:px-8 flex items-center justify-between pointer-events-none">
        {/* Left: Bridal Monogram Seal */}
        <div className="pointer-events-auto bg-[#13151c]/90 backdrop-blur-md border border-[#d4af37]/30 px-4 py-2 rounded-full flex items-center gap-2.5 shadow-2xl hover:border-[#d4af37]/60 transition-all">
          <div className="w-6 h-6 rounded-full bg-[#d4af37]/20 border border-[#d4af37] flex items-center justify-center text-[10px] font-bold text-[#d4af37]">
            {couple.bride[0]}&{couple.groom[0]}
          </div>
          <span className="text-xs uppercase tracking-widest font-display-luxury text-[#e8d5a3]">
            Save The Date
          </span>
        </div>

        {/* Right: Audio Pill Toggle & Quick RSVP */}
        <div className="pointer-events-auto flex items-center gap-3">
          <button 
            onClick={toggleMusic}
            className={`px-3.5 py-2 rounded-full border text-xs tracking-wider uppercase font-medium flex items-center gap-2 transition-all shadow-xl backdrop-blur-md ${
              isPlayingMusic 
                ? 'bg-[#d4af37] text-black border-[#d4af37] shadow-[#d4af37]/20' 
                : 'bg-[#13151c]/80 text-[#d4af37] border-[#d4af37]/30 hover:border-[#d4af37]'
            }`}
          >
            {isPlayingMusic ? <Volume2 size={14} className="animate-pulse" /> : <VolumeX size={14} />}
            <span className="hidden sm:inline">{isPlayingMusic ? 'Music: Playing' : 'Play Music'}</span>
          </button>

          <button 
            onClick={() => {
              setIsBlessingModalOpen(true);
              triggerConfetti();
            }}
            className="px-4 py-2 rounded-full bg-gradient-to-r from-[#d4af37] to-[#aa7c11] text-black font-semibold text-xs uppercase tracking-wider shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5"
          >
            <Sparkles size={13} />
            <span>Send Blessings</span>
          </button>
        </div>
      </nav>

      {/* ─────────────────────────────────────────────────────────────
          ACT 1: THE GRAND ENTRANCE & LUXURY BRIDAL HERO
      ───────────────────────────────────────────────────────────── */}
      <header className="relative min-h-[92vh] flex flex-col items-center justify-center text-center px-4 pt-24 pb-16 z-10">
        
        {/* Subtle Decorative Floral/Filigree Arch */}
        <div className="mb-6 flex flex-col items-center gap-3">
          <div className="flex items-center gap-3">
            <span className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#d4af37]"></span>
            <div className="flex items-center gap-1.5 text-[#d4af37] text-sm">
              <Sparkles size={14} />
              <span className="uppercase text-[11px] tracking-[0.35em] font-medium font-sans-clean">
                The Auspicious Union
              </span>
              <Sparkles size={14} />
            </div>
            <span className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#d4af37]"></span>
          </div>

          <p className="text-xs md:text-sm uppercase tracking-[0.25em] text-[#a19e95] font-light max-w-md mx-auto">
            Together with their families, joyfully invite you to the engagement ceremony of
          </p>
        </div>

        {/* BRIDE & GROOM NAMES (Shutabug Oversized Editorial & Bridal Serif) */}
        <div className="relative my-4 select-none">
          <h1 className="font-serif-luxury text-6xl sm:text-8xl md:text-9xl lg:text-[11rem] leading-[0.88] tracking-tight font-medium">
            <span className="block gold-gradient-text drop-shadow-[0_10px_35px_rgba(212,175,55,0.25)]">
              {couple.bride}
            </span>
            <span className="font-serif-luxury italic font-light text-3xl sm:text-5xl md:text-6xl text-[#e5d29a] my-1 block">
              — & —
            </span>
            <span className="block gold-gradient-text drop-shadow-[0_10px_35px_rgba(212,175,55,0.25)]">
              {couple.groom}
            </span>
          </h1>

          {/* Bridal Gold Ring Element (Overlay badge) */}
          <div className="absolute -top-4 -right-2 sm:-top-8 sm:right-6 bg-[#181a24]/90 border border-[#d4af37]/40 p-2 sm:p-3 rounded-full shadow-2xl backdrop-blur-md animate-float">
            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full border-2 border-dashed border-[#d4af37] flex items-center justify-center text-lg sm:text-2xl">
              💍
            </div>
          </div>
        </div>

        {/* Date & Location Capsule */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs md:text-sm font-medium">
          <div className="px-5 py-2.5 rounded-full bg-[#151722]/80 border border-[#d4af37]/30 text-[#f5ecd5] flex items-center gap-2 shadow-lg">
            <Calendar size={14} className="text-[#d4af37]" />
            <span>{couple.weddingDateText}</span>
          </div>

          <div className="px-5 py-2.5 rounded-full bg-[#151722]/80 border border-[#d4af37]/30 text-[#f5ecd5] flex items-center gap-2 shadow-lg">
            <MapPin size={14} className="text-[#d4af37]" />
            <span>{couple.venueAddress}</span>
          </div>
        </div>

        {/* Live Countdown Timer Cards */}
        <div className="mt-10 grid grid-cols-4 gap-2 sm:gap-4 max-w-sm sm:max-w-md w-full">
          {[
            { label: 'DAYS', val: timeLeft.days },
            { label: 'HOURS', val: timeLeft.hours },
            { label: 'MINUTES', val: timeLeft.minutes },
            { label: 'SECONDS', val: timeLeft.seconds },
          ].map((item, idx) => (
            <div key={idx} className="bg-[#12141c]/90 border border-[#d4af37]/20 p-2.5 sm:p-3 rounded-2xl text-center backdrop-blur-sm">
              <span className="font-display-luxury text-xl sm:text-2xl font-bold text-[#fceec9] block">
                {String(item.val).padStart(2, '0')}
              </span>
              <span className="text-[9px] sm:text-[10px] tracking-widest text-[#a8a396] uppercase font-medium">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Scroll Cue */}
        <div className="mt-12 flex flex-col items-center gap-2 text-[#d4af37]/70 text-xs tracking-widest uppercase">
          <span>Scroll To Open Invitation</span>
          <ArrowDown size={14} className="animate-bounce" />
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          SHUTABUG MARQUEE TICKER TAPE
      ───────────────────────────────────────────────────────────── */}
      <div className="w-full bg-[#d4af37] text-black py-3 overflow-hidden font-display-luxury font-bold text-xs sm:text-sm tracking-[0.25em] uppercase border-y border-[#aa7c11] select-none shadow-md">
        <div className="animate-marquee whitespace-nowrap flex gap-8 items-center">
          <span>SAVE THE DATE • {couple.bride} & {couple.groom}</span>
          <span>✦</span>
          <span>THE ENGAGEMENT CEREMONY</span>
          <span>✦</span>
          <span>{couple.weddingDateText}</span>
          <span>✦</span>
          <span>BLESS THE NEW JOURNEY</span>
          <span>✦</span>
          <span>SAVE THE DATE • {couple.bride} & {couple.groom}</span>
          <span>✦</span>
          <span>THE ENGAGEMENT CEREMONY</span>
          <span>✦</span>
          <span>{couple.weddingDateText}</span>
          <span>✦</span>
          <span>BLESS THE NEW JOURNEY</span>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          ACT 2: SCROLL STORY & PROGRESSIVE INVITATION DETAILS
          (Featuring the Save-The-Date Photos & Chapters)
      ───────────────────────────────────────────────────────────── */}
      <section className="relative py-24 px-4 sm:px-8 max-w-6xl mx-auto z-10 space-y-32">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#d4af37]/40 text-[#d4af37] text-[11px] tracking-widest uppercase bg-[#181a24]">
            <Sparkles size={12} />
            <span>THE CEREMONY STORY</span>
          </div>
          <h2 className="font-serif-luxury text-4xl sm:text-6xl text-[#fcedc7] font-normal">
            A Celebration of Love, Laughter & Destiny
          </h2>
          <p className="text-sm text-[#9e9a8f] font-light leading-relaxed">
            As two souls intertwine their paths, we would be deeply honored by your gracious presence and warm blessings.
          </p>
        </div>

        {/* CHAPTER 01: The Official Invitation & Photo 1 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
          
          {/* Photo Card (Shutabug Editorial Frame) */}
          <div className="md:col-span-7 relative group">
            <div className={`relative overflow-hidden rounded-3xl border-2 border-[#d4af37]/30 bg-[#161822] shadow-2xl p-3 ${photos[0].rotation} transition-transform duration-500 group-hover:rotate-0`}>
              <div className="relative overflow-hidden rounded-2xl aspect-[4/5] max-h-[550px] w-full">
                <img 
                  src={photos[0].url} 
                  alt="Save The Date Couple Portrait" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                  <span className="font-display-luxury text-xs tracking-widest bg-black/60 px-3 py-1 rounded-full border border-[#d4af37]/40">
                    {photos[0].tag}
                  </span>
                  <span className="font-serif-luxury text-lg italic text-[#fceec9]">
                    {photos[0].caption}
                  </span>
                </div>
              </div>
            </div>

            {/* Sticker Stamp */}
            <div className="absolute -top-4 -left-3 bg-[#d4af37] text-black font-display-luxury font-bold text-[10px] tracking-widest px-3 py-1.5 rounded-lg shadow-lg -rotate-12 border border-black">
              SAVE OUR DATE
            </div>
          </div>

          {/* Details Narrative */}
          <div className="md:col-span-5 space-y-6">
            <span className="text-xs uppercase tracking-[0.3em] text-[#d4af37] font-semibold flex items-center gap-2">
              <span className="w-8 h-[1px] bg-[#d4af37]"></span>
              01 / THE INVITATION
            </span>
            <h3 className="font-serif-luxury text-3xl sm:text-5xl text-[#f7f5f0] leading-snug">
              Two Families Joyfully Unite Under One Roof
            </h3>
            <p className="text-sm text-[#b5b1a5] font-light leading-relaxed">
              We warmly request the honor of your presence as {couple.bride} and {couple.groom} exchange rings and promise each other a lifetime of shared dreams, laughter, and companionship.
            </p>
            <div className="p-4 rounded-2xl bg-[#14161f] border border-[#d4af37]/20 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37]">
                <Heart size={18} fill="#d4af37" />
              </div>
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#e6d8b3]">Blessed With Love</h4>
                <p className="text-xs text-[#8c887d]">Your presence is the most cherished gift to us</p>
              </div>
            </div>
          </div>
        </div>

        {/* CHAPTER 02: Auspicious Timing & Photo 2 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
          
          {/* Details Narrative */}
          <div className="md:col-span-5 md:order-1 order-2 space-y-6">
            <span className="text-xs uppercase tracking-[0.3em] text-[#d4af37] font-semibold flex items-center gap-2">
              <span className="w-8 h-[1px] bg-[#d4af37]"></span>
              02 / AUSPICIOUS TIMING
            </span>
            <h3 className="font-serif-luxury text-3xl sm:text-5xl text-[#f7f5f0] leading-snug">
              When The Stars Align In Harmony
            </h3>
            <p className="text-sm text-[#b5b1a5] font-light leading-relaxed">
              Join us as the evening lights ignite the courtyard. The auspicious ring ceremony will take place at sunset, followed by heartfelt toasts, music, and a celebratory royal feast.
            </p>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-[#14161f] border border-[#d4af37]/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock size={16} className="text-[#d4af37]" />
                  <div>
                    <span className="text-xs font-semibold text-[#f0e4c5] block">Ring Exchange Ceremony</span>
                    <span className="text-xs text-[#8c887d]">Sunset auspicious Muhurtham</span>
                  </div>
                </div>
                <span className="font-display-luxury text-xs font-bold text-[#d4af37] bg-[#d4af37]/10 px-2.5 py-1 rounded-full border border-[#d4af37]/30">
                  {couple.ringExchangeTime}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#14161f] border border-[#d4af37]/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Sparkles size={16} className="text-[#d4af37]" />
                  <div>
                    <span className="text-xs font-semibold text-[#f0e4c5] block">Dinner, Cocktails & Music</span>
                    <span className="text-xs text-[#8c887d]">Feasting under the stars</span>
                  </div>
                </div>
                <span className="font-display-luxury text-xs font-bold text-[#d4af37] bg-[#d4af37]/10 px-2.5 py-1 rounded-full border border-[#d4af37]/30">
                  {couple.dinnerTime}
                </span>
              </div>
            </div>
          </div>

          {/* Photo Card */}
          <div className="md:col-span-7 md:order-2 order-1 relative group">
            <div className={`relative overflow-hidden rounded-3xl border-2 border-[#d4af37]/30 bg-[#161822] shadow-2xl p-3 ${photos[1].rotation} transition-transform duration-500 group-hover:rotate-0`}>
              <div className="relative overflow-hidden rounded-2xl aspect-[4/5] max-h-[550px] w-full">
                <img 
                  src={photos[1].url} 
                  alt="Save The Date Celebration" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                  <span className="font-display-luxury text-xs tracking-widest bg-black/60 px-3 py-1 rounded-full border border-[#d4af37]/40">
                    {photos[1].tag}
                  </span>
                  <span className="font-serif-luxury text-lg italic text-[#fceec9]">
                    {photos[1].caption}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CHAPTER 03: The Venue & Destination + Photo 3 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
          
          {/* Photo Card */}
          <div className="md:col-span-7 relative group">
            <div className={`relative overflow-hidden rounded-3xl border-2 border-[#d4af37]/30 bg-[#161822] shadow-2xl p-3 ${photos[2].rotation} transition-transform duration-500 group-hover:rotate-0`}>
              <div className="relative overflow-hidden rounded-2xl aspect-[4/5] max-h-[550px] w-full">
                <img 
                  src={photos[2].url} 
                  alt="Save The Date Venue Atmosphere" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                  <span className="font-display-luxury text-xs tracking-widest bg-black/60 px-3 py-1 rounded-full border border-[#d4af37]/40">
                    {photos[2].tag}
                  </span>
                  <span className="font-serif-luxury text-lg italic text-[#fceec9]">
                    {photos[2].caption}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Details Narrative */}
          <div className="md:col-span-5 space-y-6">
            <span className="text-xs uppercase tracking-[0.3em] text-[#d4af37] font-semibold flex items-center gap-2">
              <span className="w-8 h-[1px] bg-[#d4af37]"></span>
              03 / THE DESTINATION
            </span>
            <h3 className="font-serif-luxury text-3xl sm:text-5xl text-[#f7f5f0] leading-snug">
              {couple.venueName}
            </h3>
            <p className="text-sm text-[#b5b1a5] font-light leading-relaxed">
              Surrounded by heritage arches and lush courtyards, our venue is prepared to welcome you with grandeur and warmth. Valet parking and concierge assistance will be available on arrival.
            </p>

            <div className="p-4 rounded-2xl bg-[#14161f] border border-[#d4af37]/20 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#f0e4c5]">
                <Compass size={14} className="text-[#d4af37]" />
                <span>Dress Code & Attire</span>
              </div>
              <p className="text-xs text-[#9c978b] font-light">
                {couple.dressCode}
              </p>
            </div>

            <a 
              href={couple.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1b1e2c] border border-[#d4af37]/40 hover:border-[#d4af37] text-xs font-semibold text-[#f5ecd5] tracking-wider uppercase transition-all shadow-md"
            >
              <MapPin size={14} className="text-[#d4af37]" />
              <span>Open in Google Maps</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>

      </section>

      {/* ─────────────────────────────────────────────────────────────
          ACT 3: THE GRAND FINALE SUMMARY & SEND BLESSINGS CARD
          (End of scroll consolidated card as requested by the user!)
      ───────────────────────────────────────────────────────────── */}
      <section className="relative py-20 px-4 sm:px-8 max-w-4xl mx-auto z-10">
        
        {/* Consolidated Luxury Gold Pass Card */}
        <div className="relative rounded-3xl bg-gradient-to-b from-[#181a26] to-[#0f111a] border-2 border-[#d4af37]/50 shadow-[0_20px_60px_rgba(212,175,55,0.15)] p-6 sm:p-12 overflow-hidden">
          
          {/* Subtle Corner Bridal Ornaments */}
          <div className="absolute top-4 left-4 text-[#d4af37]/40 text-xs font-display-luxury">✦ ✦ ✦</div>
          <div className="absolute top-4 right-4 text-[#d4af37]/40 text-xs font-display-luxury">✦ ✦ ✦</div>
          
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <span className="px-4 py-1.5 rounded-full border border-[#d4af37]/40 bg-[#d4af37]/10 text-[#d4af37] text-[10px] tracking-[0.3em] font-bold uppercase inline-block">
              COMPLETE INVITATION PASS
            </span>

            <h2 className="font-serif-luxury text-4xl sm:text-6xl text-[#fdf4db]">
              Everything At A Glance
            </h2>

            <p className="text-xs sm:text-sm text-[#b8b3a7] font-light">
              We look forward to sharing this momentous evening with you. Here are all the consolidated event details for your convenience:
            </p>
          </div>

          {/* Consolidated Grid */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Box 1: Couple & Event */}
            <div className="p-5 rounded-2xl bg-[#11131c]/80 border border-[#d4af37]/25 flex items-start gap-4">
              <div className="p-3 rounded-xl bg-[#d4af37]/10 text-[#d4af37]">
                <Heart size={20} />
              </div>
              <div>
                <span className="text-[10px] tracking-widest text-[#a8a396] uppercase font-semibold">CELEBRATING</span>
                <h4 className="font-serif-luxury text-2xl text-[#f7f5f0] font-normal">
                  {couple.bride} & {couple.groom}
                </h4>
                <p className="text-xs text-[#999488]">The Engagement Ceremony</p>
              </div>
            </div>

            {/* Box 2: Date & Muhurtham */}
            <div className="p-5 rounded-2xl bg-[#11131c]/80 border border-[#d4af37]/25 flex items-start gap-4">
              <div className="p-3 rounded-xl bg-[#d4af37]/10 text-[#d4af37]">
                <Calendar size={20} />
              </div>
              <div>
                <span className="text-[10px] tracking-widest text-[#a8a396] uppercase font-semibold">DATE & TIMING</span>
                <h4 className="font-serif-luxury text-2xl text-[#f7f5f0] font-normal">
                  {couple.weddingDateText}
                </h4>
                <p className="text-xs text-[#d4af37] font-medium">{couple.ringExchangeTime}</p>
              </div>
            </div>

            {/* Box 3: Venue Address */}
            <div className="p-5 rounded-2xl bg-[#11131c]/80 border border-[#d4af37]/25 flex items-start gap-4">
              <div className="p-3 rounded-xl bg-[#d4af37]/10 text-[#d4af37]">
                <MapPin size={20} />
              </div>
              <div>
                <span className="text-[10px] tracking-widest text-[#a8a396] uppercase font-semibold">VENUE LOCATION</span>
                <h4 className="font-serif-luxury text-xl text-[#f7f5f0] font-normal">
                  {couple.venueName}
                </h4>
                <p className="text-xs text-[#999488]">{couple.venueAddress}</p>
              </div>
            </div>

            {/* Box 4: Dress Code */}
            <div className="p-5 rounded-2xl bg-[#11131c]/80 border border-[#d4af37]/25 flex items-start gap-4">
              <div className="p-3 rounded-xl bg-[#d4af37]/10 text-[#d4af37]">
                <Compass size={20} />
              </div>
              <div>
                <span className="text-[10px] tracking-widest text-[#a8a396] uppercase font-semibold">ATTIRE & THEME</span>
                <h4 className="font-serif-luxury text-xl text-[#f7f5f0] font-normal">
                  Royal & Festive
                </h4>
                <p className="text-xs text-[#999488]">{couple.dressCode}</p>
              </div>
            </div>

          </div>

          {/* Action Buttons: Calendar & Map */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button 
              onClick={handleAddToCalendar}
              className="px-5 py-3 rounded-xl bg-[#181b28] border border-[#d4af37]/40 hover:border-[#d4af37] text-xs font-semibold text-[#f5ecd5] tracking-wider uppercase transition-all shadow-md flex items-center gap-2"
            >
              <Calendar size={15} className="text-[#d4af37]" />
              <span>Add To Google Calendar</span>
            </button>

            <a 
              href={couple.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-xl bg-[#181b28] border border-[#d4af37]/40 hover:border-[#d4af37] text-xs font-semibold text-[#f5ecd5] tracking-wider uppercase transition-all shadow-md flex items-center gap-2"
            >
              <MapPin size={15} className="text-[#d4af37]" />
              <span>Get Driving Directions</span>
            </a>
          </div>

          {/* THE HIGHLIGHT: Grand "SEND BLESSINGS" Button */}
          <div className="mt-12 text-center pt-8 border-t border-[#d4af37]/20 space-y-4">
            <p className="text-xs uppercase tracking-[0.25em] text-[#d4af37] font-semibold">
              JOIN OUR CIRCLE OF BLESSINGS
            </p>

            <button
              onClick={() => {
                setIsBlessingModalOpen(true);
                triggerConfetti();
              }}
              className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-gradient-to-r from-[#d4af37] via-[#f3da8b] to-[#aa7c11] text-black font-display-luxury font-bold text-base sm:text-lg tracking-[0.15em] uppercase shadow-[0_10px_40px_rgba(212,175,55,0.4)] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-3 mx-auto"
            >
              <Sparkles size={20} className="animate-spin" />
              <span>SEND YOUR BLESSINGS & RSVP</span>
              <Heart size={20} fill="black" />
            </button>
            <p className="text-[11px] text-[#8e8a7f] italic">
              Tap above to write a warm note for the couple & shower them with blessings!
            </p>
          </div>

        </div>

      </section>

      {/* ─────────────────────────────────────────────────────────────
          GUEST BLESSINGS & WISHES WALL
      ───────────────────────────────────────────────────────────── */}
      <section className="relative py-16 px-4 sm:px-8 max-w-4xl mx-auto z-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold block">GUESTBOOK</span>
            <h3 className="font-serif-luxury text-3xl sm:text-4xl text-[#f7f5f0]">Warm Wishes & Love</h3>
          </div>

          <button 
            onClick={() => {
              setIsBlessingModalOpen(true);
              triggerConfetti();
            }}
            className="px-4 py-2 rounded-full border border-[#d4af37]/40 bg-[#141620] text-xs text-[#d4af37] hover:bg-[#d4af37] hover:text-black transition-all flex items-center gap-2"
          >
            <MessageCircleHeart size={14} />
            <span>Add A Blessing</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {blessingsList.map((item) => (
            <div key={item.id} className="p-5 rounded-2xl bg-[#11131d]/90 border border-[#d4af37]/20 relative space-y-2 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <span className="font-display-luxury text-sm font-semibold text-[#f7eccf] flex items-center gap-2">
                  <span>{item.name}</span>
                  <span className="text-base">{item.emoji}</span>
                </span>
                <span className="text-[10px] text-[#706c62]">{item.time}</span>
              </div>
              <p className="text-xs text-[#b8b3a7] font-light leading-relaxed">
                "{item.message}"
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          FOOTER: BRIDAL MONOGRAM & SIGN OFF
      ───────────────────────────────────────────────────────────── */}
      <footer className="relative py-16 text-center border-t border-[#d4af37]/20 bg-[#08090d] z-10 px-4 space-y-4">
        <div className="font-serif-luxury text-4xl gold-gradient-text tracking-wide">
          {couple.bride} & {couple.groom}
        </div>
        <p className="text-xs tracking-[0.25em] text-[#8e8a7f] uppercase font-light">
          We can’t wait to celebrate with you • {couple.weddingDateText}
        </p>
        <p className="text-[10px] text-[#55524b] pt-4">
          Crafted with love & bespoke Shutabug editorial design
        </p>
      </footer>

      {/* ─────────────────────────────────────────────────────────────
          INTERACTIVE MODAL: SEND BLESSINGS & RSVP FORM
      ───────────────────────────────────────────────────────────── */}
      {isBlessingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#13151f] border-2 border-[#d4af37]/60 p-6 sm:p-8 shadow-2xl space-y-6">
            
            {/* Close Button */}
            <button 
              onClick={() => setIsBlessingModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-[#999488] hover:text-white rounded-full bg-white/5 hover:bg-white/10"
            >
              <X size={18} />
            </button>

            {hasSentBlessing ? (
              <div className="py-10 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#d4af37]/20 border-2 border-[#d4af37] flex items-center justify-center text-3xl mx-auto animate-bounce">
                  💖
                </div>
                <h3 className="font-serif-luxury text-3xl text-[#f7f5f0]">Blessing Received!</h3>
                <p className="text-sm text-[#b8b3a7]">
                  Thank you from the bottom of our hearts for your love and warm wishes!
                </p>
              </div>
            ) : (
              <>
                <div className="text-center space-y-2">
                  <div className="inline-flex items-center gap-1.5 text-xs text-[#d4af37] font-semibold uppercase tracking-widest">
                    <Sparkles size={13} />
                    <span>Send Your Love</span>
                  </div>
                  <h3 className="font-serif-luxury text-3xl sm:text-4xl text-[#f7f5f0]">
                    Bless Aarav & Meera
                  </h3>
                  <p className="text-xs text-[#9e9a8f]">
                    Leave a loving message and confirm your attendance for the engagement.
                  </p>
                </div>

                <form onSubmit={handleSendBlessing} className="space-y-4 text-left">
                  
                  {/* Guest Name */}
                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#d4af37] font-medium block mb-1.5">
                      Your Name / Family Name *
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Rahul & Neha Kapoor" 
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#0b0c12] border border-[#d4af37]/30 text-sm text-white focus:outline-none focus:border-[#d4af37] placeholder:text-[#55524b]"
                    />
                  </div>

                  {/* Attendance Choice */}
                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#d4af37] font-medium block mb-1.5">
                      Will you be joining us?
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setAttendance('attending')}
                        className={`py-2.5 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-2 transition-all ${
                          attendance === 'attending' 
                            ? 'bg-[#d4af37] text-black border-[#d4af37]' 
                            : 'bg-[#0b0c12] text-[#999488] border-white/10'
                        }`}
                      >
                        <CheckCircle2 size={14} />
                        <span>Joyfully Attending</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setAttendance('wishes_only')}
                        className={`py-2.5 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-2 transition-all ${
                          attendance === 'wishes_only' 
                            ? 'bg-[#d4af37] text-black border-[#d4af37]' 
                            : 'bg-[#0b0c12] text-[#999488] border-white/10'
                        }`}
                      >
                        <Heart size={14} />
                        <span>Sending Love from Afar</span>
                      </button>
                    </div>
                  </div>

                  {/* Choose Blessing Emoji */}
                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#d4af37] font-medium block mb-1.5">
                      Select A Blessing Emoji
                    </label>
                    <div className="flex gap-2">
                      {['💖', '💍', '✨', '🥂', '🌸', '🎉'].map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => setSelectedEmoji(emoji)}
                          className={`w-10 h-10 rounded-xl text-lg flex items-center justify-center border transition-all ${
                            selectedEmoji === emoji 
                              ? 'bg-[#d4af37]/20 border-[#d4af37] scale-110' 
                              : 'bg-[#0b0c12] border-white/10 opacity-70 hover:opacity-100'
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Blessing Message */}
                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#d4af37] font-medium block mb-1.5">
                      Your Warm Wishes
                    </label>
                    <textarea 
                      rows={3}
                      placeholder="Write your blessings and congratulations here..."
                      value={blessingMessage}
                      onChange={(e) => setBlessingMessage(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#0b0c12] border border-[#d4af37]/30 text-sm text-white focus:outline-none focus:border-[#d4af37] placeholder:text-[#55524b]"
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <button 
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa7c11] text-black font-semibold text-sm uppercase tracking-wider shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <Send size={15} />
                    <span>Send Blessing With Confetti ✨</span>
                  </button>

                </form>
              </>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
