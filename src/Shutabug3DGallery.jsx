import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Heart, 
  Calendar, 
  MapPin, 
  Clock, 
  Sparkles, 
  Send, 
  Volume2, 
  VolumeX, 
  Compass, 
  ExternalLink,
  MessageCircle,
  X
} from 'lucide-react';

// Import images directly so Vite bundles them seamlessly for Vercel & production
const GALLERY_ITEMS = [
  {
    id: 1,
    title: 'SOMETHING IN BETWEEN',
    subtitle: 'The Beginning of Our Forever',
    quote: 'Love is not just looking at each other, it is looking in the same direction.',
    image: '/assets/amrutha-rejin-1.jpg',
    chapter: 'CHAPTER 01'
  },
  {
    id: 2,
    title: 'TWO HEARTS BY THE WATER',
    subtitle: 'Moments Written in the Stars',
    quote: 'Quiet laughter, calm waters, and a promise that anchors two souls together.',
    image: '/assets/amrutha-rejin-2.jpg',
    chapter: 'CHAPTER 02'
  },
  {
    id: 3,
    title: 'ASTROPHILE',
    subtitle: 'Love is a Series of Small Choices',
    quote: 'Love... is a series of small choices, made again and again.',
    image: '/assets/amrutha-rejin-3.jpg',
    chapter: 'CHAPTER 03'
  },
  {
    id: 4,
    title: 'THE PROMISE & THE PADDLE',
    subtitle: 'Steering Towards One Horizon',
    quote: 'Holding hands against the dark, trusting the warmth we found in each other.',
    image: '/assets/amrutha-rejin-4.jpg',
    chapter: 'CHAPTER 04'
  },
  {
    id: 5,
    title: 'PERFECTLY COMPATIBLE',
    subtitle: 'When Weirdness Becomes Love',
    quote: 'When we find someone whose weirdness is compatible with ours, we call it love.',
    image: '/assets/amrutha-rejin-5.jpg',
    chapter: 'CHAPTER 05'
  }
];

export default function Shutabug3DGallery() {
  // Official Betrothal Details
  const eventDetails = {
    bride: 'AMRUTHA',
    groom: 'REJIN',
    occasion: 'THE BETROTHAL CEREMONY',
    dateText: 'Saturday, 21st November 2026',
    timeText: '11:30 AM',
    receptionText: 'Reception to Follow',
    venueName: 'St. Thomas Syro Malabar Pilgrim Church',
    venueLocation: 'Malayattoor, Kerala',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=St.+Thomas+Syro+Malabar+Pilgrim+Church+Malayattoor',
    mapsPlaceUrl: 'https://www.google.com/maps/place/St.+Thomas+Syro+Malabar+Pilgrim+Church/@10.1852907,76.5067251,17z/data=!4m6!3m5!1s0x3b07fc810381642f:0x9dcb610aafce5da2!8m2!3d10.1852907!4d76.5067251!16s%2Fm%2F0h1dqwg',
    families: {
      brideFamily: 'Paulachan ND , Selin Paul , Athulya',
      groomFamily: 'Joy PK , Rosily Joy , Jerin Joy , Riya Jerin'
    }
  };

  // Scroll & 3D rotation state with smooth lerp damping
  const scrollTrackRef = useRef(null);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const targetAngleRef = useRef(0);
  const currentAngleRef = useRef(0);
  const animFrameRef = useRef(null);
  const [shareToast, setShareToast] = useState(null);

  // Audio Player State (Plays user's uploaded song)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio('/assets/song.mp3');
    audioRef.current.loop = true;
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Blessings & RSVP modal state
  const [isBlessingModalOpen, setIsBlessingModalOpen] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [blessingText, setBlessingText] = useState('');
  const [attendance, setAttendance] = useState('attending');
  const [selectedEmoji, setSelectedEmoji] = useState('💖');
  const [blessingsList, setBlessingsList] = useState([
    {
      id: 1,
      name: 'The Cherian Family',
      text: 'Heartfelt congratulations to dearest Amrutha & Rejin! May Almighty God shower his choicest blessings upon your union! 💍✨',
      emoji: '💐',
      time: 'Just now'
    },
    {
      id: 2,
      name: 'Mathew & Neha',
      text: 'So thrilled to celebrate your betrothal in Malayattoor! Counting down the days! ❤️',
      emoji: '💖',
      time: '1 hour ago'
    }
  ]);
  const [hasSentBlessing, setHasSentBlessing] = useState(false);

  // Active painting calculation
  const totalItems = GALLERY_ITEMS.length;
  const angleStep = 360 / totalItems;
  const activeIndex = ((Math.round(-rotationAngle / angleStep) % totalItems) + totalItems) % totalItems;
  const activeItem = GALLERY_ITEMS[activeIndex];

  // ─────────────────────────────────────────────────────────────
  // 1. SMOOTH SCROLL-DRIVEN 3D WALL ROTATION (LERP DAMPED)
  // Eliminates jitter and provides silky smooth cinematic rotation
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const handleScroll = () => {
      if (!scrollTrackRef.current) return;
      const track = scrollTrackRef.current;
      const rect = track.getBoundingClientRect();
      const trackHeight = track.offsetHeight - window.innerHeight;

      if (trackHeight <= 0) return;

      const scrolled = Math.max(0, Math.min(trackHeight, -rect.top));
      const progress = scrolled / trackHeight;
      setScrollProgress(progress);

      // Target angle for 360 rotation
      targetAngleRef.current = -progress * 360;
    };

    // Smooth lerp loop for 60fps buttery rotation
    const updateLerp = () => {
      currentAngleRef.current += (targetAngleRef.current - currentAngleRef.current) * 0.1;
      setRotationAngle(currentAngleRef.current);
      animFrameRef.current = requestAnimationFrame(updateLerp);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    animFrameRef.current = requestAnimationFrame(updateLerp);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // ─────────────────────────────────────────────────────────────
  // 2. WHATSAPP SHARING FOR SPECIFIC PHOTO (GUARANTEED TO WORK)
  // Direct WhatsApp intent URL + high-res image link
  // ─────────────────────────────────────────────────────────────
  const handleShareToWhatsApp = (e, photo) => {
    e.stopPropagation();

    // Absolute photo URL
    const fullImageUrl = window.location.origin + photo.image;
    const shareMessage = `💍 *Amrutha & Rejin's Betrothal Ceremony* • 21-11-2026\n\n"${photo.quote}"\n\n📍 St. Thomas Pilgrim Church, Malayattoor (11:30 AM)\n✨ Photo: ${fullImageUrl}\n🔗 Invitation: ${window.location.origin}`;

    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`;
    
    // Open WhatsApp directly
    window.open(waUrl, '_blank');

    setShareToast(`Sharing "${photo.title}" to WhatsApp!`);
    setTimeout(() => setShareToast(null), 3000);
  };

  // ─────────────────────────────────────────────────────────────
  // 3. PLAY UPLOADED SONG
  // ─────────────────────────────────────────────────────────────
  const toggleMusic = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio('/assets/song.mp3');
      audioRef.current.loop = true;
    }

    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlayingAudio(true);
      }).catch((e) => {
        console.error('Audio playback error', e);
      });
    }
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.65 },
      colors: ['#D4AF37', '#7A1828', '#F59E0B', '#FFFFFF', '#E6CA65']
    });
  };

  const handleSendBlessing = (e) => {
    e.preventDefault();
    if (!guestName.trim()) return;

    const newEntry = {
      id: Date.now(),
      name: guestName,
      text: blessingText || 'May God abundantly bless Amrutha & Rejin with lifelong joy and love! 💖',
      emoji: selectedEmoji,
      time: 'Just now'
    };

    setBlessingsList([newEntry, ...blessingsList]);
    setHasSentBlessing(true);
    triggerConfetti();

    setTimeout(() => {
      setHasSentBlessing(false);
      setIsBlessingModalOpen(false);
      setGuestName('');
      setBlessingText('');
    }, 2000);
  };

  // Radius scaled proportionally for perfect mobile fit
  const cylinderRadius = 310;

  return (
    <div className="min-h-screen bg-[#07080b] text-[#f7f5f0] selection:bg-[#d4af37] selection:text-black font-sans relative overflow-x-hidden">
      
      {/* Background Amber Sparks & Night Bonfire Atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-gradient-to-b from-[#d4af37]/15 via-[#7a1828]/10 to-transparent blur-[160px] rounded-full"></div>
        <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-[#f59e0b]/10 blur-[140px] rounded-full"></div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          MINIMALIST TOP BAR: ROYAL MONOGRAM & CLEAN MUSIC BUTTON
      ───────────────────────────────────────────────────────────── */}
      <header className="fixed top-4 inset-x-0 z-50 px-4 sm:px-8 flex items-center justify-between pointer-events-none">
        
        {/* Monogram Seal: R ✦ A (Exact royal style matching uploaded image) */}
        <div className="pointer-events-auto px-3.5 py-1.5 rounded-full border border-[#d4af37]/40 bg-[#0c0d14]/80 backdrop-blur-md shadow-2xl flex items-center gap-2">
          <span className="font-royal text-xs font-bold tracking-widest text-[#e5c158]">
            R <span className="text-[#38bdf8] text-[9px]">✦</span> A
          </span>
        </div>

        {/* Music Button */}
        <div className="pointer-events-auto">
          <button
            onClick={toggleMusic}
            aria-label="Toggle Music"
            className={`px-3.5 py-1.5 rounded-full border text-xs tracking-wider uppercase font-mono-clean flex items-center gap-2 transition-all shadow-2xl backdrop-blur-md ${
              isPlayingAudio
                ? 'bg-[#d4af37] text-black border-[#d4af37] shadow-[0_0_20px_rgba(212,175,55,0.4)]'
                : 'bg-[#0c0d14]/90 text-[#e6ca65] border-[#d4af37]/30 hover:border-[#d4af37]'
            }`}
          >
            {isPlayingAudio ? (
              <>
                <Volume2 size={14} className="animate-pulse text-black" />
                <span className="font-bold text-[10px]">MUSIC: ON</span>
              </>
            ) : (
              <>
                <VolumeX size={14} />
                <span className="font-semibold text-[10px]">PLAY MUSIC ♫</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Toast Notification for WhatsApp Share */}
      {shareToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#128C7E] text-white px-5 py-2.5 rounded-xl shadow-2xl font-mono-clean text-xs flex items-center gap-2 animate-bounce">
          <MessageCircle size={15} />
          <span>{shareToast}</span>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          1. SCROLL-DRIVEN 3D EXHIBITION WALL
          • Pinned container: Vertical scroll rotates the 3D gallery 360°
          • SCALED-DOWN TILE: Perfectly fitted, no overlapping
          • GLASSMORPHIC DESIGN: Replaced ivory block with translucent dark glass
      ───────────────────────────────────────────────────────────── */}
      <div ref={scrollTrackRef} className="relative h-[270vh]">
        
        {/* Sticky 3D Exhibition Screen */}
        <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-between pt-16 pb-8 overflow-hidden">
          
          {/* Top Announcement Tag: No outer circle/pill, silver color */}
          <div className="text-center z-20 space-y-1">
            <div className="flex items-center justify-center gap-2 text-[#cbd5e1] text-[10px] sm:text-[11px] font-royal tracking-[0.25em] uppercase font-bold">
              <span className="text-[#94a3b8] text-[9px]">✦</span>
              <span className="text-[#e2e8f0]">THE BETROTHAL EXHIBITION • 21-11-2026</span>
              <span className="text-[#94a3b8] text-[9px]">✦</span>
            </div>
            <p className="font-mono-clean text-[9px] tracking-widest text-[#94a3b8]/70 uppercase">
              Scroll down to rotate the 3D gallery
            </p>
          </div>

          {/* 3D Perspective Viewport */}
          <div 
            className="w-full max-w-sm sm:max-w-md h-[340px] sm:h-[380px] relative flex items-center justify-center pointer-events-none my-auto"
            style={{ perspective: '950px' }}
          >
            {/* The 3D Rotating Cylinder Object */}
            <div 
              className="w-full h-full relative preserve-3d flex items-center justify-center pointer-events-auto"
              style={{
                transform: `rotateY(${rotationAngle}deg)`,
              }}
            >
              {GALLERY_ITEMS.map((photo, idx) => {
                const itemAngle = idx * angleStep;
                return (
                  <div
                    key={photo.id}
                    className="absolute w-[180px] sm:w-[200px] flex flex-col items-center preserve-3d"
                    style={{
                      transform: `rotateY(${itemAngle}deg) translateZ(${cylinderRadius}px)`,
                    }}
                  >
                    {/* ─────────────────────────────────────────────────────────────
                        GLASSMORPHIC DESIGN BACKING (REPLACING THE IVORY BLOCK)
                    ───────────────────────────────────────────────────────────── */}
                    <div className="absolute -top-6 -inset-x-4 -bottom-8 glass-panel rounded-2xl -z-10 flex flex-col items-center justify-between p-3 border border-white/15">
                      <div className="w-20 h-10 bg-[#e5c158]/20 blur-xl rounded-full absolute -top-2"></div>
                    </div>

                    {/* SCALED-DOWN FRAMED PHOTO (PERFECT FIT ON ALL PHONES) */}
                    <div className="w-[145px] sm:w-[165px] aspect-[2/3] bg-black/90 p-1.5 rounded-xl shadow-2xl overflow-hidden relative border border-white/20 group">
                      
                      <img 
                        src={photo.image} 
                        alt={photo.title} 
                        className="w-full h-full object-cover rounded-lg"
                        loading="eager"
                      />

                      {/* WhatsApp Share Button in Top-Right Corner */}
                      <button
                        onClick={(e) => handleShareToWhatsApp(e, photo)}
                        title="Share this specific photo to WhatsApp"
                        aria-label={`Share ${photo.title} to WhatsApp`}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[#25D366] text-white shadow-lg flex items-center justify-center hover:scale-110 active:scale-90 transition-all z-30 border border-white/50 cursor-pointer"
                      >
                        <MessageCircle size={14} fill="white" className="text-white" />
                      </button>

                      {/* Glass Sheen */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none"></div>
                    </div>

                    {/* Translucent Glass Placard Underneath */}
                    <div className="mt-2.5 bg-[#0c0d14]/85 backdrop-blur-md text-white px-3 py-1 rounded-lg shadow-xl text-center w-[150px] border border-[#d4af37]/30">
                      <p className="font-royal text-[9px] font-bold uppercase tracking-wider text-[#e5c158]">
                        AMRUTHA & REJIN
                      </p>
                      <p className="font-mono-clean text-[7.5px] text-white/70 uppercase tracking-tight truncate">
                        {photo.title}
                      </p>
                    </div>

                    {/* Floor Reflection Shadow */}
                    <div className="w-36 h-4 bg-black/80 blur-md rounded-full mt-1.5"></div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Dynamic Status */}
          <div className="z-20 text-center space-y-1.5 px-4 max-w-sm mx-auto">
            <span className="font-mono-clean text-[10px] tracking-[0.25em] uppercase text-[#d4af37]">
              YOU ARE WALKING PAST
            </span>
            
            <h2 className="font-royal text-lg sm:text-2xl font-bold uppercase text-white tracking-wide">
              {activeItem.title}
            </h2>

            <p className="font-serif-luxury italic text-xs text-white/70 line-clamp-1">
              "{activeItem.quote}"
            </p>

            {/* Scroll Rotation Progress Bar */}
            <div className="pt-1 flex flex-col items-center gap-1">
              <div className="w-28 h-1 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#7a1828] to-[#d4af37] transition-all duration-75"
                  style={{ width: `${Math.min(100, scrollProgress * 100)}%` }}
                ></div>
              </div>
              <span className="font-mono-clean text-[8.5px] tracking-widest uppercase text-white/40">
                {scrollProgress < 0.95 ? 'SCROLL DOWN TO ROTATE GALLERY' : 'GALLERY COMPLETED • PROCEEDING TO CEREMONY ↓'}
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. REST OF THE SITE: ROYAL INVITATION & CEREMONY DETAILS
          (Royal font 'Cinzel' applied to bride & groom names & headers)
      ───────────────────────────────────────────────────────────── */}
      <main className="relative z-10 bg-[#08090d] border-t border-[#d4af37]/30">
        
        {/* SECTION 1: THE GRAND BRIDAL OPENING (ROYAL FONT CINZEL) */}
        <section className="py-20 px-4 sm:px-8 text-center max-w-3xl mx-auto space-y-5">
          
          <div className="flex items-center justify-center gap-2 text-[#d4af37]">
            <span className="w-10 h-[1px] bg-gradient-to-r from-transparent to-[#d4af37]"></span>
            <div className="flex items-center gap-2 font-mono-clean text-xs tracking-[0.3em] uppercase text-[#e6ca65]">
              <Sparkles size={13} />
              <span>THE WEDDING CELEBRATION OF</span>
              <Sparkles size={13} />
            </div>
            <span className="w-10 h-[1px] bg-gradient-to-l from-transparent to-[#d4af37]"></span>
          </div>

          <p className="font-mono-clean text-xs tracking-[0.2em] uppercase text-white/70 max-w-md mx-auto">
            TOGETHER WITH THEIR FAMILIES, JOYFULLY INVITE YOU TO THE BETROTHAL OF
          </p>

          {/* BRIDE & GROOM NAMES (EXACT ROYAL FONT CINZEL FROM UPLOADED IMAGE) */}
          <div className="relative py-3 select-none">
            <h1 className="font-royal text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight leading-[0.95]">
              <span className="block gold-gradient-text drop-shadow-[0_10px_35px_rgba(212,175,55,0.3)]">
                {eventDetails.groom}
              </span>
              <span className="font-royal text-2xl sm:text-4xl text-[#d4af37] block my-2 font-normal">
                &
              </span>
              <span className="block gold-gradient-text drop-shadow-[0_10px_35px_rgba(212,175,55,0.3)]">
                {eventDetails.bride}
              </span>
            </h1>

            {/* Bridal Ring Motif */}
            <div className="w-11 h-11 rounded-full border-2 border-dashed border-[#d4af37] flex items-center justify-center text-lg mx-auto mt-5 bg-[#7a1828]/30 shadow-2xl backdrop-blur-sm">
              💍
            </div>
          </div>

          <div className="pt-1">
            <span className="px-5 py-2 rounded-full border border-[#7a1828] bg-[#7a1828]/25 text-[#f5ecd5] font-royal text-xs tracking-[0.2em] uppercase font-bold inline-block">
              NOVEMBER | SATURDAY | 21 | 2026
            </span>
          </div>

          <p className="font-serif-luxury italic text-lg sm:text-xl text-white/70 max-w-lg mx-auto pt-2">
            "And now these three remain: faith, hope and love. But the greatest of these is love."
          </p>

        </section>

        {/* SECTION 2: SHARING IN OUR JOY (BOTH FAMILIES) */}
        <section className="py-14 px-4 sm:px-8 max-w-3xl mx-auto border-y border-white/10">
          <div className="text-center space-y-5">
            <span className="font-royal text-xs uppercase tracking-[0.3em] text-[#d4af37] font-semibold">
              SHARING IN OUR JOY
            </span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center max-w-2xl mx-auto">
              
              <div className="p-5 rounded-2xl glass-panel space-y-1.5">
                <span className="font-mono-clean text-[9px] text-[#d4af37] uppercase tracking-widest block font-bold">
                  BRIDE'S FAMILY
                </span>
                <p className="font-royal text-base sm:text-lg text-[#f7f5f0]">
                  {eventDetails.families.brideFamily}
                </p>
              </div>

              <div className="p-5 rounded-2xl glass-panel space-y-1.5">
                <span className="font-mono-clean text-[9px] text-[#d4af37] uppercase tracking-widest block font-bold">
                  GROOM'S FAMILY
                </span>
                <p className="font-royal text-base sm:text-lg text-[#f7f5f0]">
                  {eventDetails.families.groomFamily}
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* SECTION 3: THE BETROTHAL & VENUE ITINERARY */}
        <section className="py-16 px-4 sm:px-8 max-w-4xl mx-auto space-y-10">
          
          <div className="text-center space-y-1">
            <span className="font-royal text-xs uppercase tracking-[0.3em] text-[#d4af37]">
              SACRED CEREMONY & FEAST
            </span>
            <h2 className="font-royal text-2xl sm:text-4xl font-bold uppercase text-white">
              ITINERARY & DETAILS
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Church Ceremony Card */}
            <div className="p-6 sm:p-8 rounded-3xl glass-panel-gold space-y-3">
              <div className="w-11 h-11 rounded-xl bg-[#7a1828]/35 border border-[#7a1828] flex items-center justify-center text-[#d4af37]">
                <Clock size={20} />
              </div>
              <div>
                <span className="font-royal text-xs text-[#d4af37] tracking-widest uppercase font-bold">
                  AT 11:30 AM
                </span>
                <h3 className="font-royal text-2xl text-white mt-1">
                  The Betrothal Ceremony
                </h3>
              </div>
              <p className="text-xs text-white/70 font-mono-clean leading-relaxed">
                The blessing of rings and traditional betrothal vows at the sacred pilgrim altar of St. Thomas Church, Malayattoor.
              </p>
            </div>

            {/* Reception Card */}
            <div className="p-6 sm:p-8 rounded-3xl glass-panel-gold space-y-3">
              <div className="w-11 h-11 rounded-xl bg-[#7a1828]/35 border border-[#7a1828] flex items-center justify-center text-[#d4af37]">
                <Sparkles size={20} />
              </div>
              <div>
                <span className="font-royal text-xs text-[#d4af37] tracking-widest uppercase font-bold">
                  AFTERNOON
                </span>
                <h3 className="font-royal text-2xl text-white mt-1">
                  Celebration Reception
                </h3>
              </div>
              <p className="text-xs text-white/70 font-mono-clean leading-relaxed">
                Reception to follow immediately after the service. Join both families for celebratory blessings, lunch feast, and music.
              </p>
            </div>

          </div>

        </section>

        {/* SECTION 4: CONSOLIDATED PASS CARD */}
        <section className="py-16 px-4 sm:px-8 max-w-3xl mx-auto">
          
          <div className="relative rounded-3xl bg-gradient-to-b from-[#161724] via-[#0f1018] to-[#08090f] border-2 border-[#d4af37]/40 p-6 sm:p-10 shadow-[0_20px_60px_rgba(212,175,55,0.2)] space-y-6">
            
            <div className="text-center space-y-2">
              <span className="px-4 py-1.5 rounded-full border border-[#7a1828] bg-[#7a1828]/30 font-royal text-[9px] tracking-[0.3em] uppercase text-[#e6ca65] inline-block font-bold">
                COMPLETE INVITATION PASS
              </span>
              <h2 className="font-royal text-2xl sm:text-4xl font-bold uppercase text-white">
                CONSOLIDATED EVENT DETAILS
              </h2>
            </div>

            {/* 4-Cell Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              
              <div className="p-4 rounded-xl bg-black/60 border border-white/10 space-y-1">
                <span className="font-mono-clean text-[9px] uppercase text-[#d4af37] tracking-widest font-semibold flex items-center gap-1.5">
                  <Calendar size={12} /> DATE & DAY
                </span>
                <h4 className="font-royal text-sm font-bold text-white">{eventDetails.dateText}</h4>
                <p className="font-mono-clean text-[10px] text-white/60">Saturday Morning Service</p>
              </div>

              <div className="p-4 rounded-xl bg-black/60 border border-white/10 space-y-1">
                <span className="font-mono-clean text-[9px] uppercase text-[#d4af37] tracking-widest font-semibold flex items-center gap-1.5">
                  <Clock size={12} /> CEREMONY TIME
                </span>
                <h4 className="font-royal text-sm font-bold text-white">{eventDetails.timeText}</h4>
                <p className="font-mono-clean text-[10px] text-[#e6ca65]">{eventDetails.receptionText}</p>
              </div>

              <div className="p-4 rounded-xl bg-black/60 border border-white/10 space-y-1">
                <span className="font-mono-clean text-[9px] uppercase text-[#d4af37] tracking-widest font-semibold flex items-center gap-1.5">
                  <MapPin size={12} /> CHURCH VENUE
                </span>
                <h4 className="font-royal text-xs font-bold text-white leading-snug">{eventDetails.venueName}</h4>
                <p className="font-mono-clean text-[10px] text-white/60">{eventDetails.venueLocation}</p>
              </div>

              <div className="p-4 rounded-xl bg-black/60 border border-white/10 space-y-1">
                <span className="font-mono-clean text-[9px] uppercase text-[#d4af37] tracking-widest font-semibold flex items-center gap-1.5">
                  <Compass size={12} /> OCCASION
                </span>
                <h4 className="font-royal text-sm font-bold text-white">{eventDetails.occasion}</h4>
                <p className="font-mono-clean text-[10px] text-white/60">Paulachan & Joy Families</p>
              </div>

            </div>

            {/* Direct Google Maps Link */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <a 
                href={eventDetails.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  e.preventDefault();
                  window.open(eventDetails.mapsPlaceUrl || eventDetails.mapsUrl, '_blank');
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#7a1828] to-[#991b1b] border border-[#d4af37]/40 hover:border-[#d4af37] font-royal text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 text-white shadow-lg active:scale-95 transition-all cursor-pointer"
              >
                <MapPin size={14} className="text-[#d4af37]" />
                <span>OPEN MALAYATTOOR CHURCH IN GOOGLE MAPS</span>
                <ExternalLink size={12} />
              </a>

              <button 
                onClick={() => {
                  const title = encodeURIComponent(`Amrutha & Rejin's Betrothal Ceremony`);
                  const loc = encodeURIComponent(`${eventDetails.venueName}, ${eventDetails.venueLocation}`);
                  window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&location=${loc}&dates=20261121T060000Z/20261121T100000Z`, '_blank');
                }}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white/10 border border-white/20 hover:border-white font-royal text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-white hover:text-black transition-all"
              >
                <Calendar size={14} className="text-[#d4af37]" />
                <span>ADD TO GOOGLE CALENDAR</span>
              </button>
            </div>

            {/* SEND BLESSINGS BUTTON */}
            <div className="pt-6 border-t border-white/10 text-center space-y-3">
              <button 
                onClick={() => {
                  setIsBlessingModalOpen(true);
                  triggerConfetti();
                }}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f7e6b5] to-[#aa7c11] text-black font-royal font-extrabold text-xs sm:text-sm tracking-[0.15em] uppercase shadow-[0_10px_35px_rgba(212,175,55,0.4)] active:scale-95 transition-all flex items-center justify-center gap-2.5 mx-auto"
              >
                <Sparkles size={16} className="animate-spin" />
                <span>CLICK TO SEND BLESSINGS & RSVP</span>
                <Heart size={16} fill="black" />
              </button>

              <p className="font-mono-clean text-[10px] text-white/50 uppercase">
                LEAVE A PRAYER & SHOWER THE COUPLE WITH CELEBRATORY CONFETTI
              </p>
            </div>

          </div>

        </section>

        {/* SECTION 5: LIVE BLESSINGS WALL */}
        <section className="py-14 px-4 sm:px-8 max-w-3xl mx-auto border-t border-white/10">
          <div className="flex items-center justify-between mb-6 font-royal">
            <div>
              <span className="text-[9px] text-[#d4af37] uppercase tracking-widest block font-mono-clean">GUESTBOOK</span>
              <h3 className="text-xl font-bold uppercase text-white">BLESSINGS ARCHIVE ({blessingsList.length})</h3>
            </div>
            <button 
              onClick={() => {
                setIsBlessingModalOpen(true);
                triggerConfetti();
              }}
              className="px-3.5 py-1.5 rounded border border-[#d4af37] text-[11px] font-bold text-[#d4af37] hover:bg-[#d4af37] hover:text-black transition-all"
            >
              + ADD BLESSING
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {blessingsList.map((item) => (
              <div key={item.id} className="p-4 rounded-xl glass-panel space-y-1.5 font-mono-clean">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white flex items-center gap-2">
                    <span>{item.name}</span>
                    <span className="text-sm">{item.emoji}</span>
                  </span>
                  <span className="text-[9px] text-white/40">{item.time}</span>
                </div>
                <p className="text-xs text-white/70 italic">"{item.text}"</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            FOOTER: CREATED BY FLUX FRAME
        ───────────────────────────────────────────────────────────── */}
        <footer className="py-12 px-4 text-center border-t border-white/10 bg-[#050608] space-y-5">
          <div className="font-royal text-xl text-[#d4af37] tracking-wider">
            {eventDetails.bride} & {eventDetails.groom}
          </div>
          <p className="font-mono-clean text-[9px] tracking-widest text-white/40 uppercase">
            {eventDetails.dateText} • MALAYATTOOR, KERALA
          </p>

          {/* Professional Flux Frame Badge */}
          <div className="pt-5 border-t border-white/5 flex flex-col items-center justify-center gap-2">
            <span className="font-mono-clean text-[9px] tracking-[0.3em] uppercase text-white/40">
              CREATED BY
            </span>
            <div className="p-2 rounded-lg bg-black border border-white/10">
              <img 
                src="/assets/fluxframe-logo.png" 
                alt="Flux Frame - Cinematic Visuals" 
                className="h-12 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity"
              />
            </div>
            <p className="font-mono-clean text-[8px] tracking-[0.25em] uppercase text-white/30">
              FLUX FRAME • CINEMATIC VISUALS
            </p>
          </div>
        </footer>

      </main>

      {/* ─────────────────────────────────────────────────────────────
          INTERACTIVE BLESSINGS & RSVP POPUP MODAL
      ───────────────────────────────────────────────────────────── */}
      {isBlessingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-sm bg-[#13141f] border-2 border-[#d4af37]/60 rounded-2xl p-6 shadow-2xl space-y-5 text-white font-mono-clean">
            
            <button 
              onClick={() => setIsBlessingModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 text-white/60 hover:text-white"
            >
              <X size={15} />
            </button>

            {hasSentBlessing ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-[#d4af37]/20 border border-[#d4af37] flex items-center justify-center text-2xl mx-auto animate-bounce">
                  💖
                </div>
                <h3 className="font-royal text-xl font-bold uppercase">BLESSING RECEIVED!</h3>
                <p className="text-xs text-white/70">
                  Thank you for your prayers and blessings for Amrutha & Rejin!
                </p>
              </div>
            ) : (
              <>
                <div className="border-b border-white/10 pb-3">
                  <span className="text-[9px] text-[#d4af37] tracking-widest uppercase block">RSVP & GUESTBOOK</span>
                  <h3 className="font-royal text-lg font-bold uppercase mt-1">SEND YOUR BLESSINGS</h3>
                </div>

                <form onSubmit={handleSendBlessing} className="space-y-3.5 text-left text-xs">
                  
                  <div>
                    <label className="text-[9px] uppercase text-[#d4af37] tracking-wider block mb-1">YOUR NAME *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Thomas & Maria Varghese"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/20 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] uppercase text-[#d4af37] tracking-wider block mb-1">ATTENDANCE</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setAttendance('attending')}
                        className={`py-2 px-2.5 rounded text-[10px] font-bold border transition-all ${
                          attendance === 'attending' ? 'bg-[#d4af37] text-black border-[#d4af37]' : 'bg-black/40 border-white/10 text-white/60'
                        }`}
                      >
                        ✓ JOYFULLY ATTENDING
                      </button>
                      <button
                        type="button"
                        onClick={() => setAttendance('remote')}
                        className={`py-2 px-2.5 rounded text-[10px] font-bold border transition-all ${
                          attendance === 'remote' ? 'bg-[#d4af37] text-black border-[#d4af37]' : 'bg-black/40 border-white/10 text-white/60'
                        }`}
                      >
                        ❤️ PRAYERS FROM AFAR
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] uppercase text-[#d4af37] tracking-wider block mb-1">BLESSING ICON</label>
                    <div className="flex gap-2">
                      {['💖', '💐', '💍', '✨', '🌸', '🕊️'].map((em) => (
                        <button
                          key={em}
                          type="button"
                          onClick={() => setSelectedEmoji(em)}
                          className={`w-8 h-8 rounded text-sm border flex items-center justify-center ${
                            selectedEmoji === em ? 'border-[#d4af37] bg-[#d4af37]/20 scale-110' : 'border-white/10 bg-black/40'
                          }`}
                        >
                          {em}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] uppercase text-[#d4af37] tracking-wider block mb-1">YOUR MESSAGE</label>
                    <textarea 
                      rows={2}
                      placeholder="Write your prayers and blessings for Amrutha & Rejin..."
                      value={blessingText}
                      onChange={(e) => setBlessingText(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/20 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                    ></textarea>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa7c11] text-black font-royal font-bold text-xs uppercase tracking-wider active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <Send size={12} />
                    <span>TRANSMIT BLESSINGS WITH CONFETTI ✨</span>
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
