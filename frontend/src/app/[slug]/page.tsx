import React from 'react';
import { notFound } from 'next/navigation';
import { api } from '@/lib/api';

export const revalidate = 60;

export default async function DynamicStaticPage({ params }: { params: { slug: string } }) {
  // Static fallback content for common meta pages
  const staticPagesContent: Record<string, { title: string; content: string }> = {
    about: {
      title: 'About TechPulse AI',
      content: `
        <h2>Our Mission</h2>
        <p>TechPulse AI is an independent technology media publication focused on providing rigorous, un-hype technical coverage of artificial intelligence breakthroughs, code editors, cloud infrastructure, and software tools.</p>
        <h2>Editorial Standards</h2>
        <p>We evaluate tools based on actual engineering benchmarks, codebase indexing accuracy, and real-world performance. Sponsored posts and affiliate relationships are always explicitly labeled with total transparency.</p>
      `,
    },
    contact: {
      title: 'Contact Editorial & Media Desk',
      content: `
        <h2>Newsroom & Tips</h2>
        <p>For news tips, product launch announcements, or technical press releases, reach our editorial desk at <strong>news@techpulse.ai</strong>.</p>
        <h2>Sponsorships & Media Kit</h2>
        <p>Target over 50,000+ AI software engineers and technical decision-makers. Contact <strong>sponsor@techpulse.ai</strong> for custom campaign options.</p>
      `,
    },
    'affiliate-disclosure': {
      title: 'Affiliate & Reader Disclosure',
      content: `
        <h2>Transparency First</h2>
        <p>TechPulse AI is reader-supported. Some articles and tool directory cards contain affiliate links. If you click through and purchase a subscription or software tool, we may receive a commission at zero additional cost to you.</p>
        <p>Our editorial integrity remains uncompromised—we never accept payment for positive review ratings.</p>
      `,
    },
    'privacy-policy': {
      title: 'Privacy Policy',
      content: `
        <h2>Data Protection & Cookies</h2>
        <p>We respect user privacy. TechPulse AI uses anonymous analytical tracking to monitor post popularity and affiliate click counts. We do not sell user data to third-party data brokers.</p>
      `,
    },
  };

  const pageData = staticPagesContent[params.slug];

  if (!pageData) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <h1 className="text-4xl font-black text-white border-b border-slateDark-800 pb-4">
        {pageData.title}
      </h1>
      <div
        className="article-body"
        dangerouslySetInnerHTML={{ __html: pageData.content }}
      />
    </div>
  );
}
