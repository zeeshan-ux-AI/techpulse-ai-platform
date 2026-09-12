import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting TechPulse AI Database Seeding...');

  // Clean existing data
  await prisma.agentAuditLog.deleteMany();
  await prisma.agentApiKey.deleteMany();
  await prisma.postViewLog.deleteMany();
  await prisma.seoMetadata.deleteMany();
  await prisma.postTag.deleteMany();
  await prisma.post.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.category.deleteMany();
  await prisma.author.deleteMany();
  await prisma.user.deleteMany();
  await prisma.sponsor.deleteMany();
  await prisma.aiTool.deleteMany();
  await prisma.affiliateClickLog.deleteMany();
  await prisma.affiliateLink.deleteMany();
  await prisma.adSlot.deleteMany();
  await prisma.siteSetting.deleteMany();

  // 1. Create Admin User
  const passwordHash = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@techpulse.ai',
      name: 'TechPulse Admin',
      passwordHash,
      role: 'ADMIN',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    },
  });
  console.log(`✅ Created Admin User: ${adminUser.email}`);

  // 2. Create Authors
  const authorAlex = await prisma.author.create({
    data: {
      name: 'Alex Rivera',
      slug: 'alex-rivera',
      bio: 'Chief AI Editor at TechPulse. 10+ years covering generative AI, neural architectures, and frontier models.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      email: 'alex@techpulse.ai',
      socialLinks: JSON.stringify({ twitter: 'https://x.com/alexrivera_ai', github: 'https://github.com/alexrivera' }),
    },
  });

  const authorElena = await prisma.author.create({
    data: {
      name: 'Dr. Elena Rostova',
      slug: 'dr-elena-rostova',
      bio: 'Machine Learning Specialist & Senior Contributor. PhD in Distributed AI Systems.',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=250&q=80',
      email: 'elena@techpulse.ai',
      socialLinks: JSON.stringify({ twitter: 'https://x.com/elena_rostova', linkedin: 'https://linkedin.com/in/elenarostova' }),
    },
  });

  const authorMarcus = await prisma.author.create({
    data: {
      name: 'Marcus Vance',
      slug: 'marcus-vance',
      bio: 'Senior Software Architect covering developer tooling, SaaS engineering, and infrastructure automation.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
      email: 'marcus@techpulse.ai',
      socialLinks: JSON.stringify({ twitter: 'https://x.com/marcusvance', github: 'https://github.com/marcusvance' }),
    },
  });
  console.log('✅ Created Authors');

  // 3. Create Categories
  const catNews = await prisma.category.create({
    data: { name: 'AI News', slug: 'ai-news', description: 'Breaking updates on frontier models, AI labs, and technical breakthroughs.', icon: 'Newspaper' },
  });
  const catTools = await prisma.category.create({
    data: { name: 'AI Tools', slug: 'ai-tools', description: 'Curated directory and breakdown of cutting-edge AI software.', icon: 'Wrench' },
  });
  const catSoftware = await prisma.category.create({
    data: { name: 'Software & SaaS', slug: 'software', description: 'Cloud infrastructure, developer platforms, and SaaS products.', icon: 'Cpu' },
  });
  const catReviews = await prisma.category.create({
    data: { name: 'Reviews', slug: 'reviews', description: 'In-depth hands-on evaluations and benchmarks of AI products.', icon: 'CheckCircle' },
  });
  const catComparisons = await prisma.category.create({
    data: { name: 'Comparisons', slug: 'comparisons', description: 'Side-by-side technical breakdowns of competing products.', icon: 'Scale' },
  });
  const catTutorials = await prisma.category.create({
    data: { name: 'Tutorials', slug: 'tutorials', description: 'Step-by-step developer guides and AI workflow tutorials.', icon: 'BookOpen' },
  });
  const catDeals = await prisma.category.create({
    data: { name: 'Deals', slug: 'deals', description: 'Exclusive discounts and lifetime offers on top tech & AI tools.', icon: 'Tag' },
  });
  console.log('✅ Created Categories');

  // 4. Create Tags
  const tags = await Promise.all([
    prisma.tag.create({ data: { name: 'Generative AI', slug: 'generative-ai' } }),
    prisma.tag.create({ data: { name: 'LLMs', slug: 'llms' } }),
    prisma.tag.create({ data: { name: 'Developer Tools', slug: 'developer-tools' } }),
    prisma.tag.create({ data: { name: 'Claude', slug: 'claude' } }),
    prisma.tag.create({ data: { name: 'Cursor', slug: 'cursor' } }),
    prisma.tag.create({ data: { name: 'Open Source', slug: 'open-source' } }),
    prisma.tag.create({ data: { name: 'Productivity', slug: 'productivity' } }),
    prisma.tag.create({ data: { name: 'Agents', slug: 'agents' } }),
  ]);
  const tagMap = new Map(tags.map(t => [t.slug, t.id]));
  console.log('✅ Created Tags');

  // 5. Create Sponsors
  const sponsorNeon = await prisma.sponsor.create({
    data: {
      name: 'Neon Postgres',
      slug: 'neon-db',
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
      websiteUrl: 'https://neon.tech',
      disclosureText: 'Sponsored by Neon - The Serverless Postgres Database designed for modern scale.',
    },
  });
  console.log('✅ Created Sponsors');

  // 6. Create AI Tools Directory Entries
  await prisma.aiTool.createMany({
    data: [
      {
        name: 'Cursor AI',
        slug: 'cursor-ai',
        logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
        description: 'The AI-first Code Editor built on VS Code. Instant codebase indexing and agentic multi-file edits.',
        pricingType: 'FREEMIUM',
        startingPrice: '$20/mo',
        rating: 4.9,
        category: 'Developer Tools',
        websiteUrl: 'https://cursor.com',
        affiliateUrl: 'https://cursor.com/?ref=techpulse',
        features: JSON.stringify(['Agentic Edit Mode', 'Codebase Vector Search', 'Multi-model LLM Switching', 'Terminal AI integration']),
        pros: JSON.stringify(['Blazing fast code generation', 'Native VS Code extension support', 'Deep context awareness']),
        cons: JSON.stringify(['Pro tier required for high usage', 'Occasional contextual halluncinations']),
        isFeatured: true,
      },
      {
        name: 'Claude 3.7 Sonnet',
        slug: 'claude-3-7-sonnet',
        logo: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=200&q=80',
        description: 'Anthropic\'s flagship model with hybrid reasoning. Dynamic control over instant answers vs deep thinking.',
        pricingType: 'FREEMIUM',
        startingPrice: '$20/mo',
        rating: 4.95,
        category: 'Language Models',
        websiteUrl: 'https://claude.ai',
        affiliateUrl: 'https://claude.ai/?ref=techpulse',
        features: JSON.stringify(['Hybrid Reasoning Engine', '200k Token Context Window', 'Artifacts UI', 'Computer Use API']),
        pros: JSON.stringify(['Unrivalled coding logic', 'Superior technical writeups', 'Fine-grained thinking controls']),
        cons: JSON.stringify(['Rate limits on peak hours']),
        isFeatured: true,
      },
      {
        name: 'Perplexity Pro',
        slug: 'perplexity-pro',
        logo: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=200&q=80',
        description: 'Conversational search engine delivering real-time cited research answers and deep analysis.',
        pricingType: 'FREEMIUM',
        startingPrice: '$20/mo',
        rating: 4.8,
        category: 'Research & Search',
        websiteUrl: 'https://perplexity.ai',
        affiliateUrl: 'https://perplexity.ai/?ref=techpulse',
        features: JSON.stringify(['Deep Research Mode', 'Multi-LLM choice (GPT-4o, Claude 3.7)', 'File analysis & attachment search']),
        pros: JSON.stringify(['Eliminates search engine clutter', 'Always up-to-date sources', 'Custom collections']),
        cons: JSON.stringify(['Occasional indexing latency']),
        isFeatured: true,
      },
      {
        name: 'ElevenLabs',
        slug: 'elevenlabs',
        logo: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=200&q=80',
        description: 'Industry-leading AI voice synthesis, voice cloning, and real-time conversational voice agents.',
        pricingType: 'FREEMIUM',
        startingPrice: '$5/mo',
        rating: 4.7,
        category: 'Audio & Speech',
        websiteUrl: 'https://elevenlabs.io',
        affiliateUrl: 'https://elevenlabs.io/?ref=techpulse',
        features: JSON.stringify(['Hyper-realistic voice cloning', 'Multilingual support in 30+ languages', 'Conversational AI Voice API']),
        pros: JSON.stringify(['Indistinguishable from human speakers', 'Low latency API']),
        cons: JSON.stringify(['Credit usage adds up on large audio files']),
        isFeatured: false,
      },
    ],
  });
  console.log('✅ Created AI Tools');

  // 7. Create Affiliate Links
  const affCursor = await prisma.affiliateLink.create({
    data: {
      title: 'Cursor Pro Special Discount',
      slug: 'cursor-pro-deal',
      originalUrl: 'https://cursor.com',
      affiliateUrl: 'https://cursor.com/?ref=techpulse_aff',
      code: 'TECHPULSE20',
      category: 'Developer Tools',
      totalClicks: 142,
    },
  });

  const affNeon = await prisma.affiliateLink.create({
    data: {
      title: 'Neon Database $50 Free Credits',
      slug: 'neon-credits',
      originalUrl: 'https://neon.tech',
      affiliateUrl: 'https://neon.tech/?ref=techpulse_aff',
      code: 'NEONPULSE',
      category: 'Database',
      totalClicks: 89,
    },
  });
  console.log('✅ Created Affiliate Links');

  // 8. Create Posts & Articles with Rich Content
  const p1 = await prisma.post.create({
    data: {
      title: 'Claude 3.7 Sonnet & Hybrid Reasoning: The Architecture Breakthrough Changing Software Engineering',
      slug: 'claude-3-7-sonnet-hybrid-reasoning-breakthrough',
      excerpt: 'Anthropic has unveiled Claude 3.7 Sonnet, introducing hybrid reasoning technology that allows developers to precisely dial between instantaneous execution and extended step-by-step thinking.',
      readingTime: 6,
      type: 'NEWS',
      status: 'PUBLISHED',
      publishedAt: new Date(),
      isFeatured: true,
      isTrending: true,
      isSponsored: false,
      categoryId: catNews.id,
      authorId: authorAlex.id,
      viewCount: 1420,
      featuredImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      content: `
<h2>The Shift to Hybrid Reasoning</h2>
<p>The AI landscape is witnessing a fundamental evolution in model execution strategy. Rather than forcing a static trade-off between speed and depth, <strong>Claude 3.7 Sonnet</strong> introduces a unified hybrid reasoning architecture. Developers can now control the exact maximum reasoning budget allocated to a given request.</p>

<p>For routine boilerplate tasks or simple code edits, Claude 3.7 responds within milliseconds. However, when presented with complex mathematical proofs, multi-file refactoring, or subtle race conditions, the system engages extended thinking chains to evaluate dozens of alternative paths before emitting its final token.</p>

<div class="callout callout-info">
  <p><strong>Key Engineering Metric:</strong> In internal benchmarks, allowing Claude 3.7 to spend 16,000 tokens on step-by-step reasoning increased complex code benchmark accuracy from 78.4% to an unprecedented 92.1%.</p>
</div>

<h2>Architecture Breakdown: How Dynamic Thinking Token Allocation Works</h2>
<p>Unlike previous chain-of-thought implementations that hidden thoughts away from the end user, Claude 3.7 streamable thinking blocks allow real-time inspection of the model inner monologue.</p>

<pre><code class="language-typescript">
// Example Anthropic API call with hybrid reasoning budget
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

const response = await anthropic.messages.create({
  model: 'claude-3-7-sonnet-20260224',
  max_tokens: 20000,
  thinking: {
    type: 'enabled',
    budget_tokens: 8000, // Developer-allocated thinking depth
  },
  messages: [
    { role: 'user', content: 'Audit this distributed raft consensus algorithm for deadlocks...' }
  ]
});
</code></pre>

<h2>Impact on Software Development Workflows</h2>
<p>The implications for software developers and AI agents are immediate. Autonomous agents equipped with Claude 3.7 can now self-correct during generation, verifying test suites mentally prior to executing code mutations.</p>

<p>Furthermore, early integration in IDEs like <strong>Cursor</strong> shows a dramatic drop in hallucinated import statements and invalid method calls.</p>
      `,
    },
  });

  await prisma.seoMetadata.create({
    data: {
      postId: p1.id,
      title: 'Claude 3.7 Sonnet Breakdown: Hybrid Reasoning & Developer Guide',
      metaDescription: 'Detailed analysis of Anthropic Claude 3.7 Sonnet with hybrid reasoning capabilities, API examples, and software engineering performance benchmarks.',
      keywords: 'Claude 3.7 Sonnet, Anthropic, Hybrid Reasoning, AI Architecture, LLM Benchmarks',
      canonicalUrl: 'https://techpulse.ai/post/claude-3-7-sonnet-hybrid-reasoning-breakthrough',
      ogImage: p1.featuredImage,
      schemaType: 'Article',
      altText: 'Claude 3.7 Sonnet Hybrid Reasoning Architecture Diagram',
    },
  });

  await prisma.postTag.createMany({
    data: [
      { postId: p1.id, tagId: tagMap.get('generative-ai')! },
      { postId: p1.id, tagId: tagMap.get('llms')! },
      { postId: p1.id, tagId: tagMap.get('claude')! },
    ],
  });

  const p2 = await prisma.post.create({
    data: {
      title: 'Cursor vs Windsurf: Head-to-Head Comparison of AI Code Editors in 2026',
      slug: 'cursor-vs-windsurf-ai-code-editor-comparison-2026',
      excerpt: 'We benchmarked Cursor AI and Codeium Windsurf across multi-file refactoring, context retrieval speed, terminal execution, and developer pricing.',
      readingTime: 8,
      type: 'COMPARISON',
      status: 'PUBLISHED',
      publishedAt: new Date(),
      isFeatured: false,
      isTrending: true,
      isSponsored: false,
      categoryId: catComparisons.id,
      authorId: authorMarcus.id,
      viewCount: 2890,
      featuredImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
      content: `
<h2>The Battle for the Next-Gen IDE</h2>
<p>AI-assisted coding has migrated from simple tab-completion plugins to fully autonomous AI environments. The two dominant standalone options facing engineering teams in 2026 are <strong>Cursor</strong> and <strong>Windsurf</strong>.</p>

<h2>Feature Matrix</h2>
<table>
  <thead>
    <tr>
      <th>Feature</th>
      <th>Cursor AI</th>
      <th>Windsurf</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Base Engine</td>
      <td>VS Code Fork</td>
      <td>VS Code Fork</td>
    </tr>
    <tr>
      <td>Context Indexing</td>
      <td>Merkle-Tree Embeddings</td>
      <td>Cascade Context Engine</td>
    </tr>
    <tr>
      <td>Multi-File Editing</td>
      <td>Composer Agent Mode</td>
      <td>Cascade Flows</td>
    </tr>
    <tr>
      <td>Pricing</td>
      <td>$20/mo Pro</td>
      <td>$15/mo Pro</td>
    </tr>
  </tbody>
</table>

<h2>Codebase Indexing & Context Accuracy</h2>
<p>Cursor relies on ultra-fast local embeddings combined with remote hybrid search. When asking questions about complex full-stack repositories, Cursor consistently retrieves obscure utility functions with higher precision.</p>

<p>Windsurf, however, excels in zero-config setup for monorepos, providing rapid inline flow suggestions without requiring explicit file references (@mentions).</p>
      `,
    },
  });

  await prisma.seoMetadata.create({
    data: {
      postId: p2.id,
      title: 'Cursor vs Windsurf (2026): Which AI IDE Wins for Developers?',
      metaDescription: 'In-depth comparison between Cursor AI and Windsurf code editors. Reviewing speed, multi-file editing, pricing, and context retrieval.',
      keywords: 'Cursor vs Windsurf, AI Code Editors, Developer Tools, IDE Comparison 2026',
      canonicalUrl: 'https://techpulse.ai/post/cursor-vs-windsurf-ai-code-editor-comparison-2026',
      ogImage: p2.featuredImage,
      schemaType: 'Article',
      altText: 'Cursor vs Windsurf AI Code Editors comparison graphic',
    },
  });

  await prisma.postTag.createMany({
    data: [
      { postId: p2.id, tagId: tagMap.get('cursor')! },
      { postId: p2.id, tagId: tagMap.get('developer-tools')! },
      { postId: p2.id, tagId: tagMap.get('productivity')! },
    ],
  });

  const p3 = await prisma.post.create({
    data: {
      title: 'Building Serverless AI Backend Architecture with Neon Postgres & Node.js',
      slug: 'building-serverless-ai-backend-neon-postgres-nodejs',
      excerpt: 'Learn how to architect scale-to-zero database layers for AI applications using serverless Postgres branching and TypeScript connection pools.',
      readingTime: 7,
      type: 'TUTORIAL',
      status: 'PUBLISHED',
      publishedAt: new Date(),
      isFeatured: false,
      isTrending: false,
      isSponsored: true,
      sponsorId: sponsorNeon.id,
      categoryId: catTutorials.id,
      authorId: authorElena.id,
      viewCount: 940,
      featuredImage: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=1200&q=80',
      content: `
<h2>Why Traditional Relational DBs Fail AI Workloads</h2>
<p>Modern AI agents generate intermittent bursts of heavy database queries—storing vector embeddings, logging user prompts, and executing instant analytical queries. Traditional always-on PostgreSQL servers incur continuous costs even during idle periods.</p>

<p>Serverless PostgreSQL with instant branching, pioneered by <strong>Neon</strong>, changes this paradigm by separating compute from storage.</p>

<h2>Step 1: Setting up Neon Serverless Pooler in Node.js</h2>
<pre><code class="language-typescript">
import { Pool } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';

const neonPool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaNeon(neonPool);
export const prisma = new PrismaClient({ adapter });
</code></pre>

<h2>Database Branching for AI Testing</h2>
<p>With Neon, you can programmatically branch your production database state in 1 second via API, run experimental AI schema migrations, test agent write operations, and discard the branch automatically.</p>
      `,
    },
  });

  await prisma.seoMetadata.create({
    data: {
      postId: p3.id,
      title: 'How to Build Serverless AI Backends with Neon Postgres & Node.js',
      metaDescription: 'Step-by-step developer tutorial on building scalable AI backends using Node.js, Prisma, and Neon Serverless Postgres.',
      keywords: 'Neon Postgres, Serverless Database, Node.js AI Backend, Prisma ORM',
      canonicalUrl: 'https://techpulse.ai/post/building-serverless-ai-backend-neon-postgres-nodejs',
      ogImage: p3.featuredImage,
      schemaType: 'Article',
      altText: 'Neon Postgres Database Architecture Diagram',
    },
  });

  await prisma.postTag.createMany({
    data: [
      { postId: p3.id, tagId: tagMap.get('open-source')! },
      { postId: p3.id, tagId: tagMap.get('developer-tools')! },
    ],
  });

  console.log('✅ Created Seed Posts & SEO');

  // 9. Create Ad Slots
  await prisma.adSlot.createMany({
    data: [
      {
        slotKey: 'HEADER',
        name: 'Header Top Leaderboard',
        isEnabled: true,
        codeSnippet: '<!-- Google AdSense Header Leaderboard Slot -->\n<div class="p-3 text-xs text-center bg-slate-900 border border-slate-800 text-slate-400 font-mono">ADVERTISEMENT - HEADER LEADERBOARD (728x90)</div>',
        fallbackHtml: '<div class="p-2 text-center text-xs text-slate-500 border border-dashed border-slate-800">Promote your AI product here. Contact ads@techpulse.ai</div>',
      },
      {
        slotKey: 'HOMEPAGE',
        name: 'Homepage Feed Banner',
        isEnabled: true,
        codeSnippet: '<!-- Google AdSense Homepage Mid-Feed Slot -->\n<div class="p-4 text-center text-xs bg-slate-900 border border-slate-800 text-slate-400 font-mono">ADVERTISEMENT - HOMEPAGE FEED BANNER</div>',
        fallbackHtml: '',
      },
      {
        slotKey: 'ARTICLE_TOP',
        name: 'Article Top Banner',
        isEnabled: true,
        codeSnippet: '<!-- Google AdSense Article Top Slot -->\n<div class="p-3 text-center text-xs bg-slate-900 border border-slate-800 text-slate-400 font-mono">ADVERTISEMENT - ARTICLE TOP</div>',
        fallbackHtml: '',
      },
      {
        slotKey: 'ARTICLE_MIDDLE',
        name: 'Article Inline Content Banner',
        isEnabled: true,
        codeSnippet: '<!-- Google AdSense Article Mid Slot -->\n<div class="p-4 text-center text-xs bg-slate-900 border border-slate-800 text-slate-400 font-mono">ADVERTISEMENT - IN-ARTICLE RELEVANT ADS</div>',
        fallbackHtml: '',
      },
      {
        slotKey: 'ARTICLE_BOTTOM',
        name: 'Article Bottom Recommendation Banner',
        isEnabled: true,
        codeSnippet: '<!-- Google AdSense Article Bottom Slot -->\n<div class="p-4 text-center text-xs bg-slate-900 border border-slate-800 text-slate-400 font-mono">ADVERTISEMENT - RECOMMENDED CONTENT BANNER</div>',
        fallbackHtml: '',
      },
      {
        slotKey: 'SIDEBAR',
        name: 'Sidebar Sticky Rectangle',
        isEnabled: true,
        codeSnippet: '<!-- Google AdSense Sidebar Slot -->\n<div class="p-6 text-center text-xs bg-slate-900 border border-slate-800 text-slate-400 font-mono">ADVERTISEMENT - SIDEBAR (300x250)</div>',
        fallbackHtml: '',
      },
      {
        slotKey: 'FOOTER',
        name: 'Footer Banner',
        isEnabled: true,
        codeSnippet: '<!-- Google AdSense Footer Slot -->\n<div class="p-3 text-center text-xs bg-slate-900 border border-slate-800 text-slate-400 font-mono">ADVERTISEMENT - FOOTER BANNER</div>',
        fallbackHtml: '',
      },
    ],
  });
  console.log('✅ Created Ad Slots');

  // 10. Create Pages & Site Settings
  await prisma.page.createMany({
    data: [
      {
        title: 'About TechPulse AI',
        slug: 'about',
        content: `<h1>About TechPulse AI</h1><p>TechPulse AI is a premier technology publication dedicated to breaking news, technical evaluations, benchmarks, and actionable insights on generative AI, software architecture, and developer productivity tools.</p>`,
        isPublished: true,
      },
      {
        title: 'Contact Us',
        slug: 'contact',
        content: `<h1>Contact Editorial & Media Team</h1><p>Have news tips, product launch announcements, or press releases? Email our newsroom at <strong>news@techpulse.ai</strong>.</p>`,
        isPublished: true,
      },
      {
        title: 'Affiliate & Editorial Disclosure',
        slug: 'affiliate-disclosure',
        content: `<h1>Affiliate & Editorial Disclosure</h1><p>TechPulse AI adheres to strict editorial standards. Some links on this site are affiliate links. If you purchase through these links, we may earn an affiliate commission at zero additional cost to you.</p>`,
        isPublished: true,
      },
      {
        title: 'Privacy Policy',
        slug: 'privacy-policy',
        content: `<h1>Privacy Policy</h1><p>We take user privacy seriously. TechPulse AI does not sell user data. Read details on cookies and analytical tracking here.</p>`,
        isPublished: true,
      },
    ],
  });

  await prisma.siteSetting.createMany({
    data: [
      {
        key: 'general',
        category: 'site',
        value: JSON.stringify({
          siteName: 'TechPulse AI',
          siteTagline: 'The Modern AI & Software Technology Publication',
          siteDescription: 'Breaking AI inventions, in-depth tool reviews, developer comparisons, and SaaS insights.',
          contactEmail: 'contact@techpulse.ai',
          logoUrl: '/logo.svg',
          socialLinks: { twitter: 'https://x.com/techpulse_ai', github: 'https://github.com/techpulse' },
        }),
      },
      {
        key: 'monetization',
        category: 'monetization',
        value: JSON.stringify({
          affiliateDisclosure: 'Disclosure: TechPulse AI is reader-supported. When you buy through links on our site, we may earn an affiliate commission.',
          adsensePublisherId: 'ca-pub-1234567890000000',
          autoAdsEnabled: false,
        }),
      },
    ],
  });
  console.log('✅ Created Pages & Settings');

  // 11. Create Initial Agent API Key for Testing
  const sampleKeySecret = 'tp_ag_demo_secret_key_2026_xyz';
  const keyPrefix = sampleKeySecret.substring(0, 10);
  const keyHash = crypto.createHash('sha256').update(sampleKeySecret).digest('hex');

  const agentKey = await prisma.agentApiKey.create({
    data: {
      name: 'Primary Content Agent',
      keyPrefix,
      keyHash,
      permissions: JSON.stringify([
        'content:read',
        'content:write',
        'seo:write',
        'media:write',
        'affiliate:write',
        'sponsored:write',
        'analytics:read',
        'settings:write',
      ]),
      isActive: true,
    },
  });

  await prisma.agentAuditLog.create({
    data: {
      apiKeyId: agentKey.id,
      action: 'key:created',
      entityType: 'AgentApiKey',
      entityId: agentKey.id,
      payload: JSON.stringify({ name: 'Primary Content Agent', permissions: 'ALL' }),
      status: 'SUCCESS',
      ipAddress: '127.0.0.1',
    },
  });

  console.log('\n🔑 ========================================================');
  console.log('🔑 INITIAL DEMO AGENT API KEY GENERATED:');
  console.log(`🔑 Key: ${sampleKeySecret}`);
  console.log('🔑 Save this key for testing `/api/agent/v1/...` routes!');
  console.log('🔑 ========================================================\n');

  console.log('🎉 TechPulse AI Database Seeding Complete!');
}

main()
  .catch(e => {
    console.error('❌ Database Seeding Failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
