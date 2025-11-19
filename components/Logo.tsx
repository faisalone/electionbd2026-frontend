'use client';

import dynamic from 'next/dynamic';
import { CSSProperties } from 'react';

// Dynamically import Lottie to avoid SSR issues
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

// Import the animation JSON
import logoAnimation from '@/public/logo-animation.json';

type LogoProps = {
  height?: number | string;
  className?: string;
  priority?: boolean;
  alt?: string;
};

export default function Logo({ height = 40, className = '', alt = 'ভোটমামু' }: LogoProps) {
  const computedHeight = typeof height === 'number' ? `${height}px` : height;
  const style: CSSProperties = {
    height: computedHeight,
    width: 'auto',
  };

  return (
    <div className={`inline-flex items-center gap-2 ${className}`} title={alt}>
      {/* Animated Logo */}
      <div style={style}>
        <Lottie
          animationData={logoAnimation}
          loop={true}
          autoplay={true}
          style={style}
        />
      </div>
    </div>
  );
}
