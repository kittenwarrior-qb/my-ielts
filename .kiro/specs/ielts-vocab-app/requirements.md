# Requirements Document

## Introduction

Ứng dụng học luyện thi IELTS cá nhân với 4 mục chính: Listening, Reading, Speaking, Writing. Cho phép người dùng tự tổng hợp và quản lý vocabulary, idioms, phrases thông qua admin panel trên web. Giao diện lấy cảm hứng từ Cambridge Dictionary với list view professional, hỗ trợ search/filter đa dạng và tính năng ghi âm giọng đọc.

## Glossary

- **IELTS_App**: Ứng dụng web học IELTS được xây dựng bằng Astro
- **Vocabulary_Entry**: Một từ vựng với đầy đủ thông tin (word, phonetic, meaning, example, synonyms...)
- **Admin_Panel**: Giao diện quản trị nằm trong frontend để thêm/sửa/xóa nội dung
- **Content_Collection**: Tập hợp dữ liệu JSON chứa vocabulary, idioms, phrases
- **Audio_Recording**: File ghi âm giọng đọc của người dùng
- **Word_Form**: Các dạng biến đổi của từ (verb, noun, adjective...)
- **Synonym_Link**: Liên kết clickable tới từ đồng nghĩa trong hệ thống

## Requirements

### Requirement 1: Vocabulary List Display

**User Story:** As a learner, I want to view my vocabulary in a professional list format, so that I can quickly scan and review words.

#### Acceptance Criteria

1. WHEN the user navigates to /vocabulary, THE IELTS_App SHALL display a paginated list of Vocabulary_Entry items with columns: STT, Audio icon, Word, Type, Meaning, Example.
2. WHILE viewing the vocabulary list, THE IELTS_App SHALL provide alphabet navigation (A-Z) to filter words by first letter.
3. WHEN the user clicks a filter option, THE IELTS_App SHALL filter vocabulary by topic, level, or IELTS band score.
4. WHEN the user enters text in the search box, THE IELTS_App SHALL search across word, meaning, and example fields within 300ms.
5. THE IELTS_App SHALL display 20 items per page with pagination controls showing current page and total pages.
6. THE IELTS_App SHALL render the vocabulary list responsively on mobile, tablet, and desktop screens.

### Requirement 2: Vocabulary Detail Page

**User Story:** As a learner, I want to view detailed information about a word, so that I can understand its usage comprehensively.

#### Acceptance Criteria

1. WHEN the user clicks a word in the list, THE IELTS_App SHALL navigate to /vocabulary/[word] showing full details.
2. THE IELTS_App SHALL display word, phonetic transcription, all word types with their meanings, examples, word forms, and synonyms.
3. WHEN a Vocabulary_Entry has multiple word types, THE IELTS_App SHALL display each type with its corresponding meaning separately.
4. WHEN the user clicks a Synonym_Link, THE IELTS_App SHALL navigate to that synonym's detail page if it exists in the Content_Collection.
5. WHEN the user clicks a Word_Form link, THE IELTS_App SHALL navigate to that word form's detail page if it exists.
6. THE IELTS_App SHALL display topic tags, level indicator, and IELTS band score for each Vocabulary_Entry.

### Requirement 3: Audio Recording Feature

**User Story:** As a learner, I want to record my pronunciation, so that I can practice and improve my speaking.

#### Acceptance Criteria

1. WHEN the user clicks the record button on a Vocabulary_Entry, THE IELTS_App SHALL start recording audio using the browser's MediaRecorder API.
2. WHILE recording, THE IELTS_App SHALL display a visual indicator showing recording status and duration.
3. WHEN the user stops recording, THE IELTS_App SHALL allow playback of the recorded audio before saving.
4. WHEN the user confirms the recording, THE IELTS_App SHALL upload the Audio_Recording to cloud storage and link it to the Vocabulary_Entry.
5. WHEN an Audio_Recording exists for a Vocabulary_Entry, THE IELTS_App SHALL display a playback button to listen to the user's recording.
6. WHEN the user clicks delete on an Audio_Recording, THE IELTS_App SHALL remove the recording and update the Vocabulary_Entry.

### Requirement 4: Admin Panel - Vocabulary Management

**User Story:** As a content manager, I want to add/edit/delete vocabulary through a web interface, so that I can update content without touching code.

#### Acceptance Criteria

1. WHEN the user navigates to /admin, THE IELTS_App SHALL require password authentication before granting access.
2. WHEN authenticated, THE IELTS_App SHALL display a dashboard with options to manage vocabulary, idioms, phrases, and content sections.
3. WHEN the user submits a new Vocabulary_Entry form, THE IELTS_App SHALL validate required fields (word, type, meaning) before saving.
4. WHEN the user saves a Vocabulary_Entry, THE IELTS_App SHALL commit the updated JSON file to GitHub via API and trigger redeployment.
5. WHEN the user edits an existing Vocabulary_Entry, THE IELTS_App SHALL pre-populate the form with current data.
6. WHEN the user deletes a Vocabulary_Entry, THE IELTS_App SHALL request confirmation before removing from the Content_Collection.

### Requirement 5: Bulk Import Feature

**User Story:** As a content manager, I want to import vocabulary from files, so that I can add multiple entries efficiently.

#### Acceptance Criteria

1. WHEN the user uploads a JSON file, THE IELTS_App SHALL parse and validate the data structure before import.
2. WHEN the user uploads a CSV file, THE IELTS_App SHALL parse columns and map them to Vocabulary_Entry fields.
3. WHEN the user uploads an Excel file (.xlsx), THE IELTS_App SHALL extract data from the first sheet and parse it.
4. WHEN the user uploads a Word document (.docx), THE IELTS_App SHALL extract text content and parse structured data.
5. WHEN import data is parsed, THE IELTS_App SHALL display a preview with validation status for each entry before confirming import.
6. IF import data contains invalid entries, THEN THE IELTS_App SHALL highlight errors and allow the user to skip or fix them.

### Requirement 6: Idioms and Phrases Sections

**User Story:** As a learner, I want separate sections for idioms and phrases, so that I can organize my learning materials.

#### Acceptance Criteria

1. THE IELTS_App SHALL provide /idioms page with list view similar to vocabulary, including search and filter capabilities.
2. THE IELTS_App SHALL provide /phrases page with list view similar to vocabulary, including search and filter capabilities.
3. WHEN viewing an idiom detail, THE IELTS_App SHALL display idiom text, meaning, example usage, and related vocabulary links.
4. THE IELTS_App SHALL support Audio_Recording for idioms and phrases with the same functionality as vocabulary.
5. WHEN the user accesses admin panel, THE IELTS_App SHALL provide management interfaces for idioms and phrases.

### Requirement 7: IELTS Skills Sections

**User Story:** As a learner, I want dedicated sections for each IELTS skill, so that I can organize practice materials by skill type.

#### Acceptance Criteria

1. THE IELTS_App SHALL provide /listening, /reading, /speaking, /writing pages as content sections.
2. WHEN viewing a skill section, THE IELTS_App SHALL display related content entries with title, description, and associated vocabulary.
3. THE IELTS_App SHALL support Audio_Recording for speaking and listening practice content.
4. WHEN the user accesses admin panel, THE IELTS_App SHALL provide management interfaces for each skill section content.

### Requirement 8: Search and Navigation

**User Story:** As a learner, I want powerful search capabilities, so that I can quickly find specific content.

#### Acceptance Criteria

1. THE IELTS_App SHALL provide a global search that searches across vocabulary, idioms, and phrases.
2. WHEN the user types in search, THE IELTS_App SHALL display results with fuzzy matching using Fuse.js within 300ms.
3. THE IELTS_App SHALL provide consistent navigation header with links to all main sections.
4. THE IELTS_App SHALL highlight the current active section in the navigation.
5. WHEN on mobile, THE IELTS_App SHALL provide a hamburger menu for navigation.

### Requirement 9: Data Persistence and Deployment

**User Story:** As a user, I want my data to persist reliably, so that I don't lose my learning materials.

#### Acceptance Criteria

1. THE IELTS_App SHALL store all content data in JSON files within the project repository.
2. WHEN content is modified through admin panel, THE IELTS_App SHALL commit changes to GitHub repository via Octokit API.
3. WHEN a commit is pushed to GitHub, THE IELTS_App SHALL trigger automatic redeployment on Vercel.
4. THE IELTS_App SHALL store Audio_Recording files on Cloudflare R2 with URLs referenced in JSON data.
5. IF GitHub API call fails, THEN THE IELTS_App SHALL display an error message and allow retry.
