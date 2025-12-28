import { boardsRepo } from '../src/lib/repositories/boards';
import { generateId } from '../src/lib/utils';

async function seedBoards() {
  try {
    // Grammar boards
    const grammarBoards = [
      {
        id: generateId(),
        name: 'Tenses',
        type: 'grammar' as const,
        description: 'Các thì trong tiếng Anh',
        color: null,
        icon: null,
        itemIds: [],
      },
      {
        id: generateId(),
        name: 'Conditionals',
        type: 'grammar' as const,
        description: 'Câu điều kiện',
        color: null,
        icon: null,
        itemIds: [],
      },
      {
        id: generateId(),
        name: 'Passive Voice',
        type: 'grammar' as const,
        description: 'Câu bị động',
        color: null,
        icon: null,
        itemIds: [],
      },
    ];

    // Vocabulary boards
    const vocabularyBoards = [
      {
        id: generateId(),
        name: 'IELTS Band 7+',
        type: 'vocabulary' as const,
        description: 'Từ vựng nâng cao cho IELTS Band 7 trở lên',
        color: null,
        icon: null,
        itemIds: [],
      },
      {
        id: generateId(),
        name: 'Academic Words',
        type: 'vocabulary' as const,
        description: 'Từ vựng học thuật thường gặp',
        color: null,
        icon: null,
        itemIds: [],
      },
      {
        id: generateId(),
        name: 'Business English',
        type: 'vocabulary' as const,
        description: 'Từ vựng tiếng Anh thương mại',
        color: null,
        icon: null,
        itemIds: [],
      },
    ];

    // Idioms boards
    const idiomsBoards = [
      {
        id: generateId(),
        name: 'Common Idioms',
        type: 'idioms' as const,
        description: 'Thành ngữ thông dụng',
        color: null,
        icon: null,
        itemIds: [],
      },
      {
        id: generateId(),
        name: 'Speaking Phrases',
        type: 'idioms' as const,
        description: 'Cụm từ cho IELTS Speaking',
        color: null,
        icon: null,
        itemIds: [],
      },
      {
        id: generateId(),
        name: 'Writing Expressions',
        type: 'idioms' as const,
        description: 'Cụm từ cho IELTS Writing',
        color: null,
        icon: null,
        itemIds: [],
      },
    ];

    // Create all boards
    for (const board of [...grammarBoards, ...vocabularyBoards, ...idiomsBoards]) {
      await boardsRepo.create(board);
      console.log(`✅ Created board: ${board.name}`);
    }

    console.log('\n🎉 Successfully seeded all boards!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding boards:', error);
    process.exit(1);
  }
}

seedBoards();
