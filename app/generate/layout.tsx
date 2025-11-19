import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'আগামীর রাষ্ট্রনায়ক তারেক রহমানের জন্মদিনের ফটোকার্ড | ভোটমামু',
  description: 'ভোটমামুর এআই প্রযুক্তির মাধ্যমে আগামীর রাষ্ট্রনায়ক তারেক রহমানের জন্মদিনের ফোটোকার্ড বানিয়ে নিন',
  openGraph: {
    title: 'আগামীর রাষ্ট্রনায়ক তারেক রহমানের জন্মদিনের ফটোকার্ড',
    description: 'ভোটমামুর এআই প্রযুক্তির মাধ্যমে আগামীর রাষ্ট্রনায়ক তারেক রহমানের জন্মদিনের ফোটোকার্ড বানিয়ে নিন',
    images: ['/votemamu-photocard-preview.jpg'],
    url: 'https://votemamu.com/generate',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'আগামীর রাষ্ট্রনায়ক তারেক রহমানের জন্মদিনের ফটোকার্ড',
    description: 'ভোটমামুর এআই প্রযুক্তির মাধ্যমে আগামীর রাষ্ট্রনায়ক তারেক রহমানের জন্মদিনের ফোটোকার্ড বানিয়ে নিন',
    images: ['/votemamu-photocard-preview.jpg'],
  },
};

export default function GenerateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
