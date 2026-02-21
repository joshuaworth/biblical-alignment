# 📖✨ Biblical Alignment

**A modern, free, open-source Bible reader built on Scripture-first principles.** 🌐📱

> *"Now the Bereans were more noble-minded than the Thessalonians, for they received the message with great eagerness and examined the Scriptures every day to see if these teachings were true."* — Acts 17:11 (BSB) 🔍📜

🔗 **[biblicalalignment.org](https://biblicalalignment.org)**

---

## ⚡ Quick Facts

| | |
|---|---|
| 📦 **Type** | Monorepo (Turborepo + pnpm workspaces) |
| 🛠️ **Stack** | Next.js 16 · React 19 · TailwindCSS v4 · TypeScript |
| 🌐 **Hosting** | Cloudflare Workers (1,289 static pages) |
| 📖 **Translation** | Berean Standard Bible (BSB, Public Domain CC0) |
| 📜 **License** | MIT (code) · CC0 (Bible text) |
| 🎯 **Mission** | Get Scripture into as many hands as possible. Free forever. |

---

## 🎯 What This Is

Biblical Alignment is a **web Bible reader** at [biblicalalignment.org](https://biblicalalignment.org). One translation (BSB), done right. Clean design, fast performance, zero ads, zero paywalls. 📖🆓

The Berean Standard Bible is public domain, made by credentialed evangelical scholars, and written in modern English people actually speak. This project wraps it in a reading experience that doesn't feel like 2005. ✨

---

## 🔥 Live Features

| Feature | Details |
|---------|---------|
| 📖 **Full Bible Reader** | 66 books, 1,189 chapters, 31,102 verses |
| 🔍 **Full-Text Search** | Search across every verse instantly |
| 🔗 **Cross-References** | 41,954 cross-references from OpenBible.info |
| 📅 **Reading Plans** | Bible in a Year, NT in 90 Days, Gospels in 30 Days, Psalms & Proverbs |
| 🏷️ **Topical Index** | 25 topics with 200 curated verses |
| 🌅 **Verse of the Day** | 365 curated verses, one for each day |
| 🔖 **Bookmarks** | Save verses for quick access |
| 📝 **Notes** | Write personal study notes on any verse |
| 🖍️ **Highlights** | Color-code verses as you read |
| 🌙 **Themes** | Dark mode, light mode, sepia |
| 📴 **Offline (PWA)** | Install it, read it anywhere, no connection needed |
| 🖨️ **Print-Friendly** | Chapter pages formatted for clean printing |
| ♿ **Accessible** | Reduced motion support, ARIA labels, keyboard navigation |
| 🚫 **Custom 404** | Even the error page is helpful |

All user data (bookmarks, notes, highlights) is stored locally in your browser via Zustand persist. No accounts, no tracking. 🔒

---

## 🚪 The Gate System 🚨

Every feature must pass these gates or it doesn't ship. No exceptions. 🛑

| Gate | Principle | Basis |
|------|-----------|-------|
| 🅰️ | **Scripture is final authority** | 2 Tim 3:16-17 📖 |
| 🅱️ | **Christ alone is mediator** | 1 Tim 2:5 ✝️ |
| 🅲 | **No tradition overrides Scripture** | Mark 7:8-13 🚫 |
| 🅳 | **Popularity ≠ truth** | Matt 7:13-14 🚪 |
| 🅴 | **Help users test, don't tell them what to believe** | Acts 17:11 🔍 |

> 📄 Full theological foundations in [`docs/PRINCIPLES.md`](docs/PRINCIPLES.md)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| ⚛️ **Framework** | Next.js 16 (static export) |
| 🧩 **UI** | React 19 · TailwindCSS v4 · Framer Motion |
| 📦 **State** | Zustand (with localStorage persist) |
| 🏗️ **Monorepo** | Turborepo + pnpm workspaces |
| 🌐 **Hosting** | Cloudflare Workers |
| 🔤 **Language** | TypeScript everywhere |

---

## 🚀 Getting Started

**Prerequisites:** Node.js 18+ and pnpm 📋

```bash
# 📥 Clone the repo
git clone https://github.com/joshuaworth/biblical-alignment.git
cd biblical-alignment

# 📦 Install dependencies
pnpm install

# 🔧 Start development server
pnpm dev

# 🏗️ Build for production
pnpm build
```

The dev server runs at `http://localhost:3000` 🖥️

---

## 📁 Project Structure

```
biblical-alignment/
├── 📁 apps/
│   └── 📁 web/                 # 🌐 Main web app (Next.js)
│       ├── 📁 src/app/         # Pages and routes
│       ├── 📁 public/          # Static assets
│       └── 📄 next.config.ts   # Next.js config
│
├── 📁 packages/                # 📦 Shared packages
│   ├── 📁 ui/                  # 🎨 Component library
│   ├── 📁 bible-data/          # 📖 Bible text and parsing
│   └── 📁 search/              # 🔍 Search functionality
│
├── 📁 data/                    # 📊 Bible data
│   ├── 📁 translations/        # BSB text files
│   └── 📁 cross-references/    # Cross-reference data
│
├── 📁 docs/                    # 📄 Documentation
├── 📁 scripts/                 # 🔧 Build and deploy scripts
├── 📄 turbo.json               # Turborepo config
└── 📄 wrangler.toml            # Cloudflare Workers config
```

---

## 🤝 Contributing

Contributions are welcome! This is a free, open project. 🎉

1. 🍴 Fork the repo
2. 🌿 Create a feature branch
3. 💻 Make your changes
4. ✅ Make sure all five gates pass (see above)
5. 🚀 Submit a pull request

Please keep the [Gate System](#-the-gate-system-) in mind. If a feature doesn't honor Scripture as final authority, it won't be merged. 📖

---

## 📜 License

| What | License |
|------|---------|
| 💻 **Code** | [MIT License](LICENSE) |
| 📖 **Bible Text (BSB)** | Public Domain (CC0). Free forever. |

---

## 🙏 Guiding Verse

> *"Your word is a lamp for my feet, a light on my path."* — Psalm 119:105 💡🛤️

---

*Built with ❤️ by [IntentMesh](https://intentmesh.com)* 🔺
