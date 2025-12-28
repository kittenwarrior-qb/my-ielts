import { expressionsRepo } from '../src/lib/repositories/expressions';
import { boardsRepo } from '../src/lib/repositories/boards';
import { generateId } from '../src/lib/utils';

async function seedExpressions() {
  try {
    // Create expression items
    const expressionItems = [
      {
        id: generateId(),
        expression: 'Break the ice',
        type: 'idiom' as const,
        meaning: 'To make people feel more comfortable in a social situation, especially at the beginning of a meeting or party',
        examples: [
          'He told a funny joke to break the ice at the start of the meeting.',
          'Playing a game is a good way to break the ice with new colleagues.',
          'She broke the ice by asking everyone about their hobbies.',
        ],
        grammar: 'This idiom is typically used as a verb phrase. It can be used in various tenses: break/breaks/broke/broken the ice.',
        relatedWords: ['introduce', 'initiate', 'start conversation', 'ease tension'],
        topics: ['Social Situations', 'Business English', 'IELTS Speaking'],
        category: 'speaking',
        synonyms: ['start a conversation', 'ease the tension', 'get things started'],
        context: {
          register: 'neutral',
          mode: 'both',
          frequency: 'common',
        },
        externalLinks: [
          {
            type: 'youtube',
            url: 'https://www.youtube.com/watch?v=example1',
            title: 'Common English Idioms Explained',
          },
        ],
      },
      {
        id: generateId(),
        expression: 'Hit the books',
        type: 'idiom' as const,
        meaning: 'To study hard, especially for an exam',
        examples: [
          'I need to hit the books tonight because I have an exam tomorrow.',
          'She has been hitting the books all week to prepare for her IELTS test.',
          'If you want to pass, you should hit the books more often.',
        ],
        grammar: 'Used as a verb phrase, often in imperative or future tense when giving advice about studying.',
        relatedWords: ['study', 'prepare', 'revise', 'cram', 'learn'],
        topics: ['Education', 'IELTS', 'Student Life'],
        category: 'general',
        synonyms: ['study hard', 'crack the books', 'bone up on'],
        context: {
          register: 'informal',
          mode: 'both',
          frequency: 'common',
        },
        externalLinks: [],
      },
      {
        id: generateId(),
        expression: 'On the other hand',
        type: 'phrase' as const,
        meaning: 'Used to present a contrasting or different point of view',
        examples: [
          'The city is expensive. On the other hand, it offers many job opportunities.',
          'This method is fast. On the other hand, it may not be very accurate.',
          'Living in the countryside is peaceful. On the other hand, it can be isolating.',
        ],
        grammar: 'This is a transitional phrase used to introduce a contrasting idea. It\'s typically placed at the beginning of a sentence and followed by a comma.',
        relatedWords: ['however', 'conversely', 'in contrast', 'alternatively'],
        topics: ['Writing', 'IELTS Writing', 'Academic English'],
        category: 'writing',
        synonyms: ['conversely', 'by contrast', 'alternatively', 'however'],
        context: {
          register: 'formal',
          mode: 'written',
          frequency: 'common',
        },
        externalLinks: [],
      },
      {
        id: generateId(),
        expression: 'In my opinion',
        type: 'phrase' as const,
        meaning: 'Used to introduce your personal view or belief about something',
        examples: [
          'In my opinion, online learning is as effective as traditional classroom education.',
          'The government should invest more in public transportation, in my opinion.',
          'In my opinion, this is the best solution to the problem.',
        ],
        grammar: 'This phrase can be placed at the beginning, middle, or end of a sentence. When at the beginning, it\'s followed by a comma.',
        relatedWords: ['personally', 'I believe', 'I think', 'from my perspective'],
        topics: ['Opinion', 'IELTS Speaking', 'IELTS Writing'],
        category: 'speaking',
        synonyms: ['I believe', 'I think', 'from my perspective', 'personally', 'to my mind'],
        context: {
          register: 'neutral',
          mode: 'both',
          frequency: 'common',
        },
        externalLinks: [],
      },
      {
        id: generateId(),
        expression: 'Piece of cake',
        type: 'idiom' as const,
        meaning: 'Something that is very easy to do',
        examples: [
          'The exam was a piece of cake; I finished it in 30 minutes.',
          'Don\'t worry about the presentation. It will be a piece of cake for you.',
          'Learning to ride a bike was a piece of cake for him.',
        ],
        grammar: 'Used as a noun phrase, often with "a" or "the". Commonly appears after "be" verb or in comparisons.',
        relatedWords: ['easy', 'simple', 'effortless', 'straightforward'],
        topics: ['Difficulty', 'IELTS Speaking', 'Informal English'],
        category: 'speaking',
        synonyms: ['easy as pie', 'a breeze', 'child\'s play', 'no sweat'],
        context: {
          register: 'informal',
          mode: 'spoken',
          frequency: 'common',
        },
        externalLinks: [
          {
            type: 'website',
            url: 'https://www.merriam-webster.com/dictionary/piece%20of%20cake',
            title: 'Merriam-Webster: Piece of Cake Definition',
          },
        ],
      },
      {
        id: generateId(),
        expression: 'It is worth noting that',
        type: 'phrase' as const,
        meaning: 'Used to draw attention to an important point or fact',
        examples: [
          'It is worth noting that the study was conducted over a five-year period.',
          'The results were positive. However, it is worth noting that the sample size was small.',
          'It is worth noting that this approach has both advantages and disadvantages.',
        ],
        grammar: 'This is a formal phrase typically used in academic or professional writing. It\'s followed by a clause (subject + verb).',
        relatedWords: ['importantly', 'notably', 'significantly', 'observe'],
        topics: ['Academic Writing', 'IELTS Writing', 'Formal English'],
        category: 'writing',
        synonyms: ['it should be noted that', 'notably', 'it is important to note that'],
        context: {
          register: 'formal',
          mode: 'written',
          frequency: 'common',
        },
        externalLinks: [],
      },
      {
        id: generateId(),
        expression: 'Cost an arm and a leg',
        type: 'idiom' as const,
        meaning: 'To be very expensive',
        examples: [
          'That new smartphone costs an arm and a leg.',
          'University education in some countries costs an arm and a leg.',
          'The repairs to my car cost an arm and a leg.',
        ],
        grammar: 'Used as a verb phrase with "cost/costs/costed". The subject is usually the expensive item.',
        relatedWords: ['expensive', 'costly', 'pricey', 'overpriced'],
        topics: ['Money', 'Shopping', 'IELTS Speaking'],
        category: 'speaking',
        synonyms: ['cost a fortune', 'break the bank', 'cost a bomb'],
        context: {
          register: 'informal',
          mode: 'spoken',
          frequency: 'common',
        },
        externalLinks: [],
      },
    ];

    console.log('Creating expression items...');
    const createdItems = [];
    for (const item of expressionItems) {
      const created = await expressionsRepo.create(item);
      createdItems.push(created);
      console.log(`✅ Created expression: ${item.expression}`);
    }

    // Update boards with expression item IDs
    console.log('\nUpdating boards with expression items...');
    const boards = await boardsRepo.getAll({ type: 'idioms' });
    
    if (boards.length > 0) {
      // Add idioms to "Common Idioms" board
      const idiomsBoard = boards.find(b => b.name === 'Common Idioms');
      if (idiomsBoard) {
        const idiomItems = createdItems.filter(item => item.type === 'idiom');
        await boardsRepo.update(idiomsBoard.id, {
          itemIds: idiomItems.map(item => item.id),
        });
        console.log(`✅ Updated "${idiomsBoard.name}" board with ${idiomItems.length} items`);
      }

      // Add speaking phrases to "Speaking Phrases" board
      const speakingBoard = boards.find(b => b.name === 'Speaking Phrases');
      if (speakingBoard) {
        const speakingItems = createdItems.filter(item => 
          item.category === 'speaking' || (item.topics as string[]).includes('IELTS Speaking')
        );
        await boardsRepo.update(speakingBoard.id, {
          itemIds: speakingItems.map(item => item.id),
        });
        console.log(`✅ Updated "${speakingBoard.name}" board with ${speakingItems.length} items`);
      }

      // Add writing expressions to "Writing Expressions" board
      const writingBoard = boards.find(b => b.name === 'Writing Expressions');
      if (writingBoard) {
        const writingItems = createdItems.filter(item => 
          item.category === 'writing' || (item.topics as string[]).includes('IELTS Writing')
        );
        await boardsRepo.update(writingBoard.id, {
          itemIds: writingItems.map(item => item.id),
        });
        console.log(`✅ Updated "${writingBoard.name}" board with ${writingItems.length} items`);
      }
    }

    console.log('\n🎉 Successfully seeded expression items!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding expressions:', error);
    process.exit(1);
  }
}

seedExpressions();
