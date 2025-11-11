'use client';

import Image from 'next/image';

type LogoProps = {
  height?: number; // pixel height
  className?: string;
  priority?: boolean;
  alt?: string;
  src?: string; // allow override if needed
};

export default function Logo({ height = 32, className = '', priority = false, alt = 'ভোটমামু', src = '/votemamu-logo.png' }: LogoProps) {
  // Approximate aspect ratio of provided logo asset
  const width = Math.round(height * 3.5);
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      unoptimized
      className={`block ${className}`}
    />
  );
}
