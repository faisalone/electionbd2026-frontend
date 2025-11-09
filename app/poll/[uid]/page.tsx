import PollDetailClient from '@/components/PollDetailClient';
import { api } from '@/lib/api';
import type { Metadata } from 'next';

interface Props { params: Promise<{ uid: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { uid } = await params;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/polls/${uid}`, { cache: 'no-store' });
    const json = await res.json();
    if (!json.success) return { title: 'Poll', description: 'ElectionBD Poll' };
    const poll = json.data;
    const optionTexts = (poll.options || []).map((o: any) => o.text).join(' | ');
    const creatorName = poll.user?.name || poll.creator_name || 'Anonymous';
    return {
      title: poll.question,
      description: `${creatorName} · ${optionTexts}`.slice(0, 150),
      openGraph: {
        title: poll.question,
        description: `${creatorName} · ${optionTexts}`.slice(0, 200),
        url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/poll/${poll.uid}`,
        type: 'article',
      },
      twitter: {
        card: 'summary',
        title: poll.question,
        description: `${creatorName} · ${optionTexts}`.slice(0, 200),
      }
    };
  } catch (e) {
    return { title: 'Poll', description: 'ElectionBD Poll' };
  }
}

export default async function Page({ params }: Props) {
  const { uid } = await params;
  return <PollDetailClient uid={uid} />;
}
