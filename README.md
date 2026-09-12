# 🚀 TechPulse AI - Premium AI & Software Technology Media Platform

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-24-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-5.0-000000?style=for-the-badge&logo=express)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=for-the-badge&logo=postgresql)](https://neon.tech)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

**TechPulse AI** is a production-ready, full-stack AI and software technology media publication + affiliate platform engineered for high-frequency AI news coverage, SaaS product reviews, side-by-side developer comparisons, and autonomous AI Agent site management.

---

## 📐 System Architecture Overview

```
                          ┌────────────────────────────────┐
                          │    Next.js 14 App Router       │
                          │   Frontend (Vercel Cloud)      │
                          └──────────────┬─────────────────┘
                                         │
                                         │ REST API & JSON
                                         ▼
                          ┌────────────────────────────────┐
                          │   Node.js / Express REST API   │
                          │   & Agent Engine (Render)      │
                          └──────────────┬─────────────────┘
                                         │
                                         │ Prisma ORM
                                         ▼
                          ┌────────────────────────────────┐
                          │   Neon PostgreSQL Database     │
                          │   (Serverless Scale-to-Zero)   │
                          └────────────────────────────────┘
```

---

## 🔥 Key Platform Capabilities

### 1. Modern Editorial Media Portal
- **High-Impact UI**: Dark slate/cyan design system, custom typography, sticky editorial header, hero breaking invention story, trending sidebar rankings, and responsive drawer navigation.
- **AI Tools Directory (`/ai-tools`)**: Filterable directory supporting pricing badges (`FREE`, `FREEMIUM`, `PAID`, `FREE_TRIAL`), category filters, search keywords, ratings, features list, pros/cons, and direct affiliate access.
- **Article Reader (`/post/[slug]`)**: Reading time calculator, author details, sticky auto-generated Table of Contents (TOC), highlight callout boxes, syntax-highlighted code blocks, and related articles.
- **Taxonomy**: AI News, AI Tools, Software & SaaS, Reviews, Comparisons, Tutorials, and Deals.

### 2. Triple Monetization Engine (Clearly Separated)
- **Affiliate Recommendation Cards**: Reusable product boxes with discount codes, custom CTA buttons, and real-time click tracking (`/api/v1/affiliate/click/:id`).
- **Sponsored Content**: Dedicated sponsor logo, site URL, and mandatory "SPONSORED" badges & disclosures (`<SponsoredBadge />`).
- **Modular AdSlot System**: 7 layout positions (`HEADER`, `HOMEPAGE`, `ARTICLE_TOP`, `ARTICLE_MIDDLE`, `ARTICLE_BOTTOM`, `SIDEBAR`, `FOOTER`). Toggle slots on/off or inject custom Google AdSense scripts via Admin CMS.

### 3. Autonomous AI Agent API (`/api/agent/v1/...`)
Enables external AI agents to autonomously manage the platform:
- **Security**: Bearer API Key authentication with SHA-256 key hashing in database.
- **Granular Scopes**:
  - `content:read` - Fetch articles & categories
  - `content:write` - Create, edit, draft, publish articles
  - `seo:write` - Edit SEO titles, meta descriptions, and canonical links
  - `media:write` - Upload & update media references
  - `affiliate:write` - Manage affiliate links & promo codes
  - `sponsored:write` - Update sponsor disclosures
  - `analytics:read` - Read traffic stats & click counts
  - `settings:write` - Modify platform configuration
- **Audit Logging**: Every agent operation is immutably logged into `AgentAuditLog` with status (`SUCCESS` / `DENIED`), IP address, and payload parameters.

### 4. Dynamic SEO & Syndication
- Dynamic `generateMetadata()` for dynamic title, description, canonical URL, OpenGraph, and Twitter Cards.
- Dynamic `Article` JSON-LD schema generated for search engines.
- Database-backed dynamic `/sitemap.xml`, `/robots.txt`, and `/rss.xml`.

---

## 🛠️ Environment Variables Configuration

### Backend Environment Variables (`backend/.env`)

| Variable | Type | Description | Sample Value |
| :--- | :--- | :--- | :--- |
| `PORT` | Number | Server listening port | `5000` |
| `NODE_ENV` | String | Environment mode | `production` |
| `DATABASE_URL` | String | Neon PostgreSQL / SQLite connection string | `postgres://user:pass@ep-xxxx.neon.tech/neondb?sslmode=require` |
| `JWT_SECRET` | String | Super secret key for Admin JWT tokens | `techpulse_super_secret_jwt_key_2026` |
| `CORS_ORIGIN` | String | Allowed Frontend origin for CORS | `https://techpulse-ai.vercel.app` |

### Frontend Environment Variables (`frontend/.env.local`)

| Variable | Type | Description | Sample Value |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | String | Backend REST API Base URL | `https://techpulse-backend-api.onrender.com/api` |

---

## ⚡ 1-Click Cloud Deployment Guide

### Phase 1: Database Setup (Neon PostgreSQL)
1. Sign up on [Neon.tech](https://neon.tech) and create a new project.
2. Copy your Connection String (`postgres://user:pass@ep-xxxx.neon.tech/neondb?sslmode=require`).
3. Apply the production schema:
   ```bash
   cd backend
   npx prisma db push --schema=prisma/schema.postgresql.prisma
   ```

### Phase 2: Backend API Deployment (Render.com)
1. Push this repository to GitHub.
2. Log into [Render.com](https://render.com) and navigate to **New > Blueprint**.
3. Select your GitHub repository. Render will automatically detect `render.yaml`.
4. Set Environment Variables on Render:
   - `DATABASE_URL`: Your Neon PostgreSQL Connection String
   - `CORS_ORIGIN`: Your production Vercel frontend URL
5. Click **Apply Blueprint**.

### Phase 3: Frontend Portal Deployment (Vercel)
1. Log into [Vercel.com](https://vercel.com) and click **Add New Project**.
2. Import your GitHub repository and set **Root Directory** to `frontend`.
3. Add Environment Variable:
   - `NEXT_PUBLIC_API_URL`: `https://your-backend.onrender.com/api`
4. Click **Deploy**.

---

## 💻 Local Quickstart

### 1. Start Backend Server
```bash
cd backend
npm install
npm run db:push
npm run db:seed
npm run dev
# Server running at http://localhost:5000
```

### 2. Start Frontend Server
```bash
cd frontend
npm install
npm run dev
# Portal running at http://localhost:3000
```

### 🔑 Seed Credentials
- **Admin CMS URL**: `http://localhost:3000/admin/login`
- **Email**: `admin@techpulse.ai`
- **Password**: `admin123`
- **Demo AI Agent Key**: `tp_ag_demo_secret_key_2026_xyz`

---

## 🤖 AI Agent API (`/api/agent/v1/...`) Examples

### Create & Publish Article via Agent API
```bash
curl -X POST http://localhost:5000/api/agent/v1/posts \
  -H "Authorization: Bearer tp_ag_demo_secret_key_2026_xyz" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Sora 2.0 Real-Time Physics Video Generation Unveiled",
    "excerpt": "OpenAI has officially introduced Sora 2.0 with real-time physics simulation.",
    "content": "<h2>Physics Engine</h2><p>Detailed architecture breakdown...</p>",
    "type": "NEWS",
    "status": "PUBLISHED",
    "categoryId": "<CATEGORY_ID>",
    "authorId": "<AUTHOR_ID>"
  }'
```

### Update Article SEO Metadata
```bash
curl -X PUT http://localhost:5000/api/agent/v1/posts/<POST_ID>/seo \
  -H "Authorization: Bearer tp_ag_demo_secret_key_2026_xyz" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Sora 2.0 Real-Time Video Engine | TechPulse AI",
    "metaDescription": "In-depth technical breakdown of Sora 2.0 physics video generation.",
    "keywords": "Sora 2.0, OpenAI Video, Neural World Models"
  }'
```

---

## 📜 License
Distributed under the MIT License. Built for high-performance AI media operations.
