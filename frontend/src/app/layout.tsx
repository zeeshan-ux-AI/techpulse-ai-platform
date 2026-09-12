import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'TechPulse AI - AI & Software Technology Publication',
  description: 'Breaking AI inventions, AI tools directory, software reviews, code editor comparisons, and developer tutorials.',
  keywords: ['AI News', 'AI Tools', 'Software Reviews', 'Claude 3.7', 'Cursor IDE', 'Generative AI'],
  authors: [{ name: 'TechPulse AI Editorial Team' }],
  metadataBase: new URL('https://techpulse.ai'),
  openGraph: {
    title: 'TechPulse AI - AI & Software Technology Publication',
    description: 'Breaking AI inventions, AI tools directory, software reviews, code editor comparisons, and developer tutorials.',
    url: 'https://techpulse.ai',
    siteName: 'TechPulse AI',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@techpulse_ai',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.variable} ${mono.variable} font-sans bg-slateDark-900 text-slate-100 flex flex-col min-h-screen`}>
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
