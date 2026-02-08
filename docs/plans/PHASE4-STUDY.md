# 📚 Phase 4: Study Features — Implementation Plan

> *Deep study tools for serious Bible students*

---

## 📊 Overview

| Item | Detail |
|------|--------|
| **Goal** | Greek/Hebrew tools, cross-references, AI assistant |
| **Timeline** | 4-6 weeks |
| **Dependencies** | Phase 3 (bookmarks/notes infrastructure) |

---

## 🗂️ Data Acquisition

### 4.1 Cross-Reference Data

**Source:** [OpenBible.info Cross-References](https://www.openbible.info/labs/cross-references/)
- 340,000+ cross-references
- Public domain
- CSV format

**Data Model:**
```typescript
interface CrossReference {
  from: {
    book: string;
    chapter: number;
    verseStart: number;
    verseEnd?: number;
  };
  to: {
    book: string;
    chapter: number;
    verseStart: number;
    verseEnd?: number;
  };
  votes: number; // Community ranking
}
```

| Task | Description | Est. |
|------|-------------|------|
| 📥 | Download cross-reference CSV | 10 min |
| 🔄 | Parse and convert to JSON | 2 hr |
| 📦 | Create `packages/cross-refs` | 1 hr |
| 🔗 | Build verse lookup index | 2 hr |
| 🧪 | Test coverage | 1 hr |

---

### 4.2 Greek Lexicon (New Testament)

**Source:** [STEP Bible Lexicon](https://www.stepbible.org/) or [Berean Interlinear](https://interlinearbible.com/)
- Strong's numbers
- Greek word, transliteration, definition
- Part of speech, parsing

**Data Model:**
```typescript
interface GreekWord {
  strongs: string; // G2316
  greek: string; // θεός
  transliteration: string; // theos
  pronunciation: string; // theh'-os
  definition: string; // God, a deity
  partOfSpeech: string; // noun
  occurrences: number;
  derivation?: string;
}

interface VerseWord {
  word: string; // "God"
  strongs: string; // G2316
  parsing?: string; // N-NSM (Noun, Nominative, Singular, Masculine)
}
```

| Task | Description | Est. |
|------|-------------|------|
| 📥 | Acquire Greek lexicon data | 4 hr |
| 📥 | Acquire word-level mappings | 4 hr |
| 🔄 | Parse and structure data | 4 hr |
| 📦 | Create `packages/greek-lexicon` | 2 hr |
| 🧪 | Test with sample verses | 2 hr |

---

### 4.3 Hebrew Lexicon (Old Testament)

**Source:** Same as Greek, plus [Blue Letter Bible](https://www.blueletterbible.org/)

**Data Model:**
```typescript
interface HebrewWord {
  strongs: string; // H430
  hebrew: string; // אֱלֹהִים
  transliteration: string; // 'elohim
  pronunciation: string; // el-o-heem'
  definition: string; // God, gods
  partOfSpeech: string;
  occurrences: number;
}
```

| Task | Description | Est. |
|------|-------------|------|
| 📥 | Acquire Hebrew lexicon data | 4 hr |
| 📥 | Acquire word-level mappings | 4 hr |
| 🔄 | Parse and structure data | 4 hr |
| 📦 | Create `packages/hebrew-lexicon` | 2 hr |
| 🧪 | Test with sample verses | 2 hr |

---

## 🎨 UI Components

### 4.4 Cross-Reference Panel

**Location:** Side panel or bottom sheet on mobile

```
┌─────────────────────────────────────┐
│ 🔗 Cross-References for John 3:16  │
├─────────────────────────────────────┤
│                                     │
│ 📖 Romans 5:8                       │
│ "But God demonstrates His own love" │
│                                     │
│ 📖 1 John 4:9                       │
│ "This is how God showed His love"   │
│                                     │
│ 📖 Romans 8:32                      │
│ "He who did not spare His own Son"  │
│                                     │
│ [Show 12 more references →]         │
└─────────────────────────────────────┘
```

| Task | Description | Est. |
|------|-------------|------|
| 📐 | Design cross-ref panel UI | 2 hr |
| 🧱 | Build CrossRefPanel component | 4 hr |
| 🔗 | Integrate with verse selection | 2 hr |
| 📱 | Mobile bottom sheet version | 2 hr |
| 🧪 | Test and polish | 2 hr |

---

### 4.5 Greek/Hebrew Word Popup

**Trigger:** Tap/click on any word in verse

```
┌─────────────────────────────────────┐
│ θεός (theos)                   [×] │
│ Strong's: G2316                     │
├─────────────────────────────────────┤
│ 📖 Definition                       │
│ God, a deity; specifically the      │
│ supreme Divinity                    │
│                                     │
│ 🔤 Part of Speech                   │
│ Noun, Masculine                     │
│                                     │
│ 📊 Occurrences                      │
│ 1,343 times in NT                   │
│                                     │
│ [See all verses with θεός →]        │
└─────────────────────────────────────┘
```

| Task | Description | Est. |
|------|-------------|------|
| 📐 | Design word popup UI | 2 hr |
| 🧱 | Build WordPopup component | 4 hr |
| 🔗 | Map English words to Strong's | 4 hr |
| 🎯 | Word click detection | 2 hr |
| 📱 | Mobile optimization | 2 hr |
| 🧪 | Test with various verses | 2 hr |

---

### 4.6 Interlinear View

**Toggle:** Switch between paragraph and interlinear view

```
┌─────────────────────────────────────┐
│ [Paragraph] [Interlinear]          │
├─────────────────────────────────────┤
│                                     │
│  Ἐν      ἀρχῇ      ἦν       ὁ      │
│  En      archē     ēn       ho     │
│  In      beginning was      the    │
│  PREP    N-DSF     V-IAI-3S ART    │
│                                     │
│  λόγος                              │
│  logos                              │
│  Word                               │
│  N-NSM                              │
│                                     │
└─────────────────────────────────────┘
```

| Task | Description | Est. |
|------|-------------|------|
| 📐 | Design interlinear layout | 2 hr |
| 🧱 | Build InterlinearView component | 6 hr |
| 🔄 | Toggle between views | 1 hr |
| 📱 | Mobile scrolling behavior | 2 hr |
| 🧪 | Test with long verses | 2 hr |

---

## 🤖 AI Study Assistant

### 4.7 Architecture

```
┌─────────────────────────────────────┐
│           User Question             │
└─────────────────┬───────────────────┘
                  │
         ┌────────▼────────┐
         │  RAG Pipeline   │
         │  (Embeddings)   │
         └────────┬────────┘
                  │
      ┌──────────┴──────────┐
      │                      │
┌─────▼─────┐          ┌─────▼─────┐
│  Vector   │          │  Claude   │
│  Search   │          │   API     │
│ (Relevant │          │ (Answer)  │
│  verses)  │          │           │
└───────────┘          └───────────┘
```

**Principles (from PRINCIPLES.md):**
- AI NEVER interprets authoritatively
- Always cite Scripture
- Say "I don't know" when uncertain
- Point users to the text, not AI opinions

---

### 4.8 Embeddings & Vector Search

**Tech:** OpenAI embeddings + Supabase pgvector (or local FAISS)

```typescript
// Create embeddings for all verses
interface VerseEmbedding {
  id: string; // "john-3-16"
  book: string;
  chapter: number;
  verse: number;
  text: string;
  embedding: number[]; // 1536 dimensions
}

// Semantic search
async function findRelevantVerses(query: string): Promise<Verse[]> {
  const queryEmbedding = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: query,
  });

  return supabase.rpc('match_verses', {
    query_embedding: queryEmbedding,
    match_count: 10,
  });
}
```

| Task | Description | Est. |
|------|-------------|------|
| 🧮 | Generate embeddings for all 31k verses | 4 hr |
| 💾 | Set up Supabase with pgvector | 2 hr |
| 🔍 | Build semantic search function | 2 hr |
| 🧪 | Test search quality | 2 hr |

---

### 4.9 AI Chat Interface

```
┌─────────────────────────────────────┐
│ 🤖 Study Assistant                  │
├─────────────────────────────────────┤
│                                     │
│ 👤 What does the Bible say about    │
│    loving your enemies?             │
│                                     │
│ 🤖 Several passages address this:   │
│                                     │
│    📖 Matthew 5:44                  │
│    "Love your enemies and pray      │
│    for those who persecute you"     │
│                                     │
│    📖 Romans 12:20                  │
│    "If your enemy is hungry,        │
│    feed him..."                     │
│                                     │
│    📖 Luke 6:27-28                  │
│    "Love your enemies, do good      │
│    to those who hate you..."        │
│                                     │
│    These passages teach that        │
│    loving enemies involves active   │
│    goodwill, not just absence of    │
│    hatred. I encourage you to read  │
│    these verses in context.         │
│                                     │
├─────────────────────────────────────┤
│ 💬 [Ask a question...        ] [→] │
└─────────────────────────────────────┘
```

| Task | Description | Est. |
|------|-------------|------|
| 📐 | Design chat UI | 2 hr |
| 🧱 | Build ChatInterface component | 4 hr |
| 🔗 | Integrate Claude API | 2 hr |
| 📝 | Craft system prompt (see ai/prompts/) | 4 hr |
| 🔗 | Link verses in responses | 2 hr |
| 🧪 | Test edge cases | 4 hr |

---

### 4.10 System Prompt

```markdown
You are a Bible study assistant for Biblical Alignment.

RULES:
1. Always cite Scripture (book chapter:verse)
2. Never interpret authoritatively - present what the text says
3. If asked for your opinion, redirect to Scripture
4. Say "I don't know" if the Bible doesn't clearly address something
5. Never push any denomination
6. Present multiple interpretations when they exist
7. Encourage users to read passages in context

CONTEXT:
- User is reading: {currentBook} {currentChapter}
- Relevant verses from search: {relevantVerses}

RESPONSE FORMAT:
- Start with relevant Scripture quotes
- Explain what the text says (not what it means)
- Suggest related passages
- End with encouragement to read in context
```

---

## 📦 Dependencies

```json
{
  "openai": "^4.0.0",
  "@anthropic-ai/sdk": "^0.20.0",
  "@supabase/supabase-js": "^2.0.0",
  "ai": "^3.0.0"
}
```

---

## 🚀 Implementation Order

1. **Cross-references** (2 weeks) - Data + UI
2. **Greek lexicon** (1 week) - Data + word popup
3. **Hebrew lexicon** (1 week) - Same pattern
4. **Interlinear view** (1 week)
5. **AI embeddings** (1 week)
6. **AI chat** (1 week)

---

*Last updated: January 2026*
