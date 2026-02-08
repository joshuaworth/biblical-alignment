# 🌍 Phase 6: Multi-Language — Implementation Plan

> *Make the Bible accessible in 100+ languages*

---

## 📊 Overview

| Item | Detail |
|------|--------|
| **Goal** | Bible in 100+ languages |
| **Phase 6a** | 10 languages |
| **Phase 6b** | 50 languages |
| **Phase 6c** | 100+ languages |
| **Dependencies** | Core app complete |

---

## 📖 Translation Sources

### 6.1 Public Domain Translations

| Language | Translation | Source | Verses |
|----------|-------------|--------|--------|
| 🇺🇸 English | BSB | berean.bible | 31,102 ✅ |
| 🇪🇸 Spanish | Reina Valera 1909 | ebible.org | 31,102 |
| 🇫🇷 French | Louis Segond 1910 | ebible.org | 31,102 |
| 🇩🇪 German | Luther 1912 | ebible.org | 31,102 |
| 🇵🇹 Portuguese | Almeida 1911 | ebible.org | 31,102 |
| 🇮🇹 Italian | Riveduta 1927 | ebible.org | 31,102 |
| 🇷🇺 Russian | Synodal 1876 | ebible.org | 31,102 |
| 🇨🇳 Chinese | CUV | ebible.org | 31,102 |
| 🇰🇷 Korean | Korean RV | ebible.org | 31,102 |
| 🇯🇵 Japanese | Colloquial | ebible.org | 31,102 |
| 🇸🇦 Arabic | Smith & Van Dyke | ebible.org | 31,102 |
| 🇮🇱 Hebrew | Modern | ebible.org | OT only |
| 🇬🇷 Greek | Modern | ebible.org | NT only |

**Primary Source:** [eBible.org](https://ebible.org/download.php)
- USFM format (standard Bible markup)
- Public domain or open license
- Well-maintained

---

### 6.2 Data Pipeline

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   eBible     │ →  │   Parser     │ →  │   JSON       │
│   (USFM)     │    │   Script     │    │   Format     │
└──────────────┘    └──────────────┘    └──────────────┘
                           │
                    ┌──────▼──────┐
                    │  Validation │
                    │  - Verse    │
                    │    counts   │
                    │  - Unicode  │
                    │  - Missing  │
                    └─────────────┘
```

**USFM to JSON Converter:**
```typescript
// Input: USFM format
\c 1
\v 1 In the beginning God created the heavens and the earth.
\v 2 Now the earth was formless and void...

// Output: JSON
{
  "book": "Genesis",
  "chapter": 1,
  "verses": [
    { "verse": 1, "text": "In the beginning..." },
    { "verse": 2, "text": "Now the earth was..." }
  ]
}
```

| Task | Description | Est. |
|------|-------------|------|
| 📥 | Download translations from eBible | 2 hr |
| 🔄 | Build USFM parser | 4 hr |
| ✅ | Validation script (verse counts) | 2 hr |
| 📦 | Generate JSON for each language | 2 hr |
| 🧪 | Test with 3 languages | 2 hr |

---

## 🏗️ Architecture

### 6.3 Multi-Language Data Structure

```
packages/bible-data/
├── src/
│   └── data/
│       ├── en-bsb/        # English BSB (current)
│       │   ├── index.json
│       │   └── books/
│       │       ├── genesis.json
│       │       └── ...
│       ├── es-rv09/       # Spanish Reina Valera
│       │   ├── index.json
│       │   └── books/
│       ├── fr-ls10/       # French Louis Segond
│       └── ...
└── index.ts               # Exports all translations
```

**Translation Index:**
```typescript
interface TranslationIndex {
  id: string;          // "es-rv09"
  language: string;    // "Spanish"
  languageCode: string; // "es"
  name: string;        // "Reina Valera 1909"
  shortName: string;   // "RV09"
  direction: "ltr" | "rtl";
  year: number;
  license: string;
  books: number;       // 66 or 39 or 27
}
```

---

### 6.4 URL Structure

**Option A: Path-based (Recommended)**
```
/en/read/genesis/1     # English
/es/read/genesis/1     # Spanish
/zh/read/genesis/1     # Chinese
```

**Option B: Subdomain**
```
en.biblicalalignment.org/read/genesis/1
es.biblicalalignment.org/read/genesis/1
```

**Implementation (Next.js):**
```typescript
// app/[lang]/read/[book]/[chapter]/page.tsx
interface PageProps {
  params: Promise<{
    lang: string;
    book: string;
    chapter: string;
  }>;
}

export function generateStaticParams() {
  const languages = ['en', 'es', 'fr', 'de', ...];
  const books = getAllBooks();

  return languages.flatMap(lang =>
    books.flatMap(book =>
      Array.from({ length: book.chapters }, (_, i) => ({
        lang,
        book: bookToSlug(book.name),
        chapter: String(i + 1),
      }))
    )
  );
}
```

| Task | Description | Est. |
|------|-------------|------|
| 📁 | Restructure routes for [lang] | 4 hr |
| 🔄 | Update all links for lang prefix | 4 hr |
| 🌐 | Language detection (browser) | 2 hr |
| 💾 | Language preference storage | 1 hr |
| 🧪 | Test with 3 languages | 2 hr |

---

## 🎨 UI Components

### 6.5 Language Switcher

```
┌─────────────────────────────────────┐
│ 🌐 Language                    [×] │
├─────────────────────────────────────┤
│ 🔍 [Search languages...]           │
├─────────────────────────────────────┤
│ 🇺🇸 English (BSB)           ✓     │
│ 🇪🇸 Español (RV 1909)              │
│ 🇫🇷 Français (LS 1910)             │
│ 🇩🇪 Deutsch (Luther 1912)          │
│ 🇵🇹 Português (Almeida)            │
│ 🇮🇹 Italiano (Riveduta)            │
│ 🇷🇺 Русский (Synodal)              │
│ 🇨🇳 中文 (CUV)                     │
│ 🇰🇷 한국어 (KRV)                   │
│ 🇯🇵 日本語                         │
│ 🇸🇦 العربية (SVD)                  │
└─────────────────────────────────────┘
```

| Task | Description | Est. |
|------|-------------|------|
| 🧱 | LanguageSwitcher component | 4 hr |
| 🔍 | Search/filter languages | 2 hr |
| 🏳️ | Flag icons (or text fallback) | 1 hr |
| ⚡ | Optimistic UI update | 1 hr |
| 📱 | Mobile bottom sheet | 2 hr |

---

### 6.6 Parallel Translation View

**Side-by-side comparison:**
```
┌────────────────────┬────────────────────┐
│ 🇺🇸 English (BSB)  │ 🇪🇸 Español (RV)   │
├────────────────────┼────────────────────┤
│                    │                    │
│ ¹ In the beginning │ ¹ En el principio  │
│ God created the    │ creó Dios los      │
│ heavens and the    │ cielos y la        │
│ earth.             │ tierra.            │
│                    │                    │
│ ² Now the earth    │ ² Y la tierra      │
│ was formless and   │ estaba desordenada │
│ void...            │ y vacía...         │
│                    │                    │
└────────────────────┴────────────────────┘
```

| Task | Description | Est. |
|------|-------------|------|
| 📐 | Design parallel layout | 2 hr |
| 🧱 | ParallelView component | 6 hr |
| 🔄 | Sync scroll between columns | 2 hr |
| 📱 | Mobile: swipe between | 2 hr |
| ⚙️ | Select translation pairs | 2 hr |

---

## 🔤 RTL Support

### 6.7 Right-to-Left Languages

**Affected languages:**
- Arabic (ar)
- Hebrew (he)
- Persian/Farsi (fa)
- Urdu (ur)

**Implementation:**
```typescript
// Detect RTL
const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
const isRTL = rtlLanguages.includes(currentLang);

// Apply direction
<html dir={isRTL ? 'rtl' : 'ltr'} lang={currentLang}>
```

**CSS Adjustments:**
```css
/* Logical properties for RTL support */
.verse {
  margin-inline-start: 1rem;  /* Not margin-left */
  padding-inline-end: 0.5rem; /* Not padding-right */
}

/* RTL-specific */
[dir="rtl"] .verse-number {
  font-family: var(--font-arabic);
}

[dir="rtl"] .nav-arrow {
  transform: scaleX(-1); /* Flip arrows */
}
```

| Task | Description | Est. |
|------|-------------|------|
| 🔄 | Add dir attribute logic | 1 hr |
| 🎨 | Switch to logical CSS properties | 4 hr |
| 🔤 | RTL-specific fonts | 2 hr |
| 🧪 | Test Arabic/Hebrew | 2 hr |

---

## 🔍 Multi-Language Search

### 6.8 Search Architecture

**Option A: Separate indexes per language**
```
/public/search-index-en.json  (7MB)
/public/search-index-es.json  (7MB)
...
```
- Pro: Simple, fast
- Con: Large downloads, can't search across languages

**Option B: Combined index with language filter**
```typescript
interface SearchEntry {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  text: string;
  lang: string; // NEW
}

// Filter at search time
const results = fuse.search(query).filter(r => r.item.lang === currentLang);
```
- Pro: Search across languages possible
- Con: Massive index (70MB+ for 10 languages)

**Recommendation:** Option A (separate indexes) for MVP

| Task | Description | Est. |
|------|-------------|------|
| 🔧 | Update search index builder | 2 hr |
| 📦 | Generate indexes per language | 2 hr |
| 🔄 | Lazy-load correct index | 2 hr |
| 🧪 | Test search in 3 languages | 2 hr |

---

## 🌐 UI Translation (i18n)

### 6.9 App UI Strings

**Not just Bible text—UI needs translation too:**

```typescript
// messages/en.json
{
  "nav.read": "Read",
  "nav.search": "Search",
  "nav.settings": "Settings",
  "search.placeholder": "Search for words or phrases...",
  "settings.theme": "Theme",
  "settings.fontSize": "Font Size",
  "chapter.listen": "Listen",
  "chapter.next": "Next Chapter",
  "chapter.previous": "Previous Chapter"
}

// messages/es.json
{
  "nav.read": "Leer",
  "nav.search": "Buscar",
  "nav.settings": "Configuración",
  "search.placeholder": "Buscar palabras o frases...",
  ...
}
```

**Library:** `next-intl` or `react-i18next`

| Task | Description | Est. |
|------|-------------|------|
| 📦 | Install next-intl | 30 min |
| 📝 | Extract all UI strings | 4 hr |
| 🌐 | Create message files | 2 hr |
| 🤖 | AI-translate to 10 languages | 2 hr |
| ✏️ | Human review translations | 4 hr |
| 🔄 | Update all components | 4 hr |

---

## 🚀 Rollout Plan

### Phase 6a: 10 Languages (Week 1-2)

1. English (BSB) ✅
2. Spanish (Reina Valera)
3. French (Louis Segond)
4. German (Luther)
5. Portuguese (Almeida)
6. Italian (Riveduta)
7. Russian (Synodal)
8. Chinese Simplified (CUV)
9. Korean (KRV)
10. Arabic (SVD)

### Phase 6b: 50 Languages (Week 3-4)

Add remaining major languages:
- Japanese, Hindi, Bengali, Vietnamese
- Dutch, Polish, Swedish, Norwegian
- Indonesian, Tagalog, Thai
- Ukrainian, Turkish, Greek
- And more from eBible.org

### Phase 6c: 100+ Languages (Week 5-6)

- All available public domain translations
- Focus on accuracy and completeness
- Community contributions for UI translations

---

## 📦 Dependencies

```json
{
  "next-intl": "^3.0.0",
  "negotiator": "^0.6.0",
  "@formatjs/intl-localematcher": "^0.5.0"
}
```

---

## 📊 Static Page Count

| Languages | Chapters | Total Pages |
|-----------|----------|-------------|
| 1 (current) | 1,189 | ~1,260 |
| 10 | 11,890 | ~12,600 |
| 50 | 59,450 | ~63,000 |
| 100 | 118,900 | ~126,000 |

**Build time implications:**
- Current: ~2 minutes
- 10 languages: ~20 minutes
- 100 languages: ~3 hours

**Solution:** Incremental Static Regeneration (ISR) or on-demand generation

---

*Last updated: January 2026*
