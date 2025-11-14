# বাংলা নির্বাচন পোর্টাল ২০২৬ 🇧🇩This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).



একটি আধুনিক, সম্পূর্ণ বাংলা ভাষায় নির্মিত নির্বাচন তথ্য পোর্টাল যা Next.js 16, React 19, TypeScript এবং TailwindCSS দিয়ে তৈরি।## Getting Started



## 🌟 FeaturesFirst, run the development server:



- ✅ **ইন্টারেক্টিভ টাইমলাইন**: নির্বাচনের সকল পর্যায়ের তথ্য সহ এনিমেটেড টাইমলাইন```bash

- ✅ **AI-চালিত সার্চ**: স্মার্ট সার্চ বার সাথে ইনস্ট্যান্ট সাজেশনnpm run dev

- ✅ **লাইভ পোল**: রিয়েল-টাইম ভোটিং এবং রেজাল্ট ভিজুয়ালাইজেশন# or

- ✅ **প্রার্থী তথ্য**: সম্পূর্ণ প্রার্থী প্রোফাইল সহ বিস্তারিত তথ্যyarn dev

- ✅ **ব্যানার জেনারেটর**: নির্বাচনী ব্যানার/পোস্টার ডিজাইন টুল# or

- ✅ **ডায়নামিক রাউটিং**: বিভাগ → জেলা → আসন → প্রার্থী নেভিগেশনpnpm dev

- ✅ **সম্পূর্ণ রেসপন্সিভ**: মোবাইল-ফার্স্ট ডিজাইন# or

- ✅ **বাংলা টাইপোগ্রাফি**: Noto Sans Bengali ফন্ট সহbun dev

```

## 🚀 Quick Start

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Prerequisites

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

- Node.js 18+ এবং npm ইন্সটল থাকতে হবে

- Git (ঐচ্ছিক)This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.



### Installation & Setup## Learn More



1. **Development Server চালু করুন:**To learn more about Next.js, take a look at the following resources:



```bash- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.

npm run dev- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

```

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

2. **ব্রাউজারে খুলুন:**

## Deploy on Vercel

[http://localhost:3000](http://localhost:3000)

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

## 📁 Project Structure

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

```
electionbd2026/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with Navbar & Footer
│   ├── page.tsx                 # Homepage
│   ├── market/                  # Marketplace
│   │   └── page.tsx
│   ├── division/[division]/     # Division pages
│   │   └── page.tsx
│   ├── district/[district]/     # District pages
│   │   └── page.tsx
│   ├── seat/[seat]/             # Seat pages
│   │   └── page.tsx
│   └── candidate/[id]/          # Candidate details
│       └── page.tsx
├── components/                   # Reusable React Components
│   ├── Navbar.tsx               # Navigation bar
│   ├── Footer.tsx               # Footer
│   ├── HeroTimeline.tsx         # Animated timeline
│   ├── AiSearchBar.tsx          # AI search with suggestions
│   ├── PollCard.tsx             # Poll voting component
│   ├── NewsCard.tsx             # News article card
│   ├── CandidateCard.tsx        # Candidate profile card
│   ├── PartyCard.tsx            # Political party card
│   ├── BannerDesigner.tsx       # Banner design tool
│   └── SectionWrapper.tsx       # Section container
├── lib/                         # Utilities & Data
│   ├── mockData.ts              # Mock data (timeline, polls, candidates)
│   └── utils.ts                 # Helper functions
├── config/                      # Configuration
│   └── theme.ts                 # Theme colors & settings
└── public/                      # Static assets

```

## 🎨 Customization Guide

### 1. Update Timeline Data

টাইমলাইনের ডাটা পরিবর্তন করতে `lib/mockData.ts` ফাইল এডিট করুন:

```typescript
export const timelineData = [
  {
    id: 1,
    title: "তফসিল ঘোষণা",
    status: "অপেক্ষমান", // বা "সম্পন্ন" বা "চলমান"
    date: "১৫ জানুয়ারি ২০২৬", // তারিখ যুক্ত করুন
    description: "নির্বাচন কমিশন কর্তৃক নির্বাচনের তফসিল ঘোষণা",
  },
  // আরও আইটেম যুক্ত করুন...
];
```

### 2. Update Poll Questions

পোলের প্রশ্ন এবং অপশন পরিবর্তন করতে:

```typescript
export const pollsData = [
  {
    id: 1,
    question: "আপনার প্রশ্ন এখানে লিখুন",
    options: [
      { id: "a", text: "অপশন ১", votes: 450, color: "#00A651" },
      { id: "b", text: "অপশন ২", votes: 380, color: "#00923F" },
      // আরও অপশন...
    ],
    totalVotes: 1000,
    active: true,
  },
];
```

### 3. Add New Candidates

নতুন প্রার্থী যুক্ত করতে `candidatesData` অ্যারেতে:

```typescript
export const candidatesData = [
  {
    id: "unique-id",
    name: "প্রার্থীর নাম",
    nameEn: "Candidate Name",
    partyId: "al", // দলের ID
    seatId: "dhaka-1", // আসনের ID
    age: 45,
    education: "শিক্ষাগত যোগ্যতা",
    experience: "পেশাগত অভিজ্ঞতা",
    image: "https://...", // ছবির URL
  },
];
```

### 4. Customize Banner Templates

ব্যানার ডিজাইনের mock data এডিট করতে `lib/mockData.ts`:

```typescript
export const designTemplates = [
  {
    id: "banner-1",
    type: "banner",
    name: "ক্লাসিক ব্যানার",
    dimensions: "1920x1080",
  },
  // নতুন টেমপ্লেট যুক্ত করুন...
];
```

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Font**: Noto Sans Bengali (Google Fonts)

## 📦 Available Scripts

```bash
npm run dev      # Development server চালু করুন
npm run build    # Production build তৈরি করুন
npm run start    # Production server চালু করুন
npm run lint     # Code linting করুন
```

## 🎯 Key Pages

- **Homepage** (`/`): টাইমলাইন, পোল, খবর
- **বিভাগ** (`/division/dhaka`): বিভাগের তথ্য
- **জেলা** (`/district/dhaka`): জেলার আসনসমূহ
- **আসন** (`/seat/dhaka-1`): প্রার্থী তালিকা
- **প্রার্থী** (`/candidate/1`): বিস্তারিত প্রোফাইল
- **মার্কেট** (`/market`): মার্কেটপ্লেস

## 🎨 Design Features

- **Glassmorphism**: স্টিকি নেভবার
- **Smooth Animations**: Framer Motion transitions
- **Card-based Layout**: রাউন্ডেড কর্নার সহ শ্যাডো কার্ড
- **Responsive Grid**: মোবাইল থেকে ডেস্কটপ পর্যন্ত
- **Bengali Typography**: বোল্ড, ক্লিন ফন্ট

## 📝 Important Files to Edit

### For Timeline Updates:
📄 `lib/mockData.ts` → `timelineData` array

### For Banner Mock Data:
📄 `lib/mockData.ts` → `designTemplates` and `partiesData`

### For Candidates/Seats:
📄 `lib/mockData.ts` → `candidatesData`, `seatsData`, `divisionsData`

### For Theme Colors:
📄 `app/globals.css` → CSS variables
📄 `config/theme.ts` → Theme configuration

## 🚀 Deployment

### Vercel (Recommended)

1. GitHub এ push করুন
2. [Vercel](https://vercel.com) এ import করুন
3. Deploy করুন - সব automatic!

### Other Platforms

```bash
npm run build
npm run start
```

## 📝 Notes

- সকল ডাটা বর্তমানে **mock data** - API integration পরবর্তীতে করা যাবে
- ছবির URL গুলো Unsplash থেকে নেওয়া - নিজস্ব ছবি আপলোড করুন
- AI Search বর্তমানে frontend only - backend API যুক্ত করতে হবে
- Banner download ফিচার mock - canvas-to-image লাইব্রেরি দরকার

## 🤝 Contributing

Pull requests স্বাগত! বড় পরিবর্তনের জন্য প্রথমে issue খুলুন।

## 📄 License

MIT License

## 👨‍💻 Author

বাংলা নির্বাচন পোর্টাল টিম

---

**Made with ❤️ for Bangladesh Elections 2026**
