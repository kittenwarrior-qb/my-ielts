# Implementation Plan

- [ ] 1. Database Schema and Migrations
- [ ] 1.1 Create database schema extensions in schema.ts
  - Add userProgress, practiceSessions, vocabularyMastery, and skillScores tables
  - Define proper types, enums, and relationships
  - Add TypeScript type exports
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 8.1, 8.2, 8.3, 8.4_

- [ ] 1.2 Create database migration files
  - Generate migration with drizzle-kit
  - Verify migration SQL
  - Add indexes for performance optimization
  - _Requirements: 8.1, 8.2, 8.3, 12.4_

- [ ] 1.3 Create seed data for testing
  - Add sample user progress data
  - Add sample practice sessions
  - Add sample skill scores
  - Add sample vocabulary mastery records
  - _Requirements: 1.5, 2.4_

- [ ] 2. Repository Layer Implementation
- [ ] 2.1 Create UserProgressRepository
  - Implement getByUserAndSkill method
  - Implement upsert method for creating/updating progress
  - Implement getCurrentBandScore method
  - Implement getTargetBandScore method
  - _Requirements: 8.1, 8.4_

- [ ] 2.2 Create PracticeSessionRepository
  - Implement create method for logging sessions
  - Implement getByUserAndSkill method with date filtering
  - Implement getPracticeStats method for analytics
  - Implement calculatePracticeIntensity method
  - _Requirements: 5.2, 5.3, 5.4, 8.2_

- [ ] 2.3 Create SkillScoreRepository
  - Implement create method for recording scores
  - Implement getScoreHistory method (last 12 weeks)
  - Implement getLatestScore method
  - Implement calculateVolatility method
  - _Requirements: 1.1, 1.2, 6.1, 6.2, 8.1_

- [ ] 2.4 Create VocabularyMasteryRepository
  - Implement upsert method for mastery records
  - Implement getByUserAndSkill method
  - Implement getMasteryStats method
  - Implement getRecommendations method with filtering
  - _Requirements: 4.1, 4.2, 4.3, 4.5_

- [ ] 3. Business Logic Layer
- [ ] 3.1 Create BandScoreCalculator utility
  - Implement calculateProjectedScore function
  - Implement calculateLearningEfficiency function
  - Implement determineConfidence function
  - Add diminishing returns logic
  - _Requirements: 2.1, 2.2, 2.3, 2.5_

- [ ] 3.2 Create AnalyticsEngine utility
  - Implement calculateScoreVolatility function
  - Implement determineRiskLevel function
  - Implement calculateRecentTrend function
  - _Requirements: 1.2, 1.3, 6.4, 6.5_

- [ ] 3.3 Create RecommendationEngine utility
  - Implement generateVocabularyRecommendations function
  - Implement generateStudyPlan function
  - Implement prioritizeRecommendations function
  - Filter vocabulary by skill relevance
  - _Requirements: 4.3, 4.4, 4.5, 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ]* 3.4 Write unit tests for calculation logic
  - Test band score projection with various inputs
  - Test learning efficiency calculation
  - Test score volatility calculation
  - Test risk level determination
  - Test edge cases (no data, extreme values)
  - _Requirements: 2.1, 2.2, 2.3, 2.5_

- [ ] 4. API Endpoints Implementation
- [ ] 4.1 Create POST /api/skills/progress/track endpoint
  - Implement request validation
  - Implement upsert logic using UserProgressRepository
  - Add error handling
  - Return success response with updated data
  - _Requirements: 8.1, 8.4, 8.5_

- [ ] 4.2 Create GET /api/skills/[skill]/analytics endpoint
  - Fetch user progress data
  - Fetch score history
  - Calculate practice statistics
  - Calculate vocabulary statistics
  - Compute volatility and risk level
  - Calculate learning efficiency
  - Return comprehensive analytics response
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 4.1, 4.2, 5.5, 6.1_

- [ ] 4.3 Create POST /api/skills/practice/session endpoint
  - Implement request validation
  - Create practice session record
  - Update practice intensity metrics
  - Return success response
  - _Requirements: 5.1, 5.2, 5.3, 8.2, 8.5_

- [ ] 4.4 Create GET /api/skills/practice/history endpoint
  - Fetch practice sessions with filtering
  - Implement pagination (limit 20)
  - Sort by date descending
  - Return session history
  - _Requirements: 5.4_

- [ ] 4.5 Create GET /api/skills/[skill]/recommendations endpoint
  - Fetch user's vocabulary mastery data
  - Generate vocabulary recommendations
  - Generate study plan recommendations
  - Prioritize by relevance and impact
  - Return recommendations response
  - _Requirements: 4.3, 4.4, 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ]* 4.6 Write integration tests for API endpoints
  - Test request/response validation
  - Test error handling
  - Test database operations
  - Test authentication
  - _Requirements: 8.5_

- [ ] 5. Static Astro Components
- [ ] 5.1 Create SkillDashboard.astro component
  - Fetch initial data server-side
  - Implement layout structure
  - Add loading and error states
  - Pass data to child components
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 9.1, 9.2, 9.3_

- [ ] 5.2 Create PerformanceMetrics.astro component
  - Display current band score with badge
  - Display score volatility meter
  - Display risk indicator with icon
  - Display last updated timestamp
  - Add responsive layout
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 9.1, 9.2, 9.3_

- [ ] 5.3 Create VocabularyMastery.astro component
  - Display total words learned count
  - Display retention rate visualization
  - Add container for VocabularyRecommendations island
  - Add responsive layout
  - _Requirements: 4.1, 4.2, 9.1, 9.2, 9.3_

- [ ] 5.4 Create StudyPlanGenerator.astro component
  - Display personalized study recommendations
  - Show priority indicators
  - Add links to relevant resources
  - Add responsive layout
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 9.1, 9.2, 9.3_

- [ ] 6. Interactive React Island Components
- [ ] 6.1 Create BandScoreProjector.tsx component
  - Implement time horizon slider with range 1-52 weeks
  - Add milestone markers (4, 12, 24, 48 weeks)
  - Implement real-time projection calculation
  - Display projected score with confidence indicator
  - Add debouncing (100ms) for slider updates
  - Implement keyboard navigation support
  - Add ARIA labels for accessibility
  - _Requirements: 2.1, 2.2, 2.3, 2.5, 3.1, 3.2, 3.3, 3.4, 3.5, 10.1, 10.2, 10.4, 12.3_

- [ ] 6.2 Create ProgressChart.tsx component
  - Implement SVG-based line chart
  - Display last 12 weeks of score history
  - Add hover tooltips with exact values
  - Add trend indicators (up/down arrows)
  - Implement color-coded performance zones
  - Add responsive scaling
  - Support dark mode colors
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 9.1, 9.2, 9.3, 11.1, 11.2, 11.3_

- [ ] 6.3 Create PracticeSessionTracker.tsx component
  - Implement form with duration and words practiced inputs
  - Add form validation
  - Implement API call to log session
  - Add optimistic UI updates
  - Display toast notifications for success/error
  - Show last 20 practice sessions
  - Calculate and display practice intensity
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 8.2, 8.5, 9.4_

- [ ] 6.4 Create VocabularyRecommendations.tsx component
  - Fetch recommendations from API
  - Display 5-10 vocabulary words
  - Show word definitions and phonetics
  - Add links to vocabulary detail pages
  - Implement loading skeleton states
  - Add error handling
  - _Requirements: 4.3, 4.4, 4.5, 7.2, 7.3_

- [ ] 6.5 Add TypeScript types for React components
  - Define prop interfaces for all components
  - Define state interfaces
  - Define API response types
  - Export shared types
  - _Requirements: All component requirements_

- [ ]* 6.6 Write component unit tests
  - Test BandScoreProjector calculation logic
  - Test ProgressChart rendering
  - Test PracticeSessionTracker form validation
  - Test VocabularyRecommendations data fetching
  - _Requirements: 2.1, 2.2, 2.3, 5.1, 5.2, 5.3_

- [ ] 7. Update Skill Pages
- [ ] 7.1 Update listening.astro page
  - Replace placeholder content with SkillDashboard
  - Pass skill="listening" prop
  - Fetch initial data server-side
  - Add error boundary
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 12.1, 12.2, 12.5_

- [ ] 7.2 Update reading.astro page
  - Replace placeholder content with SkillDashboard
  - Pass skill="reading" prop
  - Fetch initial data server-side
  - Add error boundary
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 12.1, 12.2, 12.5_

- [ ] 7.3 Update speaking.astro page
  - Replace placeholder content with SkillDashboard
  - Pass skill="speaking" prop
  - Fetch initial data server-side
  - Add error boundary
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 12.1, 12.2, 12.5_

- [ ] 7.4 Update writing.astro page
  - Replace placeholder content with SkillDashboard
  - Pass skill="writing" prop
  - Fetch initial data server-side
  - Add error boundary
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 12.1, 12.2, 12.5_

- [ ] 8. Styling and Theming
- [ ] 8.1 Create dashboard-specific styles
  - Add fintech-inspired card styles
  - Create progress bar components
  - Add badge variants for risk levels
  - Create chart color palettes
  - _Requirements: 1.4, 9.1, 9.2, 9.3, 10.3_

- [ ] 8.2 Implement dark mode support
  - Add dark mode color variants
  - Ensure contrast ratios meet WCAG AA
  - Update chart colors for dark mode
  - Test theme toggle functionality
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

- [ ] 8.3 Add responsive design styles
  - Implement mobile layout (single column)
  - Implement tablet layout (two columns)
  - Implement desktop layout (multi-column)
  - Ensure touch targets are 44x44px minimum
  - Test on various screen sizes
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [ ] 8.4 Implement accessibility features
  - Add visible focus indicators (2px outline)
  - Add ARIA labels to all interactive elements
  - Ensure keyboard navigation works
  - Add skip links where appropriate
  - Test with screen reader
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [ ] 9. Integration and Testing
- [ ] 9.1 Connect components to API endpoints
  - Wire BandScoreProjector to analytics API
  - Wire ProgressChart to score history API
  - Wire PracticeSessionTracker to session API
  - Wire VocabularyRecommendations to recommendations API
  - Add error handling for all API calls
  - _Requirements: 2.1, 2.2, 4.3, 5.2, 5.3, 6.1, 8.5_

- [ ] 9.2 Test complete user flows
  - Test viewing dashboard with existing data
  - Test viewing dashboard with no data
  - Test logging practice sessions
  - Test adjusting time horizon slider
  - Test vocabulary recommendations
  - _Requirements: All requirements_

- [ ] 9.3 Run accessibility audit
  - Test keyboard navigation
  - Test screen reader compatibility
  - Verify color contrast ratios
  - Check focus management
  - Validate ARIA attributes
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [ ] 9.4 Run performance testing
  - Measure Lighthouse score (target > 90)
  - Test Core Web Vitals
  - Verify slider responsiveness (< 100ms)
  - Check database query performance (< 200ms)
  - Optimize bundle size
  - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

- [ ]* 9.5 Fix any issues found during testing
  - Address accessibility issues
  - Fix performance bottlenecks
  - Resolve UI bugs
  - Improve error handling
  - _Requirements: All requirements_

- [ ] 10. Documentation and Deployment
- [ ] 10.1 Run database migrations
  - Execute migrations on development database
  - Verify schema changes
  - Run seed data script
  - Test rollback procedure
  - _Requirements: 8.1, 8.2, 8.3_

- [ ] 10.2 Final integration verification
  - Test all four skill pages
  - Verify data persistence
  - Test error scenarios
  - Verify dark mode across all components
  - Test responsive layouts on real devices
  - _Requirements: All requirements_

- [ ]* 10.3 Create user documentation
  - Document how to use the dashboard
  - Explain band score projection
  - Describe practice session tracking
  - Provide vocabulary recommendation guide
  - _Requirements: 1.1, 2.1, 4.1, 5.1, 7.1_
