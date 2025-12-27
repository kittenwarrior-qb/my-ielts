# Design Document

## Overview

The IELTS Skills Dashboard transforms the existing placeholder skill pages into interactive, data-driven dashboards that provide learners with comprehensive progress tracking, predictive analytics, and personalized study recommendations. The design leverages Astro's server-side rendering for optimal performance while using React islands for interactive components, maintaining the existing fintech-inspired UI aesthetic.

### Design Principles

1. **Performance First**: Leverage Astro's partial hydration to minimize JavaScript payload
2. **Progressive Enhancement**: Core content accessible without JavaScript, enhanced with interactivity
3. **Consistency**: Maintain existing design system, component patterns, and dark mode support
4. **Accessibility**: WCAG AA compliance with full keyboard navigation and screen reader support
5. **Responsive**: Mobile-first approach with optimized layouts for all screen sizes
6. **Data-Driven**: Real-time calculations and visualizations based on user progress data

## Architecture

### System Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        A[Astro Page] --> B[Static Content]
        A --> C[React Islands]
        C --> D[BandScoreProjector]
        C --> E[ProgressChart]
        C --> F[PracticeSessionTracker]
        C --> G[VocabularyRecommendations]
    end
    
    subgraph "API Layer"
        H[/api/skills/progress/track]
        I[/api/skills/[skill]/analytics]
        J[/api/skills/practice/session]
        K[/api/skills/practice/history]
        L[/api/skills/[skill]/recommendations]
    end
    
    subgraph "Business Logic Layer"
        M[ProgressRepository]
        N[PracticeSessionRepository]
        O[VocabularyMasteryRepository]
        P[SkillScoreRepository]
        Q[BandScoreCalculator]
        R[RecommendationEngine]
    end

    
    subgraph "Data Layer"
        S[(PostgreSQL)]
        T[user_progress]
        U[practice_sessions]
        V[vocabulary_mastery]
        W[skill_scores]
    end
    
    C --> H
    C --> I
    C --> J
    C --> K
    C --> L
    
    H --> M
    I --> M
    I --> P
    J --> N
    K --> N
    L --> O
    L --> R
    
    M --> S
    N --> S
    O --> S
    P --> S
    Q --> P
    R --> O
```

### Technology Stack

- **Frontend Framework**: Astro 5.16 (SSR mode)
- **Interactive Components**: React 19 (client:load directive)
- **Styling**: TailwindCSS 3.4 with existing design system
- **Database**: PostgreSQL via Supabase
- **ORM**: Drizzle ORM
- **Icons**: Lucide React
- **Charts**: Custom SVG-based charts (lightweight, no external library)
- **Type Safety**: TypeScript strict mode

## Components and Interfaces

### Page Structure

Each skill page follows this component hierarchy:

```
SkillPage.astro (Server-rendered)
├── Header (React Island - existing)
├── SkillDashboard (Astro Component)
│   ├── PerformanceMetrics (Astro Component)
│   │   ├── CurrentBandScore (Astro Component)
│   │   ├── ScoreVolatility (Astro Component)
│   │   └── RiskIndicator (Astro Component)
│   ├── BandScoreProjector (React Island - client:load)
│   │   ├── TimeHorizonSlider (React Component)
│   │   └── ProjectionDisplay (React Component)
│   ├── ProgressChart (React Island - client:load)
│   ├── VocabularyMastery (Astro Component)
│   │   └── VocabularyRecommendations (React Island - client:load)
│   ├── PracticeSessionTracker (React Island - client:load)
│   └── StudyPlanGenerator (Astro Component)
└── Footer (Astro Component - existing)
```

### Component Specifications

#### 1. SkillDashboard (Astro Component)

**Purpose**: Main container component that orchestrates the dashboard layout

**Props**:
```typescript
interface SkillDashboardProps {
  skill: 'listening' | 'reading' | 'speaking' | 'writing';
  userId: string;
  initialData: {
    currentBandScore: number | null;
    scoreHistory: SkillScore[];
    practiceStats: PracticeStats;
    vocabularyStats: VocabularyStats;
  };
}
```

**Responsibilities**:
- Fetch initial data server-side
- Render static performance metrics
- Coordinate layout of interactive islands
- Handle loading and error states

#### 2. BandScoreProjector (React Island)

**Purpose**: Interactive calculator for band score projection with time horizon slider

**Props**:
```typescript
interface BandScoreProjectorProps {
  skill: string;
  currentBandScore: number;
  practiceIntensity: number; // sessions per week
  learningEfficiency: number; // 0-1 scale
  historicalImprovementRate: number; // band points per week
}
```

**State**:
```typescript
interface ProjectorState {
  timeHorizon: number; // weeks (1-52)
  projectedScore: number;
  confidenceLevel: 'low' | 'medium' | 'high';
}
```

**Key Features**:
- Real-time calculation on slider change
- Debounced updates (100ms)
- Milestone markers at 4, 12, 24, 48 weeks
- Visual confidence indicator
- Accessible slider with keyboard support

#### 3. ProgressChart (React Island)

**Purpose**: Visual trend chart showing band score progression

**Props**:
```typescript
interface ProgressChartProps {
  scoreHistory: Array<{
    date: string;
    bandScore: number;
  }>;
  skill: string;
}
```

**Features**:
- SVG-based line chart (no external dependencies)
- Responsive scaling
- Hover tooltips with exact values
- Trend indicators (up/down arrows)
- Color-coded performance zones
- Dark mode support

#### 4. PracticeSessionTracker (React Island)

**Purpose**: Form to log practice sessions with immediate feedback

**Props**:
```typescript
interface PracticeSessionTrackerProps {
  skill: string;
  userId: string;
}
```

**State**:
```typescript
interface SessionForm {
  duration: number; // minutes
  wordsPracticed: number;
  date: Date;
}
```

**Features**:
- Form validation
- Optimistic UI updates
- Toast notifications
- Session history display (last 20)
- Practice intensity calculation

#### 5. VocabularyRecommendations (React Island)

**Purpose**: Display skill-specific vocabulary recommendations

**Props**:
```typescript
interface VocabularyRecommendationsProps {
  skill: string;
  userId: string;
  currentLevel: string;
  masteredCount: number;
}
```

**Features**:
- Fetch recommendations from API
- Display 5-10 words with definitions
- Link to vocabulary detail pages
- Filter by skill relevance
- Loading skeleton states

#### 6. PerformanceMetrics (Astro Component)

**Purpose**: Static display of current performance indicators

**Props**:
```typescript
interface PerformanceMetricsProps {
  currentBandScore: number | null;
  scoreVolatility: number; // 0-1 scale
  riskLevel: 'low' | 'medium' | 'high';
  lastUpdated: Date | null;
}
```

**Visual Elements**:
- Large band score display with badge
- Volatility meter (progress bar)
- Risk indicator with icon and color
- Last updated timestamp

## Data Models

### Database Schema Extensions

#### user_progress Table

```typescript
export const userProgress = pgTable('user_progress', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  skill: skillEnum('skill').notNull(),
  currentBand: real('current_band').notNull(),
  targetBand: real('target_band').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

**Indexes**:
- `idx_user_progress_user_skill` on (userId, skill) - unique
- `idx_user_progress_updated` on (updatedAt)

#### practice_sessions Table

```typescript
export const practiceSessions = pgTable('practice_sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  skill: skillEnum('skill').notNull(),
  durationMinutes: integer('duration_minutes').notNull(),
  wordsPracticed: integer('words_practiced').notNull(),
  date: timestamp('date').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

**Indexes**:
- `idx_practice_sessions_user_skill` on (userId, skill)
- `idx_practice_sessions_date` on (date DESC)

#### vocabulary_mastery Table

```typescript
export const vocabularyMastery = pgTable('vocabulary_mastery', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  vocabularyId: text('vocabulary_id').notNull().references(() => vocabulary.id),
  skill: skillEnum('skill').notNull(),
  masteryLevel: integer('mastery_level').notNull(), // 0-100
  lastReviewed: timestamp('last_reviewed').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

**Indexes**:
- `idx_vocabulary_mastery_user_skill` on (userId, skill)
- `idx_vocabulary_mastery_vocab` on (vocabularyId)
- `idx_vocabulary_mastery_level` on (masteryLevel DESC)

#### skill_scores Table

```typescript
export const skillScores = pgTable('skill_scores', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  skill: skillEnum('skill').notNull(),
  bandScore: real('band_score').notNull(),
  recordedAt: timestamp('recorded_at').notNull(),
});
```

**Indexes**:
- `idx_skill_scores_user_skill` on (userId, skill)
- `idx_skill_scores_recorded` on (recordedAt DESC)

### TypeScript Types

```typescript
// Core domain types
export type Skill = 'listening' | 'reading' | 'speaking' | 'writing';
export type RiskLevel = 'low' | 'medium' | 'high';
export type ConfidenceLevel = 'low' | 'medium' | 'high';

// Analytics types
export interface PracticeStats {
  totalSessions: number;
  totalMinutes: number;
  totalWords: number;
  averageSessionDuration: number;
  sessionsPerWeek: number;
  lastSessionDate: Date | null;
}

export interface VocabularyStats {
  totalLearned: number;
  retentionRate: number;
  averageMasteryLevel: number;
  recommendedWords: string[];
}

export interface SkillScore {
  id: string;
  bandScore: number;
  recordedAt: Date;
}

export interface ProjectionResult {
  projectedScore: number;
  confidenceLevel: ConfidenceLevel;
  factors: {
    currentScore: number;
    practiceIntensity: number;
    learningEfficiency: number;
    historicalRate: number;
  };
}

// API request/response types
export interface TrackProgressRequest {
  userId: string;
  skill: Skill;
  currentBand: number;
  targetBand: number;
}

export interface TrackProgressResponse {
  success: boolean;
  data: {
    id: string;
    updatedAt: Date;
  };
}

export interface SkillAnalyticsResponse {
  currentBandScore: number | null;
  scoreHistory: SkillScore[];
  practiceStats: PracticeStats;
  vocabularyStats: VocabularyStats;
  scoreVolatility: number;
  riskLevel: RiskLevel;
  learningEfficiency: number;
}

export interface PracticeSessionRequest {
  userId: string;
  skill: Skill;
  durationMinutes: number;
  wordsPracticed: number;
  date: Date;
}

export interface RecommendationsResponse {
  vocabulary: Array<{
    id: string;
    word: string;
    phonetic: string;
    meaning: string;
    relevanceScore: number;
  }>;
  studyPlan: Array<{
    type: 'practice' | 'vocabulary' | 'review';
    description: string;
    priority: number;
  }>;
}
```

## Business Logic

### Band Score Projection Algorithm

The projection algorithm uses a weighted formula considering multiple factors:

```typescript
function calculateProjectedScore(params: {
  currentScore: number;
  timeHorizon: number; // weeks
  practiceIntensity: number; // sessions per week
  learningEfficiency: number; // 0-1
  historicalRate: number; // band points per week
}): ProjectionResult {
  const {
    currentScore,
    timeHorizon,
    practiceIntensity,
    learningEfficiency,
    historicalRate
  } = params;

  // Base improvement rate (band points per week)
  const baseRate = historicalRate > 0 ? historicalRate : 0.05;

  // Practice intensity multiplier (0.5 to 2.0)
  const intensityMultiplier = Math.min(2.0, Math.max(0.5, practiceIntensity / 3));

  // Efficiency multiplier (0.5 to 1.5)
  const efficiencyMultiplier = 0.5 + learningEfficiency;

  // Diminishing returns factor (harder to improve at higher bands)
  const diminishingFactor = Math.max(0.3, 1 - (currentScore / 12));

  // Calculate projected improvement
  const weeklyImprovement = baseRate * intensityMultiplier * efficiencyMultiplier * diminishingFactor;
  const totalImprovement = weeklyImprovement * timeHorizon;

  // Calculate projected score (capped at 9.0)
  const projectedScore = Math.min(9.0, currentScore + totalImprovement);

  // Determine confidence level
  const dataPoints = historicalRate > 0 ? 'sufficient' : 'insufficient';
  const confidenceLevel = determineConfidence(dataPoints, practiceIntensity);

  return {
    projectedScore: Math.round(projectedScore * 2) / 2, // Round to nearest 0.5
    confidenceLevel,
    factors: {
      currentScore,
      practiceIntensity,
      learningEfficiency,
      historicalRate
    }
  };
}

function determineConfidence(
  dataPoints: 'sufficient' | 'insufficient',
  practiceIntensity: number
): ConfidenceLevel {
  if (dataPoints === 'insufficient') return 'low';
  if (practiceIntensity < 2) return 'medium';
  return 'high';
}
```

### Learning Efficiency Calculation

```typescript
function calculateLearningEfficiency(
  scoreImprovements: number[],
  practiceMinutes: number[]
): number {
  if (scoreImprovements.length < 2) return 0.5; // Default

  // Calculate improvement per hour of practice
  const totalImprovement = scoreImprovements.reduce((a, b) => a + b, 0);
  const totalHours = practiceMinutes.reduce((a, b) => a + b, 0) / 60;

  if (totalHours === 0) return 0.5;

  const improvementPerHour = totalImprovement / totalHours;

  // Normalize to 0-1 scale (assuming 0.1 band per hour is excellent)
  return Math.min(1.0, improvementPerHour / 0.1);
}
```

### Score Volatility Calculation

```typescript
function calculateScoreVolatility(scores: number[]): number {
  if (scores.length < 2) return 0;

  // Calculate standard deviation
  const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
  const squaredDiffs = scores.map(score => Math.pow(score - mean, 2));
  const variance = squaredDiffs.reduce((a, b) => a + b, 0) / scores.length;
  const stdDev = Math.sqrt(variance);

  // Normalize to 0-1 scale (1.0 band stdDev = high volatility)
  return Math.min(1.0, stdDev / 1.0);
}
```

### Risk Level Determination

```typescript
function determineRiskLevel(
  volatility: number,
  practiceIntensity: number,
  recentTrend: 'up' | 'down' | 'stable'
): RiskLevel {
  // High risk: high volatility + low practice + downward trend
  if (volatility > 0.6 && practiceIntensity < 2 && recentTrend === 'down') {
    return 'high';
  }

  // Medium risk: moderate volatility or low practice
  if (volatility > 0.4 || practiceIntensity < 3) {
    return 'medium';
  }

  // Low risk: consistent performance + regular practice
  return 'low';
}
```

## API Endpoints

### POST /api/skills/progress/track

**Purpose**: Create or update user progress for a skill

**Request**:
```typescript
{
  userId: string;
  skill: 'listening' | 'reading' | 'speaking' | 'writing';
  currentBand: number;
  targetBand: number;
}
```

**Response**:
```typescript
{
  success: boolean;
  data: {
    id: string;
    updatedAt: string;
  };
  error?: string;
}
```

**Implementation**:
- Validate band scores (0-9, 0.5 increments)
- Upsert user_progress record
- Return updated record

### GET /api/skills/[skill]/analytics

**Purpose**: Retrieve comprehensive analytics for a skill

**Query Parameters**:
- `userId`: string (required)

**Response**:
```typescript
{
  success: boolean;
  data: {
    currentBandScore: number | null;
    scoreHistory: Array<{
      id: string;
      bandScore: number;
      recordedAt: string;
    }>;
    practiceStats: {
      totalSessions: number;
      totalMinutes: number;
      totalWords: number;
      averageSessionDuration: number;
      sessionsPerWeek: number;
      lastSessionDate: string | null;
    };
    vocabularyStats: {
      totalLearned: number;
      retentionRate: number;
      averageMasteryLevel: number;
    };
    scoreVolatility: number;
    riskLevel: 'low' | 'medium' | 'high';
    learningEfficiency: number;
  };
  error?: string;
}
```

**Implementation**:
- Fetch user progress
- Fetch last 12 weeks of skill scores
- Calculate practice statistics
- Calculate vocabulary statistics
- Compute volatility and risk level
- Calculate learning efficiency

### POST /api/skills/practice/session

**Purpose**: Log a practice session

**Request**:
```typescript
{
  userId: string;
  skill: 'listening' | 'reading' | 'speaking' | 'writing';
  durationMinutes: number;
  wordsPracticed: number;
  date: string; // ISO 8601
}
```

**Response**:
```typescript
{
  success: boolean;
  data: {
    id: string;
    createdAt: string;
  };
  error?: string;
}
```

**Implementation**:
- Validate input data
- Insert practice_sessions record
- Update practice intensity metrics
- Return created record

### GET /api/skills/practice/history

**Purpose**: Retrieve practice session history

**Query Parameters**:
- `userId`: string (required)
- `skill`: string (optional)
- `limit`: number (default: 20)

**Response**:
```typescript
{
  success: boolean;
  data: Array<{
    id: string;
    skill: string;
    durationMinutes: number;
    wordsPracticed: number;
    date: string;
  }>;
  error?: string;
}
```

### GET /api/skills/[skill]/recommendations

**Purpose**: Get personalized study recommendations

**Query Parameters**:
- `userId`: string (required)

**Response**:
```typescript
{
  success: boolean;
  data: {
    vocabulary: Array<{
      id: string;
      word: string;
      phonetic: string;
      meaning: string;
      relevanceScore: number;
    }>;
    studyPlan: Array<{
      type: 'practice' | 'vocabulary' | 'review';
      description: string;
      priority: number;
    }>;
  };
  error?: string;
}
```

**Implementation**:
- Analyze user's vocabulary mastery
- Filter vocabulary by skill relevance
- Prioritize words at appropriate difficulty level
- Generate study plan based on gaps
- Return top 5-10 recommendations

## Error Handling

### Error Categories

1. **Validation Errors** (400)
   - Invalid band scores
   - Missing required fields
   - Invalid date formats

2. **Authentication Errors** (401)
   - Missing user ID
   - Invalid session

3. **Not Found Errors** (404)
   - User progress not found
   - Skill data not found

4. **Server Errors** (500)
   - Database connection failures
   - Calculation errors

### Error Response Format

```typescript
{
  success: false;
  error: string;
  details?: any;
}
```

### Client-Side Error Handling

- Display toast notifications for API errors
- Provide fallback UI for missing data
- Retry logic for transient failures
- Graceful degradation for offline scenarios

## Testing Strategy

### Unit Tests

**Band Score Calculator**:
```typescript
describe('calculateProjectedScore', () => {
  it('should project higher score with more practice', () => {
    const result1 = calculateProjectedScore({
      currentScore: 6.0,
      timeHorizon: 12,
      practiceIntensity: 2,
      learningEfficiency: 0.7,
      historicalRate: 0.05
    });

    const result2 = calculateProjectedScore({
      currentScore: 6.0,
      timeHorizon: 12,
      practiceIntensity: 5,
      learningEfficiency: 0.7,
      historicalRate: 0.05
    });

    expect(result2.projectedScore).toBeGreaterThan(result1.projectedScore);
  });

  it('should cap projected score at 9.0', () => {
    const result = calculateProjectedScore({
      currentScore: 8.5,
      timeHorizon: 52,
      practiceIntensity: 7,
      learningEfficiency: 1.0,
      historicalRate: 0.1
    });

    expect(result.projectedScore).toBeLessThanOrEqual(9.0);
  });

  it('should apply diminishing returns at higher bands', () => {
    const lowBandResult = calculateProjectedScore({
      currentScore: 5.0,
      timeHorizon: 12,
      practiceIntensity: 3,
      learningEfficiency: 0.7,
      historicalRate: 0.05
    });

    const highBandResult = calculateProjectedScore({
      currentScore: 8.0,
      timeHorizon: 12,
      practiceIntensity: 3,
      learningEfficiency: 0.7,
      historicalRate: 0.05
    });

    const lowBandImprovement = lowBandResult.projectedScore - 5.0;
    const highBandImprovement = highBandResult.projectedScore - 8.0;

    expect(lowBandImprovement).toBeGreaterThan(highBandImprovement);
  });
});
```

**Learning Efficiency Calculator**:
```typescript
describe('calculateLearningEfficiency', () => {
  it('should return 0.5 for insufficient data', () => {
    const result = calculateLearningEfficiency([], []);
    expect(result).toBe(0.5);
  });

  it('should calculate efficiency from improvements and practice time', () => {
    const result = calculateLearningEfficiency(
      [0.5, 0.5, 0.5], // 1.5 band improvement
      [300, 300, 300]  // 15 hours total
    );
    expect(result).toBeGreaterThan(0);
    expect(result).toBeLessThanOrEqual(1.0);
  });
});
```

**Score Volatility Calculator**:
```typescript
describe('calculateScoreVolatility', () => {
  it('should return 0 for single score', () => {
    const result = calculateScoreVolatility([6.5]);
    expect(result).toBe(0);
  });

  it('should return higher volatility for inconsistent scores', () => {
    const consistent = calculateScoreVolatility([6.0, 6.0, 6.5, 6.0, 6.5]);
    const inconsistent = calculateScoreVolatility([5.0, 7.0, 5.5, 7.5, 6.0]);
    expect(inconsistent).toBeGreaterThan(consistent);
  });
});
```

### Integration Tests

- API endpoint request/response validation
- Database operations (CRUD)
- Repository methods
- End-to-end user flows

### Accessibility Tests

- Keyboard navigation
- Screen reader compatibility
- Color contrast validation
- Focus management

## Performance Optimization

### Server-Side Rendering

- Use Astro components for static content
- Fetch initial data server-side
- Minimize client-side JavaScript

### Database Optimization

- Proper indexing on frequently queried columns
- Limit query results (pagination)
- Use connection pooling
- Cache frequently accessed data

### Client-Side Optimization

- Debounce slider updates (100ms)
- Lazy load chart data
- Use React.memo for expensive components
- Optimize re-renders with proper dependencies

### Asset Optimization

- SVG icons (no image files)
- Inline critical CSS
- Code splitting for React islands
- Minimize bundle size

## Accessibility Features

### Keyboard Navigation

- Tab order follows visual hierarchy
- Slider accessible via arrow keys
- Enter/Space activates buttons
- Escape closes modals

### Screen Reader Support

- ARIA labels for all interactive elements
- ARIA live regions for dynamic updates
- Semantic HTML structure
- Descriptive alt text

### Visual Accessibility

- WCAG AA color contrast (4.5:1)
- Focus indicators (2px outline)
- Sufficient touch targets (44x44px)
- No color-only information

### Dark Mode

- Consistent color palette
- Maintained contrast ratios
- Smooth transitions
- Persistent preference

## Migration Strategy

### Phase 1: Database Setup
1. Create migration files
2. Run migrations on development
3. Seed test data
4. Verify schema

### Phase 2: Backend Implementation
1. Create repositories
2. Implement API endpoints
3. Add validation
4. Write unit tests

### Phase 3: Frontend Components
1. Build Astro components
2. Create React islands
3. Implement calculations
4. Add styling

### Phase 4: Integration
1. Connect components to APIs
2. Test user flows
3. Accessibility audit
4. Performance testing

### Phase 5: Deployment
1. Run migrations on production
2. Deploy application
3. Monitor errors
4. Gather user feedback
