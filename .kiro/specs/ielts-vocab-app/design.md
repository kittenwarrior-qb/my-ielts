# Design Document

## Overview

Ứng dụng IELTS Vocabulary App được xây dựng với Astro (SSR mode) + React cho interactive components. Dữ liệu lưu trữ dạng JSON files trong repo, commit qua GitHub API khi có thay đổi từ admin panel. Audio files lưu trên Cloudflare R2. Deploy tự động trên Vercel.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         VERCEL (Hosting)                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    ASTRO APP (SSR)                       │   │
│  │                                                          │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │   │
│  │  │    Pages     │  │  Components  │  │  API Routes  │   │   │
│  │  │  (Astro)     │  │   (React)    │  │   (Astro)    │   │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘   │   │
│  │                                                          │   │
│  │  ┌──────────────────────────────────────────────────┐   │   │
│  │  │              JSON Data Files                      │   │   │
│  │  │  vocabulary.json | idioms.json | phrases.json    │   │   │
│  │  └──────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
         │                                    │
         ▼                                    ▼
┌─────────────────┐                 ┌─────────────────┐
│   GitHub API    │                 │  Cloudflare R2  │
│  (Octokit)      │                 │  (Audio Files)  │
│  Commit JSON    │                 │                 │
└─────────────────┘                 └─────────────────┘
```

## Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Framework | Astro 4.x (SSR) | Static + Server rendering |
| UI Components | React 18 | Interactive components |
| Styling | TailwindCSS | Utility-first CSS |
| Search | Fuse.js | Client-side fuzzy search |
| File Parsing | papaparse, xlsx, mammoth | Import CSV, Excel, Word |
| GitHub Integration | Octokit | Commit files via API |
| Icons | Lucide React | Icon library |
| Audio | Web Audio API + MediaRecorder | Recording & playback |
| Hosting | Vercel | Auto-deploy on commit |
| Storage | Cloudflare R2 | Audio file storage |

## Components and Interfaces

### Page Structure

```
src/pages/
├── index.astro                    # Homepage
├── vocabulary/
│   ├── index.astro                # Vocabulary list
│   └── [word].astro               # Vocabulary detail
├── idioms/
│   ├── index.astro                # Idioms list
│   └── [slug].astro               # Idiom detail
├── phrases/
│   ├── index.astro                # Phrases list
│   └── [slug].astro               # Phrase detail
├── listening.astro                # Listening section
├── reading.astro                  # Reading section
├── speaking.astro                 # Speaking section
├── writing.astro                  # Writing section
├── admin/
│   ├── index.astro                # Admin dashboard
│   ├── vocabulary/
│   │   ├── index.astro            # Manage vocabulary
│   │   ├── new.astro              # Add new word
│   │   └── edit/[word].astro      # Edit word
│   ├── idioms/...                 # Similar structure
│   ├── phrases/...                # Similar structure
│   └── import.astro               # Bulk import page
└── api/
    ├── vocabulary/
    │   ├── create.ts              # POST - create entry
    │   ├── update.ts              # PUT - update entry
    │   └── delete.ts              # DELETE - remove entry
    ├── idioms/...                 # Similar structure
    ├── phrases/...                # Similar structure
    ├── import.ts                  # POST - bulk import
    ├── auth.ts                    # POST - admin login
    └── upload.ts                  # POST - upload audio
```

### React Components

```
src/components/
├── layout/
│   ├── Header.tsx                 # Navigation header
│   ├── Footer.tsx                 # Footer
│   ├── MobileNav.tsx              # Mobile hamburger menu
│   └── AdminLayout.tsx            # Admin wrapper
├── vocabulary/
│   ├── VocabularyList.tsx         # Main list with filters
│   ├── VocabularyCard.tsx         # Single word row in list
│   ├── VocabularyDetail.tsx       # Detail page content
│   ├── AlphabetFilter.tsx         # A-Z navigation
│   ├── TopicFilter.tsx            # Topic dropdown
│   ├── LevelFilter.tsx            # Level/Band filter
│   └── Pagination.tsx             # Page controls
├── search/
│   ├── SearchBox.tsx              # Search input
│   ├── SearchResults.tsx          # Results dropdown
│   └── GlobalSearch.tsx           # Header search
├── audio/
│   ├── AudioPlayer.tsx            # Play audio button
│   ├── AudioRecorder.tsx          # Record component
│   └── RecordingPreview.tsx       # Preview before save
├── admin/
│   ├── VocabularyForm.tsx         # Add/Edit form
│   ├── ImportUploader.tsx         # File upload + preview
│   ├── ImportPreview.tsx          # Preview imported data
│   └── LoginForm.tsx              # Admin login
└── common/
    ├── Button.tsx                 # Reusable button
    ├── Input.tsx                  # Form input
    ├── Select.tsx                 # Dropdown select
    ├── Modal.tsx                  # Modal dialog
    └── Toast.tsx                  # Notification toast
```

## Data Models

### Vocabulary Entry

```typescript
interface VocabularyEntry {
  id: number;
  word: string;
  phonetic: string;
  types: WordType[];
  examples: string[];
  wordForms: WordFormLink[];
  synonyms: string[];
  antonyms: string[];
  topics: string[];
  level: 'basic' | 'common' | 'advanced';
  band: number; // IELTS band score 4.0 - 9.0
  audioUrl: string | null; // Cambridge/external audio
  myAudioUrl: string | null; // User recorded audio
  notes: string;
  createdAt: string;
  updatedAt: string;
}

interface WordType {
  type: 'noun' | 'verb' | 'adjective' | 'adverb' | 'preposition' | 'conjunction' | 'interjection';
  meaning: string;
  meaningVi: string;
}

interface WordFormLink {
  word: string;
  type: string;
}
```

### Idiom Entry

```typescript
interface IdiomEntry {
  id: number;
  slug: string;
  idiom: string;
  meaning: string;
  meaningVi: string;
  examples: string[];
  relatedVocabulary: string[];
  topics: string[];
  level: 'common' | 'advanced';
  audioUrl: string | null;
  myAudioUrl: string | null;
  notes: string;
  createdAt: string;
  updatedAt: string;
}
```

### Phrase Entry

```typescript
interface PhraseEntry {
  id: number;
  slug: string;
  phrase: string;
  meaning: string;
  meaningVi: string;
  examples: string[];
  category: 'speaking' | 'writing' | 'general';
  topics: string[];
  audioUrl: string | null;
  myAudioUrl: string | null;
  notes: string;
  createdAt: string;
  updatedAt: string;
}
```

### Skill Content Entry

```typescript
interface SkillContent {
  id: number;
  slug: string;
  title: string;
  skill: 'listening' | 'reading' | 'speaking' | 'writing';
  content: string; // Markdown content
  relatedVocabulary: string[];
  audioUrl: string | null;
  myAudioUrl: string | null;
  createdAt: string;
  updatedAt: string;
}
```

### JSON File Structure

```
src/data/
├── vocabulary.json        # VocabularyEntry[]
├── idioms.json            # IdiomEntry[]
├── phrases.json           # PhraseEntry[]
├── listening.json         # SkillContent[]
├── reading.json           # SkillContent[]
├── speaking.json          # SkillContent[]
├── writing.json           # SkillContent[]
└── topics.json            # Topic[] - danh sách topics
```

## UI Design

### Vocabulary List Page (/vocabulary)

```
┌─────────────────────────────────────────────────────────────────┐
│  [Logo] IELTS Vocab    [Vocabulary] [Idioms] [Phrases]    🔍   │
│                        [Listening] [Reading] [Speaking] [Writing]│
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  🔍 Search vocabulary...                    [Filters ▼] │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  A B C D E F G H I J K L M N O P Q R S T U V W X Y Z [All]     │
│                                                                 │
│  Topics: [All ▼]    Level: [All ▼]    Band: [All ▼]            │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ #  │ 🔊 │ Word        │ Type  │ Meaning      │ Example  │   │
│  ├────┼────┼─────────────┼───────┼──────────────┼──────────┤   │
│  │ 1  │ 🔊 │ abandon     │ v, n  │ từ bỏ        │ She...   │   │
│  │ 2  │ 🔊 │ abbreviate  │ v     │ viết tắt     │ The...   │   │
│  │ 3  │ 🔊 │ ability     │ n     │ khả năng     │ His...   │   │
│  │ ...│    │             │       │              │          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ◀ Prev  [1] [2] [3] ... [20]  Next ▶     Showing 1-20 of 500  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Vocabulary Detail Page (/vocabulary/[word])

```
┌─────────────────────────────────────────────────────────────────┐
│  [Header Navigation]                                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ← Back to list                                                 │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  abandon                                                 │   │
│  │  /əˈbændən/   🔊 Audio   🎤 My Recording                │   │
│  │                                                          │   │
│  │  ─────────────────────────────────────────────────────  │   │
│  │                                                          │   │
│  │  📖 Definitions                                          │   │
│  │                                                          │   │
│  │  verb                                                    │   │
│  │  • to leave someone or something                         │   │
│  │  • từ bỏ, bỏ rơi                                        │   │
│  │                                                          │   │
│  │  noun                                                    │   │
│  │  • complete lack of inhibition                           │   │
│  │  • sự phóng túng                                        │   │
│  │                                                          │   │
│  │  ─────────────────────────────────────────────────────  │   │
│  │                                                          │   │
│  │  📝 Examples                                             │   │
│  │  • She had to abandon her car in the snow.              │   │
│  │  • He abandoned his family when they needed him.        │   │
│  │                                                          │   │
│  │  ─────────────────────────────────────────────────────  │   │
│  │                                                          │   │
│  │  🔗 Word Forms                                           │   │
│  │  [abandonment (n)] [abandoned (adj)]                    │   │
│  │                                                          │   │
│  │  💡 Synonyms                                             │   │
│  │  [give up] [desert] [forsake] [leave]                   │   │
│  │                                                          │   │
│  │  ─────────────────────────────────────────────────────  │   │
│  │                                                          │   │
│  │  📌 Topics: General, Relationships                       │   │
│  │  📊 Level: Common  |  Band: 6.0+                        │   │
│  │                                                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Admin Panel (/admin)

```
┌─────────────────────────────────────────────────────────────────┐
│  [Logo] Admin Panel                              [← Back to Site]│
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐  ┌──────────────────────────────────────┐    │
│  │              │  │                                      │    │
│  │  Dashboard   │  │  Welcome to Admin Panel              │    │
│  │              │  │                                      │    │
│  │  Vocabulary  │  │  ┌────────┐ ┌────────┐ ┌────────┐   │    │
│  │  • Add New   │  │  │  500   │ │   50   │ │  100   │   │    │
│  │  • Manage    │  │  │ Words  │ │ Idioms │ │Phrases │   │    │
│  │              │  │  └────────┘ └────────┘ └────────┘   │    │
│  │  Idioms      │  │                                      │    │
│  │  • Add New   │  │  Quick Actions:                      │    │
│  │  • Manage    │  │  [+ Add Vocabulary]                  │    │
│  │              │  │  [+ Add Idiom]                       │    │
│  │  Phrases     │  │  [📥 Import Data]                    │    │
│  │  • Add New   │  │                                      │    │
│  │  • Manage    │  │                                      │    │
│  │              │  │                                      │    │
│  │  Import      │  │                                      │    │
│  │              │  │                                      │    │
│  └──────────────┘  └──────────────────────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Error Handling

### API Error Responses

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

// Error codes
const ErrorCodes = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  GITHUB_API_ERROR: 'GITHUB_API_ERROR',
  UPLOAD_ERROR: 'UPLOAD_ERROR',
  PARSE_ERROR: 'PARSE_ERROR',
};
```

### Client-side Error Handling

- Display toast notifications for errors
- Retry button for failed API calls
- Form validation with inline error messages
- Loading states during async operations

### GitHub API Error Handling

- Retry logic with exponential backoff (max 3 retries)
- Queue commits if multiple rapid changes
- Display clear error message if commit fails
- Allow manual retry from admin panel

## Testing Strategy

### Unit Tests
- Data validation functions
- Search/filter logic
- File parsing utilities (CSV, Excel, Word)

### Integration Tests
- API routes (create, update, delete)
- GitHub API integration
- Audio upload flow

### E2E Tests
- Vocabulary list navigation and filtering
- Admin panel CRUD operations
- Import flow with different file types

## Security Considerations

- Admin panel protected by password (stored in environment variable)
- GitHub token stored securely in Vercel environment variables
- Cloudflare R2 credentials in environment variables
- Input sanitization for all user inputs
- Rate limiting on API routes
