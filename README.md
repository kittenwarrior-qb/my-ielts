# IELTS Learning Platform

Ứng dụng học IELTS toàn diện với vocabulary, grammar, expressions và board system tương tự Trello - Astro + React + PostgreSQL.

**Live Demo:** [Coming soon]

## Mô tả bài toán

Người học IELTS cần một nơi tập trung để:
- Tra cứu từ vựng với phiên âm, ví dụ, synonyms
- Học grammar patterns với explanations chi tiết
- Lưu idioms/phrases theo chủ đề
- Tổ chức learning materials vào boards (như Trello)
- Nghe phát âm từ vựng

```
Input:  Từ vựng rời rạc, grammar rules khó nhớ
Output: Hệ thống có cấu trúc với boards, topics, levels
```

## Tính năng đã có

### Core Features
- **Vocabulary Management**: Tra cứu từ, phiên âm, word types, examples, synonyms
- **Grammar Patterns**: Structure, explanation, usage notes, examples
- **Expressions**: Idioms & phrases với context, register, frequency
- **Board System**: Tổ chức vocabulary/grammar/idioms vào boards (Trello-style)
- **Audio Support**: Upload/play audio cho từ vựng
- **Dictionary Integration**: Tra từ điển trực tiếp trong app

### Advanced Features
- **Level System**: Beginner, Intermediate, Advanced
- **IELTS Band Scoring**: Từ vựng được gắn band score (6.5, 7.0, 7.5...)
- **Topics & Categories**: Phân loại theo chủ đề (speaking, writing, general)
- **External Links**: Liên kết tài liệu bên ngoài
- **Search & Filter**: Tìm kiếm nhanh với Fuse.js
- **Admin Dashboard**: Quản lý content với authentication

### Data Management
- **Bulk Import**: Import từ CSV, Excel, Word documents
- **GitHub Sync**: Backup/sync data với GitHub
- **Seed Scripts**: Scripts để seed data nhanh

## Tech Stack

| Component | Choice | Lý do |
|-----------|--------|-------|
| Framework | Astro 5 | SSR performance, React islands, SEO tốt |
| UI Library | React 19 | Component reusability, ecosystem lớn |
| Database | PostgreSQL | JSONB cho flexible schema, indexing mạnh |
| ORM | Drizzle | Type-safe, lightweight, migration tự động |
| Styling | Tailwind + shadcn/ui | Rapid development, consistent design |
| State | TanStack Query | Server state caching, optimistic updates |
| Deploy | Vercel | Zero-config, edge functions, auto HTTPS |

## Cách chạy

### Local

```bash
git clone <your-repo-url>
cd <project-name>

# Install dependencies
pnpm install

# Setup database
cp .env.example .env
# Cập nhật DATABASE_URL trong .env

# Run migrations
pnpm db:push

# Seed data (optional)
pnpm db:seed

# Start dev server
pnpm dev
# → http://localhost:4321
```

### Database Commands

```bash
pnpm db:generate   # Generate migration files
pnpm db:migrate    # Run migrations
pnpm db:push       # Push schema changes
pnpm db:studio     # Open Drizzle Studio GUI
```

## API Endpoints

### Authentication
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/api/auth/login` | Admin login |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Get current user |

### Vocabulary
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/vocabulary` | List vocabulary (paginated) |
| GET | `/api/vocabulary/:id` | Get vocabulary detail |
| POST | `/api/vocabulary/create` | Create vocabulary (admin) |
| GET | `/api/vocabulary/fetch` | Fetch from external API |

### Grammar
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/grammar` | List grammar patterns |
| GET | `/api/grammar/:id` | Get grammar detail |
| POST | `/api/grammar/create` | Create grammar (admin) |
| GET | `/api/grammar/by-ids` | Batch get by IDs |

### Expressions
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/expressions` | List expressions |
| GET | `/api/expressions/:id` | Get expression detail |
| POST | `/api/expressions/create` | Create expression (admin) |

### Boards
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/boards` | List all boards |
| GET | `/api/boards/:id` | Get board with items |
| POST | `/api/boards` | Create board (admin) |
| PUT | `/api/boards/:id` | Update board (admin) |
| DELETE | `/api/boards/:id` | Delete board (admin) |

### Dictionary
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/dictionary/:word` | Lookup word definition |

### Audio
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/api/audio/upload` | Upload audio file |
| DELETE | `/api/audio/delete` | Delete audio file |

## Thiết kế Database

```
boards (1) ──→ (N) vocabulary/grammar/expressions
topics (1) ──→ (N) vocabulary/grammar/expressions
```

### Schema Highlights

**boards**
- `id`, `name`, `type` (grammar/vocabulary/idioms)
- `itemIds` (JSONB array) - Flexible references
- `color`, `icon` - UI customization

**vocabulary**
- `word`, `phonetic`, `audioUrl`
- `types` (JSONB) - Multiple word types với meanings
- `examples`, `synonyms`, `wordForms` (JSONB arrays)
- `level` (enum), `band` (real) - IELTS scoring
- `topics` (JSONB) - Multiple topic tags

**grammar**
- `title`, `structure`, `explanation`
- `examples`, `usage`, `notes`
- `externalLinks` (JSONB) - Reference materials
- `level` (enum)

**expressions**
- `expression`, `type` (idiom/phrase)
- `meaning`, `examples`
- `context` (JSONB) - register, mode, frequency
- `synonyms`, `relatedWords`

### Indexes

```sql
-- Primary lookups
CREATE UNIQUE INDEX idx_vocabulary_word ON vocabulary(word);
CREATE UNIQUE INDEX idx_expressions_expression ON expressions(expression);

-- Filtering
CREATE INDEX idx_vocabulary_level ON vocabulary(level);
CREATE INDEX idx_vocabulary_band ON vocabulary(band);
CREATE INDEX idx_grammar_level ON grammar(level);

-- JSONB queries (if needed)
CREATE INDEX idx_vocabulary_topics ON vocabulary USING GIN(topics);
```

**Tại sao PostgreSQL?**
- JSONB cho flexible arrays (examples, synonyms, topics)
- Enum types cho level, word_type, category
- Full-text search capabilities
- Drizzle ORM có type-safety tốt

## Xử lý Data Import

### Challenge: Import từ nhiều nguồn khác nhau

Users có data từ CSV, Excel, Word documents với formats khác nhau.

**Solution:**
```typescript
// CSV: papaparse
// Excel: xlsx
// Word: mammoth
```

Normalize về unified schema trước khi insert.

### Challenge: Duplicate detection

Khi import bulk, có thể có từ trùng lặp.

**Solution:**
```sql
-- UNIQUE constraint trên word/expression
-- ON CONFLICT DO UPDATE trong Drizzle
```

## Board System Design

### Tại sao dùng JSONB array thay vì junction table?

**Option 1: Junction Table**
```sql
board_items (board_id, item_id, item_type, position)
```

**Option 2: JSONB Array** (Đã chọn)
```sql
boards.itemIds = ["vocab_1", "grammar_2", "expr_3"]
```

**Trade-offs:**

Junction table:
- ✅ Normalized, foreign keys
- ✅ Easy to query items by board
- ❌ Phức tạp khi reorder
- ❌ 3 tables join để lấy board data

JSONB array:
- ✅ Simple schema, 1 query lấy hết
- ✅ Reorder dễ (update array)
- ✅ Mixed types (vocab + grammar + expressions)
- ❌ Không có foreign key constraint
- ❌ Phải validate manually

**Kết luận:** JSONB phù hợp vì:
- Board size nhỏ (< 100 items)
- Reorder thường xuyên
- Mixed content types
- Read-heavy workload

## Authentication Strategy

### Simple Admin-Only Auth

```typescript
// Cookie-based session
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// No user table, no JWT complexity
if (password === ADMIN_PASSWORD) {
  cookies.set('admin', 'true', { httpOnly: true });
}
```

**Tại sao không dùng JWT/OAuth?**
- Chỉ có 1 admin user
- Không cần scale authentication
- Cookie đơn giản, secure với httpOnly
- Có thể upgrade sau nếu cần multi-user

## Performance Optimizations

### 1. Astro Islands Architecture

```astro
<!-- Static HTML -->
<Header />

<!-- Interactive React component -->
<VocabularySearch client:load />

<!-- Lazy load -->
<BoardCard client:visible />
```

Chỉ hydrate components cần interactive → Fast initial load.

### 2. TanStack Query Caching

```typescript
// Cache vocabulary list 5 phút
useQuery({
  queryKey: ['vocabulary', filters],
  queryFn: fetchVocabulary,
  staleTime: 5 * 60 * 1000,
});
```

Giảm API calls, instant navigation.

### 3. Pagination

```typescript
// Limit 20 items per page
const { data, total } = await vocabularyRepo.list({
  page: 1,
  limit: 20,
  level: 'intermediate',
});
```

Không load hết database vào memory.

### 4. JSONB Indexing

```sql
-- Fast topic filtering
CREATE INDEX idx_vocabulary_topics ON vocabulary USING GIN(topics);

-- Query
SELECT * FROM vocabulary WHERE topics @> '["business"]';
```

## Security

### Input Validation
- Sanitize user input trước khi insert
- Validate enum values (level, type, category)
- Max length cho text fields

### Authentication
- httpOnly cookies → Prevent XSS
- Admin-only endpoints check `requireAuth()`
- CORS configured cho production domain

### SQL Injection
- Drizzle ORM parameterized queries
- Không dùng raw SQL với user input

## Challenges & Solutions

### 1. Audio File Management

**Problem:** Lưu audio files ở đâu? Database hay file system?

**Solution:** 
- Upload lên Vercel Blob Storage
- Lưu URL trong database
- Fallback về external API nếu không có user audio

### 2. Mixed Content Types trong Boards

**Problem:** Board chứa cả vocabulary, grammar, expressions. Làm sao fetch efficiently?

**Solution:**
```typescript
// Parse itemIds: ["vocab_abc", "grammar_xyz", "expr_123"]
const vocabIds = itemIds.filter(id => id.startsWith('vocab_'));
const grammarIds = itemIds.filter(id => id.startsWith('grammar_'));

// Parallel fetch
const [vocabs, grammars, expressions] = await Promise.all([
  vocabularyRepo.getByIds(vocabIds),
  grammarRepo.getByIds(grammarIds),
  expressionsRepo.getByIds(expressionIds),
]);
```

3 queries song song thay vì N+1.

### 3. IELTS Band Score Precision

**Problem:** Band score có thể là 6.5, 7.0, 7.5... Dùng INT hay FLOAT?

**Solution:**
```typescript
band: real('band') // PostgreSQL REAL type
```

REAL (4 bytes) đủ cho precision, nhẹ hơn DOUBLE.

## Limitations & Future Improvements

### Hiện tại còn thiếu
- User accounts (mỗi user có boards riêng)
- Spaced repetition system (flashcards)
- Progress tracking & analytics
- Mobile app (React Native)
- Collaborative boards (real-time)
- AI-powered suggestions

### Production-ready cần thêm
- Rate limiting (tránh abuse API)
- Error monitoring (Sentry)
- Analytics (Plausible/Umami)
- Backup strategy (automated DB backups)
- CDN cho audio files
- Full-text search với PostgreSQL tsvector

## Project Structure

```
src/
├── components/
│   ├── dashboard/      # Board cards, vocabulary cards
│   ├── vocabulary/     # Vocabulary-specific components
│   ├── ui/            # shadcn/ui components
│   └── audio/         # Audio player components
├── pages/
│   ├── api/           # API routes
│   │   ├── auth/
│   │   ├── boards/
│   │   ├── vocabulary/
│   │   ├── grammar/
│   │   └── expressions/
│   ├── dashboard/     # Dashboard pages
│   └── index.astro    # Landing page
├── lib/
│   ├── db/
│   │   ├── schema.ts  # Drizzle schema
│   │   └── seed.ts    # Seed scripts
│   ├── repositories/  # Data access layer
│   └── auth.ts        # Auth utilities
└── styles/            # Global styles

scripts/               # Seed & migration scripts
drizzle/              # Migration files
```

## Scripts

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm preview          # Preview production build

# Database
pnpm db:generate      # Generate migrations
pnpm db:push          # Push schema changes
pnpm db:studio        # Open Drizzle Studio

# Seeding
pnpm db:seed          # Run main seed script
tsx scripts/seed-vocabulary.ts
tsx scripts/seed-grammar.ts
tsx scripts/seed-boards.ts
```

## Environment Variables

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/ielts_vocab

# Admin Auth
ADMIN_PASSWORD=your_secure_password

# GitHub Integration (optional)
GITHUB_TOKEN=ghp_xxx
GITHUB_REPO=username/repo
GITHUB_BRANCH=main

# App
NODE_ENV=development
```

## Contributing

Contributions welcome! Đặc biệt cần:
- Thêm vocabulary/grammar content
- Cải thiện UI/UX
- Tối ưu performance
- Viết tests

## License

MIT

---

Built with ❤️ for IELTS learners
