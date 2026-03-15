'use client';

/**
 * Hero animation components for the consumer site.
 * Each template gets unique, wow-factor entrance animations.
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useScroll, useTransform, useInView, useSpring, type Variants } from 'framer-motion';

// ─── Typewriter Effect (Editorial template) ────────────────────
export function Typewriter({
  text,
  speed = 40,
  delay = 300,
  style,
  className,
}: {
  text: string;
  speed?: number;
  delay?: number;
  style?: React.CSSProperties;
  className?: string;
}) {
  const [displayed, setDisplayed] = useState('');
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const timeout = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timeout);
  }, [isInView, delay]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [started, text, speed]);

  return (
    <span ref={ref} className={className} style={style}>
      {displayed}
      {started && displayed.length < text.length && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
          className="inline-block w-[2px] h-[0.9em] ml-0.5 align-middle"
          style={{ backgroundColor: style?.color || 'currentColor' }}
        />
      )}
    </span>
  );
}

// ─── Parallax Image Container ──────────────────────────────────
export function ParallaxImage({
  children,
  className,
  style,
  speed = 0.3,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  speed?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [`-${speed * 100}%`, `${speed * 100}%`]);

  return (
    <div ref={ref} className={`overflow-hidden relative ${className || ''}`} style={style}>
      <motion.div style={{ y }} className="absolute inset-[-20%]">
        {children}
      </motion.div>
    </div>
  );
}

// ─── Animated Counter ──────────────────────────────────────────
export function AnimatedCounter({
  end,
  suffix = '',
  prefix = '',
  duration = 2000,
  className,
  style,
}: {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, end, duration]);

  return (
    <span ref={ref} className={className} style={style}>
      {prefix}{count}{suffix}
    </span>
  );
}

// ─── Floating Gradient Orbs ────────────────────────────────────
export function FloatingOrbs({
  color1,
  color2,
  templateId,
}: {
  color1: string;
  color2?: string;
  templateId: string;
}) {
  // Different orb configurations per template
  if (templateId === 'bold' || templateId === 'tech') return null; // No orbs for dark aggressive templates

  const c2 = color2 || color1;

  if (templateId === 'minimal') {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <motion.div
          className="absolute rounded-full blur-[100px]"
          style={{
            width: 400,
            height: 400,
            top: '-10%',
            right: '-5%',
            background: `radial-gradient(circle, ${color1}08 0%, transparent 70%)`,
          }}
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    );
  }

  if (templateId === 'playful') {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <motion.div
          className="absolute rounded-full blur-[80px]"
          style={{
            width: 300,
            height: 300,
            top: '-15%',
            right: '-10%',
            background: `radial-gradient(circle, ${color1}15 0%, transparent 70%)`,
          }}
          animate={{
            x: [0, 40, -20, 0],
            y: [0, -30, 20, 0],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute rounded-full blur-[80px]"
          style={{
            width: 250,
            height: 250,
            bottom: '-10%',
            left: '-5%',
            background: `radial-gradient(circle, ${c2}12 0%, transparent 70%)`,
          }}
          animate={{
            x: [0, -30, 20, 0],
            y: [0, 20, -30, 0],
            scale: [1, 0.95, 1.1, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute rounded-full blur-[60px]"
          style={{
            width: 180,
            height: 180,
            top: '50%',
            left: '60%',
            background: `radial-gradient(circle, ${color1}08 0%, transparent 70%)`,
          }}
          animate={{
            x: [0, 50, -30, 0],
            y: [0, -40, 30, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    );
  }

  if (templateId === 'classic' || templateId === 'wellness') {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <motion.div
          className="absolute rounded-full blur-[120px]"
          style={{
            width: 500,
            height: 500,
            top: '-20%',
            left: '50%',
            transform: 'translateX(-50%)',
            background: `radial-gradient(circle, ${color1}06 0%, transparent 70%)`,
          }}
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    );
  }

  if (templateId === 'editorial' || templateId === 'magazine') {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <motion.div
          className="absolute rounded-full blur-[100px]"
          style={{
            width: 350,
            height: 350,
            bottom: '-15%',
            right: '-10%',
            background: `radial-gradient(circle, ${color1}06 0%, transparent 70%)`,
          }}
          animate={{
            x: [0, 20, 0],
            y: [0, -15, 0],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    );
  }

  // Startup, boutique, restaurant, portfolio — generic subtle orb
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <motion.div
        className="absolute rounded-full blur-[100px]"
        style={{
          width: 400,
          height: 400,
          top: '-10%',
          right: '-8%',
          background: `radial-gradient(circle, ${color1}08 0%, transparent 70%)`,
        }}
        animate={{
          x: [0, 25, 0],
          y: [0, -20, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}

// ─── Scroll-triggered Section Wrapper ──────────────────────────
export function ScrollReveal({
  children,
  className,
  delay = 0,
  direction = 'up',
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'left' | 'right' | 'none';
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const initial: Record<string, number> = { opacity: 0 };
  const animate: Record<string, number> = { opacity: 1 };

  if (direction === 'up') {
    initial.y = 30;
    animate.y = 0;
  } else if (direction === 'left') {
    initial.x = 40;
    animate.x = 0;
  } else if (direction === 'right') {
    initial.x = -40;
    animate.x = 0;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={initial}
      animate={isInView ? animate : initial}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}

// ─── Bold Template: Text Reveal (clip-path) ────────────────────
export function BoldTextReveal({
  children,
  className,
  style,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
}) {
  return (
    <div className="overflow-hidden">
      <motion.div
        className={className}
        style={style}
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 0.7,
          delay,
          ease: [0.33, 1, 0.68, 1],
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

// ─── Playful: Bouncy Entrance ──────────────────────────────────
export function BouncyReveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.6,
        delay,
        type: 'spring',
        stiffness: 150,
        damping: 15,
      }}
    >
      {children}
    </motion.div>
  );
}

// ─── Playful: Confetti-like particles ──────────────────────────
export function ConfettiParticles({ color }: { color: string }) {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 4 + Math.random() * 8,
    delay: Math.random() * 2,
    duration: 3 + Math.random() * 4,
    rotation: Math.random() * 360,
  }));

  const shapes = ['rounded-full', 'rounded-sm', 'rounded-none'];
  const opacities = ['06', '08', '10', '12'];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className={`absolute ${shapes[p.id % shapes.length]}`}
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            backgroundColor: `${color}${opacities[p.id % opacities.length]}`,
            rotate: p.rotation,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, p.id % 2 === 0 ? 15 : -15, 0],
            rotate: [p.rotation, p.rotation + 180, p.rotation + 360],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

// ─── Classic: Elegant Fade with Upward Motion ──────────────────
export function ElegantFade({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.9,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

// ─── Minimal: Subtle scale-fade ────────────────────────────────
export function SubtleScaleFade({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 1,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

// ─── Editorial: Slide in from side ─────────────────────────────
export function SlideFromSide({
  children,
  className,
  side = 'left',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  side?: 'left' | 'right';
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x: side === 'left' ? -50 : 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {children}
    </motion.div>
  );
}
