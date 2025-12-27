# Design Document

## Overview

This document outlines the comprehensive UI/UX redesign of the my IELTS application, transforming it from a corporate blue-themed interface into a vibrant, Duolingo-inspired learning platform with IELTS red as the primary brand color. The redesign focuses on creating an engaging, gamified experience that motivates learners while maintaining accessibility and performance standards.

### Design Philosophy

1. **Playful Yet Professional**: Balance fun, engaging elements with educational credibility
2. **Color Psychology**: Use IELTS red to convey energy, passion, and urgency in learning
3. **Gamification**: Incorporate game-like elements to increase motivation and engagement
4. **Consistency**: Maintain uniform styling across all components and pages
5. **Accessibility First**: Ensure all design choices meet WCAG AA standards
6. **Performance**: Keep animations smooth and bundle sizes minimal

## Color System

### Primary Color Palette (IELTS Red)

```typescript
const ieltsRed = {
  50: '#FEF2F2',   // Lightest - backgrounds
  100: '#FEE2E2',  // Very light - hover states
  200: '#FECACA',  // Light - borders
  300: '#FCA5A5',  // Medium light
  400: '#F87171',  // Medium
  500: '#E4002B',  // IELTS Brand Red (Primary)
  600: '#DC2626',  // Medium dark - hover
  700: '#B91C1C',  // Dark - active states
  800: '#991B1B',  // Very dark
  900: '#7F1D1D',  // Darkest
};
```

### Secondary Color Palette (Complementary Teal)

```typescript
const complementaryTeal = {
  50: '#F0FDFA',
  100: '#CCFBF1',
  200: '#99F6E4',
  300: '#5EEAD4',
  400: '#2DD4BF',
  500: '#14B8A6',  // Secondary color
  600: '#0D9488',
  700: '#0F766E',
  800: '#115E59',
  900: '#134E4A',
};
```

### Semantic Colors

```typescript
const semanticColors = {
  success: {
    light: '#86EFAC',   // Green 300
    DEFAULT: '#22C55E', // Green 500
    dark: '#16A34A',    // Green 600
  },
  warning: {
    light: '#FDE047',   // Yellow 300
    DEFAULT: '#EAB308', // Yellow 500
    dark: '#CA8A04',    // Yellow 600
  },
  danger: {
    light: '#FCA5A5',   // Red 300
    DEFAULT: '#EF4444', // Red 500
    dark: '#DC2626',    // Red 600
  },
  info: {
    light: '#93C5FD',   // Blue 300
    DEFAULT: '#3B82F6', // Blue 500
    dark: '#2563EB',    // Blue 600
  },
};
```

### Skill-Specific Colors

```typescript
const skillColors = {
  listening: {
    bg: '#DBEAFE',      // Blue 100
    text: '#1E40AF',    // Blue 800
    icon: '#3B82F6',    // Blue 500
  },
  reading: {
    bg: '#D1FAE5',      // Green 100
    text: '#065F46',    // Green 800
    icon: '#10B981',    // Green 500
  },
  speaking: {
    bg: '#FED7AA',      // Orange 100
    text: '#9A3412',    // Orange 800
    icon: '#F97316',    // Orange 500
  },
  writing: {
    bg: '#E9D5FF',      // Purple 100
    text: '#6B21A8',    // Purple 800
    icon: '#A855F7',    // Purple 500
  },
};
```

### Neutral Colors

```typescript
const neutralColors = {
  50: '#F8FAFC',   // Lightest background
  100: '#F1F5F9',  // Light background
  200: '#E2E8F0',  // Borders
  300: '#CBD5E1',  // Disabled
  400: '#94A3B8',  // Placeholder
  500: '#64748B',  // Secondary text
  600: '#475569',  // Body text
  700: '#334155',  // Headings
  800: '#1E293B',  // Dark headings
  900: '#0F172A',  // Darkest - dark mode bg
};
```

## Typography

### Font Family

```css
font-family: 'Nunito', 'Inter', system-ui, -apple-system, sans-serif;
```

**Rationale**: Nunito is a rounded, friendly sans-serif similar to Duolingo's typography. Inter serves as fallback for better system compatibility.

### Font Scale

```typescript
const fontSizes = {
  xs: '0.75rem',    // 12px
  sm: '0.875rem',   // 14px
  base: '1rem',     // 16px
  lg: '1.125rem',   // 18px
  xl: '1.25rem',    // 20px
  '2xl': '1.5rem',  // 24px
  '3xl': '1.875rem',// 30px
  '4xl': '2.25rem', // 36px
  '5xl': '3rem',    // 48px
};

const fontWeights = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
};
```

### Typography Hierarchy

```typescript
const typography = {
  h1: {
    fontSize: '3rem',      // 48px
    fontWeight: 800,
    lineHeight: 1.2,
    letterSpacing: '-0.02em',
  },
  h2: {
    fontSize: '2.25rem',   // 36px
    fontWeight: 700,
    lineHeight: 1.3,
    letterSpacing: '-0.01em',
  },
  h3: {
    fontSize: '1.875rem',  // 30px
    fontWeight: 700,
    lineHeight: 1.4,
  },
  h4: {
    fontSize: '1.5rem',    // 24px
    fontWeight: 600,
    lineHeight: 1.5,
  },
  body: {
    fontSize: '1rem',      // 16px
    fontWeight: 400,
    lineHeight: 1.6,
  },
  bodyLarge: {
    fontSize: '1.125rem',  // 18px
    fontWeight: 400,
    lineHeight: 1.7,
  },
  caption: {
    fontSize: '0.875rem',  // 14px
    fontWeight: 400,
    lineHeight: 1.5,
  },
};
```

## Spacing System

### Base Unit: 4px

```typescript
const spacing = {
  0: '0',
  1: '0.25rem',  // 4px
  2: '0.5rem',   // 8px
  3: '0.75rem',  // 12px
  4: '1rem',     // 16px
  5: '1.25rem',  // 20px
  6: '1.5rem',   // 24px
  8: '2rem',     // 32px
  10: '2.5rem',  // 40px
  12: '3rem',    // 48px
  16: '4rem',    // 64px
  20: '5rem',    // 80px
  24: '6rem',    // 96px
};
```

## Border Radius

### Duolingo-Inspired Rounded Corners

```typescript
const borderRadius = {
  none: '0',
  sm: '0.375rem',   // 6px - small elements
  DEFAULT: '0.5rem', // 8px - buttons
  md: '0.75rem',    // 12px - cards
  lg: '1rem',       // 16px - large cards
  xl: '1.5rem',     // 24px - hero sections
  '2xl': '2rem',    // 32px - special elements
  full: '9999px',   // circular
};
```

## Component Specifications

### Button Component

#### Variants

```typescript
interface ButtonVariants {
  primary: {
    bg: 'bg-ielts-500',
    hover: 'hover:bg-ielts-600',
    active: 'active:bg-ielts-700',
    text: 'text-white',
    shadow: 'shadow-md hover:shadow-lg',
    transform: 'hover:scale-105 active:scale-95',
  };
  secondary: {
    bg: 'bg-teal-500',
    hover: 'hover:bg-teal-600',
    active: 'active:bg-teal-700',
    text: 'text-white',
    shadow: 'shadow-md hover:shadow-lg',
    transform: 'hover:scale-105 active:scale-95',
  };
  success: {
    bg: 'bg-green-500',
    hover: 'hover:bg-green-600',
    active: 'active:bg-green-700',
    text: 'text-white',
    shadow: 'shadow-md hover:shadow-lg',
    transform: 'hover:scale-105 active:scale-95',
  };
  danger: {
    bg: 'bg-red-500',
    hover: 'hover:bg-red-600',
    active: 'active:bg-red-700',
    text: 'text-white',
    shadow: 'shadow-md hover:shadow-lg',
    transform: 'hover:scale-105 active:scale-95',
  };
  ghost: {
    bg: 'bg-transparent',
    hover: 'hover:bg-gray-100 dark:hover:bg-gray-800',
    active: 'active:bg-gray-200 dark:active:bg-gray-700',
    text: 'text-gray-700 dark:text-gray-300',
    shadow: 'shadow-none',
    transform: 'hover:scale-105 active:scale-95',
  };
  outline: {
    bg: 'bg-transparent',
    border: 'border-2 border-ielts-500',
    hover: 'hover:bg-ielts-50 dark:hover:bg-ielts-900/20',
    active: 'active:bg-ielts-100 dark:active:bg-ielts-900/30',
    text: 'text-ielts-600 dark:text-ielts-400',
    shadow: 'shadow-none',
    transform: 'hover:scale-105 active:scale-95',
  };
}
```

#### Sizes

```typescript
interface ButtonSizes {
  sm: {
    padding: 'px-3 py-1.5',
    fontSize: 'text-sm',
    borderRadius: 'rounded',
  };
  md: {
    padding: 'px-4 py-2.5',
    fontSize: 'text-base',
    borderRadius: 'rounded-lg',
  };
  lg: {
    padding: 'px-6 py-3.5',
    fontSize: 'text-lg',
    borderRadius: 'rounded-lg',
  };
}
```

#### Animation

```css
.button {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.button:hover {
  transform: scale(1.05);
}

.button:active {
  transform: scale(0.95);
}
```

### Card Component

#### Base Styles

```typescript
const cardStyles = {
  base: 'bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700',
  padding: 'p-6',
  hover: 'hover:shadow-lg hover:-translate-y-1 transition-all duration-200',
  interactive: 'cursor-pointer',
};
```

#### Variants

```typescript
interface CardVariants {
  default: {
    bg: 'bg-white dark:bg-gray-800',
    border: 'border-gray-200 dark:border-gray-700',
    shadow: 'shadow-sm hover:shadow-lg',
  };
  colored: {
    // For skill cards
    listening: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20',
    reading: 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20',
    speaking: 'bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20',
    writing: 'bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20',
  };
  elevated: {
    shadow: 'shadow-xl',
    border: 'border-none',
  };
}
```

### Badge Component

#### Styles

```typescript
interface BadgeVariants {
  primary: {
    bg: 'bg-ielts-100 dark:bg-ielts-900/30',
    text: 'text-ielts-700 dark:text-ielts-300',
    border: 'border border-ielts-200 dark:border-ielts-800',
  };
  success: {
    bg: 'bg-green-100 dark:bg-green-900/30',
    text: 'text-green-700 dark:text-green-300',
    border: 'border border-green-200 dark:border-green-800',
  };
  warning: {
    bg: 'bg-yellow-100 dark:bg-yellow-900/30',
    text: 'text-yellow-700 dark:text-yellow-300',
    border: 'border border-yellow-200 dark:border-yellow-800',
  };
  danger: {
    bg: 'bg-red-100 dark:bg-red-900/30',
    text: 'text-red-700 dark:text-red-300',
    border: 'border border-red-200 dark:border-red-800',
  };
}
```

### Progress Bar Component

#### Circular Progress (Duolingo Style)

```typescript
interface CircularProgressProps {
  value: number;      // 0-100
  size: 'sm' | 'md' | 'lg';
  color: 'primary' | 'success' | 'warning';
  showLabel: boolean;
}

const sizes = {
  sm: { width: 60, strokeWidth: 4 },
  md: { width: 100, strokeWidth: 6 },
  lg: { width: 150, strokeWidth: 8 },
};
```

#### Linear Progress

```typescript
interface LinearProgressProps {
  value: number;      // 0-100
  color: 'primary' | 'success' | 'warning';
  height: 'sm' | 'md' | 'lg';
  showLabel: boolean;
  animated: boolean;
}

const heights = {
  sm: 'h-2',
  md: 'h-4',
  lg: 'h-6',
};
```

## Page Layouts

### Home Page Redesign

#### Hero Section

```typescript
interface HeroSection {
  layout: 'centered';
  background: 'gradient-to-br from-ielts-50 to-white dark:from-gray-900 dark:to-gray-800';
  padding: 'py-16 px-4';
  content: {
    title: {
      text: 'my IELTS Vocabulary',
      highlight: 'IELTS' in red,
      fontSize: '5xl',
      fontWeight: 'extrabold',
    };
    subtitle: {
      text: 'Học từ vựng IELTS hiệu quả với hệ thống quản lý từ vựng, idioms và phrases',
      fontSize: 'xl',
      color: 'gray-600',
    };
  };
}
```

#### Statistics Cards

```typescript
interface StatsCard {
  layout: 'grid-3-columns';
  gap: '6';
  card: {
    padding: '8';
    borderRadius: 'xl';
    shadow: 'lg';
    hover: 'lift-effect';
    content: {
      number: {
        fontSize: '5xl',
        fontWeight: 'extrabold',
        color: 'ielts-600',
      };
      label: {
        fontSize: 'xl',
        fontWeight: 'semibold',
      };
      description: {
        fontSize: 'base',
        color: 'gray-600',
      };
      icon: {
        size: '12',
        color: 'ielts-500',
        position: 'top-right',
      };
    };
  };
}
```

#### Skill Cards

```typescript
interface SkillCard {
  layout: 'grid-4-columns';
  gap: '4';
  card: {
    padding: '6';
    borderRadius: 'xl';
    background: 'gradient' (skill-specific),
    hover: 'lift-and-glow';
    content: {
      icon: {
        size: '16',
        color: 'skill-specific',
        position: 'center-top',
      };
      title: {
        fontSize: '2xl',
        fontWeight: 'bold',
        align: 'center',
      };
      progress: {
        type: 'circular',
        size: 'md',
        position: 'bottom',
      };
    };
  };
}
```

### Skill Pages Redesign

#### Page Header

```typescript
interface SkillPageHeader {
  background: 'gradient-to-r from-skill-color-light to-skill-color',
  padding: 'py-12 px-4',
  content: {
    icon: {
      size: '20',
      color: 'white',
      position: 'center',
    };
    title: {
      fontSize: '4xl',
      fontWeight: 'extrabold',
      color: 'white',
    };
    subtitle: {
      fontSize: 'lg',
      color: 'white/90',
    };
  };
}
```

#### Content Cards

```typescript
interface ContentCard {
  borderRadius: 'xl',
  padding: '6',
  shadow: 'md',
  hover: 'shadow-xl transform -translate-y-1',
  icon: {
    size: '8',
    color: 'skill-color',
    position: 'left-of-title',
  };
  title: {
    fontSize: 'xl',
    fontWeight: 'bold',
  };
  list: {
    spacing: '3',
    bulletStyle: 'custom-icon',
    bulletColor: 'skill-color',
  };
}
```

## Animations

### Micro-interactions

```css
/* Button Press */
@keyframes button-press {
  0% { transform: scale(1); }
  50% { transform: scale(0.95); }
  100% { transform: scale(1); }
}

/* Card Lift */
@keyframes card-lift {
  from {
    transform: translateY(0);
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }
  to {
    transform: translateY(-4px);
    box-shadow: 0 10px 25px rgba(0,0,0,0.15);
  }
}

/* Fade In Up */
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Scale In */
@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Bounce */
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
```

### Page Transitions

```typescript
const pageTransitions = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    duration: 300,
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    duration: 400,
  },
  staggerChildren: {
    staggerDelay: 100,
    animation: 'slideUp',
  },
};
```

## Icon System

### Skill Icons

```typescript
const skillIcons = {
  listening: 'Headphones',
  reading: 'BookOpen',
  speaking: 'MessageCircle',
  writing: 'PenTool',
};
```

### Action Icons

```typescript
const actionIcons = {
  add: 'Plus',
  edit: 'Edit',
  delete: 'Trash2',
  save: 'Save',
  cancel: 'X',
  search: 'Search',
  filter: 'Filter',
  sort: 'ArrowUpDown',
};
```

### Status Icons

```typescript
const statusIcons = {
  success: 'CheckCircle',
  warning: 'AlertTriangle',
  error: 'XCircle',
  info: 'Info',
  loading: 'Loader',
};
```

### Gamification Icons

```typescript
const gamificationIcons = {
  trophy: 'Trophy',
  fire: 'Flame',
  star: 'Star',
  target: 'Target',
  award: 'Award',
  medal: 'Medal',
};
```

## Dark Mode

### Background Colors

```typescript
const darkModeBackgrounds = {
  primary: '#0F172A',      // Main background
  secondary: '#1E293B',    // Card background
  tertiary: '#334155',     // Elevated elements
  hover: '#475569',        // Hover states
};
```

### Text Colors

```typescript
const darkModeText = {
  primary: '#F1F5F9',      // Main text
  secondary: '#CBD5E1',    // Secondary text
  tertiary: '#94A3B8',     // Muted text
  disabled: '#64748B',     // Disabled text
};
```

### Color Adjustments

```typescript
const darkModeAdjustments = {
  ieltsRed: {
    light: '#E4002B',      // Too bright for dark mode
    dark: '#F87171',       // Adjusted for dark backgrounds
  },
  shadows: {
    light: 'rgba(0, 0, 0, 0.1)',
    dark: 'rgba(0, 0, 0, 0.5)',  // Stronger shadows
  },
  borders: {
    light: '#E2E8F0',
    dark: '#334155',       // Subtle borders
  },
};
```

## Accessibility

### Focus States

```css
.focus-visible {
  outline: 2px solid theme('colors.ielts.500');
  outline-offset: 2px;
  border-radius: theme('borderRadius.DEFAULT');
}

.dark .focus-visible {
  outline-color: theme('colors.ielts.400');
}
```

### Color Contrast

All color combinations must meet WCAG AA standards:
- Normal text: 4.5:1 minimum
- Large text (18px+): 3:1 minimum
- UI components: 3:1 minimum

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Implementation Strategy

### Phase 1: Foundation
1. Update Tailwind config with new color system
2. Add Nunito font to project
3. Update global CSS with new base styles
4. Create utility classes for common patterns

### Phase 2: Component Updates
1. Update Button component with new variants
2. Update Card component with new styles
3. Create new Badge component
4. Create Progress components (circular and linear)
5. Update existing UI components

### Phase 3: Page Redesigns
1. Redesign home page
2. Update skill pages (Listening, Reading, Speaking, Writing)
3. Update vocabulary pages
4. Update idioms and phrases pages

### Phase 4: Polish
1. Add animations and transitions
2. Implement dark mode refinements
3. Test accessibility
4. Optimize performance

### Phase 5: Testing
1. Cross-browser testing
2. Responsive testing
3. Accessibility audit
4. Performance testing
5. User feedback collection
