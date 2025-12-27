# Implementation Plan

- [ ] 1. Foundation Setup
- [x] 1.1 Update Tailwind configuration with IELTS red color system


  - Replace primary blue colors with IELTS red scale (50-900)
  - Add complementary teal as secondary color
  - Add semantic colors (success, warning, danger, info)
  - Add skill-specific color palettes
  - Update neutral gray scale
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 10.1, 10.2, 10.3, 10.4, 10.5_

- [x] 1.2 Add Nunito font to the project


  - Update Layout.astro to include Nunito from Google Fonts
  - Set Nunito as primary font family in Tailwind config
  - Keep Inter as fallback font
  - _Requirements: 6.5_



- [ ] 1.3 Update global CSS with Duolingo-inspired styles
  - Increase border-radius values for rounded design
  - Update button base styles with new animations
  - Update card base styles with hover effects
  - Add utility classes for common patterns
  - Add animation keyframes for micro-interactions

  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 15.1, 15.2, 15.3, 15.4, 15.5_

- [ ] 1.4 Update spacing and typography scales
  - Implement 4px base spacing system
  - Update font size scale
  - Update font weight scale
  - Update line-height values for better readability


  - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [ ] 2. UI Component Updates
- [ ] 2.1 Update Button component with new variants and styles
  - Add primary variant with IELTS red
  - Add secondary variant with teal
  - Add success, danger, ghost, and outline variants
  - Implement hover scale animation (1.05)
  - Implement active scale animation (0.95)


  - Add shadow effects for depth
  - Update size variants (sm, md, lg)
  - Ensure all variants work in dark mode
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 11.1, 11.2_

- [ ] 2.2 Update Card component with Duolingo-style design
  - Increase border-radius to 12px (rounded-xl)


  - Add hover lift effect (translateY -4px)
  - Add shadow transition on hover
  - Create colored variant for skill cards
  - Create elevated variant with stronger shadow
  - Ensure dark mode compatibility
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 14.1, 14.2, 14.3_

- [ ] 2.3 Create new Badge component
  - Implement primary, success, warning, and danger variants
  - Add rounded-full style for pill badges
  - Add icon support
  - Implement size variants (sm, md, lg)
  - Ensure proper contrast in dark mode
  - _Requirements: 5.2, 10.3, 14.4_

- [ ] 2.4 Create CircularProgress component
  - Implement SVG-based circular progress indicator
  - Add size variants (sm, md, lg)
  - Add color variants (primary, success, warning)
  - Add percentage label option
  - Add smooth animation for value changes
  - _Requirements: 5.1, 5.3_

- [ ] 2.5 Create LinearProgress component
  - Implement linear progress bar
  - Add height variants (sm, md, lg)
  - Add color variants matching circular progress
  - Add animated stripe option
  - Add label option
  - _Requirements: 5.1, 5.3_

- [ ] 2.6 Update Input component with new styling
  - Increase border-radius to 8px
  - Update focus ring color to IELTS red
  - Add icon support (left and right)
  - Improve dark mode styling
  - _Requirements: 1.1, 1.5, 14.1, 14.3_

- [ ] 2.7 Update Select component with new styling
  - Match Input component styling
  - Update dropdown styling
  - Add custom arrow icon
  - Improve dark mode styling
  - _Requirements: 1.1, 1.5, 14.1, 14.3_

- [ ] 2.8 Update Modal component with backdrop blur
  - Add backdrop blur effect
  - Update modal border-radius to 16px
  - Add fade-in animation
  - Update close button styling
  - Improve dark mode styling
  - _Requirements: 15.4, 14.1, 14.3_

- [x] 2.9 Update Toast component with new colors


  - Update success toast to use green
  - Update error toast to use red
  - Update warning toast to use yellow
  - Update info toast to use blue
  - Add icons to toasts
  - Improve animations
  - _Requirements: 10.3, 11.4, 11.5, 12.3_


- [ ] 3. Home Page Redesign
- [ ] 3.1 Create hero section with gradient background
  - Implement gradient from IELTS red-50 to white
  - Center-align content
  - Make "IELTS" text red in title
  - Update subtitle styling
  - Add fade-in animation on page load

  - Ensure responsive layout
  - _Requirements: 7.1, 7.4, 7.5, 15.1, 13.1, 13.4_

- [ ] 3.2 Redesign statistics cards with large numbers
  - Use Card component with elevated variant
  - Display numbers in 5xl font size with extrabold weight
  - Add IELTS red color to numbers
  - Add icons to top-right corner

  - Implement hover lift effect
  - Add staggered fade-in animation
  - _Requirements: 7.2, 7.4, 5.3, 12.1, 15.2_

- [x] 3.3 Redesign skill cards with gradients and icons


  - Create gradient backgrounds for each skill
  - Add large centered icons (Headphones, BookOpen, MessageCircle, PenTool)
  - Use skill-specific colors
  - Add circular progress indicator
  - Implement hover glow effect
  - Add bounce animation on hover
  - _Requirements: 7.3, 7.4, 12.2, 15.3, 15.5_

- [ ] 3.4 Update grid layouts and spacing
  - Use consistent gap spacing (6 for stats, 4 for skills)
  - Ensure responsive breakpoints (1 col mobile, 2 col tablet, 3-4 col desktop)
  - Add proper padding and margins
  - _Requirements: 7.5, 13.1, 13.2, 13.3_

- [ ] 3.5 Replace all anchor tags styled as buttons with Button component
  - Find all <a> tags with btn classes
  - Replace with Button component
  - Use appropriate variant (primary, secondary)
  - Maintain href functionality
  - _Requirements: 3.1, 3.2_

- [ ] 4. Skill Pages Redesign
- [ ] 4.1 Create colorful page headers for each skill
  - Implement gradient backgrounds (skill-specific colors)
  - Add large skill icon at center
  - Style title in white with 4xl font
  - Style subtitle in white/90
  - Add proper padding (py-12)
  - _Requirements: 8.1, 8.5, 12.2_

- [ ] 4.2 Update Listening page with new design
  - Replace placeholder with colorful header (blue theme)
  - Update tip cards with icons
  - Replace button with Button component
  - Add fade-in animations
  - Ensure responsive layout
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 3.1, 13.1_

- [ ] 4.3 Update Reading page with new design
  - Replace placeholder with colorful header (green theme)
  - Update tip cards with icons
  - Replace button with Button component
  - Add fade-in animations
  - Ensure responsive layout
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 3.1, 13.1_

- [ ] 4.4 Update Speaking page with new design
  - Replace placeholder with colorful header (orange theme)
  - Update tip cards with icons
  - Replace buttons with Button components
  - Add fade-in animations
  - Ensure responsive layout
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 3.1, 13.1_

- [ ] 4.5 Update Writing page with new design
  - Replace placeholder with colorful header (purple theme)
  - Update tip cards with icons
  - Replace buttons with Button components
  - Add fade-in animations
  - Ensure responsive layout
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 3.1, 13.1_

- [ ] 5. Navigation and Header Update
- [ ] 5.1 Update Header component with IELTS red branding
  - Make logo/brand name red
  - Update active link color to IELTS red
  - Add hover effects to navigation links
  - Update dark mode toggle button styling
  - Ensure responsive mobile menu
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [ ] 5.2 Update Footer component styling
  - Match new color scheme
  - Update link colors
  - Ensure dark mode compatibility
  - _Requirements: 1.1, 14.1_

- [ ] 6. Vocabulary Pages Update
- [ ] 6.1 Update vocabulary list page
  - Replace buttons with Button components
  - Update card styling with new design
  - Add hover effects
  - Update badge colors
  - Ensure responsive layout
  - _Requirements: 3.1, 4.1, 4.2, 13.1_

- [ ] 6.2 Update vocabulary detail page
  - Update card styling
  - Replace buttons with Button components
  - Add colored badges for word types
  - Update audio player button
  - Improve dark mode styling
  - _Requirements: 3.1, 4.1, 4.2, 14.1_

- [ ] 6.3 Update vocabulary filter UI
  - Replace select elements with Select components
  - Update filter button styling
  - Add clear filters button
  - Improve mobile layout
  - _Requirements: 3.1, 13.1, 13.2_

- [ ] 7. Idioms and Phrases Pages Update
- [ ] 7.1 Update idioms list page
  - Replace buttons with Button components
  - Update card styling
  - Add hover effects
  - Ensure responsive layout
  - _Requirements: 3.1, 4.1, 4.2, 13.1_

- [ ] 7.2 Update idioms detail page
  - Update card styling
  - Replace buttons with Button components
  - Improve dark mode styling
  - _Requirements: 3.1, 4.1, 14.1_

- [ ] 7.3 Update phrases list page
  - Replace buttons with Button components
  - Update card styling
  - Add category badges with new colors
  - Ensure responsive layout
  - _Requirements: 3.1, 4.1, 4.2, 13.1_

- [ ] 7.4 Update phrases detail page
  - Update card styling
  - Replace buttons with Button components
  - Improve dark mode styling
  - _Requirements: 3.1, 4.1, 14.1_

- [ ] 8. Admin Pages Update
- [ ] 8.1 Update admin dashboard
  - Replace buttons with Button components
  - Update card styling
  - Add statistics with large numbers
  - Update table styling
  - _Requirements: 3.1, 4.1, 5.3_

- [ ] 8.2 Update admin forms
  - Replace buttons with Button components
  - Update input styling
  - Update select styling
  - Add proper validation feedback
  - _Requirements: 3.1, 11.4, 11.5_

- [ ] 8.3 Update admin vocabulary management
  - Replace all buttons with Button components
  - Update modal styling
  - Update table styling
  - Add loading states
  - _Requirements: 3.1, 3.4, 11.3_

- [ ] 9. Dark Mode Refinement
- [ ] 9.1 Update dark mode background colors
  - Use darker primary background (#0F172A)
  - Update card backgrounds (#1E293B)
  - Update elevated element backgrounds (#334155)
  - Test all pages in dark mode
  - _Requirements: 14.1, 14.2, 14.3_

- [ ] 9.2 Adjust IELTS red for dark mode
  - Use lighter shade (#F87171) for better visibility
  - Update all primary color usages in dark mode
  - Test contrast ratios
  - _Requirements: 14.2, 14.4_

- [ ] 9.3 Update shadows for dark mode
  - Use stronger shadows (rgba(0,0,0,0.5))
  - Update all shadow utilities
  - Test depth perception
  - _Requirements: 14.3_

- [ ] 9.4 Update borders for dark mode
  - Use subtle borders (#334155)
  - Update all border utilities
  - Test visual separation
  - _Requirements: 14.3_

- [ ] 9.5 Test theme toggle transition
  - Ensure smooth transition without flashing
  - Test on all pages
  - Fix any jarring color changes
  - _Requirements: 14.5_

- [ ] 10. Animations and Micro-interactions
- [ ] 10.1 Implement button press animation
  - Add scale-down on active state
  - Add scale-up on hover state
  - Test on all button variants
  - _Requirements: 11.1, 15.3_

- [ ] 10.2 Implement card lift animation
  - Add translateY on hover
  - Add shadow transition
  - Test on all card types
  - _Requirements: 11.2, 15.2_

- [ ] 10.3 Implement page load animations
  - Add fade-in for main content
  - Add staggered animations for card grids
  - Test performance impact
  - _Requirements: 15.1, 15.2_

- [ ] 10.4 Implement modal animations
  - Add backdrop blur and fade-in
  - Add scale-in for modal content
  - Test smooth opening and closing
  - _Requirements: 15.4_

- [ ] 10.5 Add prefers-reduced-motion support
  - Disable animations for users who prefer reduced motion
  - Test with system settings
  - Ensure functionality without animations
  - _Requirements: 15.5_

- [ ] 11. Accessibility Improvements
- [ ] 11.1 Update focus states for all interactive elements
  - Add 2px outline in IELTS red
  - Add 2px outline offset
  - Test keyboard navigation
  - Ensure visible focus indicators
  - _Requirements: 10.1, 10.2_

- [ ] 11.2 Add ARIA labels to icon-only buttons
  - Add aria-label to all icon buttons
  - Add aria-hidden to decorative icons
  - Test with screen reader
  - _Requirements: 10.2, 12.4_

- [ ] 11.3 Ensure proper heading hierarchy
  - Verify h1-h6 usage on all pages
  - Fix any skipped heading levels
  - Test with screen reader
  - _Requirements: 6.1_

- [ ] 11.4 Test color contrast ratios
  - Test all text/background combinations
  - Ensure WCAG AA compliance (4.5:1 for normal text)
  - Fix any failing combinations
  - _Requirements: 1.5, 10.3, 10.5_

- [ ] 11.5 Ensure touch targets are 44x44px minimum
  - Measure all buttons and interactive elements
  - Increase size where needed
  - Test on mobile devices
  - _Requirements: 13.2_

- [ ] 12. Responsive Design Testing
- [ ] 12.1 Test on mobile devices (320px - 767px)
  - Test all pages on small screens
  - Verify single-column layouts
  - Test touch interactions
  - Fix any layout issues
  - _Requirements: 13.1, 13.2_

- [ ] 12.2 Test on tablets (768px - 1023px)
  - Test all pages on medium screens
  - Verify 2-column layouts
  - Test touch interactions
  - Fix any layout issues
  - _Requirements: 13.3_

- [ ] 12.3 Test on desktops (1024px+)
  - Test all pages on large screens
  - Verify multi-column layouts
  - Test hover interactions
  - Fix any layout issues
  - _Requirements: 13.3_

- [ ] 12.4 Test layout transitions
  - Test smooth transitions between breakpoints
  - Verify no content jumping
  - Test on various screen sizes
  - _Requirements: 13.4_

- [ ] 13. Performance Optimization
- [ ] 13.1 Optimize animation performance
  - Use transform and opacity for animations
  - Avoid animating layout properties
  - Test frame rates
  - _Requirements: 15.1, 15.2, 15.3_

- [ ] 13.2 Optimize font loading
  - Use font-display: swap for Nunito
  - Preload critical fonts
  - Test loading performance
  - _Requirements: 6.5_

- [ ] 13.3 Minimize CSS bundle size
  - Remove unused Tailwind classes
  - Optimize custom CSS
  - Test bundle size
  - _Requirements: 1.3_

- [ ] 13.4 Test Lighthouse scores
  - Run Lighthouse on all major pages
  - Ensure performance score > 90
  - Fix any issues
  - _Requirements: All performance-related requirements_

- [ ] 14. Cross-browser Testing
- [ ] 14.1 Test on Chrome/Edge
  - Test all pages and features
  - Verify animations work correctly
  - Fix any browser-specific issues
  - _Requirements: All requirements_

- [ ] 14.2 Test on Firefox
  - Test all pages and features
  - Verify animations work correctly
  - Fix any browser-specific issues
  - _Requirements: All requirements_

- [ ] 14.3 Test on Safari
  - Test all pages and features
  - Verify animations work correctly
  - Fix any browser-specific issues
  - _Requirements: All requirements_

- [ ] 14.4 Test on mobile browsers
  - Test on iOS Safari
  - Test on Android Chrome
  - Fix any mobile-specific issues
  - _Requirements: All requirements_

- [ ] 15. Final Polish and Documentation
- [ ] 15.1 Review all pages for consistency
  - Check color usage
  - Check spacing
  - Check typography
  - Fix any inconsistencies
  - _Requirements: All requirements_

- [ ] 15.2 Create component usage examples
  - Document Button variants
  - Document Card variants
  - Document Badge usage
  - Document Progress components
  - _Requirements: 3.1, 3.2, 4.1, 5.1_

- [ ] 15.3 Update README with design system documentation
  - Document color palette
  - Document typography scale
  - Document spacing system
  - Document component library
  - _Requirements: 1.1, 6.1, 6.2_

- [ ] 15.4 Create design system Storybook
  - Set up Storybook
  - Add stories for all components
  - Document props and variants
  - _Requirements: 3.1, 4.1_

- [ ] 15.5 Final user acceptance testing
  - Test complete user flows
  - Gather feedback
  - Make final adjustments
  - _Requirements: All requirements_
