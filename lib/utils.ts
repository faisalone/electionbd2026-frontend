import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// Convert English numbers to Bengali
export function toBengaliNumber(num: number | string): string {
	const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
	return String(num)
		.split('')
		.map((char) => {
			if (char >= '0' && char <= '9') {
				return bengaliDigits[parseInt(char)];
			}
			return char;
		})
		.join('');
}

// Convert Bengali numbers to English
export function toEnglishNumber(num: string): string {
	const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
	return num
		.split('')
		.map((char) => {
			const index = bengaliDigits.indexOf(char);
			return index !== -1 ? index.toString() : char;
		})
		.join('');
}

// Format date in Bengali locale with AM/PM in Bengali
export function formatBengaliDate(dateString: string): string {
	const date = new Date(dateString);
	const formattedDate = date.toLocaleDateString('bn-BD', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});

	const hours = date.getHours();
	const minutes = date.getMinutes();
	const isPM = hours >= 12;
	const hour12 = hours % 12 || 12;

	const bengaliHours = toBengaliNumber(hour12);
	const bengaliMinutes = toBengaliNumber(minutes.toString().padStart(2, '0'));
	const period = isPM ? 'অপরাহ্ন' : 'পূর্বাহ্ন';

	return `${formattedDate} এ ${bengaliHours}:${bengaliMinutes} ${period}`;
}
