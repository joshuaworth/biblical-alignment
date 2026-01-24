# 🧠 Biblical Alignment — Session State & Plans

> *This file captures all context, decisions, and plans so any future Claude session can continue seamlessly.* 📋

**Last Updated**: January 24, 2026 (Session 3)

---

## 📍 Current Status

| Item | Status |
|------|--------|
| 🌐 **Domain** | `biblicalalignment.org` ✅ Secured on Cloudflare |
| 📁 **Project Structure** | ✅ Complete monorepo scaffolding |
| 🎨 **Landing Page** | ✅ Built and running at localhost:3000 |
| 📖 **Reading View** | ✅ **COMPLETE** — All 66 books readable |
| 📥 **BSB Data** | ✅ **31,102 verses converted to JSON** |
| 📜 **BSB License** | ✅ Public domain - attribution added |
| 🔧 **Chrome MCP** | ✅ Fixed (native host locked to Claude Code) |
| 🔍 **Search Feature** | 🟡 Ready to build |
| 📱 **Mobile (Capacitor)** | ⚪ Not yet started |

---

## 🚨 CRITICAL: BSB Licensing Requirement

**DO NOT use third-party repos for BSB data!** (e.g., scrollmapper/bible_databases)

The BSB must be obtained directly from the official source with proper licensing:

### License Form Details
- **URL**: https://berean.bible/licensing.htm
- **Project Name**: Biblical Alignment
- **Website**: biblicalalignment.org
- **Usage Type**: Web application + Mobile app (iOS/Android)
- **Description**: Free, open-source Bible study platform. No ads, no paywalls. Scripture-first approach with AI assistance for search/cross-reference.

### After License Approval
1. Download BSB data from official source (Excel/TSV format)
2. Convert to JSON structured by book/chapter/verse
3. Place in `packages/bible-data/src/data/bsb/`

---

## 🔑 Key Decisions Made

### 1. Project Name & Domain
- **Name**: Biblical Alignment
- **Domain**: biblicalalignment.org (secured on Cloudflare)
- **Tagline**: "Align your life with Scripture"

### 2. Bible Translation
- **Primary**: Berean Standard Bible (BSB)
- **Why**: Public domain (CC0), modern English, scholarly, transparent manuscript variants
- **Official Source**: https://berean.bible
- **⚠️ License Required**: Must complete form at https://berean.bible/licensing.htm

### 3. Tech Stack (State of the Art)
| Tech | Version | Notes |
|------|---------|-------|
| Next.js | 16.1.4 | Latest, Turbopack enabled |
| React | 19.2.3 | Latest patched (security fixes) |
| TailwindCSS | 4.1.18 | v4 CSS-first config |
| Capacitor | 8.0.1 | For iOS/Android |
| TypeScript | 5.9.3 | |
| pnpm | 9.x | Package manager |
| Turborepo | 2.x | Monorepo build |

### 4. Theological Principles (The Gate System)
Every feature must pass these gates:

| Gate | Principle | Scripture |
|------|-----------|-----------|
| 🅰️ | Scripture is final authority | 2 Tim 3:16-17 |
| 🅱️ | Christ alone is mediator | 1 Tim 2:5 |
| 🅲 | No tradition overrides Scripture | Mark 7:8-13 |
| 🅳 | Popularity ≠ truth | Matt 7:13-14 |
| 🅴 | Help users test, don't tell them what to believe | Acts 17:11 |

### 5. Design Principles
- Modern, clean (not "church website" aesthetic)
- Dark mode by default
- Mobile-first
- Amber/gold accent colors (scroll/parchment inspired)
- Serif for Scripture, sans-serif for UI

---

## 🏗️ What's Been Built

### Project Structure
```
/Volumes/IntentMesh/Code/Projects/bible-study-app/
├── README.md ✅
├── ROADMAP.md ✅
├── package.json ✅
├── turbo.json ✅
├── LICENSE ✅
├── .gitignore ✅
├── .claude/
│   ├── CLAUDE.md ✅
│   └── SESSION_STATE.md ✅ (this file)
├── docs/
│   └── PRINCIPLES.md ✅
├── ai/
│   └── prompts/study-assistant.md ✅
├── apps/
│   └── web/ ✅ (Next.js 16.1.4 app)
│       ├── package.json ✅
│       ├── next.config.ts ✅
│       ├── tsconfig.json ✅
│       ├── postcss.config.mjs ✅
│       └── src/
│           ├── lib/
│           │   └── bible.ts ✅ (utility functions)
│           └── app/
│               ├── layout.tsx ✅
│               ├── globals.css ✅
│               ├── page.tsx ✅ (landing page)
│               └── read/
│                   ├── page.tsx ✅ (book selector)
│                   ├── [book]/
│                   │   ├── page.tsx ✅ (chapter selector)
│                   │   └── [chapter]/
│                   │       └── page.tsx ✅ (verse reader)
├── packages/
│   └── bible-data/
│       ├── scripts/
│       │   └── convert-bsb.mjs ✅ (xlsx → JSON)
│       └── src/data/bsb/
│           ├── index.json ✅ (with attribution)
│           └── [66 book files].json ✅
└── [other scaffolded folders]
```

### Landing Page Features
- ✅ Navigation bar (fixed, blur backdrop)
- ✅ Hero section with gradient text
- ✅ Featured verse (Acts 17:11)
- ✅ 6-feature grid
- ✅ Gate system principles section
- ✅ CTA section
- ✅ Footer
- ✅ Dark mode support
- ✅ Responsive design

### Reading View Features
- ✅ Book selector grid (OT/NT separated)
- ✅ Chapter selector with grid layout
- ✅ Beautiful verse display with superscript numbers
- ✅ Prev/next chapter navigation
- ✅ Breadcrumb navigation
- ✅ Responsive design
- ✅ Dark mode support
- ✅ BSB attribution footer

### Bible Data Utilities (`src/lib/bible.ts`)
- ✅ `getBibleIndex()` — Get all books metadata
- ✅ `getBooksByTestament()` — OT/NT grouping
- ✅ `getBook(abbr)` — Load book data
- ✅ `getChapter(book, num)` — Get specific chapter
- ✅ `bookToSlug()` / `slugToBook()` — URL handling
- ✅ `getPreviousChapter()` / `getNextChapter()` — Navigation

---

## 📋 Immediate Next Steps

### ✅ COMPLETED
- ~~BSB License Form~~ — Public domain, attribution added
- ~~BSB Data~~ — 31,102 verses converted from official xlsx
- ~~Reading View~~ — All routes working
- ~~Bible Utilities~~ — Types and functions in `src/lib/bible.ts`

### 1. 🔍 Search Feature
- Full-text search across all verses
- Instant results as you type
- Highlight matching text
- Route: `/search`

### 2. 📱 Capacitor Mobile Wrap
```bash
cd apps/web
pnpm add @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android
npx cap init "Biblical Alignment" org.biblicalalignment.app
npx cap add ios
npx cap add android
```

### 3. 🚀 Deploy to Production
- Build for production: `pnpm build`
- Deploy to Cloudflare Pages or Vercel
- Point biblicalalignment.org to deployment

---

## 🎨 Design Tokens (Tailwind v4)

Defined in `apps/web/src/app/globals.css`:

```css
@theme {
  --color-scripture: #1a1a2e;
  --color-parchment: #faf8f5;
  --color-gold: #d4a853;
  --color-gold-dark: #b8922e;
  --color-ink: #2d2d2d;
  --color-ink-light: #6b6b6b;
  --color-night: #0f0f1a;
  --color-night-surface: #1a1a2e;
  --color-night-text: #e8e6e3;
  --font-family-display: "Playfair Display", Georgia, serif;
  --font-family-body: "Inter", system-ui, sans-serif;
}
```

---

## 🔗 Important Links

| Resource | URL |
|----------|-----|
| **BSB License Form** | https://berean.bible/licensing.htm |
| BSB Downloads | https://berean.bible/downloads.htm |
| Bible Hub (BSB source) | https://biblehub.com |
| Project Domain | https://biblicalalignment.org |

---

## 💬 Key Context from User

1. **Not pushing any denomination** — Reformed, Catholic, Orthodox, Pentecostal, etc. are all treated equally. Show the text, let users decide.

2. **Scripture is the test** — Not tradition, not popularity, not historical continuity. The text decides.

3. **Modern and beautiful** — Young people should want to use this. Not 2005 design.

4. **Completely free and open** — In the spirit of the BSB being public domain, everything is MIT licensed and free.

5. **AI assists, Scripture decides** — AI can help find verses and cross-references but never interprets authoritatively.

6. **Project of love** — This is a labor of love to make Scripture accessible.

7. **Must use official BSB source** — Do NOT use third-party repos. Complete the license form at berean.bible.

---

## 🚀 To Resume Development

```bash
cd /Volumes/IntentMesh/Code/Projects/bible-study-app/apps/web
pnpm dev
# Opens at http://localhost:3000
```

---

## 📝 Notes for Future Sessions

- User prefers heavy emoji usage in docs and code comments
- User wants state-of-the-art, latest versions (always check npm for current versions)
- Chrome MCP may need computer reboot to work properly
- All theological decisions are documented in docs/PRINCIPLES.md
- The "Gate System" is critical — every feature must pass the 5 gates
- **BSB data must come from official source with license** — user is completing form

---

## 🔄 Session History

### Session 1 (Jan 24, 2026)
- Researched Bible translations, chose BSB
- Discussed theological principles, established Gate System
- Created project structure and monorepo
- Secured domain biblicalalignment.org
- Built landing page with Next.js 16.1.4
- Dev server running at localhost:3000

### Session 2 (Jan 24, 2026)
- Attempted to download BSB data from third-party repo
- User corrected: MUST use official berean.bible source with license
- User filling out license form at berean.bible/licensing.htm
- User rebooting computer to fix Chrome MCP connection
- Fixed Chrome MCP native host (locked to Claude Code)
- Downloaded BSB xlsx from official source
- Converted to JSON: 31,102 verses across 66 books
- Added official BSB attribution to index.json

### Session 3 (Jan 24, 2026 - Current)
- Built complete Reading View:
  - `/read` — Book selector (OT/NT grid)
  - `/read/[book]` — Chapter selector
  - `/read/[book]/[chapter]` — Verse reader with navigation
- Created `src/lib/bible.ts` utility functions
- All pages tested and working at localhost:3000

---

*This file should be read at the start of any new session to maintain continuity.* 🔄
