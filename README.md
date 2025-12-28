# IELTS Learning Platform

Ứng dụng học IELTS toàn diện với vocabulary, grammar, expressions và board system - Astro + React + PostgreSQL.

## Mô tả bài toán

Người học IELTS cần một nơi tập trung để:
- Tra cứu từ vựng với phiên âm, ví dụ, synonyms
- Học grammar patterns với explanations chi tiết và lessons
- Lưu idioms/phrases theo chủ đề
- Tổ chức learning materials vào boards
- Nghe phát âm từ vựng

```
Input:  Từ vựng rời rạc, grammar rules khó nhớ
Output: Hệ thống có cấu trúc với boards, lessons, topics, levels
```

## Tính năng đã có

### Core Features
- **Vocabulary Management**: Tra cứu từ, phiên âm, word types, examples, synonyms
  - Thêm/sửa/xóa vocabulary với form đa dạng (manual, API tra từ điển, JSON import)
  - Tổ chức vocabulary vào boards
  - Audio support với play button
  
- **Grammar Patterns**: Structure, explanation, usage notes, examples
  - Tổ chức grammar vào boards và lessons (2 cấp độ)
  - Thêm/sửa/xóa grammar items
  - Thêm/sửa/xóa lessons trong board
  - Sidebar navigation với dropdown lessons
  
- **Expressions/Idioms**: Idioms & phrases với context, register, frequency
  - Thêm/sửa/xóa expressions
  - Tổ chức vào boards theo chủ đề
  
- **Board System**: 
  - Tạo/sửa/xóa boards cho cả 3 loại (grammar, vocabulary, idioms)
  - Grammar boards có lessons (2-level hierarchy)
  - Vocabulary và Idioms boards chứa trực tiếp items
  - Cascade delete: xóa board sẽ xóa tất cả lessons và items bên trong

### Advanced Features
- **Level System**: Beginner, Intermediate, Advanced
- **IELTS Band Scoring**: Từ vựng được gắn band score (6.0, 6.5, 7.0...)
- **Topics & Categories**: Phân loại theo chủ đề
- **Search & Filter**: Tìm kiếm nhanh với Fuse.js
- **Admin Dashboard**: 
  - Authentication với admin password
  - Permission checks cho tất cả CRUD operations
  - Error dialogs thân thiện
  - Responsive design

### Data Management
- **Bulk Import**: Import từ CSV, Excel, Word documents
- **Dictionary API Integration**: Tra từ điển tự động khi thêm vocabulary
- **Seed Scripts**: Scripts để seed data nhanh
- **Cleanup Scripts**: Script dọn dẹp orphaned data (`npm run db:clean`)

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

## Database Commands

```bash
pnpm db:generate   # Generate migration files
pnpm db:migrate    # Run migrations
pnpm db:push       # Push schema changes
pnpm db:studio     # Open Drizzle Studio GUI
pnpm db:seed       # Seed initial data
pnpm db:clean      # Clean orphaned data (lessons/items without boards)
```

## API Endpoints

### Authentication
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/api/auth/login` | Admin login |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Get current user info |

### Vocabulary
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/vocabulary` | List all vocabulary |
| GET | `/api/vocabulary/:id` | Get vocabulary detail |
| POST | `/api/vocabulary/create` | Create vocabulary (admin) |
| PUT | `/api/vocabulary/:id` | Update vocabulary (admin) |
| DELETE | `/api/vocabulary/:id` | Delete vocabulary (admin) |
| POST | `/api/vocabulary/fetch` | Fetch from dictionary API |

### Grammar
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/grammar` | List all grammar patterns |
| GET | `/api/grammar/:id` | Get grammar detail |
| POST | `/api/grammar/create` | Create grammar (admin) |
| PUT | `/api/grammar/:id` | Update grammar (admin) |
| DELETE | `/api/grammar/:id` | Delete grammar (admin) |
| GET | `/api/grammar/by-ids` | Batch get by IDs |

### Expressions
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/expressions` | List all expressions |
| GET | `/api/expressions/:id` | Get expression detail |
| POST | `/api/expressions/create` | Create expression (admin) |
| PUT | `/api/expressions/:id` | Update expression (admin) |
| DELETE | `/api/expressions/:id` | Delete expression (admin) |
| GET | `/api/expressions/by-ids` | Batch get by IDs |

### Boards
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/boards` | List boards (filter by type) |
| GET | `/api/boards/:id` | Get board detail |
| POST | `/api/boards` | Create board (admin) |
| PUT | `/api/boards/:id` | Update board (admin) |
| DELETE | `/api/boards/:id` | Delete board + cascade delete items (admin) |
| POST | `/api/boards/:id/items` | Add item to board (admin) |
| DELETE | `/api/boards/:id/items` | Remove item from board (admin) |

### Lessons (Grammar only)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/lessons?boardId=:id` | List lessons in board |
| GET | `/api/lessons/:id` | Get lesson detail |
| POST | `/api/lessons` | Create lesson (admin) |
| PUT | `/api/lessons/:id` | Update lesson (admin) |
| DELETE | `/api/lessons/:id` | Delete lesson (admin) |

## Thiết kế Database

```
boards (1) ──→ (N) lessons (Grammar only)
lessons (1) ──→ (N) grammar items
boards (1) ──→ (N) vocabulary/expressions (direct)
```

### Schema Highlights

**boards**
- `id`, `name`, `type` (grammar/vocabulary/idioms)
- `itemIds` (JSONB array) - References to items (vocabulary/expressions only)
- `description`, `color`, `icon`, `order`
- Grammar boards use lessons instead of direct itemIds

**lessons** (Grammar only)
- `id`, `boardId`, `title`, `description`
- `itemIds` (JSONB array) - References to grammar items
- `order` - Position in board

**vocabulary**
- `word`, `phonetic`, `audioUrl`
- `types` (JSONB) - Multiple word types với meanings
- `examples`, `synonyms`, `wordForms` (JSONB arrays)
- `level` (enum), `band` (real) - IELTS scoring
- `topics` (JSONB) - Multiple topic tags
- `grammar` - Grammar notes

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
- `category`, `topics`

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

### Grammar: 2-Level Hierarchy (Board → Lessons → Items)

Grammar sử dụng cấu trúc 2 cấp để tổ chức tốt hơn:

```
Grammar Board
├── Lesson 1: Present Tenses
│   ├── Present Simple
│   ├── Present Continuous
│   └── Present Perfect
├── Lesson 2: Past Tenses
│   ├── Past Simple
│   └── Past Continuous
```

**Lý do:**
- Grammar patterns thường được nhóm theo chủ đề (tenses, conditionals, etc.)
- Dễ dàng tổ chức curriculum
- Sidebar có dropdown để navigate

**Implementation:**
- `boards` table: chứa grammar boards
- `lessons` table: `boardId` foreign key, `itemIds` JSONB array
- `grammar` table: individual grammar items

### Vocabulary & Idioms: Flat Structure (Board → Items)

Vocabulary và Idioms dùng cấu trúc phẳng:

```
Vocabulary Board
├── Word 1
├── Word 2
└── Word 3
```

**Lý do:**
- Không cần phân cấp phức tạp
- Vocabulary thường học theo board/topic trực tiếp
- Đơn giản hơn cho user

**Implementation:**
- `boards.itemIds` JSONB array chứa trực tiếp vocabulary/expression IDs

### Cascade Delete Logic

Khi xóa board:

**Grammar Board:**
1. Lấy tất cả lessons của board
2. Với mỗi lesson:
   - Xóa tất cả grammar items trong `lesson.itemIds`
   - Xóa lesson
3. Xóa các grammar items trực tiếp trong `board.itemIds` (nếu có)
4. Xóa board

**Vocabulary/Idioms Board:**
1. Xóa tất cả items trong `board.itemIds`
2. Xóa board

**Script cleanup:**
```bash
npm run db:clean  # Xóa orphaned data (lessons/items không còn board)
```

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

### 1. Grammar Organization: Flat vs Hierarchical

**Problem:** Grammar patterns cần tổ chức theo chủ đề (tenses, conditionals, etc.) nhưng vocabulary thì không.

**Solution:** 
- Grammar: 2-level hierarchy (Board → Lessons → Items)
- Vocabulary/Idioms: Flat structure (Board → Items)
- Sidebar tự động detect và hiển thị dropdown cho grammar, simple list cho vocabulary/idioms

### 2. Cascade Delete Complexity

**Problem:** Khi xóa board, cần xóa tất cả lessons và items bên trong. Làm sao đảm bảo không bỏ sót?

**Solution:**
```typescript
// boardsRepo.delete()
if (board.type === 'grammar') {
  // 1. Get all lessons
  const lessons = await lessonsRepo.getAll(boardId);
  
  // 2. Delete items in each lesson
  for (const lesson of lessons) {
    for (const itemId of lesson.itemIds) {
      await grammarRepo.delete(itemId);
    }
    await lessonsRepo.delete(lesson.id);
  }
}
// 3. Delete items directly in board
// 4. Delete board
```

Plus cleanup script để xóa orphaned data định kỳ.

### 3. Mixed Content Types trong Boards

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

### 4. Form Flexibility for Vocabulary

**Problem:** Users muốn nhập vocabulary theo nhiều cách khác nhau.

**Solution:** 3 input methods trong AddVocabularyForm:
- **Manual**: Form fields đầy đủ
- **Dictionary API**: Tra từ điển tự động, sau đó edit
- **JSON Import**: Paste JSON cho bulk import

### 5. Permission Management

**Problem:** Cần phân quyền admin nhưng không muốn phức tạp với user system.

**Solution:**
- Simple cookie-based auth với admin password
- `requireAuth()` và `getAdminStatus()` middleware
- Error dialogs thân thiện khi không có quyền
- Có thể upgrade sau nếu cần multi-user

## Limitations & Future Improvements

### Hiện tại còn thiếu
- User accounts (mỗi user có boards riêng)
- Spaced repetition system (flashcards)
- Progress tracking & analytics
- Mobile app (React Native)
- Collaborative boards (real-time)
- AI-powered suggestions
- Full-text search
- Export boards to PDF/Excel

### Production-ready cần thêm
- Rate limiting (tránh abuse API)
- Error monitoring (Sentry)
- Analytics (Plausible/Umami)
- Automated DB backups
- CDN cho audio files
- Comprehensive tests (unit + integration)
- CI/CD pipeline

## Project Structure

```
src/
├── components/
│   ├── dashboard/           # Dashboard components
│   │   ├── GrammarBoardsGrid.tsx      # Grammar boards list
│   │   ├── GrammarBoardDetail.tsx     # Grammar board with lessons
│   │   ├── GrammarLessonDetail.tsx    # Lesson with grammar items
│   │   ├── VocabularyBoardsGrid.tsx   # Vocabulary boards list
│   │   ├── VocabularyBoardDetail.tsx  # Vocabulary board with items
│   │   ├── ExpressionsBoardsGrid.tsx  # Expressions boards list
│   │   ├── ExpressionsBoardDetail.tsx # Expressions board with items
│   │   ├── BoardsListWithLessons.tsx  # Sidebar navigation
│   │   ├── CreateBoardModal.tsx       # Create board modal
│   │   ├── EditBoardModal.tsx         # Edit board modal
│   │   ├── DeleteBoardDialog.tsx      # Delete board dialog
│   │   ├── CreateLessonModal.tsx      # Create lesson modal (grammar)
│   │   ├── EditLessonModal.tsx        # Edit lesson modal (grammar)
│   │   └── DeleteLessonDialog.tsx     # Delete lesson dialog (grammar)
│   ├── admin/               # Admin forms
│   │   ├── AddVocabularyForm.tsx      # Add vocabulary (3 methods)
│   │   ├── EditVocabularyForm.tsx     # Edit vocabulary
│   │   ├── AddGrammarForm.tsx         # Add grammar
│   │   ├── EditGrammarForm.tsx        # Edit grammar
│   │   ├── AddExpressionForm.tsx      # Add expression
│   │   └── EditExpressionForm.tsx     # Edit expression
│   └── ui/                  # shadcn/ui components
├── pages/
│   ├── api/                 # API routes
│   │   ├── auth/            # Authentication
│   │   ├── boards/          # Boards CRUD + items management
│   │   ├── lessons/         # Lessons CRUD (grammar only)
│   │   ├── vocabulary/      # Vocabulary CRUD + fetch API
│   │   ├── grammar/         # Grammar CRUD
│   │   └── expressions/     # Expressions CRUD
│   ├── dashboard/           # Dashboard pages (SPA)
│   └── index.astro          # Landing page
├── lib/
│   ├── db/
│   │   ├── schema.ts        # Drizzle schema
│   │   ├── client.ts        # Database client
│   │   └── seed*.ts         # Seed scripts
│   ├── repositories/        # Data access layer
│   │   ├── boards.ts        # Boards repo with cascade delete
│   │   ├── lessons.ts       # Lessons repo
│   │   ├── vocabulary.ts    # Vocabulary repo
│   │   ├── grammar.ts       # Grammar repo
│   │   └── expressions.ts   # Expressions repo
│   ├── auth.ts              # Auth utilities
│   └── queryClient.ts       # TanStack Query client
└── contexts/
    └── AdminContext.tsx     # Admin state context

scripts/                     # Utility scripts
├── clean-orphaned-data.ts   # Clean orphaned lessons/items
├── seed-*.ts                # Various seed scripts
└── README.md                # Scripts documentation
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
