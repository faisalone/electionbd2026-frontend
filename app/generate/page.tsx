'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Download, Trash2, Loader2, Sparkles, ArrowLeft, CheckCircle, Share2 } from 'lucide-react';
import { FaFacebook, FaWhatsapp, FaTelegram, FaFacebookMessenger } from 'react-icons/fa';
import { BsCopy, BsCheckLg } from 'react-icons/bs';
import Link from 'next/link';
import { removeBackground } from '@imgly/background-removal';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

// Template specifications
const TEMPLATE = {
  width: 1000,
  height: 1000,
  image: { x: 20, y: 582, height: 400 }, // Bottom-left, maintain aspect ratio
  text: { x: 250, y: 890, width: 750, height: 110 } // Centered text
};

export default function GeneratePage() {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [text, setText] = useState('');
  const [designation, setDesignation] = useState('');
  const [loading, setLoading] = useState(false);
  const [removingBackground, setRemovingBackground] = useState(false);
  const [backgroundRemoved, setBackgroundRemoved] = useState(false);
  const [removalProgress, setRemovalProgress] = useState(0);
  const [generatedPoster, setGeneratedPoster] = useState<string>('');
  const [templateImage, setTemplateImage] = useState<HTMLImageElement | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewImageRef = useRef<HTMLImageElement | null>(null);

  const pageUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleShare = (platform: string) => {
    const shareUrl = encodeURIComponent(pageUrl);
    const title = encodeURIComponent('আগামীর রাষ্ট্রনায়ক তারেক রহমানের জন্মদিনের ফটোকার্ড');
    const text = encodeURIComponent('ভোটমামুর এআই প্রযুক্তির মাধ্যমে আগামীর রাষ্ট্রনায়ক তারেক রহমানের জন্মদিনের ফোটোকার্ড বানিয়ে নিন! #তারেকরহমান #ভোটমামু');

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, '_blank');
        break;
      case 'messenger':
        window.open(`fb-messenger://share/?link=${shareUrl}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${text}%20${shareUrl}`, '_blank');
        break;
      case 'telegram':
        window.open(`https://t.me/share/url?url=${shareUrl}&text=${text}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(pageUrl);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
        break;
    }
  };

  // Load template image on mount
  useEffect(() => {
    const img = new window.Image();
    img.onload = () => setTemplateImage(img);
    img.src = '/templates/template-01.png';
  }, []);

    // Update canvas preview whenever content changes
  useEffect(() => {
    drawPreview();
  }, [imagePreview, text, designation, templateImage]);

  const drawPreview = () => {
    if (!canvasRef.current || !templateImage) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear and draw template
    ctx.clearRect(0, 0, TEMPLATE.width, TEMPLATE.height);
    ctx.drawImage(templateImage, 0, 0, TEMPLATE.width, TEMPLATE.height);

    // Draw uploaded image (maintain aspect ratio, fixed height 300px)
    if (imagePreview && previewImageRef.current) {
      const img = previewImageRef.current;
      const targetHeight = TEMPLATE.image.height;
      const aspectRatio = img.width / img.height;
      const targetWidth = targetHeight * aspectRatio;
      
      ctx.drawImage(
        img,
        TEMPLATE.image.x,
        TEMPLATE.image.y,
        targetWidth,
        targetHeight
      );
    }

    // Draw text centered with Bengali font support
    const centerX = TEMPLATE.text.x + (TEMPLATE.text.width / 2);
    let currentY = TEMPLATE.text.y;
    
    // Draw name (larger font)
    if (text) {
      ctx.fillStyle = '#fff';
      ctx.font = '700 48px "Noto Sans Bengali", system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(text, centerX, currentY);
      currentY += 45; // Reduced gap between name and designation
    }
    
    // Draw designation (smaller font, below name)
    if (designation) {
      ctx.fillStyle = '#fff';
      ctx.font = '500 32px "Noto Sans Bengali", system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(designation, centerX, currentY);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadedImage(file);
    setGeneratedPoster('');
    setBackgroundRemoved(false); // Reset background removal state
    setRemovalProgress(0);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setImagePreview(dataUrl);
      
      // Update canvas preview
      const img = new window.Image();
      img.onload = () => {
        previewImageRef.current = img;
        drawPreview();
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveBackground = async () => {
    if (!uploadedImage) return;

    setRemovingBackground(true);
    setRemovalProgress(0);
    
    try {
      // Show realistic progress updates
      const progressInterval = setInterval(() => {
        setRemovalProgress(prev => {
          if (prev < 30) return prev + 5;
          if (prev < 60) return prev + 3;
          if (prev < 85) return prev + 2;
          return Math.min(prev + 1, 95);
        });
      }, 200);      // Use client-side AI background removal
      const imageUrl = URL.createObjectURL(uploadedImage);
      const blob = await removeBackground(imageUrl);
      
      clearInterval(progressInterval);
      setRemovalProgress(100);
      
      // Create object URL from blob
      const processedUrl = URL.createObjectURL(blob);
      setImagePreview(processedUrl);
      
      // Update canvas preview
      const img = new window.Image();
      img.onload = () => {
        previewImageRef.current = img;
        drawPreview();
      };
      img.src = processedUrl;

      // Convert to file
      const processedFile = new File([blob], 'processed.png', { type: 'image/png' });
      setUploadedImage(processedFile);
      setBackgroundRemoved(true);
      
      // Cleanup
      URL.revokeObjectURL(imageUrl);
    } catch (error) {
      console.error('Background removal error:', error);
      alert('ব্যাকগ্রাউন্ড রিমুভ করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।');
    } finally {
      setRemovingBackground(false);
      setTimeout(() => setRemovalProgress(0), 1000);
    }
  };

  const handleGeneratePoster = async () => {
    if (!canvasRef.current || !uploadedImage || !text) {
      alert('অনুগ্রহ করে ছবি আপলোড এবং টেক্সট লিখুন');
      return;
    }

    setLoading(true);
    
    try {
      const canvas = canvasRef.current;
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => resolve(blob!), 'image/png', 1.0);
      });

      const url = URL.createObjectURL(blob);
      setGeneratedPoster(url);
    } catch (error) {
      console.error('Poster generation error:', error);
      alert('একটি ত্রুটি ঘটেছে');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    
    canvasRef.current.toBlob((blob) => {
      if (!blob) return;
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `poster-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 'image/png', 1.0);
  };

  const resetForm = () => {
    setUploadedImage(null);
    setImagePreview('');
    setText('');
    setDesignation('');
    setGeneratedPoster('');
    previewImageRef.current = null;
    if (templateImage) {
      drawPreview();
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 py-4 md:py-8 px-3 md:px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header - Compact for Mobile */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 md:mb-6"
        >
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-gray-600 hover:text-[#C8102E] mb-3 md:mb-4 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>হোমে ফিরে যান</span>
          </Link>
          
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
            <span className="text-[#C8102E]">তারেক রহমানের</span> জন্মদিনের ফটোকার্ড
          </h1>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-4 md:gap-6">
          {/* Left: Live Preview */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl md:rounded-2xl shadow-xl p-4 md:p-6"
          >
            <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
              <span className="text-xl md:text-2xl">👁️</span>
              লাইভ প্রিভিউ
            </h2>
            
            <div className="relative bg-gray-100 rounded-xl overflow-hidden shadow-inner" style={{ aspectRatio: '1/1' }}>
              <canvas
                ref={canvasRef}
                width={TEMPLATE.width}
                height={TEMPLATE.height}
                className="w-full h-full"
              />
            </div>
          </motion.div>

          {/* Right: Controls */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4 md:space-y-6"
          >
            {/* Image Upload - First */}
            <div className="bg-white rounded-xl md:rounded-2xl shadow-xl p-4 md:p-6">
              <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4">ছবি আপলোড করুন</h3>
              
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-4 md:p-6 text-center cursor-pointer transition-all ${
                  uploadedImage 
                    ? 'border-green-400 bg-green-50' 
                    : 'border-gray-300 hover:border-[#C8102E] hover:bg-red-50'
                } group`}
              >
                {uploadedImage ? (
                  <CheckCircle className="w-10 md:w-12 h-10 md:h-12 mx-auto text-green-600 mb-2" />
                ) : (
                  <Upload className="w-10 md:w-12 h-10 md:h-12 mx-auto text-gray-400 group-hover:text-[#C8102E] mb-2" />
                )}
                <p className="text-sm md:text-base text-gray-700 font-medium mb-1">
                  {uploadedImage ? uploadedImage.name : 'JPG, PNG (সর্বোচ্চ 10MB)'}
                </p>
                <button className="px-3 md:px-4 py-2 bg-[#C8102E] text-white rounded-lg font-medium hover:bg-[#A00D27] transition-colors text-xs md:text-sm mt-2">
                  {uploadedImage ? 'পরিবর্তন করুন' : 'ফাইল নির্বাচন করুন'}
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                onChange={handleImageUpload}
                className="hidden"
              />

              <AnimatePresence>
                {uploadedImage && !backgroundRemoved && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <button
                      onClick={handleRemoveBackground}
                      disabled={removingBackground}
                      className="mt-3 md:mt-4 w-full px-3 md:px-4 py-2 md:py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg text-sm md:text-base"
                    >
                      {removingBackground ? (
                        <>
                          <Loader2 className="w-4 md:w-5 h-4 md:h-5 animate-spin" />
                          AI প্রসেস হচ্ছে... {removalProgress}%
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 md:w-5 h-4 md:h-5" />
                          AI দিয়ে ব্যাকগ্রাউন্ড রিমুভ করুন
                        </>
                      )}
                    </button>
                    
                    {removingBackground && (
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <motion.div
                          className="h-full bg-linear-to-r from-purple-600 to-pink-600"
                          initial={{ width: 0 }}
                          animate={{ width: `${removalProgress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    )}
                  </motion.div>
                )}
                
                {backgroundRemoved && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-3 md:mt-4 px-3 md:px-4 py-2 md:py-3 bg-green-100 text-green-800 rounded-xl flex items-center justify-center gap-2 text-sm md:text-base"
                  >
                    <CheckCircle className="w-4 md:w-5 h-4 md:h-5" />
                    ব্যাকগ্রাউন্ড সফলভাবে রিমুভ হয়েছে
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Text Input - Second */}
            <div className="bg-white rounded-xl md:rounded-2xl shadow-xl p-4 md:p-6">
              <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4">আপনার নাম লিখুন</h3>
              
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="আপনার নাম লিখুন..."
                className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-gray-300 rounded-xl focus:border-[#C8102E] focus:ring-2 focus:ring-[#C8102E]/20 outline-none text-base md:text-lg mb-2 md:mb-3"
                maxLength={50}
              />
              
              <input
                type="text"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                placeholder="পদবী লিখুন (ঐচ্ছিক)..."
                className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-gray-300 rounded-xl focus:border-[#C8102E] focus:ring-2 focus:ring-[#C8102E]/20 outline-none text-sm md:text-base"
                maxLength={50}
              />
              
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs md:text-sm text-gray-500">
                  {text && designation ? 'নাম ও পদবী যুক্ত হয়েছে' : text ? 'নাম যুক্ত হয়েছে' : ''}
                </p>
                {(text || designation) && <span className="text-green-600 text-sm font-medium">✓</span>}
              </div>
            </div>

            {/* Download Button - Third */}
            <div className="bg-white rounded-xl md:rounded-2xl shadow-xl p-4 md:p-6">
              <button
                onClick={handleDownload}
                disabled={loading || !uploadedImage || !text}
                className="w-full px-4 md:px-6 py-3 md:py-4 bg-[#C8102E] text-white rounded-xl font-bold text-base md:text-lg hover:bg-[#A00D27] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
              >
                <Download className="w-5 md:w-6 h-5 md:h-6" />
                ডাউনলোড করুন
              </button>
            </div>
          </motion.div>
        </div>

        {/* Instructions & Share Buttons - Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 md:mt-8 max-w-4xl mx-auto space-y-4 md:space-y-6"
        >
          {/* Instructions */}
          <div className="bg-linear-to-br from-blue-50 to-purple-50 rounded-xl md:rounded-2xl p-4 md:p-6 border border-blue-200">
            <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-base md:text-lg">
              <span className="text-xl">💡</span>
              কিভাবে ব্যবহার করবেন
            </h4>
            <div className="space-y-2 text-sm md:text-base text-gray-700">
              <p>• আপনার ছবি আপলোড করুন</p>
              <p>• AI দিয়ে ব্যাকগ্রাউন্ড রিমুভ করুন (ঐচ্ছিক)</p>
              <p>• আপনার নাম ও পদবী লিখুন</p>
              <p>• ডাউনলোড বাটনে ক্লিক করুন</p>
            </div>
          </div>

          {/* Share Buttons */}
          <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-4 md:p-6">
            <h4 className="font-bold text-gray-900 mb-3 text-base md:text-lg">শেয়ার করুন</h4>
            <div className="flex flex-wrap items-center gap-3">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => handleShare('facebook')}
                className="flex-1 min-w-[120px] p-3 bg-[#1877F2] text-white rounded-lg hover:bg-[#1559C4] transition-colors flex items-center justify-center gap-2"
                aria-label="Facebook এ শেয়ার করুন"
              >
                <FaFacebook className="w-5 h-5" />
                <span className="text-sm font-medium">Facebook</span>
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => handleShare('whatsapp')}
                className="flex-1 min-w-[120px] p-3 bg-[#25D366] text-white rounded-lg hover:bg-[#1EBE57] transition-colors flex items-center justify-center gap-2"
                aria-label="WhatsApp এ শেয়ার করুন"
              >
                <FaWhatsapp className="w-5 h-5" />
                <span className="text-sm font-medium">WhatsApp</span>
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => handleShare('telegram')}
                className="flex-1 min-w-[120px] p-3 bg-[#0088CC] text-white rounded-lg hover:bg-[#0077B3] transition-colors flex items-center justify-center gap-2"
                aria-label="Telegram এ শেয়ার করুন"
              >
                <FaTelegram className="w-5 h-5" />
                <span className="text-sm font-medium">Telegram</span>
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => handleShare('copy')}
                className="flex-1 min-w-[120px] p-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                aria-label="লিংক কপি করুন"
              >
                {isCopied ? <BsCheckLg className="w-5 h-5" /> : <BsCopy className="w-5 h-5" />}
                <span className="text-sm font-medium">{isCopied ? 'কপি হয়েছে!' : 'লিংক কপি'}</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
