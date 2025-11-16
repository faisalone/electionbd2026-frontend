'use client';

import dynamic from 'next/dynamic';
import { CSSProperties } from 'react';

// Dynamically import Lottie to avoid SSR issues
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

// Import the animation JSON
import logoAnimation from '@/public/logo-animation.json';

type LogoProps = {
  height?: number;
  className?: string;
  priority?: boolean;
  alt?: string;
};

export default function Logo({ height = 40, className = '', alt = 'ভোটমামু' }: LogoProps) {
  const style: CSSProperties = {
    height: `${height}px`,
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
