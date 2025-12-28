import { grammarRepo } from '../src/lib/repositories/grammar';
import { boardsRepo } from '../src/lib/repositories/boards';
import { generateId } from '../src/lib/utils';

async function seedGrammar() {
  try {
    // Create grammar items
    const grammarItems = [
      {
        id: generateId(),
        title: 'Simple Present Tense',
        structure: 'Subject + verb (base form) / verb + s/es (third person singular)',
        explanation: 'The Simple Present tense is used to describe habits, unchanging situations, general truths, and fixed arrangements. It expresses actions that happen regularly or facts that are always true.',
        examples: [
          'I study English every day.',
          'She works at a hospital.',
          'The sun rises in the east.',
          'Water boils at 100 degrees Celsius.',
          'They play football on Sundays.',
        ],
        usage: 'Use Simple Present for:\n- Habits and routines (I wake up at 7 AM)\n- General truths and facts (The Earth revolves around the Sun)\n- Scheduled events (The train leaves at 9 PM)\n- Instructions and directions (You turn left at the traffic light)',
        notes: 'Remember to add -s or -es to the verb when the subject is he, she, it, or a singular noun. Common mistakes include forgetting the -s ending or using it with plural subjects.',
        topics: ['Tenses', 'Basic Grammar', 'IELTS'],
        level: 'beginner' as const,
        externalLinks: [
          {
            type: 'youtube',
            url: 'https://www.youtube.com/watch?v=tSA0hode9BQ',
            title: 'Simple Present Tense - English Grammar Lesson',
            thumbnail: 'https://img.youtube.com/vi/tSA0hode9BQ/mqdefault.jpg',
          },
          {
            type: 'website',
            url: 'https://www.grammarly.com/blog/simple-present/',
            title: 'Grammarly: Simple Present Tense Guide',
          },
        ],
      },
      {
        id: generateId(),
        title: 'Present Perfect Tense',
        structure: 'Subject + have/has + past participle',
        explanation: 'The Present Perfect tense connects the past with the present. It describes actions that started in the past and continue to the present, or actions that happened at an unspecified time before now.',
        examples: [
          'I have lived in this city for five years.',
          'She has finished her homework.',
          'They have visited Paris three times.',
          'He has never eaten sushi.',
          'We have known each other since childhood.',
        ],
        usage: 'Use Present Perfect for:\n- Life experiences (I have traveled to Japan)\n- Actions that started in the past and continue now (I have worked here for 3 years)\n- Recent actions with present results (She has lost her keys)\n- Actions at an unspecified time (Have you ever been to London?)',
        notes: 'Use "for" with duration (for 3 years) and "since" with a starting point (since 2020). Don\'t use Present Perfect with specific past time expressions like "yesterday" or "last week".',
        topics: ['Tenses', 'Advanced Grammar', 'IELTS'],
        level: 'intermediate' as const,
        externalLinks: [
          {
            type: 'youtube',
            url: 'https://www.youtube.com/watch?v=_TkbXqQkHfE',
            title: 'Present Perfect Tense Explained',
            thumbnail: 'https://img.youtube.com/vi/_TkbXqQkHfE/mqdefault.jpg',
          },
        ],
      },
      {
        id: generateId(),
        title: 'First Conditional',
        structure: 'If + present simple, will + base verb',
        explanation: 'The First Conditional is used to talk about real and possible situations in the future. It describes what will happen if a certain condition is met.',
        examples: [
          'If it rains tomorrow, I will stay at home.',
          'If you study hard, you will pass the exam.',
          'She will be happy if you call her.',
          'If they arrive early, we will have time for coffee.',
          'You will get wet if you don\'t take an umbrella.',
        ],
        usage: 'Use First Conditional for:\n- Real future possibilities (If I have time, I will help you)\n- Predictions (If you eat too much, you will feel sick)\n- Warnings (If you don\'t hurry, you will miss the bus)\n- Promises (If you come to the party, I will introduce you to my friends)',
        notes: 'The "if" clause can come first or second in the sentence. When it comes first, use a comma. You can also use "unless" (meaning "if not") instead of "if".',
        topics: ['Conditionals', 'Advanced Grammar', 'IELTS'],
        level: 'intermediate' as const,
        externalLinks: [],
      },
      {
        id: generateId(),
        title: 'Passive Voice',
        structure: 'Subject + be + past participle (+ by + agent)',
        explanation: 'The Passive Voice is used when we want to emphasize the action or the object of the action rather than who performs it. The subject receives the action instead of doing it.',
        examples: [
          'The book was written by Shakespeare.',
          'English is spoken in many countries.',
          'The house is being painted.',
          'The project will be completed next month.',
          'The letter has been sent.',
        ],
        usage: 'Use Passive Voice when:\n- The doer is unknown (My car was stolen)\n- The doer is obvious (The thief was arrested)\n- The action is more important than the doer (The bridge was built in 1850)\n- In formal or scientific writing (The experiment was conducted carefully)',
        notes: 'To form the passive, use the appropriate form of "be" + past participle. The agent (who does the action) can be omitted if it\'s not important or unknown.',
        topics: ['Passive Voice', 'Advanced Grammar', 'IELTS Writing'],
        level: 'advanced' as const,
        externalLinks: [
          {
            type: 'website',
            url: 'https://www.englishclub.com/grammar/verbs-voice_passive.htm',
            title: 'EnglishClub: Passive Voice Guide',
          },
        ],
      },
      {
        id: generateId(),
        title: 'Past Perfect Tense',
        structure: 'Subject + had + past participle',
        explanation: 'The Past Perfect tense is used to show that one action happened before another action in the past. It helps establish a clear sequence of past events.',
        examples: [
          'I had finished my homework before dinner.',
          'She had already left when I arrived.',
          'They had never seen snow before they moved to Canada.',
          'By the time we got to the station, the train had departed.',
          'He had studied English for five years before he moved to London.',
        ],
        usage: 'Use Past Perfect for:\n- An action completed before another past action (I had eaten before she called)\n- To show cause and effect in the past (She was tired because she had worked all day)\n- With time expressions like "by the time", "before", "after", "already", "just"',
        notes: 'Past Perfect is often used with Past Simple to show which action happened first. The action that happened first uses Past Perfect, and the later action uses Past Simple.',
        topics: ['Tenses', 'Advanced Grammar', 'IELTS'],
        level: 'advanced' as const,
        externalLinks: [],
      },
    ];

    console.log('Creating grammar items...');
    const createdItems = [];
    for (const item of grammarItems) {
      const created = await grammarRepo.create(item);
      createdItems.push(created);
      console.log(`✅ Created grammar item: ${item.title}`);
    }

    // Update boards with grammar item IDs
    console.log('\nUpdating boards with grammar items...');
    const boards = await boardsRepo.getAll({ type: 'grammar' });
    
    if (boards.length > 0) {
      // Add tense-related items to "Tenses" board
      const tensesBoard = boards.find(b => b.name === 'Tenses');
      if (tensesBoard) {
        const tenseItems = createdItems.filter(item => 
          item.title.includes('Present') || item.title.includes('Past')
        );
        await boardsRepo.update(tensesBoard.id, {
          itemIds: tenseItems.map(item => item.id),
        });
        console.log(`✅ Updated "${tensesBoard.name}" board with ${tenseItems.length} items`);
      }

      // Add conditional items to "Conditionals" board
      const conditionalsBoard = boards.find(b => b.name === 'Conditionals');
      if (conditionalsBoard) {
        const conditionalItems = createdItems.filter(item => 
          item.title.includes('Conditional')
        );
        await boardsRepo.update(conditionalsBoard.id, {
          itemIds: conditionalItems.map(item => item.id),
        });
        console.log(`✅ Updated "${conditionalsBoard.name}" board with ${conditionalItems.length} items`);
      }

      // Add passive voice items to "Passive Voice" board
      const passiveBoard = boards.find(b => b.name === 'Passive Voice');
      if (passiveBoard) {
        const passiveItems = createdItems.filter(item => 
          item.title.includes('Passive')
        );
        await boardsRepo.update(passiveBoard.id, {
          itemIds: passiveItems.map(item => item.id),
        });
        console.log(`✅ Updated "${passiveBoard.name}" board with ${passiveItems.length} items`);
      }
    }

    console.log('\n🎉 Successfully seeded grammar items!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding grammar:', error);
    process.exit(1);
  }
}

seedGrammar();
