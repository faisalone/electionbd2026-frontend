export const theme = {
	colors: {
		primary: '#C8102E',
		primaryHover: '#A00D27',
		secondary: '#222222',
		background: '#ffffff',
		foreground: '#222222',
		muted: '#f5f5f5',
		accent: '#C8102E',
		border: '#e5e5e5',
	},
	fonts: {
		bengali: ['Noto Sans Bengali', 'sans-serif'],
	},
	borderRadius: {
		sm: '0.5rem',
		md: '1rem',
		lg: '1.5rem',
		xl: '2rem',
	},
} as const;

// Utility function to get theme colors in Tailwind format
export const getThemeColor = (colorKey: keyof typeof theme.colors) => {
	return theme.colors[colorKey];
};

// CSS variables for dynamic usage
export const cssVariables = {
	'--color-primary': theme.colors.primary,
	'--color-primary-hover': theme.colors.primaryHover,
	'--color-secondary': theme.colors.secondary,
} as const;
