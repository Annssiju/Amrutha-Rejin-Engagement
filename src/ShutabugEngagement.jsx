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
  Search, 
  Compass, 
  Check, 
  X, 
  Grid, 
  List as ListIcon, 
  ArrowUpRight,
  HelpCircle,
  Info,
  SlidersHorizontal,
  ChevronDown,
  ExternalLink
} from 'lucide-react';

// Save-The-Date Artworks / Photography Collection
const ARTWORK_COLLECTION = [
  {
    id: 'art-01',
    number: '01',
    title: 'The Promise of Forever',
    subtitle: 'Ceremony of the Auspicious Rings',
    date: '12.12.2026',
    time: '18:30 HRS',
    venue: 'Royal Courtyard, Udaipur',
    medium: 'Save The Date • Edition 01',
    dimensions: 'Portrait • 35mm Gold Film',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85',
    description: 'A formal invitation to join Meera and Aarav as they exchange rings under the golden twilight skies.'
  },
  {
    id: 'art-02',
    number: '02',
    title: 'Two Hearts, One Rhythm',
    subtitle: 'The Evening Feasting & Cocktails',
    date: '12.12.2026',
    time: '20:00 HRS',
    venue: 'The Grand Pavilion',
    medium: 'Save The Date • Edition 02',
    dimensions: 'Editorial • Archival Print',
    image: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=85',
    description: 'An evening celebrating deep kinship, traditional melodies, curated feasts, and boundless laughter.'
  },
  {
    id: 'art-03',
    number: '03',
    title: 'Sanctuary Under The Stars',
    subtitle: 'Destination & Arrival Protocol',
    date: '12.12.2026',
    time: '17:30 HRS (Arrivals)',
    venue: 'Palace Gardens & Heritage Hall',
    medium: 'Save The Date • Edition 03',
    dimensions: 'Landscape • Fine Art',
    image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85',
    description: 'Surrounded by century-old marble arches and lush floral installations. Valet and concierge at the north gate.'
  }
];

export default function ShutabugEngagement({ onSwitchStyle }) {
  // Couple & Event Details
  const eventDetails = {
    groom: 'Aarav Alabi',
    bride: 'Meera Vance',
    dateString: 'Saturday, 12th December 2026',
    timeString: '6:30 PM Onwards',
    venueName: 'The Royal Heritage Palace',
    address: 'Palace Road, Central Boulevard, Udaipur',
    dressCode: 'Royal Elegance / Formal Champagne & Black Tie',
    mapsUrl: 'https://maps.google.com/?q=The+Royal+Heritage+Palace',
  };

  // View state: 'gallery' or 'list' (shutabug signature)
  const [viewMode, setViewMode] = useState('gallery');

  // Modals / Drawers
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isBlessingsOpen, setIsBlessingsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState(null);

  // Blessings & RSVP state
  const [guestName, setGuestName] = useState('');
  const [blessingMessage, setBlessingMessage] = useState('');
  const [attendance, setAttendance] = useState('attending');
  const [selectedEmoji, setSelectedEmoji] = useState('💖');
  const [blessings, setBlessings] = useState([
    {
      id: 1,
      name: 'Adewale & Folake',
      message: 'Huge congratulations to Meera & Aarav! May your love flourish endlessly. See you in Udaipur!',
      emoji: '🥂',
      date: 'JUST NOW'
    },
    {
      id: 2,
      name: 'Tanya & Siddharth',
      message: 'Counting down the days! So thrilled to celebrate this divine union with both families. ❤️',
      emoji: '✨',
      date: '2 HRS AGO'
    }
  ]);
  const [sentSuccess, setSentSuccess] = useState(false);

  // Audio Synthesizer (Ambient Ethereal Notes)
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const audioCtxRef = useRef(null);
  const synthIntervalRef = useRef(null);

  // Countdown timer
  const [timeLeft, setTimeLeft] = useState({ days: 24, hours: 8, minutes: 45, seconds: 12 });

  useEffect(() => {
    const target = new Date('2026-12-12T18:30:00').getTime();
    const updateCountdown = () => {
      const now = new Date().getTime();
      const diff = target - now;
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
        });
      }
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Keyboard shortcut ⌘K for search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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

        const chordNotes = [261.63, 329.63, 392.00, 523.25, 659.25];
        let idx = 0;
        const playTone = () => {
          if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') return;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(chordNotes[idx % chordNotes.length], ctx.currentTime);
          idx = (idx + 1 + Math.floor(Math.random() * 2));

          gain.gain.setValueAtTime(0.001, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.06, ctx.currentTime + 0.3);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3.0);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start();
          osc.stop(ctx.currentTime + 3.1);
        };

        playTone();
        synthIntervalRef.current = setInterval(playTone, 1500);
        setIsPlayingMusic(true);
      } catch (err) {
        console.error('Audio synthesizer error', err);
      }
    }
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.65 },
      colors: ['#111110', '#d4af37', '#e8e8e5', '#a63d40']
    });
  };

  const handleSendBlessing = (e) => {
    e.preventDefault();
    if (!guestName.trim()) return;

    const newEntry = {
      id: Date.now(),
      name: guestName,
      message: blessingMessage || 'Sending heartfelt blessings and love on your auspicious engagement! 💖',
      emoji: selectedEmoji,
      date: 'JUST NOW'
    };

    setBlessings([newEntry, ...blessings]);
    setSentSuccess(true);
    triggerConfetti();

    setTimeout(() => {
      setSentSuccess(false);
      setIsBlessingsOpen(false);
      setGuestName('');
      setBlessingMessage('');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#f2f2f0] text-[#111110] font-shutabug-serif selection:bg-[#111110] selection:text-[#f2f2f0] relative bg-shutabug-grain">
      
      {/* ─────────────────────────────────────────────────────────────
          STICKY TOP BANNER FOR STYLE SELECTION (DISCREET & FUNCTIONAL)
      ───────────────────────────────────────────────────────────── */}
      {onSwitchStyle && (
        <div className="bg-[#111110] text-[#f2f2f0] px-4 py-1.5 text-center chrome-caps flex items-center justify-between border-b border-black">
          <span className="opacity-70">AUTHENTIC SHUTABUG DESIGN SYSTEM ENABLED</span>
          <button 
            onClick={onSwitchStyle}
            className="underline hover:text-[#d4af37] transition-colors"
          >
            SWITCH TO ROYAL GOLD (DARK THEME) →
          </button>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          EXACT SHUTABUG SITE HEADER (Fixed, Minimal Chrome, Hairline)
      ───────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-[#f2f2f0]/95 backdrop-blur-md border-b border-shutabug transition-all">
        <div className="max-w-[88rem] mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
          
          {/* Left Brand & Nav Links */}
          <div className="flex items-center gap-6 sm:gap-10">
            <a href="#" className="flex items-center gap-2 group">
              {/* Shutabug-style spiky head / seal icon */}
              <div className="w-6 h-6 rounded-sm bg-[#111110] text-[#f2f2f0] flex items-center justify-center font-shutabug-display text-xs font-bold tracking-tighter group-hover:bg-black transition-colors">
                SB
              </div>
              <span className="font-shutabug-display text-base font-extrabold tracking-tight uppercase">
                SHUTABUG <span className="font-shutabug-serif italic font-normal text-sm lowercase text-[#686865]">x {eventDetails.bride} & {eventDetails.groom}</span>
              </span>
            </a>

            {/* Navigation items (Exactly like shutabug: Index, Story, Venue, Info, Help) */}
            <nav className="hidden md:flex items-center gap-6 chrome-caps">
              <a href="#ceremony" className="hover:text-black hover:underline underline-offset-4">Index</a>
              <button onClick={() => setIsInfoOpen(true)} className="hover:text-black hover:underline underline-offset-4">Story & Info</button>
              <a href="#details" className="hover:text-black hover:underline underline-offset-4">Details</a>
              <button onClick={() => setIsHelpOpen(true)} className="hover:text-black hover:underline underline-offset-4">Help & FAQ</button>
            </nav>
          </div>

          {/* Right Chrome Controls: Search, Sound, Blessings Counter */}
          <div className="flex items-center gap-3 sm:gap-4 chrome-caps">
            
            {/* ⌘K Browse Collections */}
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded border border-shutabug hover:border-black transition-colors bg-[#f7f7f5]"
            >
              <Search size={12} className="text-[#686865]" />
              <span className="text-[#686865]">⌘K Search</span>
            </button>

            {/* Music Synthesizer Pill */}
            <button 
              onClick={toggleMusic}
              className={`px-3 py-1.5 rounded border text-[11px] flex items-center gap-1.5 transition-all ${
                isPlayingMusic 
                  ? 'bg-[#111110] text-[#f2f2f0] border-black' 
                  : 'border-shutabug hover:border-black bg-transparent'
              }`}
            >
              {isPlayingMusic ? <Volume2 size={12} className="animate-pulse" /> : <VolumeX size={12} />}
              <span className="hidden sm:inline">{isPlayingMusic ? 'AUDIO: ON' : 'AUDIO: OFF'}</span>
            </button>

            {/* Blessings Counter (0) */}
            <button 
              onClick={() => {
                setIsBlessingsOpen(true);
                triggerConfetti();
              }}
              className="px-3.5 py-1.5 rounded bg-[#111110] text-[#f2f2f0] hover:bg-black active:scale-95 transition-all flex items-center gap-1.5"
            >
              <Heart size={12} fill="#f2f2f0" />
              <span>( {blessings.length} ) BLESSINGS</span>
            </button>
          </div>

        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          HERO BAR: METADATA & VIEW SWITCHER (Exact Shutabug Bar)
      ───────────────────────────────────────────────────────────── */}
      <div className="border-b border-shutabug py-3 px-4 sm:px-8 max-w-[88rem] mx-auto flex flex-wrap items-center justify-between gap-4 chrome-caps text-[#686865]">
        
        {/* Left Status */}
        <div className="flex items-center gap-4 sm:gap-6">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#17703c] animate-pulse"></span>
            <span className="text-[#111110] font-semibold">SAVE THE DATE</span>
          </span>
          <span className="hidden sm:inline text-shutabug">|</span>
          <span className="hidden sm:inline">DATE: 12 DEC 2026</span>
          <span className="hidden md:inline text-shutabug">|</span>
          <span className="hidden md:inline">TIMING: 18:30 HRS</span>
          <span className="hidden lg:inline text-shutabug">|</span>
          <span className="hidden lg:inline">VENUE: {eventDetails.venueName.toUpperCase()}</span>
        </div>

        {/* Right: Signature Shutabug View Switcher [ Gallery | List ] */}
        <div className="flex items-center gap-1 bg-[#e7e7e4] p-0.5 rounded border border-shutabug">
          <button 
            onClick={() => setViewMode('gallery')}
            className={`px-3 py-1 rounded text-[10px] font-bold tracking-wider flex items-center gap-1 transition-all ${
              viewMode === 'gallery' ? 'bg-[#111110] text-[#f2f2f0] shadow-sm' : 'text-[#686865] hover:text-black'
            }`}
          >
            <Grid size={11} />
            <span>GALLERY</span>
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`px-3 py-1 rounded text-[10px] font-bold tracking-wider flex items-center gap-1 transition-all ${
              viewMode === 'list' ? 'bg-[#111110] text-[#f2f2f0] shadow-sm' : 'text-[#686865] hover:text-black'
            }`}
          >
            <ListIcon size={11} />
            <span>LIST</span>
          </button>
        </div>

      </div>

      {/* ─────────────────────────────────────────────────────────────
          ACT 1: EDITORIAL HERO HEADLINE
          (The Couple's Names in Shutabug Typographic Mastery)
      ───────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 max-w-[88rem] mx-auto border-b border-shutabug">
        
        <div className="max-w-4xl space-y-4">
          <div className="chrome-caps text-[#686865] tracking-[0.2em] flex items-center gap-3">
            <span className="w-6 h-[1px] bg-[#111110]"></span>
            <span>A PRIVATE INVITATION • THE ENGAGEMENT CELEBRATION</span>
          </div>

          <h1 className="font-shutabug-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold tracking-tight uppercase leading-[0.88] text-[#111110]">
            MEERA &<br />
            <span className="font-shutabug-serif italic font-normal text-4xl sm:text-7xl md:text-8xl tracking-normal lowercase block sm:inline my-1 text-[#686865]">
              together with
            </span> AARAV
          </h1>

          <p className="font-shutabug-serif text-lg sm:text-2xl text-[#333331] max-w-2xl pt-4 leading-relaxed font-normal">
            Joyfully requesting your esteemed company as two souls commit to their lifetime promise in a ceremony steeped in love, tradition, and timeless celebration.
          </p>
        </div>

        {/* Live Countdown & Event Pills */}
        <div className="mt-12 pt-8 border-t border-shutabug flex flex-wrap items-center justify-between gap-6 chrome-caps">
          <div className="flex flex-wrap items-center gap-6">
            <div>
              <span className="text-[#686865] block text-[10px]">TIME TO CELEBRATION</span>
              <span className="text-sm font-bold text-[#111110] font-shutabug-mono">
                {timeLeft.days}D : {timeLeft.hours}H : {timeLeft.minutes}M : {timeLeft.seconds}S
              </span>
            </div>
            <div className="hidden sm:block w-[1px] h-8 bg-shutabug"></div>
            <div>
              <span className="text-[#686865] block text-[10px]">CEREMONY DATE</span>
              <span className="text-sm font-bold text-[#111110] font-shutabug-mono">
                DECEMBER 12, 2026
              </span>
            </div>
            <div className="hidden sm:block w-[1px] h-8 bg-shutabug"></div>
            <div>
              <span className="text-[#686865] block text-[10px]">COORDINATES</span>
              <span className="text-sm font-bold text-[#111110] font-shutabug-mono">
                24.5854° N, 73.7125° E
              </span>
            </div>
          </div>

          <button 
            onClick={() => {
              setIsBlessingsOpen(true);
              triggerConfetti();
            }}
            className="px-6 py-3 bg-[#111110] text-[#f2f2f0] rounded hover:bg-black active:scale-95 transition-all text-xs tracking-widest font-bold flex items-center gap-2"
          >
            <span>SEND BLESSINGS & RSVP</span>
            <ArrowUpRight size={14} />
          </button>
        </div>

      </section>

      {/* ─────────────────────────────────────────────────────────────
          ACT 2: SCROLL DETAILS & SAVE-THE-DATE SHOWCASE
          (User requested: while scrolling, show details like inviting guests,
          wedding timing, location alongside Save-The-Date images)
      ───────────────────────────────────────────────────────────── */}
      <section id="ceremony" className="py-16 px-4 sm:px-8 max-w-[88rem] mx-auto border-b border-shutabug">
        
        {/* Section Header */}
        <div className="flex flex-wrap items-end justify-between gap-4 mb-12">
          <div>
            <span className="chrome-caps text-[#686865] tracking-[0.2em] block mb-1">
              THE CHRONICLES OF CELEBRATION
            </span>
            <h2 className="font-shutabug-display text-3xl sm:text-5xl font-extrabold uppercase tracking-tight">
              SAVE THE DATE COLLECTION
            </h2>
          </div>

          <p className="font-shutabug-serif italic text-base sm:text-lg text-[#686865] max-w-md">
            Scroll through the chapters of the evening—from the auspicious ring exchange to the banquet under the moonlight.
          </p>
        </div>

        {/* ─── OPTION A: SHUTABUG GALLERY VIEW ─── */}
        {viewMode === 'gallery' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ARTWORK_COLLECTION.map((art) => (
              <div 
                key={art.id} 
                className="group border border-shutabug bg-[#f7f7f5] rounded-sm overflow-hidden flex flex-col justify-between hover:border-black transition-all"
              >
                {/* Top Meta Bar */}
                <div className="p-3 border-b border-shutabug flex items-center justify-between chrome-caps text-[#686865] bg-[#ecece9]">
                  <span className="font-bold text-[#111110]">NO. {art.number}</span>
                  <span>{art.medium}</span>
                </div>

                {/* Save The Date Image with Zoom Hover */}
                <div className="relative aspect-[3/4] overflow-hidden bg-[#e0e0dc] cursor-pointer" onClick={() => setSelectedArtwork(art)}>
                  <img 
                    src={art.image} 
                    alt={art.title} 
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                  
                  {/* Floating Action Badge on Hover */}
                  <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-[#111110] text-[#f2f2f0] px-3 py-1.5 rounded text-[10px] chrome-caps flex items-center gap-1 shadow-lg">
                    <span>INSPECT DETAILS</span>
                    <ArrowUpRight size={11} />
                  </div>
                </div>

                {/* Bottom Story & Timing Card */}
                <div className="p-5 space-y-4">
                  <div>
                    <span className="chrome-caps text-[10px] text-[#686865] block mb-1">
                      {art.time} • {art.date}
                    </span>
                    <h3 className="font-shutabug-serif italic text-2xl font-normal text-[#111110] group-hover:underline">
                      {art.title}
                    </h3>
                    <p className="chrome-caps text-[11px] font-bold text-[#111110] mt-1">
                      {art.subtitle}
                    </p>
                  </div>

                  <p className="font-shutabug-serif text-sm text-[#555552] leading-relaxed">
                    {art.description}
                  </p>

                  <div className="pt-3 border-t border-shutabug flex items-center justify-between chrome-caps text-[10px] text-[#686865]">
                    <span>LOCATION</span>
                    <span className="text-[#111110] font-semibold">{art.venue}</span>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* ─── OPTION B: SHUTABUG LIST VIEW (Editorial Index Table) ─── */}
        {viewMode === 'list' && (
          <div className="border border-shutabug rounded-sm overflow-hidden">
            <div className="grid grid-cols-12 p-3 bg-[#ecece9] border-b border-shutabug chrome-caps font-bold text-[#111110] text-[10px]">
              <div className="col-span-1">#</div>
              <div className="col-span-4">EVENT / CHAPTER</div>
              <div className="col-span-3">TIMING & DATE</div>
              <div className="col-span-3">VENUE LOCATION</div>
              <div className="col-span-1 text-right">ACTION</div>
            </div>

            {ARTWORK_COLLECTION.map((art) => (
              <div 
                key={art.id}
                onClick={() => setSelectedArtwork(art)}
                className="grid grid-cols-12 p-4 items-center border-b border-shutabug hover:bg-[#eaeae6] cursor-pointer transition-colors"
              >
                <div className="col-span-1 font-shutabug-mono text-xs font-bold text-[#686865]">
                  {art.number}
                </div>
                <div className="col-span-4">
                  <h4 className="font-shutabug-serif text-xl italic text-[#111110]">{art.title}</h4>
                  <span className="chrome-caps text-[10px] text-[#686865]">{art.subtitle}</span>
                </div>
                <div className="col-span-3 chrome-caps text-xs text-[#111110]">
                  <span className="font-bold block">{art.time}</span>
                  <span className="text-[#686865] text-[10px]">{art.date}</span>
                </div>
                <div className="col-span-3 chrome-caps text-xs text-[#333331]">
                  {art.venue}
                </div>
                <div className="col-span-1 text-right">
                  <button className="p-2 border border-shutabug rounded hover:bg-[#111110] hover:text-[#f2f2f0] transition-colors">
                    <ArrowUpRight size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </section>

      {/* ─────────────────────────────────────────────────────────────
          ACT 3: THE END-OF-SCROLL CONSOLIDATED SUMMARY & BLESSINGS
          (Exactly as requested: "when the scroll end, display all details
          like wedding timing, location and a button to send blessings")
      ───────────────────────────────────────────────────────────── */}
      <section id="details" className="py-20 px-4 sm:px-8 max-w-[88rem] mx-auto border-b border-shutabug">
        
        {/* Consolidated Grand Card in Shutabug Editorial Finish */}
        <div className="border-2 border-black bg-[#f7f7f5] p-6 sm:p-12 rounded-sm shadow-xl relative">
          
          {/* Top Label */}
          <div className="flex items-center justify-between border-b border-shutabug pb-4 chrome-caps text-[#686865]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-[#111110] text-[#f2f2f0] flex items-center justify-center text-[8px] font-bold">✦</span>
              <span className="font-bold text-[#111110]">FINAL INVITATION DISPATCH • ALL DETAILS CONSOLIDATED</span>
            </div>
            <span>OFFICIAL PROTOCOL</span>
          </div>

          {/* Headline */}
          <div className="my-8 text-center max-w-2xl mx-auto space-y-3">
            <h2 className="font-shutabug-display text-4xl sm:text-6xl font-extrabold uppercase tracking-tight">
              THE CONSOLIDATED GUIDE
            </h2>
            <p className="font-shutabug-serif text-lg text-[#555552] italic">
              "We eagerly anticipate celebrating our union surrounded by the people who have shaped our lives."
            </p>
          </div>

          {/* Consolidated 4-Column Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-10 pt-6 border-t border-shutabug">
            
            {/* Box 1: Couple */}
            <div className="p-4 bg-[#ecece9] border border-shutabug rounded space-y-1">
              <span className="chrome-caps text-[10px] text-[#686865] block">CELEBRATING COUPLE</span>
              <h3 className="font-shutabug-display text-xl font-bold uppercase">{eventDetails.bride}</h3>
              <p className="font-shutabug-serif italic text-base text-[#686865]">& {eventDetails.groom}</p>
            </div>

            {/* Box 2: Timing */}
            <div className="p-4 bg-[#ecece9] border border-shutabug rounded space-y-1">
              <span className="chrome-caps text-[10px] text-[#686865] block">DATE & CEREMONY TIME</span>
              <h3 className="font-shutabug-mono text-base font-bold">{eventDetails.dateString}</h3>
              <p className="chrome-caps text-xs text-[#17703c] font-semibold">{eventDetails.timeString}</p>
            </div>

            {/* Box 3: Venue */}
            <div className="p-4 bg-[#ecece9] border border-shutabug rounded space-y-1">
              <span className="chrome-caps text-[10px] text-[#686865] block">DESTINATION & VENUE</span>
              <h3 className="font-shutabug-serif text-lg font-semibold text-[#111110] leading-snug">{eventDetails.venueName}</h3>
              <p className="chrome-caps text-[10px] text-[#686865] truncate">{eventDetails.address}</p>
            </div>

            {/* Box 4: Dress Code */}
            <div className="p-4 bg-[#ecece9] border border-shutabug rounded space-y-1">
              <span className="chrome-caps text-[10px] text-[#686865] block">DRESS CODE & ATTIRE</span>
              <h3 className="font-shutabug-serif text-lg italic text-[#111110]">Royal & Celebratory</h3>
              <p className="chrome-caps text-[10px] text-[#686865]">{eventDetails.dressCode}</p>
            </div>

          </div>

          {/* Navigation Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-6 border-t border-shutabug chrome-caps">
            <a 
              href={eventDetails.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded border border-shutabug hover:border-black bg-white flex items-center gap-2 hover:bg-[#111110] hover:text-[#f2f2f0] transition-all text-xs font-bold"
            >
              <MapPin size={13} />
              <span>DIRECTIONS VIA GOOGLE MAPS</span>
              <ExternalLink size={12} />
            </a>

            <button 
              onClick={() => {
                const title = encodeURIComponent(`${eventDetails.bride} & ${eventDetails.groom}'s Engagement`);
                const location = encodeURIComponent(`${eventDetails.venueName}, ${eventDetails.address}`);
                window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&location=${location}`, '_blank');
              }}
              className="px-5 py-2.5 rounded border border-shutabug hover:border-black bg-white flex items-center gap-2 hover:bg-[#111110] hover:text-[#f2f2f0] transition-all text-xs font-bold"
            >
              <Calendar size={13} />
              <span>ADD TO GOOGLE CALENDAR</span>
            </button>
          </div>

          {/* THE MASTER CTA: BUTTON TO SEND BLESSINGS (Prominent & High-Impact) */}
          <div className="mt-10 pt-8 border-t-2 border-black text-center space-y-4">
            <span className="chrome-caps text-xs text-[#686865] tracking-[0.25em] font-bold block">
              ✦ SHOWER THE COUPLE WITH LOVE ✦
            </span>

            <button 
              onClick={() => {
                setIsBlessingsOpen(true);
                triggerConfetti();
              }}
              className="w-full sm:w-auto px-12 py-5 bg-[#111110] text-[#f2f2f0] hover:bg-black active:scale-95 transition-all text-sm sm:text-base font-shutabug-display font-extrabold tracking-[0.15em] uppercase rounded shadow-2xl flex items-center justify-center gap-3 mx-auto"
            >
              <Sparkles size={18} className="animate-pulse" />
              <span>CLICK TO SEND BLESSINGS & CONFIRM RSVP</span>
              <Heart size={18} fill="#f2f2f0" />
            </button>

            <p className="chrome-caps text-[11px] text-[#686865]">
              TAP TO LEAVE A MESSAGE IN THE GUESTBOOK • CONFIRM ATTENDANCE
            </p>
          </div>

        </div>

      </section>

      {/* ─────────────────────────────────────────────────────────────
          COMMUNITY BLESSINGS ARCHIVE (Live Wishes Grid)
      ───────────────────────────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-8 max-w-[88rem] mx-auto border-b border-shutabug">
        <div className="flex items-center justify-between mb-8 chrome-caps">
          <div>
            <span className="text-[#686865] text-[10px] block">COMMUNITY LOVE ARCHIVE</span>
            <h3 className="font-shutabug-display text-2xl font-bold uppercase text-[#111110]">
              MESSAGES & BLESSINGS ({blessings.length})
            </h3>
          </div>

          <button 
            onClick={() => {
              setIsBlessingsOpen(true);
              triggerConfetti();
            }}
            className="px-4 py-2 border border-black hover:bg-[#111110] hover:text-[#f2f2f0] transition-colors rounded text-xs font-bold"
          >
            + ADD YOUR BLESSING
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {blessings.map((b) => (
            <div key={b.id} className="p-5 border border-shutabug bg-[#f7f7f5] rounded space-y-2">
              <div className="flex items-center justify-between chrome-caps">
                <span className="font-bold text-[#111110] text-xs flex items-center gap-2">
                  <span>{b.name}</span>
                  <span className="text-base">{b.emoji}</span>
                </span>
                <span className="text-[10px] text-[#686865]">{b.date}</span>
              </div>
              <p className="font-shutabug-serif text-base text-[#333331] italic leading-relaxed">
                "{b.message}"
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SHUTABUG EXACT FOOTER (nBz1BW_foot)
      ───────────────────────────────────────────────────────────── */}
      <footer className="py-12 px-4 sm:px-8 max-w-[88rem] mx-auto flex flex-wrap items-center justify-between gap-6 chrome-caps text-[#686865] text-xs">
        <div>
          <span>© SHUTABUG x {eventDetails.bride.toUpperCase()} & {eventDetails.groom.toUpperCase()} . 2026</span>
          <span className="block text-[10px] mt-1 text-[#888885]">POLICIES: LOVE, JOY & CELEBRATION</span>
        </div>

        <div className="flex items-center gap-6">
          <a href="#ceremony" className="hover:text-black">INDEX</a>
          <button onClick={() => setIsInfoOpen(true)} className="hover:text-black">INFO</button>
          <button onClick={() => setIsHelpOpen(true)} className="hover:text-black">HELP</button>
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-black">BACK TO TOP ↑</button>
        </div>
      </footer>

      {/* ─────────────────────────────────────────────────────────────
          INTERACTIVE DRAWER 1: SEND BLESSINGS & RSVP MODAL
      ───────────────────────────────────────────────────────────── */}
      {isBlessingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-[#f2f2f0] border-2 border-black p-6 sm:p-8 rounded-sm shadow-2xl space-y-6 text-[#111110]">
            
            <button 
              onClick={() => setIsBlessingsOpen(false)}
              className="absolute top-4 right-4 p-1.5 border border-shutabug rounded hover:bg-[#111110] hover:text-[#f2f2f0] transition-colors"
            >
              <X size={16} />
            </button>

            {sentSuccess ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-[#111110] text-[#f2f2f0] flex items-center justify-center text-2xl mx-auto animate-bounce">
                  💖
                </div>
                <h3 className="font-shutabug-display text-2xl font-bold uppercase">BLESSING RECEIVED</h3>
                <p className="font-shutabug-serif text-base text-[#686865] italic">
                  Thank you for your warmth and love. Your message has been added to the celebration archive!
                </p>
              </div>
            ) : (
              <>
                <div className="border-b border-shutabug pb-4">
                  <span className="chrome-caps text-[10px] text-[#686865] block">GUESTBOOK & RSVP</span>
                  <h3 className="font-shutabug-display text-2xl font-bold uppercase mt-1">
                    SEND BLESSINGS TO MEERA & AARAV
                  </h3>
                </div>

                <form onSubmit={handleSendBlessing} className="space-y-4 chrome-caps">
                  
                  <div>
                    <label className="text-[11px] text-[#686865] block mb-1 font-semibold">YOUR FULL NAME *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Dayo & Amara Adeleke"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#f7f7f5] border border-shutabug rounded text-sm text-[#111110] focus:outline-none focus:border-black font-shutabug-serif"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-[#686865] block mb-1 font-semibold">RSVP ATTENDANCE</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setAttendance('attending')}
                        className={`py-2 px-3 border rounded text-xs font-bold transition-all ${
                          attendance === 'attending' ? 'bg-[#111110] text-[#f2f2f0] border-black' : 'bg-[#f7f7f5] border-shutabug'
                        }`}
                      >
                        ✓ JOYFULLY ATTENDING
                      </button>
                      <button
                        type="button"
                        onClick={() => setAttendance('remote')}
                        className={`py-2 px-3 border rounded text-xs font-bold transition-all ${
                          attendance === 'remote' ? 'bg-[#111110] text-[#f2f2f0] border-black' : 'bg-[#f7f7f5] border-shutabug'
                        }`}
                      >
                        ❤️ WISHES FROM AFAR
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-[#686865] block mb-1 font-semibold">SELECT AN ICON</label>
                    <div className="flex gap-2">
                      {['💖', '🥂', '💍', '✨', '🌸', '👑'].map((em) => (
                        <button
                          key={em}
                          type="button"
                          onClick={() => setSelectedEmoji(em)}
                          className={`w-9 h-9 border rounded flex items-center justify-center text-lg ${
                            selectedEmoji === em ? 'border-black bg-[#111110]/10 font-bold scale-110' : 'border-shutabug bg-[#f7f7f5]'
                          }`}
                        >
                          {em}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-[#686865] block mb-1 font-semibold">HEARTFELT MESSAGE</label>
                    <textarea 
                      rows={3}
                      placeholder="Write your wishes, blessings, and toasts here..."
                      value={blessingMessage}
                      onChange={(e) => setBlessingMessage(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#f7f7f5] border border-shutabug rounded text-sm text-[#111110] focus:outline-none focus:border-black font-shutabug-serif"
                    ></textarea>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-3.5 bg-[#111110] text-[#f2f2f0] hover:bg-black rounded font-shutabug-display font-bold text-xs tracking-widest uppercase transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <Send size={13} />
                    <span>TRANSMIT BLESSINGS WITH CONFETTI</span>
                  </button>

                </form>
              </>
            )}

          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          INTERACTIVE DRAWER 2: HELP & FAQ DRAWER (Shutabug Style)
      ───────────────────────────────────────────────────────────── */}
      {isHelpOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-[#f2f2f0] h-full p-6 sm:p-8 overflow-y-auto space-y-6 text-[#111110] border-l-2 border-black">
            
            <div className="flex items-center justify-between border-b border-shutabug pb-4">
              <span className="chrome-caps font-bold">GUEST PROTOCOL & HELP</span>
              <button onClick={() => setIsHelpOpen(false)} className="p-1 border border-shutabug rounded hover:bg-black hover:text-white">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-6 font-shutabug-serif text-sm">
              <div>
                <h4 className="chrome-caps text-xs font-bold text-[#111110] mb-1">NEED ASSISTANCE?</h4>
                <p className="text-[#555552]">Direct concierge email: <a href="mailto:concierge@meera-aarav.com" className="underline font-bold text-black">concierge@meera-aarav.com</a></p>
              </div>

              <div className="p-4 bg-[#ecece9] rounded border border-shutabug space-y-1">
                <span className="chrome-caps text-[10px] font-bold text-[#111110]">VALET & PARKING</span>
                <p className="text-xs text-[#555552]">Complimentary valet parking will be active at the North Gate of The Royal Heritage Palace starting at 17:00 HRS.</p>
              </div>

              <div className="p-4 bg-[#ecece9] rounded border border-shutabug space-y-1">
                <span className="chrome-caps text-[10px] font-bold text-[#111110]">DRESS CODE</span>
                <p className="text-xs text-[#555552]">Guests are requested to dress in Royal Traditional or Black Tie & Champagne tones to honor the celebratory palette.</p>
              </div>

              <div className="p-4 bg-[#ecece9] rounded border border-shutabug space-y-1">
                <span className="chrome-caps text-[10px] font-bold text-[#111110]">CHILDREN & PLUS-ONES</span>
                <p className="text-xs text-[#555552]">All registered guests and family members listed on your envelope are joyfully accommodated.</p>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          INTERACTIVE DRAWER 3: STORY & INFO
      ───────────────────────────────────────────────────────────── */}
      {isInfoOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-[#f2f2f0] h-full p-6 sm:p-8 overflow-y-auto space-y-6 text-[#111110] border-l-2 border-black">
            
            <div className="flex items-center justify-between border-b border-shutabug pb-4">
              <span className="chrome-caps font-bold">THE UNION STORY</span>
              <button onClick={() => setIsInfoOpen(false)} className="p-1 border border-shutabug rounded hover:bg-black hover:text-white">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4 font-shutabug-serif text-base text-[#333331] leading-relaxed">
              <h3 className="font-shutabug-display text-2xl font-bold uppercase">TWO WORLDS, ONE HEART</h3>
              <p>
                From lively afternoons in Lagos to serene lakeside sunsets in Udaipur, Meera and Aarav found in each other a companion for every journey, a laughter that cures any gloom, and a shared devotion to family.
              </p>
              <p>
                This website is presented in the authentic design language of Shutabug, honoring creative storytelling, African modernism, and Indian bridal grandeur.
              </p>
              <div className="p-4 border border-shutabug bg-[#e6e6e2] rounded text-xs chrome-caps">
                <span>CURATED WITH LOVE FOR FAMILY & FRIENDS</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          SEARCH OVERLAY (⌘K)
      ───────────────────────────────────────────────────────────── */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/50 backdrop-blur-sm animate-fadeIn" onClick={() => setIsSearchOpen(false)}>
          <div className="w-full max-w-lg bg-[#f2f2f0] border-2 border-black rounded p-4 shadow-2xl space-y-3" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2 border-b border-shutabug pb-2">
              <Search size={16} className="text-[#686865]" />
              <input 
                type="text"
                autoFocus
                placeholder="Search ceremony, timing, directions, attire..."
                className="w-full bg-transparent text-sm focus:outline-none font-shutabug-serif text-black"
              />
              <span className="chrome-caps text-[10px] bg-[#e2e2de] px-1.5 py-0.5 rounded text-[#686865]">ESC</span>
            </div>

            <div className="space-y-1 chrome-caps text-xs">
              <a href="#ceremony" onClick={() => setIsSearchOpen(false)} className="p-2 hover:bg-[#e2e2de] rounded flex items-center justify-between block">
                <span>01 / AUSPICIOUS RING EXCHANGE (18:30 HRS)</span>
                <ArrowUpRight size={12} />
              </a>
              <a href="#ceremony" onClick={() => setIsSearchOpen(false)} className="p-2 hover:bg-[#e2e2de] rounded flex items-center justify-between block">
                <span>02 / CELEBRATION DINNER & TOASTS (20:00 HRS)</span>
                <ArrowUpRight size={12} />
              </a>
              <a href="#details" onClick={() => setIsSearchOpen(false)} className="p-2 hover:bg-[#e2e2de] rounded flex items-center justify-between block">
                <span>03 / GOOGLE MAPS VENUE DIRECTIONS</span>
                <ArrowUpRight size={12} />
              </a>
              <button onClick={() => { setIsSearchOpen(false); setIsBlessingsOpen(true); }} className="w-full text-left p-2 hover:bg-[#e2e2de] rounded flex items-center justify-between">
                <span>04 / SEND BLESSINGS & RSVP</span>
                <Heart size={12} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          LIGHTBOX FOR INDIVIDUAL ARTWORK / PHOTO INSPECTION
      ───────────────────────────────────────────────────────────── */}
      {selectedArtwork && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn" onClick={() => setSelectedArtwork(null)}>
          <div className="relative max-w-2xl w-full bg-[#f2f2f0] border-2 border-black rounded p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-shutabug pb-3 chrome-caps">
              <span className="font-bold">INSPECTING: {selectedArtwork.title.toUpperCase()}</span>
              <button onClick={() => setSelectedArtwork(null)} className="p-1 border border-shutabug rounded hover:bg-black hover:text-white">
                <X size={16} />
              </button>
            </div>

            <div className="aspect-[4/3] overflow-hidden rounded border border-shutabug bg-black">
              <img src={selectedArtwork.image} alt={selectedArtwork.title} className="w-full h-full object-cover" />
            </div>

            <div className="space-y-2">
              <h3 className="font-shutabug-serif text-2xl italic text-[#111110]">{selectedArtwork.title}</h3>
              <p className="font-shutabug-serif text-sm text-[#555552]">{selectedArtwork.description}</p>
              <div className="flex items-center justify-between chrome-caps text-xs text-[#686865] pt-2 border-t border-shutabug">
                <span>TIMING: {selectedArtwork.time}</span>
                <span>VENUE: {selectedArtwork.venue}</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
