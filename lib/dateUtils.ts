/**
 * Format date to Bengali with time
 * Example: "১১ নভেম্বর ২০২৫, দুপুর ২:৩০"
 */
export function formatBengaliDateTime(dateString: string): string {
  const date = new Date(dateString);
  
  const months = [
    'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
    'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
  ];
  
  const bengaliNumerals = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  
  const toBengaliNumber = (num: number): string => {
    return String(num).split('').map(digit => bengaliNumerals[parseInt(digit)]).join('');
  };
  
  const day = toBengaliNumber(date.getDate());
  const month = months[date.getMonth()];
  const year = toBengaliNumber(date.getFullYear());
  
  const hours = date.getHours();
  const minutes = date.getMinutes();
  
  // Convert to 12-hour format
  const hour12 = hours % 12 || 12;
  const period = hours < 12 ? 'সকাল' : hours < 18 ? 'দুপুর' : 'সন্ধ্যা';
  
  const bengaliHour = toBengaliNumber(hour12);
  const bengaliMinutes = toBengaliNumber(minutes).padStart(2, '০');
  
  return `${day} ${month} ${year}, ${period} ${bengaliHour}:${bengaliMinutes}`;
}

/**
 * Get relative time in Bengali
 * Example: "২ ঘন্টা আগে", "১৫ মিনিট আগে"
 */
export function getRelativeTimeBengali(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  const bengaliNumerals = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  
  const toBengaliNumber = (num: number): string => {
    return String(num).split('').map(digit => bengaliNumerals[parseInt(digit)]).join('');
  };
  
  if (diffInMinutes < 1) {
    return 'কয়েক মুহূর্ত আগে';
  } else if (diffInMinutes < 60) {
    return `${toBengaliNumber(diffInMinutes)} মিনিট আগে`;
  } else if (diffInMinutes < 1440) { // Less than 24 hours
    const hours = Math.floor(diffInMinutes / 60);
    return `${toBengaliNumber(hours)} ঘন্টা আগে`;
  } else if (diffInMinutes < 43200) { // Less than 30 days
    const days = Math.floor(diffInMinutes / 1440);
    return `${toBengaliNumber(days)} দিন আগে`;
  } else if (diffInMinutes < 525600) { // Less than 365 days
    const months = Math.floor(diffInMinutes / 43200);
    return `${toBengaliNumber(months)} মাস আগে`;
  } else {
    const years = Math.floor(diffInMinutes / 525600);
    return `${toBengaliNumber(years)} বছর আগে`;
  }
}
