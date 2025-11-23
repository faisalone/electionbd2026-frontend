'use client';

import Link from 'next/link';
import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';

interface SocialMediaLinksProps {
  size?: string;
  iconClassName?: string;
  containerClassName?: string;
  showLabels?: boolean;
}

const socialLinks = [
  {
    name: 'Facebook',
    url: 'https://www.facebook.com/votemamubd',
    icon: FaFacebook,
    color: 'text-blue-600 hover:text-blue-700',
    bgColor: 'hover:bg-blue-50',
    label: 'ফেসবুক'
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/votemamu/',
    icon: FaInstagram,
    color: 'text-pink-600 hover:text-pink-700',
    bgColor: 'hover:bg-pink-50',
    label: 'ইনস্টাগ্রাম'
  },
  {
    name: 'YouTube',
    url: 'https://www.youtube.com/@votemamu',
    icon: FaYoutube,
    color: 'text-red-600 hover:text-red-700',
    bgColor: 'hover:bg-red-50',
    label: 'ইউটিউব'
  }
];

export default function SocialMediaLinks({ 
  size = 'w-6 h-6', 
  iconClassName = '',
  containerClassName = 'flex items-center gap-3',
  showLabels = false
}: SocialMediaLinksProps) {
  return (
    <div className={containerClassName}>
      {socialLinks.map((social) => {
        const Icon = social.icon;
        return (
          <Link
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`
              flex items-center gap-2 p-2.5 rounded-xl transition-all duration-300
              ${social.color} ${social.bgColor}
              hover:scale-110
              ${iconClassName}
            `}
            aria-label={social.name}
          >
            <Icon className={size} />
            {showLabels && (
              <span className="text-sm font-medium">{social.label}</span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
