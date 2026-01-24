# 📖 Biblical Alignment

**✨ A radically modern, AI-assisted Bible platform built on Scripture-first principles ✨**

> *"Now the Bereans were more noble-minded than the Thessalonians, for they received the message with great eagerness and examined the Scriptures every day to see if these teachings were true."* — Acts 17:11 (BSB) 🔍📜

🌐 **biblicalalignment.org**

---

## ⚡ Quick Facts

| | |
|---|---|
| 📦 **Type** | Monorepo · Web + Mobile + Kids Apps |
| 🛠️ **Stack** | TypeScript · React · React Native · Capacitor |
| 📊 **Status** | 🟡 Planning & Scaffolding |
| 📜 **License** | MIT (Code) · Public Domain (Bible Text) |
| 🎯 **Mission** | Align your life with Scripture — accessible to everyone, everywhere |

---

## 🎯 What This Is

A family of **modern, beautiful Bible apps** built on the Berean Standard Bible (BSB) — completely free, completely open.

| App | Audience | Description |
|-----|----------|-------------|
| 📱 **Bible App** | Everyone | Clean, modern Bible reading experience |
| 📚 **Study App** | Serious students | Cross-references, Greek/Hebrew, AI study assistant |
| 🧒 **Kids Bible** | Children 4-12 | Simplified language, illustrations, interactive |
| 🌐 **Web Platform** | Everyone | Full-featured web Bible with SEO for discoverability |

---

## 🔥 Why This Exists

The Berean Standard Bible is:
- ✅ **Public domain** — Free forever, no licensing restrictions
- ✅ **Scholarly** — Made by credentialed evangelical scholars
- ✅ **Transparent** — Shows all manuscript variants
- ✅ **Modern English** — Readable without being dumbed down

But the current online version looks **outdated** 😬. Young people won't use something that feels like 2005.

**Our mission**: Take the best free Bible translation and make it **radically accessible** with modern design, modern tech, and modern distribution 🚀

---

## 📖 Core Principles

> 📄 Full details in [`docs/PRINCIPLES.md`](docs/PRINCIPLES.md)

### 🚪 The Gate System

Every feature must pass these gates or it doesn't ship:

| Gate | Principle | Basis |
|------|-----------|-------|
| 🅰️ | **Scripture is final authority** | 2 Tim 3:16-17 📖 |
| 🅱️ | **Christ alone is mediator** | 1 Tim 2:5 ✝️ |
| 🅲 | **No tradition overrides Scripture** | Mark 7:8-13 🚫 |
| 🅳 | **Popularity ≠ truth** | Matt 7:13-14 🚪 |
| 🅴 | **Help users test, don't tell them what to believe** | Acts 17:11 🔍 |

### 🚫 What We Don't Do

- ❌ Push any denomination (Reformed, Catholic, Orthodox, Pentecostal, etc.)
- ❌ Use AI to interpret Scripture for users
- ❌ Treat historical continuity or size as proof of truth
- ❌ Add layers between users and God's Word
- ❌ Include practices not authorized by Scripture

### ✅ What We Do

- ✅ Point to the text — always
- ✅ Show manuscript variants transparently
- ✅ Make study tools free and accessible
- ✅ Use AI as a tool, not a teacher
- ✅ Build for everyone: young, old, scholar, new believer

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| 🌐 **Web** | Next.js · React · TailwindCSS |
| 📱 **Mobile** | React Native · Capacitor |
| 🗄️ **Data** | SQLite (local) · Supabase (sync) |
| 🤖 **AI** | Claude API · Local embeddings |
| 🔍 **Search** | Meilisearch or Typesense |
| 📊 **Analytics** | Plausible (privacy-first) |

---

## 📁 Project Structure

```
biblical-alignment/
├── 📄 README.md                    # You are here
├── 📄 ROADMAP.md                   # Development roadmap
│
├── 📁 .claude/                     # AI assistant instructions
│   └── 📄 CLAUDE.md
│
├── 📁 .github/                     # GitHub configs
│   ├── 📁 ISSUE_TEMPLATE/
│   └── 📁 workflows/               # CI/CD
│
├── 📁 apps/                        # Application variants
│   ├── 📁 web/                     # Main web app
│   ├── 📁 mobile/                  # iOS + Android
│   ├── 📁 kids/                    # Children's Bible
│   └── 📁 study/                   # Deep study app
│
├── 📁 packages/                    # Shared packages
│   ├── 📁 ui/                      # Design system
│   ├── 📁 bible-data/              # Bible text + parsing
│   ├── 📁 ai-assistant/            # AI integration
│   └── 📁 search/                  # Search functionality
│
├── 📁 data/                        # Bible data
│   ├── 📁 translations/            # BSB, KJV, ASV, etc.
│   ├── 📁 cross-references/        # Cross-reference data
│   └── 📁 lexicon/                 # Greek/Hebrew lexicon
│
├── 📁 docs/                        # Documentation
│   ├── 📁 guides/                  # User guides
│   ├── 📁 api/                     # API documentation
│   └── 📁 theology/                # Theological foundations
│
├── 📁 assets/                      # Static assets
│   ├── 📁 icons/
│   ├── 📁 fonts/
│   └── 📁 images/
│
├── 📁 content/                     # Content for SEO
│   ├── 📁 blog/                    # Blog posts
│   └── 📁 devotionals/             # Daily devotionals
│
├── 📁 seo/                         # SEO configs
│
├── 📁 ai/                          # AI/ML assets
│   ├── 📁 agents/                  # AI agent definitions
│   ├── 📁 embeddings/              # Vector embeddings
│   └── 📁 prompts/                 # Prompt templates
│
├── 📁 scripts/                     # Build/deploy scripts
├── 📁 config/                      # Shared configs
└── 📁 tests/                       # Test files
```

---

## 🚀 Planned Features

### 📱 Core Bible App

| Feature | Description |
|---------|-------------|
| 📖 **Read** | Beautiful, distraction-free reading experience |
| 🔍 **Search** | Lightning-fast full-text search |
| 🔗 **Cross-References** | See related passages instantly |
| 📝 **Notes & Highlights** | Personal study notes |
| 🔖 **Bookmarks** | Save your place |
| 📴 **Offline** | Full Bible available offline |
| 🌙 **Dark Mode** | Easy on the eyes |

### 📚 Study Features

| Feature | Description |
|---------|-------------|
| 🇬🇷 **Greek/Hebrew** | Original language words with definitions |
| 📊 **Manuscript Variants** | See where translations differ |
| 🗺️ **Maps** | Biblical geography |
| ⏳ **Timeline** | Historical context |
| 🤖 **AI Assistant** | Ask questions, get Scripture-rooted answers |

### 🧒 Kids Bible

| Feature | Description |
|---------|-------------|
| 📖 **Simplified Text** | Age-appropriate language |
| 🎨 **Illustrations** | Beautiful artwork |
| 🎮 **Interactive** | Quizzes and activities |
| 🔊 **Audio** | Read-along narration |
| ⭐ **Progress** | Track reading achievements |

---

## 📈 SEO Strategy

We want people searching for Bible verses to find **this** — a free, modern, ad-free Bible.

| Strategy | Implementation |
|----------|----------------|
| 🔍 **Every verse has a URL** | `/genesis/1/1` — shareable, indexable |
| 📝 **Blog content** | Topical articles driving organic traffic |
| 🏷️ **Structured data** | Schema.org markup for rich snippets |
| ⚡ **Core Web Vitals** | Fast, accessible, mobile-first |
| 🌐 **Multi-language** | Eventually support 100+ languages |

---

## 🤖 AI Philosophy

> **AI assists. Scripture decides.** 🤖📖

| Principle | Implementation |
|-----------|----------------|
| 🔧 **Tool, not teacher** | AI finds verses, explains context, cross-references — never interprets authoritatively |
| 📖 **Always cite** | Every AI answer includes Scripture references |
| 🚫 **No denominational bias** | AI doesn't push Catholic, Reformed, Orthodox, etc. |
| ⚠️ **Honest uncertainty** | AI says "I don't know" rather than guessing |
| 🔓 **Transparent** | Users can see what the AI is doing |

---

## 🗺️ Roadmap

> 📄 Full details in [`ROADMAP.md`](ROADMAP.md)

| Phase | Focus |
|-------|-------|
| 🏗️ **Phase 1** | Scaffolding, data acquisition, design system |
| 🌐 **Phase 2** | Web Bible (MVP) |
| 📱 **Phase 3** | Mobile apps (iOS + Android) |
| 📚 **Phase 4** | Study features + AI assistant |
| 🧒 **Phase 5** | Kids Bible |
| 🌍 **Phase 6** | Multi-language expansion |

---

## 🤝 Contributing

This is an open project. Contributions welcome!

1. 🍴 Fork the repo
2. 🌿 Create a branch
3. 💻 Make your changes
4. ✅ Ensure all gates pass
5. 🚀 Submit a PR

---

## 📜 License

- **Code**: MIT License — do whatever you want
- **Bible Text (BSB)**: Public Domain (CC0) — free forever
- **Design Assets**: TBD

---

## 🙏 Guiding Verse

> *"Your word is a lamp for my feet, a light on my path."* — Psalm 119:105 💡🛤️

---

## 💡 Why "Biblical Alignment"?

**Alignment** = adjusting your life to harmonize with something.

**Biblical Alignment** = adjusting your life to harmonize with **Scripture**.

Not with tradition. Not with popularity. Not with what feels good. **With the text.** 📖✝️

---

*Built with ❤️ by [IntentMesh](https://intentmesh.com)* 🔺
