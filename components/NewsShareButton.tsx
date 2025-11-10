'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { FaFacebook, FaWhatsapp, FaTelegram, FaFacebookMessenger } from 'react-icons/fa';
import { BsCopy, BsCheckLg } from 'react-icons/bs';

interface NewsShareButtonProps {
  newsId: number;
  newsUid?: string;
  title: string;
  category: string;
}

export default function NewsShareButton({ newsId, newsUid, title, category }: NewsShareButtonProps) {
  const [isCopied, setIsCopied] = useState(false);
  
  const newsUrl = useMemo(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    return `${origin}/news/${newsUid || newsId}`;
  }, [newsId, newsUid]);
  
  const shareMessage = `📰 ${title}

🏷️ বিভাগ: ${category}

খবরটি পড়তে ক্লিক করুন:
${newsUrl}

#বাংলাদেশ #নির্বাচন২০২৬ #সংবাদ`;

  const handleShare = async (platform: string) => {
    const shareUrl = encodeURIComponent(newsUrl);
    const text = encodeURIComponent(shareMessage);

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, '_blank');
        break;
      case 'messenger':
        window.open(`fb-messenger://share/?link=${shareUrl}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${text}`, '_blank');
        break;
      case 'telegram':
        window.open(`https://t.me/share/url?url=${shareUrl}&text=${text}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(newsUrl);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
        break;
    }
  };

  return (
    <div className="flex items-center justify-center gap-1">
      {/* Facebook */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => handleShare('facebook')}
        className="p-1.5 text-blue-600 hover:text-blue-700 transition-colors"
        title="Facebook এ শেয়ার করুন"
      >
        <FaFacebook className="w-5 h-5" />
      </motion.button>

      {/* Messenger */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => handleShare('messenger')}
        className="p-1.5 text-blue-500 hover:text-blue-600 transition-colors"
        title="Messenger এ শেয়ার করুন"
      >
        <FaFacebookMessenger className="w-5 h-5" />
      </motion.button>

      {/* WhatsApp */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => handleShare('whatsapp')}
        className="p-1.5 text-green-600 hover:text-green-700 transition-colors"
        title="WhatsApp এ শেয়ার করুন"
      >
        <FaWhatsapp className="w-5 h-5" />
      </motion.button>

      {/* Telegram */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => handleShare('telegram')}
        className="p-1.5 text-sky-500 hover:text-sky-600 transition-colors"
        title="Telegram এ শেয়ার করুন"
      >
        <FaTelegram className="w-5 h-5" />
      </motion.button>

      {/* Copy Link */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => handleShare('copy')}
        className={`p-1.5 transition-colors ${
          isCopied 
            ? 'text-green-600' 
            : 'text-gray-600 hover:text-gray-700'
        }`}
        title="লিংক কপি করুন"
      >
        {isCopied ? (
          <BsCheckLg className="w-5 h-5" />
        ) : (
          <BsCopy className="w-5 h-5" />
        )}
      </motion.button>
    </div>
  );
}
