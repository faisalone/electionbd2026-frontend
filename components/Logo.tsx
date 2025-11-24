'use client';

import dynamic from 'next/dynamic';
import { CSSProperties, useMemo } from 'react';

// Dynamically import Lottie to avoid SSR issues
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

// Import and cache the animation JSON
import logoAnimation from '@/public/logo-animation.json';

type LogoProps = {
  height?: number | string;
  className?: string;
  priority?: boolean;
  alt?: string;
};

export default function Logo({ height = 40, className = '', alt = 'ভোটমামু' }: LogoProps) {
  const computedHeight = typeof height === 'number' ? `${height}px` : height;
  
  // Memoize style and lottie options to prevent re-renders
  const style: CSSProperties = useMemo(() => ({
    height: computedHeight,
    width: 'auto',
  }), [computedHeight]);

  const lottieOptions = useMemo(() => ({
    animationData: logoAnimation,
    loop: true,
    autoplay: true,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
      progressiveLoad: true, // Enable progressive loading
      hideOnTransparent: true,
    }
  }), []);

  return (
    <div className={`inline-flex items-center gap-2 ${className}`} title={alt}>
      {/* Animated Logo */}
      <div style={style}>
        <Lottie
          {...lottieOptions}
          style={style}
        />
      </div>
    </div>
  );
}
