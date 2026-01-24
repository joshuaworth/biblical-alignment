# 🤖 Claude Instructions for Biblical Alignment

> *Project-specific instructions for AI assistants working on this codebase.* 📖🔧

🌐 **biblicalalignment.org**

---

## 📖 Project Overview

This is **Biblical Alignment** — a family of modern, beautiful Bible applications built on Scripture-first principles using the Berean Standard Bible (BSB).

**Key Links**:
- 📄 [`README.md`](../README.md) — Project overview
- 📜 [`docs/PRINCIPLES.md`](../docs/PRINCIPLES.md) — Theological foundations
- 🗺️ [`ROADMAP.md`](../ROADMAP.md) — Development roadmap

---

## 🚪 The Gate System (CRITICAL) 🚨

Before implementing ANY feature, it must pass these gates:

| Gate | Question | Fail = Don't Build |
|------|----------|-------------------|
| 🅰️ | Does this honor Scripture as final authority? | ❌ |
| 🅱️ | Does this keep Christ as sole mediator? | ❌ |
| 🅲 | Does this avoid nullifying God's Word? | ❌ |
| 🅳 | Does this avoid popularity-as-proof? | ❌ |
| 🅴 | Does this help users test against the text? | ❌ |

**If ANY gate fails, do not implement the feature. Flag it for discussion.** 🚫

---

## 🚫 Do NOT Do These Things

When working on this project, Claude must NEVER:

| ❌ | Action |
|----|--------|
| 🏛️ | Push any denomination (Reformed, Catholic, Orthodox, Pentecostal, etc.) |
| 🤖 | Have AI interpret Scripture authoritatively |
| 📊 | Use historical size/age as evidence of doctrinal truth |
| 🙏 | Include saint/Mary invocation or any non-Christ mediator patterns |
| 📜 | Treat tradition as authority over Scripture |
| 💬 | Tell users what to believe — show them the text instead |

---

## ✅ Always Do These Things

| ✅ | Action |
|----|--------|
| 📖 | Point to Scripture as final authority |
| 🔗 | Cite verses when making biblical claims |
| 🔍 | Show manuscript variants when relevant |
| 🤔 | Say "I don't know" rather than guess on theological questions |
| 🎯 | Keep user focused on the text, not on AI interpretation |
| 🆓 | Remember: this is a FREE project — no paywalls, no gatekeeping |

---

## 📁 Project Structure

```
bible-study-app/
├── apps/           # Application variants (web, mobile, kids, study)
├── packages/       # Shared packages (ui, bible-data, ai-assistant, search)
├── data/           # Bible text and reference data
├── docs/           # Documentation
├── assets/         # Static assets (icons, fonts, images)
├── content/        # Blog/SEO content
├── ai/             # AI-specific assets (prompts, embeddings)
├── seo/            # SEO configurations
├── scripts/        # Build and deployment scripts
├── config/         # Shared configurations
└── tests/          # Test files
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| 🌐 Web | Next.js · React · TailwindCSS |
| 📱 Mobile | React Native · Capacitor |
| 🗄️ Data | SQLite (local) · Supabase (sync) |
| 🤖 AI | Claude API · Local embeddings |
| 🔍 Search | Meilisearch or Typesense |

---

## 📖 Bible Data

**Primary Translation**: Berean Standard Bible (BSB)
- 📜 License: Public Domain (CC0)
- 🔗 Source: [berean.bible](https://berean.bible)
- 📥 Data: [openbible.com/download.htm](https://openbible.com/download.htm)

**Additional Translations** (for comparison):
- KJV (Public Domain)
- ASV (Public Domain)
- WEB (Public Domain)

---

## 🎨 Design Principles

| Principle | Description |
|-----------|-------------|
| 📱 **Mobile-first** | Design for phones first, then scale up |
| 🌙 **Dark mode default** | Easy on eyes for reading |
| ✨ **Modern & clean** | Not "church website" aesthetic — think Apple/Notion |
| 🧓 **Accessible** | Works for all ages and abilities |
| ⚡ **Fast** | <2s load time even on 3G |

---

## 💬 Tone & Voice

When writing UI copy or content:

| ✅ Do | ❌ Don't |
|-------|---------|
| Clear and direct | Churchy jargon |
| Warm but not preachy | Condescending |
| Inviting to all | Insider language |
| Scripture speaks for itself | AI interprets for you |

---

## 🔧 Development Guidelines

### Code Style
- 📝 TypeScript everywhere
- 🎨 TailwindCSS for styling
- 📦 Components in packages/ui
- 🧪 Tests for critical paths

### Git Commits
```
feat: Add verse search functionality 📖🔍
fix: Correct cross-reference linking 🔗
docs: Update PRINCIPLES.md 📜
test: Add Bible data parsing tests 🧪
chore: Update dependencies 📦

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
```

### File Organization
- One component per file
- Colocate tests with components
- Shared logic in packages/

---

## 🙏 Remember

> *"Your word is a lamp for my feet, a light on my path."* — Psalm 119:105 💡🛤️

This project exists to get Scripture into as many hands as possible. Every line of code should serve that mission. 📖🌍✝️

---

*When in doubt, ask: "Does this help someone encounter God's Word more clearly?"* 🤔📖
