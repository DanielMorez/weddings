import { useState, useEffect, useRef, type FormEvent } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import imgHeroBlock from '@/imports/MobileWeddingV2/photo_2026-08-09_213029.png'
import imgFormalPortrait from '@/imports/MobileWeddingV2/4875327f91ae4c0ef4f93d30c8e1ccf00ee8e0af.png'
import imgTimerBlock from '@/imports/MobileWeddingV2/99b2d9dbff6b24a25c62c037179ed9d4a4d556af.png'
import weddingTrack from '@/imports/Audio/Би-2 - Молитва (OST Метро).mp3'
import { getRsvpStatus, submitRsvp } from '@/api/rsvp'

// Register ScrollTrigger once at module level — safe to call multiple times
gsap.registerPlugin(ScrollTrigger)

// ─── Design tokens ────────────────────────────────────────────────────────────
const BURGUNDY = '#6e1c24'
const CREAM    = '#fcfbfa'
const INK      = '#1a1a1a'
const MUTED    = 'rgba(26,26,26,0.6)'
const BORDER_SOFT = '#eae7e2'
const BORDER_RULE = '#F0EAE6'

/** Shorthand for Cormorant Garamond style objects */
const cg = (weight: number, size: number, extra?: React.CSSProperties): React.CSSProperties => ({
  fontFamily: '"Cormorant Garamond", serif',
  fontWeight: weight,
  fontSize:   `${size}px`,
  margin:     0,
  lineHeight: 'normal',
  ...extra,
})

// ─── Target wedding date ──────────────────────────────────────────────────────
const WEDDING_DATE = new Date('2026-09-19T16:30:00')

// ─── useLenis ────────────────────────────────────────────────────────────────
/**
 * Initialises Lenis momentum scroll and wires it into GSAP's ticker so that
 * ScrollTrigger always reads the interpolated Lenis scroll position rather than
 * the raw browser scroll position. Cleans up completely on unmount.
 *
 * Integration pattern (official Lenis + GSAP docs):
 *   1. lenis.on('scroll', ScrollTrigger.update) — push each Lenis scroll event
 *      into ScrollTrigger so scrub animations update in lock-step.
 *   2. gsap.ticker.add(raf) — drive Lenis from GSAP's rAF loop so both systems
 *      share one animation frame and never drift.
 *   3. gsap.ticker.lagSmoothing(0) — prevent GSAP from dropping frames when the
 *      tab is backgrounded, which would cause Lenis to stutter on refocus.
 */
function useLenis(enabled: boolean) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    // Premium easing: exponential ease-out — weighted, magazine-like deceleration
    const ease = (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t))

    const lenis = new Lenis({
      duration:        1.8,
      easing:          ease,
      smoothWheel:     true,
      wheelMultiplier: 0.85,
      syncTouch:       false, // native touch momentum — less fight with the OS
      touchMultiplier: 1.2,
      infinite:        false,
    })

    lenisRef.current = lenis
    lenis.stop() // gate holds scroll until guest opens the invitation

    // 1. Forward every interpolated scroll event to ScrollTrigger so scrub
    //    animations stay in sync with Lenis position, not native scroll.
    lenis.on('scroll', ScrollTrigger.update)

    // 2. Drive Lenis from GSAP's ticker — single unified rAF loop.
    //    `time` is in seconds; Lenis.raf() expects milliseconds.
    const raf = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)

    // 3. Disable lag-smoothing so GSAP never skips frames after tab blur.
    gsap.ticker.lagSmoothing(0)

    return () => {
      // Remove the ticker callback, destroy Lenis, and kill all ScrollTriggers
      // created in this session to avoid stale triggers across HMR cycles.
      gsap.ticker.remove(raf)
      lenis.destroy()
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [])

  useEffect(() => {
    const lenis = lenisRef.current
    if (!lenis) return
    if (enabled) lenis.start()
    else lenis.stop()
  }, [enabled])

  return lenisRef
}

// ─── useScrollReveal ─────────────────────────────────────────────────────────
/**
 * Observes every [data-reveal] and [data-reveal-stagger] element.
 * Adds the "visible" class once the element crosses the viewport threshold,
 * triggering the CSS fade-in-up transition defined in index.css.
 */
function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('visible')
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -44px 0px' },
    )

    document
      .querySelectorAll('[data-reveal], [data-reveal-stagger]')
      .forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])
}

// ─── useParallax ─────────────────────────────────────────────────────────────
/**
 * Registers GSAP ScrollTrigger parallax animations on the hero and timer
 * background images, plus a subtle counter-scroll on the portrait photo.
 *
 * Each tween uses:
 *   - yPercent: fractional vertical offset as % of the element's own height
 *   - ease: "none" — scrub handles the easing; a curve here doubles it
 *   - scrub: 1.2 — slight lag so parallax follows scroll smoothly without jitter
 *     Lenis's interpolated position still drives the depth effect
 *
 * The function is called after Lenis is mounted so ScrollTrigger reads the
 * correct scroll proxy from Lenis → gsap.ticker.
 */
function useParallax(refs: {
  heroImg:     React.RefObject<HTMLImageElement | null>
  heroSection: React.RefObject<HTMLElement | null>
  timerImg:    React.RefObject<HTMLImageElement | null>
  timerSection:React.RefObject<HTMLElement | null>
  portraitImg: React.RefObject<HTMLImageElement | null>
  portraitWrap:React.RefObject<HTMLDivElement | null>
}) {
  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── Hero: image drifts upward as the section scrolls out of view
      if (refs.heroImg.current && refs.heroSection.current) {
        gsap.fromTo(
          refs.heroImg.current,
          { yPercent: 0 },
          {
            yPercent: 22,           // moves up ~22% of its own height
            ease: 'none',
            scrollTrigger: {
              trigger: refs.heroSection.current,
              start:   'top top',   // when section top hits viewport top
              end:     'bottom top',// when section bottom leaves top
              scrub:   1.2,         // slight lag so parallax doesn't jitter with scroll
            },
          },
        )
      }

      // ── Timer background: same treatment for the dark overlay section
      if (refs.timerImg.current && refs.timerSection.current) {
        gsap.fromTo(
          refs.timerImg.current,
          { yPercent: -10 },
          {
            yPercent: 10,
            ease: 'none',
            scrollTrigger: {
              trigger: refs.timerSection.current,
              start:   'top bottom', // starts animating before section enters
              end:     'bottom top',
              scrub:   1.2,
            },
          },
        )
      }

      // ── Portrait: subtle counter-scroll for depth against the border frame
      if (refs.portraitImg.current && refs.portraitWrap.current) {
        gsap.fromTo(
          refs.portraitImg.current,
          { yPercent: -4 },
          {
            yPercent: 4,
            ease: 'none',
            scrollTrigger: {
              trigger: refs.portraitWrap.current,
              start:   'top bottom',
              end:     'bottom top',
              scrub:   1.2,
            },
          },
        )
      }
    })

    // Dispose all tweens and ScrollTriggers created inside this context
    return () => ctx.revert()
  }, [refs])
}

// ─── Countdown helpers ────────────────────────────────────────────────────────

function getTimeLeft() {
  const diff = WEDDING_DATE.getTime() - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  return {
    days:    Math.floor(diff / 86_400_000),
    hours:   Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff /    60_000) % 60),
    seconds: Math.floor((diff /     1_000) % 60),
  }
}

const pad = (n: number) => String(n).padStart(2, '0')

// ─── AnimatedDigit ────────────────────────────────────────────────────────────
/**
 * Renders a two-character digit that cross-fades through a blur when its value
 * changes, creating a high-end digital clock feel without jarring snaps.
 *
 * Technique: on value change, fade+blur out → swap content → fade+blur in.
 * The swap happens mid-transition so the outgoing and incoming frames never
 * overlap visually.
 */
function AnimatedDigit({ value }: { value: string }) {
  const [displayed, setDisplayed] = useState(value)
  const [fading, setFading]       = useState(false)

  useEffect(() => {
    if (value === displayed) return
    setFading(true)
    const swap = setTimeout(() => {
      setDisplayed(value)
      setFading(false)
    }, 210)
    return () => clearTimeout(swap)
  }, [value, displayed])

  return (
    <span
      style={{
        display:    'inline-block',
        minWidth:   '2ch',
        textAlign:  'center',
        transition: 'opacity 0.21s ease, filter 0.21s ease',
        opacity:    fading ? 0 : 1,
        filter:     fading ? 'blur(5px)' : 'blur(0)',
      }}
    >
      {displayed}
    </span>
  )
}

// ─── Chip ─────────────────────────────────────────────────────────────────────
/**
 * Tactile selection chip with a spring scale-down on press (0.96) and a
 * fluid 400ms color transition matching Smart Animate Ease Out timing.
 */
function Chip({
  label,
  selected,
  onClick,
}: {
  label:    string
  selected: boolean
  onClick:  () => void
}) {
  const [pressing, setPressing] = useState(false)

  return (
    <button
      type="button"
      onClick={onClick}
      onPointerDown={() => setPressing(true)}
      onPointerUp={  () => setPressing(false)}
      onPointerLeave={() => setPressing(false)}
      style={{
        display:         'flex',
        alignItems:      'center',
        padding:         '10px 16px',
        borderRadius:    '30px',
        border:          `1px solid ${selected ? BURGUNDY : BORDER_SOFT}`,
        background:      selected ? BURGUNDY : CREAM,
        color:           selected ? CREAM     : INK,
        fontFamily:      '"Cormorant Garamond", serif',
        fontWeight:      500,
        fontSize:        '14px',
        lineHeight:      'normal',
        whiteSpace:      'nowrap',
        cursor:          'pointer',
        userSelect:      'none',
        outline:         'none',
        // 400ms color flip + 150ms spring press — two separate curve profiles
        transition: [
          'background-color 0.4s cubic-bezier(0.16,1,0.3,1)',
          'color            0.4s cubic-bezier(0.16,1,0.3,1)',
          'border-color     0.4s cubic-bezier(0.16,1,0.3,1)',
          'transform        0.15s cubic-bezier(0.16,1,0.3,1)',
        ].join(', '),
        transform: pressing ? 'scale(0.96)' : 'scale(1)',
      }}
    >
      {label}
    </button>
  )
}

// ─── InputField ───────────────────────────────────────────────────────────────
/**
 * Hairline-bottom text input. On focus:
 *   - border transitions from soft gray → deep burgundy (300ms ease)
 *   - placeholder fades out so the cursor has clear space
 */
function InputField({
  label,
  placeholder,
  value,
  onChange,
}: {
  label:       string
  placeholder: string
  value:       string
  onChange:    (v: string) => void
}) {
  const [focused, setFocused] = useState(false)
  const isActive = focused || value.length > 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
      <label style={{ ...cg(500, 15), color: INK, display: 'block' }}>{label}</label>
      <div style={{ position: 'relative', height: '48px' }}>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={ () => setFocused(false)}
          placeholder={isActive ? '' : placeholder}
          style={{
            width:        '100%',
            height:       '100%',
            background:   'transparent',
            border:       'none',
            borderBottom: `1px solid ${focused ? BURGUNDY : BORDER_SOFT}`,
            outline:      'none',
            fontFamily:   '"Cormorant Garamond", serif',
            fontStyle:    isActive ? 'normal' : 'italic',
            fontWeight:   400,
            fontSize:     '14px',
            color:        isActive ? INK : 'rgba(26,26,26,0.5)',
            padding:      '0',
            boxSizing:    'border-box',
            transition:   'border-color 0.3s cubic-bezier(0.16,1,0.3,1)',
          }}
        />
      </div>
    </div>
  )
}

// ─── MapButton / SubmitButton ─────────────────────────────────────────────────
/** Soft magnetic ripple: scale(1.01) on hover, scale(0.97) on press */
function MapButton() {
  const [pressing, setPressing] = useState(false)
  const [hovering, setHovering] = useState(false)

  return (
    <a
      href="https://maps.google.com/?q=Улица+Мира+2а"
      target="_blank"
      rel="noopener noreferrer"
      onPointerDown={  () => setPressing(true)}
      onPointerUp={    () => setPressing(false)}
      onPointerLeave={ () => { setPressing(false); setHovering(false) }}
      onPointerEnter={ () => setHovering(true)}
      style={{
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'center',
        padding:         '16px 32px',
        background:      BURGUNDY,
        borderRadius:    '2px',
        width:           '100%',
        textDecoration:  'none',
        boxShadow:       '0 4px 6px rgba(0,0,0,0.15)',
        boxSizing:       'border-box',
        transition:      'transform 0.22s cubic-bezier(0.16,1,0.3,1)',
        transform:       pressing ? 'scale(0.97)' : hovering ? 'scale(1.01)' : 'scale(1)',
      }}
    >
      <span style={{ ...cg(600, 13), color: CREAM, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        Посмотреть на карте
      </span>
    </a>
  )
}

function SubmitButton({ loading = false }: { loading?: boolean }) {
  const [pressing, setPressing] = useState(false)
  const [hovering, setHovering] = useState(false)

  return (
    <button
      type="submit"
      disabled={loading}
      onPointerDown={  () => !loading && setPressing(true)}
      onPointerUp={    () => setPressing(false)}
      onPointerLeave={ () => { setPressing(false); setHovering(false) }}
      onPointerEnter={ () => setHovering(true)}
      style={{
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        padding:        '16px',
        width:          '100%',
        background:     BURGUNDY,
        border:         'none',
        borderRadius:   '2px',
        boxShadow:      '0 4px 6px rgba(0,0,0,0.15)',
        cursor:         loading ? 'wait' : 'pointer',
        opacity:        loading ? 0.7 : 1,
        transition:     'transform 0.22s cubic-bezier(0.16,1,0.3,1), opacity 0.2s ease',
        transform:      pressing ? 'scale(0.97)' : hovering && !loading ? 'scale(1.01)' : 'scale(1)',
      }}
    >
      <span style={{ ...cg(600, 14), color: CREAM, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        {loading ? 'Отправляем…' : 'Отправить ответ'}
      </span>
    </button>
  )
}

// ─── SuccessState ─────────────────────────────────────────────────────────────
function SuccessState() {
  return (
    <div
      style={{
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        gap:            '16px',
        padding:        '48px 24px',
        textAlign:      'center',
        animation:      'fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) forwards',
      }}
    >
      <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }`}</style>
      <div style={{
        width:       '48px',
        height:      '48px',
        border:      `1.5px solid ${BURGUNDY}`,
        borderRadius:'50%',
        display:     'flex',
        alignItems:  'center',
        justifyContent:'center',
      }}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M4 10.5l4.5 4.5 7.5-9" stroke={BURGUNDY} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <p style={{ ...cg(400, 28), color: INK, lineHeight: 1.2 }}>Спасибо!</p>
      <p style={{ ...cg(400, 17), color: MUTED, lineHeight: 1.6 }}>
        Ваш ответ принят. Мы с нетерпением ждём вас на торжестве.
      </p>
    </div>
  )
}

// ─── Music gate + mute ───────────────────────────────────────────────────────
function MusicGate({
  visible,
  fading,
  onOpen,
}: {
  visible: boolean
  fading: boolean
  onOpen: () => void
}) {
  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Свадебное приглашение"
      style={{
        position:       'fixed',
        inset:          0,
        zIndex:         1000,
        background:     CREAM,
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        justifyContent: 'center',
        padding:        '48px 32px',
        textAlign:      'center',
        opacity:        fading ? 0 : 1,
        transition:     'opacity 0.55s cubic-bezier(0.16,1,0.3,1)',
        pointerEvents:  fading ? 'none' : 'auto',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '28px', maxWidth: '360px', width: '100%' }}>
        <p style={{ ...cg(500, 13), color: BURGUNDY, textTransform: 'uppercase', letterSpacing: '0.14em' }}>
          Свадебное приглашение
        </p>
        <p style={{
          fontFamily: '"Pinyon Script", cursive',
          fontWeight: 400,
          fontSize:   '64px',
          color:      BURGUNDY,
          lineHeight: 1,
          margin:     0,
        }}>
          Rasim &amp; Anna
        </p>
        <div style={{ width: '64px', height: '1px', background: 'rgba(110,28,36,0.35)' }} />
        <p style={{ ...cg(400, 18), color: MUTED, letterSpacing: '0.08em' }}>
          19 . 09 . 2026
        </p>
        <button
          type="button"
          onClick={onOpen}
          style={{
            marginTop:      '24px',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            padding:        '16px 48px',
            width:          '100%',
            maxWidth:       '280px',
            background:     BURGUNDY,
            border:         'none',
            borderRadius:   '2px',
            cursor:         'pointer',
            boxShadow:      '0 4px 6px rgba(0,0,0,0.12)',
          }}
        >
          <span style={{ ...cg(600, 13), color: CREAM, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Открыть
          </span>
        </button>
      </div>
    </div>
  )
}

function MusicMuteButton({
  muted,
  onToggle,
}: {
  muted: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={muted ? 'Включить музыку' : 'Выключить музыку'}
      style={{
        position:       'fixed',
        right:          '20px',
        bottom:         '20px',
        zIndex:         900,
        width:          '48px',
        height:         '48px',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        background:     CREAM,
        border:         `1px solid ${BURGUNDY}`,
        borderRadius:   '2px',
        cursor:         'pointer',
        boxShadow:      '0 2px 8px rgba(26,5,8,0.08)',
      }}
    >
      {muted ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M11 5L6 9H3v6h3l5 4V5z" stroke={BURGUNDY} strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M16 9.5l5 5M21 9.5l-5 5" stroke={BURGUNDY} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M11 5L6 9H3v6h3l5 4V5z" stroke={BURGUNDY} strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M15.5 8.5a4.5 4.5 0 010 7M18.5 6a8 8 0 010 12" stroke={BURGUNDY} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )}
    </button>
  )
}

// ─── Divider ─────────────────────────────────────────────────────────────────
function Divider() {
  return (
    <div style={{ padding: '0 32px', height: '64px', display: 'flex', alignItems: 'center' }}>
      <div style={{ height: '1px', background: BORDER_RULE, width: '100%' }} />
    </div>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [entered, setEntered] = useState(false)
  const [gateFading, setGateFading] = useState(false)
  const [muted, setMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Lenis must initialise before useParallax registers ScrollTriggers so that
  // GSAP's ticker is already driving Lenis when the first trigger fires.
  useLenis(entered)
  useScrollReveal()

  useEffect(() => {
    if (entered) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [entered])

  // ── Element refs for GSAP parallax targets ────────────────────────────────
  const heroSectionRef  = useRef<HTMLElement>(null)
  const heroImgRef      = useRef<HTMLImageElement>(null)
  const timerSectionRef = useRef<HTMLElement>(null)
  const timerImgRef     = useRef<HTMLImageElement>(null)
  const portraitWrapRef = useRef<HTMLDivElement>(null)
  const portraitImgRef  = useRef<HTMLImageElement>(null)

  useParallax({
    heroImg:      heroImgRef,
    heroSection:  heroSectionRef,
    timerImg:     timerImgRef,
    timerSection: timerSectionRef,
    portraitImg:  portraitImgRef,
    portraitWrap: portraitWrapRef,
  })

  // ── Live countdown ────────────────────────────────────────────────────────
  const [timeLeft, setTimeLeft] = useState(getTimeLeft)
  useEffect(() => {
    const t = setInterval(() => setTimeLeft(getTimeLeft()), 1000)
    return () => clearInterval(t)
  }, [])

  // ── RSVP form state ───────────────────────────────────────────────────────
  const [name,       setName]       = useState('')
  const [attendance, setAttendance] = useState<string | null>(null)
  const [drinks,     setDrinks]     = useState<Set<string>>(new Set())
  const [allergy,    setAllergy]    = useState('')
  const [plusOne,    setPlusOne]    = useState('')
  const [submitted,  setSubmitted]  = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    getRsvpStatus()
      .then((already) => {
        if (!cancelled && already) setSubmitted(true)
      })
      .catch(() => {
        /* status check is best-effort */
      })
    return () => {
      cancelled = true
    }
  }, [])

  const handleOpenInvitation = async () => {
    const audio = audioRef.current
    if (audio) {
      audio.volume = 0.65
      audio.muted = false
      try {
        await audio.play()
      } catch {
        /* Autoplay may still fail; guest can use mute toggle later */
      }
    }
    setMuted(false)
    setGateFading(true)
    window.setTimeout(() => setEntered(true), 550)
  }

  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return
    const next = !muted
    audio.muted = next
    if (!next && audio.paused) {
      void audio.play().catch(() => {})
    }
    setMuted(next)
  }

  const toggleDrink = (d: string) =>
    setDrinks((prev) => {
      const next = new Set(prev)
      next.has(d) ? next.delete(d) : next.add(d)
      return next
    })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (submitting) return

    if (!name.trim()) {
      setSubmitError('Укажите, как к вам обращаться')
      return
    }
    if (attendance !== 'yes' && attendance !== 'no') {
      setSubmitError('Укажите, планируете ли вы присутствовать')
      return
    }

    setSubmitting(true)
    setSubmitError(null)

    try {
      const result = await submitRsvp({
        name: name.trim(),
        attendance,
        drinks: [...drinks],
        allergy: allergy.trim(),
        plusOne: plusOne.trim(),
      })

      if (result.ok || result.alreadySubmitted) {
        setSubmitted(true)
        return
      }

      setSubmitError(result.error)
    } catch {
      setSubmitError('Не удалось отправить ответ. Попробуйте позже.')
    } finally {
      setSubmitting(false)
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ background: CREAM, display: 'flex', flexDirection: 'column', width: '100%', overflowX: 'hidden' }}>
      <audio ref={audioRef} src={weddingTrack} loop preload="auto" playsInline />

      <MusicGate
        visible={!entered}
        fading={gateFading}
        onOpen={handleOpenInvitation}
      />

      {entered && (
        <MusicMuteButton muted={muted} onToggle={toggleMute} />
      )}

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section
        ref={heroSectionRef}
        style={{
          position:       'relative',
          height:         '650px',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          padding:        '120px 32px 80px',
          overflow:       'hidden',
        }}
      >
        {/*
          Parallax container — extends 25% above/below the section so the image
          has travel room. GSAP moves the img via yPercent scrub inside this clip.
        */}
        <div aria-hidden style={{ position: 'absolute', inset: '-25% 0', overflow: 'hidden' }}>
          <img
            ref={heroImgRef}
            alt=""
            src={imgHeroBlock}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', willChange: 'transform' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(77,11,18,0.5)' }} />
        </div>

        <div
          data-reveal
          style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px', width: '100%', textAlign: 'center' }}
        >
          <p style={{ ...cg(500, 15), color: CREAM, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
            Свадебное торжество
          </p>
          <p style={{ fontFamily: '"Pinyon Script", cursive', fontWeight: 400, fontSize: '80px', color: CREAM, lineHeight: 1, margin: 0 }}>
            Rasim &amp; Anna
          </p>
          <div style={{ width: '80px', height: '1px', background: 'rgba(252,251,250,0.5)' }} />
          <p style={{ ...cg(400, 18), color: CREAM, letterSpacing: '0.06em' }}>
            19 . 09 . 2026
          </p>
        </div>
      </section>

      {/* ── INVITATION ────────────────────────────────────────────────── */}
      <section style={{ background: CREAM, padding: '64px 32px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <div data-reveal style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'center' }}>
          <p style={{ ...cg(600, 13), color: BURGUNDY, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Приглашение
          </p>
          <p style={{ ...cg(400, 38), color: INK, lineHeight: 1.2 }}>Дорогие гости!</p>
          <p style={{ ...cg(400, 18), color: MUTED, lineHeight: 1.7 }}>
            Один день в нашей жизни будет особенным, и мы хотим разделить его тепло с вами. Мы рады пригласить вас на торжество, посвященное началу нашей новой совместной главы. Ваши улыбки, поддержка и объятия станут главным украшением нашего праздника.
          </p>
        </div>

        <div
          data-reveal
          style={{ border: `1px solid ${BURGUNDY}`, borderRadius: '2px', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'center', textAlign: 'center', transitionDelay: '100ms' }}
        >
          <p style={{ ...cg(500, 20), color: BURGUNDY }}>19 СЕНТЯБРЯ 2026</p>
          <p style={{ ...cg(600, 13), color: INK, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Суббота &bull; 16:30
          </p>
        </div>

        {/*
          Portrait frame — overflow:hidden clips the image during its counter-scroll.
          GSAP moves portraitImgRef by ±4% of its height for a subtle depth push.
        */}
        <div
          data-reveal
          style={{ border: `1px solid ${BURGUNDY}`, borderRadius: '2px', padding: '8px', height: '460px', transitionDelay: '180ms' }}
        >
          <div
            ref={portraitWrapRef}
            style={{ width: '100%', height: '100%', overflow: 'hidden', borderRadius: '1px' }}
          >
            <img
              ref={portraitImgRef}
              alt="Rasim and Anna"
              src={imgFormalPortrait}
              style={{ width: '100%', height: '108%', objectFit: 'cover', display: 'block', willChange: 'transform' }}
            />
          </div>
        </div>
      </section>

      <Divider />

      {/* ── SCHEDULE & VENUE ──────────────────────────────────────────── */}
      <section style={{ padding: '64px 32px', display: 'flex', flexDirection: 'column', gap: '40px' }}>
        <div data-reveal style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'center' }}>
          <p style={{ ...cg(600, 13), color: BURGUNDY, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Программа дня
          </p>
          <p style={{ ...cg(400, 36), color: INK }}>Детали события</p>
        </div>

        <div data-reveal-stagger style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            { time: '16:30', title: 'Сбор гостей',       desc: 'Приветственные напитки и музыкальная атмосфера' },
            { time: '17:00', title: 'Начало',             desc: 'Торжественная церемония бракосочетания и праздничный ужин' },
            { time: '23:00', title: 'Окончание вечера',   desc: 'Финальные аккорды праздника, теплые проводы и салют' },
          ].map((item) => (
            <div key={item.time} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <p style={{ ...cg(600, 18), color: BURGUNDY, width: '65px', flexShrink: 0 }}>{item.time}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <p style={{ ...cg(500, 18), color: INK }}>{item.title}</p>
                <p style={{ ...cg(400, 15), color: MUTED, lineHeight: 1.5 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div
          data-reveal
          style={{ border: `1px solid ${BURGUNDY}`, borderRadius: '2px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', textAlign: 'center' }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
            <p style={{ ...cg(600, 12), color: BURGUNDY, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Место проведения
            </p>
            <p style={{ ...cg(400, 26), color: INK }}>Банкетный зал Диэл</p>
            <p style={{ ...cg(400, 16), color: MUTED }}>Улица Мира, 2а лит В</p>
          </div>
          <MapButton />
        </div>
      </section>

      <Divider />

      {/* ── DRESS CODE ────────────────────────────────────────────────── */}
      <section style={{ background: CREAM, padding: '64px 32px' }}>
        <div
          data-reveal
          style={{ border: `1px solid ${BURGUNDY}`, borderRadius: '2px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', textAlign: 'center' }}
        >
          <p style={{ ...cg(600, 14), color: BURGUNDY, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Пожелания к дресс-коду
          </p>
          <div style={{ width: '40px', height: '1px', background: 'rgba(110,28,36,0.3)' }} />
          <p style={{ ...cg(400, 17), color: INK, lineHeight: 1.6 }}>
            Просим вас по возможности избегать преобладания черного, белого и очень яркого цвета в одежде.
          </p>
        </div>
      </section>

      {/* ── RSVP ──────────────────────────────────────────────────────── */}
      <section style={{ padding: '64px 24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <div data-reveal style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'center' }}>
          <p style={{ ...cg(600, 13), color: BURGUNDY, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Анкета гостя
          </p>
          <p style={{ ...cg(400, 28), color: INK, lineHeight: 1.2 }}>
            Пожалуйста, подтвердите присутствие
          </p>
        </div>

        {submitted ? (
          <SuccessState />
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div data-reveal>
              <InputField label="Как к вам обращаться (Имя / Фамилия)?" placeholder="Имя Фамилия" value={name} onChange={setName} />
            </div>

            <div data-reveal style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <p style={{ ...cg(500, 15), color: INK }}>Планируете ли вы присутствовать?</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                <Chip label="С удовольствием буду"  selected={attendance === 'yes'} onClick={() => setAttendance(attendance === 'yes' ? null : 'yes')} />
                <Chip label="К сожалению, не смогу" selected={attendance === 'no'}  onClick={() => setAttendance(attendance === 'no'  ? null : 'no')}  />
              </div>
            </div>

            <div data-reveal style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <p style={{ ...cg(500, 15), color: INK }}>
                Будете ли вы алкоголь? Если да, то какой напиток предпочитаете?
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {['Вино красное', 'Вино белое', 'Шампанское', 'Водка', 'Коньяк', 'Самогон', 'Безалкогольные напитки'].map((d) => (
                  <Chip key={d} label={d} selected={drinks.has(d)} onClick={() => toggleDrink(d)} />
                ))}
              </div>
            </div>

            <div data-reveal>
              <InputField label="Есть ли у вас аллергия? Если да, то на что?" placeholder="Например: орехи, морепродукты" value={allergy} onChange={setAllergy} />
            </div>

            <div data-reveal>
              <InputField label="Будет ли у вас +1? Если да, как к нему / ней обращаться?" placeholder="Имя Фамилия партнера" value={plusOne} onChange={setPlusOne} />
            </div>

            {submitError && (
              <p
                role="alert"
                style={{ ...cg(400, 15), color: BURGUNDY, textAlign: 'center', lineHeight: 1.5, margin: 0 }}
              >
                {submitError}
              </p>
            )}

            <div data-reveal><SubmitButton loading={submitting} /></div>
          </form>
        )}
      </section>

      {/* ── GIFTS ─────────────────────────────────────────────────────── */}
      <section style={{ padding: '64px 24px' }}>
        <div
          data-reveal
          style={{ border: `1px solid ${BORDER_RULE}`, borderRadius: '2px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', textAlign: 'center' }}
        >
          <p style={{ ...cg(600, 13), color: BURGUNDY, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Подарки</p>
          <div style={{ width: '40px', height: '1px', background: 'rgba(110,28,36,0.3)' }} />
          <p style={{ ...cg(400, 18), color: INK, lineHeight: 1.6 }}>
            Ваши улыбки и прекрасное настроение — главный подарок для нас. Если вы хотите поддержать начало нашей семейной истории, мы будем особенно рады тому, что помещается в конверте.
          </p>
        </div>
      </section>

      {/* ── COUNTDOWN TIMER ───────────────────────────────────────────── */}
      <section
        ref={timerSectionRef}
        style={{
          position:       'relative',
          minHeight:      '340px',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          padding:        '64px 32px',
          overflow:       'hidden',
          boxShadow:      '0 8px 12px rgba(110,28,36,0.2)',
        }}
      >
        {/* Parallax container — same pattern as the hero */}
        <div aria-hidden style={{ position: 'absolute', inset: '-25% 0', overflow: 'hidden' }}>
          <img
            ref={timerImgRef}
            alt=""
            src={imgTimerBlock}
            style={{ width: '100%', height: '100%', objectFit: 'cover', willChange: 'transform' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(26,5,8,0.82)' }} />
        </div>

        <div
          data-reveal
          style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '28px', color: CREAM, textAlign: 'center', width: '100%' }}
        >
          <p style={{ ...cg(400, 20), color: CREAM }}>До начала свадьбы осталось</p>

          <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', justifyContent: 'center' }}>
            {[
              { value: pad(timeLeft.days),    label: 'Дней'   },
              { value: pad(timeLeft.hours),   label: 'Часов'  },
              { value: pad(timeLeft.minutes), label: 'Минут'  },
              { value: pad(timeLeft.seconds), label: 'Секунд' },
            ].map(({ value, label }) => (
              <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center', width: '70px' }}>
                <p style={{ ...cg(500, 36), color: CREAM }}>
                  <AnimatedDigit value={value} />
                </p>
                <p style={{ ...cg(400, 13), color: CREAM, textTransform: 'uppercase', opacity: 0.7 }}>
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────── */}
      <footer style={{ padding: '64px 32px', display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center', textAlign: 'center' }}>
        <div style={{ width: '32px', height: '1.5px', background: BURGUNDY }} />
        <div data-reveal style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <p style={{ ...cg(600, 13), color: BURGUNDY, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Свадебный координатор
            </p>
            <p style={{ ...cg(500, 18), color: INK }}>Арина +7 (999) 601-20-53</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <p style={{ ...cg(600, 13), color: BURGUNDY, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Электронная почта
            </p>
            <a
              href="mailto:anna.ledenyova.99@mail.ru"
              style={{ ...cg(500, 18), color: INK, textDecoration: 'underline', textUnderlineOffset: '3px' }}
            >
              anna.ledenyova.99@mail.ru
            </a>
          </div>
        </div>
      </footer>

    </div>
  )
}
