# 📱 Phase 3: Mobile Apps — Implementation Plan

> *Native iOS and Android apps with offline support*

---

## 📊 Overview

| Item | Detail |
|------|--------|
| **Goal** | Ship to App Store + Play Store |
| **Tech** | Capacitor (already configured) |
| **Timeline** | 2-3 weeks |
| **Dependencies** | Phase 2 complete ✅ |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│           Next.js Static Export         │
│         (1,260 pre-rendered pages)      │
└─────────────────┬───────────────────────┘
                  │
         ┌────────▼────────┐
         │    Capacitor    │
         │   (Native Shell)│
         └────────┬────────┘
                  │
      ┌──────────┴──────────┐
      │                      │
┌─────▼─────┐          ┌─────▼─────┐
│   iOS     │          │  Android  │
│ (Swift)   │          │ (Kotlin)  │
└───────────┘          └───────────┘
```

---

## ✅ Task Breakdown

### 3.1 iOS Build & Test

| Task | Description | Est. |
|------|-------------|------|
| 🔧 | Run `npx cap sync ios` | 5 min |
| 🍎 | Open in Xcode, configure signing | 30 min |
| 📱 | Test on iOS Simulator | 1 hr |
| 📱 | Test on physical device | 1 hr |
| 🐛 | Fix any WebView issues | 2 hr |
| 📸 | Generate App Store screenshots | 2 hr |
| 📝 | Write App Store description | 1 hr |
| 🚀 | Submit to App Store Connect | 1 hr |

**Requirements:**
- Apple Developer Account ($99/year)
- Xcode 15+
- macOS

**App Store Assets:**
| Asset | Size | Notes |
|-------|------|-------|
| Icon | 1024x1024 | No transparency |
| Screenshots (6.7") | 1290x2796 | iPhone 15 Pro Max |
| Screenshots (6.5") | 1284x2778 | iPhone 14 Plus |
| Screenshots (5.5") | 1242x2208 | iPhone 8 Plus |
| iPad Pro 12.9" | 2048x2732 | If supporting iPad |

---

### 3.2 Android Build & Test

| Task | Description | Est. |
|------|-------------|------|
| 🔧 | Run `npx cap sync android` | 5 min |
| 🤖 | Open in Android Studio | 10 min |
| 📱 | Test on Android Emulator | 1 hr |
| 📱 | Test on physical device | 1 hr |
| 🐛 | Fix any WebView issues | 2 hr |
| 🔑 | Generate signing key | 30 min |
| 📸 | Generate Play Store screenshots | 2 hr |
| 📝 | Write Play Store description | 1 hr |
| 🚀 | Submit to Play Console | 1 hr |

**Requirements:**
- Google Play Developer Account ($25 one-time)
- Android Studio
- JDK 17+

**Play Store Assets:**
| Asset | Size | Notes |
|-------|------|-------|
| Icon | 512x512 | PNG, no alpha |
| Feature Graphic | 1024x500 | Banner image |
| Screenshots | min 320px | 2-8 required |

---

### 3.3 Offline Support (Service Worker)

**Current:** PWA with basic caching via `next-pwa`

**Enhanced Offline:**
```typescript
// Caching strategy
const CACHE_STRATEGY = {
  // Bible text - cache first, update in background
  '/read/*': 'stale-while-revalidate',

  // Search index - cache forever (7MB)
  '/search-index.json': 'cache-first',

  // Static assets - cache forever
  '/_next/static/*': 'cache-first',

  // App shell - network first
  '/': 'network-first',
}
```

| Task | Description | Est. |
|------|-------------|------|
| 📦 | Pre-cache all 66 books | 2 hr |
| 🔄 | Background sync for updates | 2 hr |
| 📊 | Offline indicator UI | 1 hr |
| 🧪 | Test airplane mode | 1 hr |

---

### 3.4 Push Notifications (Daily Verse)

**Tech:** Firebase Cloud Messaging (FCM)

```typescript
// Capacitor plugin
import { PushNotifications } from '@capacitor/push-notifications';

// Daily verse notification
interface DailyVerseNotification {
  title: "Daily Verse";
  body: "John 3:16 - For God so loved...";
  data: {
    book: "john",
    chapter: 3,
    verse: 16
  }
}
```

| Task | Description | Est. |
|------|-------------|------|
| 🔔 | Install @capacitor/push-notifications | 30 min |
| 🔥 | Set up Firebase project | 1 hr |
| 📱 | iOS push certificate (APNs) | 1 hr |
| 🤖 | Android FCM config | 30 min |
| ⏰ | Daily verse scheduler (Cloud Function) | 2 hr |
| ⚙️ | Notification settings UI | 2 hr |
| 🧪 | Test on both platforms | 2 hr |

---

### 3.5 Bookmarks & Highlights

**Data Model:**
```typescript
interface Bookmark {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  createdAt: Date;
  color?: string; // For highlights
  note?: string;
}

// Storage: localStorage for now, Supabase later
const STORAGE_KEY = 'biblical-alignment-bookmarks';
```

**UI Components:**
| Component | Description |
|-----------|-------------|
| `BookmarkButton` | Toggle bookmark on verse |
| `HighlightMenu` | Color picker on text selection |
| `BookmarksList` | View all bookmarks |
| `BookmarksPage` | /bookmarks route |

| Task | Description | Est. |
|------|-------------|------|
| 💾 | Create bookmark store (Zustand) | 1 hr |
| 🔖 | BookmarkButton component | 1 hr |
| 🎨 | HighlightMenu component | 2 hr |
| 📋 | BookmarksList component | 2 hr |
| 📄 | /bookmarks page | 1 hr |
| 💾 | localStorage persistence | 1 hr |
| 📤 | Export bookmarks (JSON) | 1 hr |
| 🧪 | Test on mobile | 1 hr |

---

### 3.6 Personal Notes

**Data Model:**
```typescript
interface Note {
  id: string;
  book: string;
  chapter: number;
  verse?: number; // Optional - can be chapter-level
  content: string;
  createdAt: Date;
  updatedAt: Date;
}
```

| Task | Description | Est. |
|------|-------------|------|
| 💾 | Create notes store | 1 hr |
| 📝 | NoteEditor component | 2 hr |
| 📋 | NotesList component | 2 hr |
| 🔗 | Link notes to verses | 2 hr |
| 📄 | /notes page | 1 hr |
| 🔍 | Search within notes | 2 hr |
| 🧪 | Test on mobile | 1 hr |

---

## 📦 Dependencies to Add

```json
{
  "@capacitor/push-notifications": "^6.0.0",
  "@capacitor/local-notifications": "^6.0.0",
  "@capacitor/share": "^6.0.0",
  "@capacitor/haptics": "^6.0.0",
  "zustand": "^4.5.0"
}
```

---

## 🧪 Testing Checklist

### iOS
- [ ] App launches correctly
- [ ] Navigation works (back button, gestures)
- [ ] Theme switching works
- [ ] TTS works (may need native API)
- [ ] Search works offline
- [ ] Deep links work (`biblicalalignment://read/john/3`)
- [ ] Safe area insets correct
- [ ] Keyboard doesn't cover input

### Android
- [ ] App launches correctly
- [ ] Back button works correctly
- [ ] Theme follows system dark mode
- [ ] TTS works
- [ ] Search works offline
- [ ] Deep links work
- [ ] Status bar color matches theme
- [ ] Soft keyboard behavior correct

---

## 🚀 Release Checklist

### iOS
- [ ] App Store Connect account ready
- [ ] App ID registered
- [ ] Provisioning profiles created
- [ ] Screenshots for all required sizes
- [ ] Privacy policy URL
- [ ] App description (4000 chars max)
- [ ] Keywords (100 chars max)
- [ ] Age rating questionnaire
- [ ] Export compliance (uses encryption?)

### Android
- [ ] Play Console account ready
- [ ] App signing key created
- [ ] Store listing complete
- [ ] Content rating questionnaire
- [ ] Privacy policy URL
- [ ] Target API level 34+
- [ ] AAB (Android App Bundle) generated

---

## 📈 Success Metrics

| Metric | Target |
|--------|--------|
| App Store rating | 4.5+ |
| Play Store rating | 4.5+ |
| Day 1 retention | 40%+ |
| Day 7 retention | 25%+ |
| Crash-free rate | 99.5%+ |
| App size | <50MB |

---

*Last updated: January 2026*
