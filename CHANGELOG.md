# Changelog

All notable changes to Biblical Alignment.

---

## [Unreleased] — February 2026

### Added
- Cross-reference data integration (41,954 references from OpenBible.info)
- Cross-reference panel in verse context menu
- Verse of the Day on homepage (365 curated verses, deterministic by date)
- Reading plans: New Testament in 90 Days, Gospels in 30 Days, Psalms & Proverbs
- Reading plan progress tracker with streak counter (localStorage)
- `/plans` route for browsing and tracking reading plans
- `robots.txt` for search engine crawling
- `sitemap.xml` generation (1,260+ URLs)
- JSON-LD structured data (WebSite, BreadcrumbList, Chapter schemas)
- Page metadata for search, bookmarks, notes, and plans pages
- Improved chapter page SEO with verse text previews and canonical URLs
- Cross-reference build script (`scripts/build-cross-references.ts`)
- Sitemap build script (`scripts/build-sitemap.ts`) for static export compatibility

### Fixed
- Bookmark functionality wired up in ChapterReader (was TODO/console.log)
- Maskable PWA icons now exist (were referenced but missing)
- README status updated from "Planning & Scaffolding" to current phase
- Sitemap generation converted from Next.js route to build script (incompatible with `output: 'export'`)
- `turbo.json` updated: `pipeline` renamed to `tasks` (Turborepo 2.0 breaking change)

### Changed
- Translation philosophy: BSB only (removed KJV, ASV, WEB references)
- ROADMAP updated to reflect completed bookmarks, notes, and highlight features
- Phase 6 plan updated to remove other English translations

### Removed
- Empty `data/translations/kjv/` and `data/translations/asv/` directories

---

## Phase 2 — January 2026

### Added
- Full Bible reader with all 66 books (1,189 chapters, 31,102 verses)
- Berean Standard Bible (BSB) text data
- Full-text search across entire Bible (Fuse.js, 7MB index)
- Bookmarks with 5 highlight colors (yellow, green, blue, pink, orange)
- Personal notes with timestamps and export
- Text-to-Speech via Web Speech API
- Light / Dark / Sepia themes
- 6 accent color options (amber, blue, green, purple, red, teal)
- Font customization (default, serif, dyslexia-friendly)
- Adjustable font size (14-24px) and line height (1.5-2.5x)
- Swipe navigation between chapters
- Distraction-free reading mode
- Floating action button for mobile
- Reading position memory (auto-scroll to last position)
- PWA with offline support (Service Worker)
- Responsive design (mobile-first)
- Deployed to Cloudflare Workers at biblicalalignment.org
- 1,260 statically generated pages

---

## Phase 1 — January 2026

### Added
- Project scaffolding (Next.js 16 + Turbopack + TypeScript)
- Monorepo structure (Turborepo + pnpm workspaces)
- Core principles documentation (The Gate System)
- BSB data acquisition and JSON formatting
- Design system (colors, fonts, themes)
- Capacitor setup for iOS and Android

---

*Built with love by [IntentMesh](https://intentmesh.com)*
