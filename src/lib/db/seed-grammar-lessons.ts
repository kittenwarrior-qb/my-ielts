import 'dotenv/config';
import { db } from './client';
import { boards, lessons, grammar } from './schema';
import { randomUUID } from 'node:crypto';

// IELTS Grammar data theo lộ trình từ cơ bản đến nâng cao
const grammarLessonsData = [
  {
    board: {
      name: 'Basic Grammar',
      description: 'Essential grammar for IELTS beginners (Band 4.0-5.0)',
      type: 'grammar' as const,
      color: '#3B82F6',
      icon: '📘',
      order: 1,
    },
    lessons: [
      {
        title: 'Lesson 1: Present Simple Tense',
        description: 'Thì hiện tại đơn',
        order: 1,
        grammarItems: [
          {
            title: 'Present Simple - Affirmative',
            structure: 'Subject + V(s/es)',
            explanation: 'Used to express habits, general truths, and permanent situations.',
            examples: [
              'I work in a bank.\nTôi làm việc ở ngân hàng.',
              'She studies English every day.\nCô ấy học tiếng Anh mỗi ngày.',
              'The sun rises in the east.\nMặt trời mọc ở phía đông.',
            ],
            usage: 'Use for routines, facts, and things that are always true.',
            notes: 'Add -s/-es to the verb with he/she/it. Regular verbs: work→works, study→studies.',
            level: 'beginner' as const,
          },
          {
            title: 'Present Simple - Negative',
            structure: 'Subject + do/does + not + V(base)',
            explanation: 'Used to make negative statements in present simple.',
            examples: [
              'I do not (don\'t) like coffee.\nTôi không thích cà phê.',
              'He does not (doesn\'t) work on weekends.\nAnh ấy không làm việc vào cuối tuần.',
              'They don\'t speak French.\nHọ không nói tiếng Pháp.',
            ],
            usage: 'Use "don\'t" with I/you/we/they and "doesn\'t" with he/she/it.',
            notes: 'The main verb stays in base form after do/does not.',
            level: 'beginner' as const,
          },
          {
            title: 'Present Simple - Questions',
            structure: 'Do/Does + Subject + V(base)?',
            explanation: 'Used to ask questions in present simple.',
            examples: [
              'Do you like pizza?\nBạn có thích pizza không?',
              'Does she work here?\nCô ấy có làm việc ở đây không?',
              'Where do they live?\nHọ sống ở đâu?',
            ],
            usage: 'Start with Do/Does, then subject, then base verb.',
            notes: 'Use "Do" with I/you/we/they and "Does" with he/she/it.',
            level: 'beginner' as const,
          },
          {
            title: 'Frequency Adverbs',
            structure: 'Subject + adverb + verb',
            explanation: 'Adverbs that show how often something happens.',
            examples: [
              'I always wake up at 7 AM.\nTôi luôn thức dậy lúc 7 giờ sáng.',
              'She usually goes to the gym.\nCô ấy thường đi phòng gym.',
              'They never eat fast food.\nHọ không bao giờ ăn đồ ăn nhanh.',
            ],
            usage: 'Common adverbs: always, usually, often, sometimes, rarely, never.',
            notes: 'Place adverb before main verb but after "be" verb: She is always happy.',
            level: 'beginner' as const,
          },
        ],
      },
      {
        title: 'Lesson 2: Present Continuous',
        description: 'Thì hiện tại tiếp diễn',
        order: 2,
        grammarItems: [
          {
            title: 'Present Continuous - Form',
            structure: 'Subject + am/is/are + V-ing',
            explanation: 'Used to describe actions happening now or around now.',
            examples: [
              'I am studying for my IELTS exam.\nTôi đang học cho kỳ thi IELTS.',
              'She is working on a project.\nCô ấy đang làm việc trên một dự án.',
              'They are playing football.\nHọ đang chơi bóng đá.',
            ],
            usage: 'Use for actions in progress at the moment of speaking.',
            notes: 'Spelling: run→running (double consonant), make→making (drop e).',
            level: 'beginner' as const,
          },
          {
            title: 'Present Continuous - Negative',
            structure: 'Subject + am/is/are + not + V-ing',
            explanation: 'Used to make negative statements about current actions.',
            examples: [
              'I am not watching TV right now.\nTôi không đang xem TV bây giờ.',
              'He is not (isn\'t) listening to music.\nAnh ấy không đang nghe nhạc.',
              'We are not (aren\'t) eating dinner yet.\nChúng tôi chưa ăn tối.',
            ],
            usage: 'Add "not" after am/is/are.',
            notes: 'Contractions: isn\'t, aren\'t (but "am not" has no contraction).',
            level: 'beginner' as const,
          },
          {
            title: 'Present Continuous - Questions',
            structure: 'Am/Is/Are + Subject + V-ing?',
            explanation: 'Used to ask about actions happening now.',
            examples: [
              'Are you studying English?\nBạn có đang học tiếng Anh không?',
              'Is she coming to the party?\nCô ấy có đến bữa tiệc không?',
              'What are they doing?\nHọ đang làm gì?',
            ],
            usage: 'Move am/is/are before the subject.',
            notes: 'Use question words (what, where, why) at the beginning for wh-questions.',
            level: 'beginner' as const,
          },
          {
            title: 'Stative Verbs',
            structure: 'Not used in continuous form',
            explanation: 'Some verbs describe states, not actions, and are not used in continuous tenses.',
            examples: [
              'I know the answer. (NOT: I am knowing)\nTôi biết câu trả lời.',
              'She loves chocolate. (NOT: She is loving)\nCô ấy yêu sô-cô-la.',
              'They believe in hard work.\nHọ tin vào sự chăm chỉ.',
            ],
            usage: 'Common stative verbs: know, understand, believe, love, hate, want, need, prefer.',
            notes: 'Some verbs can be both stative and action: think, have, see.',
            level: 'beginner' as const,
          },
        ],
      },
    ],
  },
  {
    board: {
      name: 'Intermediate Grammar',
      description: 'Grammar for IELTS Band 5.5-6.5',
      type: 'grammar' as const,
      color: '#10B981',
      icon: '📗',
      order: 2,
    },
    lessons: [
      {
        title: 'Lesson 1: Past Tenses',
        description: 'Các thì quá khứ',
        order: 1,
        grammarItems: [
          {
            title: 'Past Simple',
            structure: 'Subject + V-ed / V2',
            explanation: 'Used for completed actions in the past.',
            examples: [
              'I visited London last year.\nTôi đã đến thăm London năm ngoái.',
              'She studied medicine at university.\nCô ấy đã học y khoa ở đại học.',
              'They moved to a new house in 2020.\nHọ đã chuyển đến nhà mới vào năm 2020.',
            ],
            usage: 'Use with time expressions: yesterday, last week, in 2020, ago.',
            notes: 'Regular verbs add -ed. Irregular verbs have special forms: go→went, see→saw.',
            level: 'intermediate' as const,
          },
          {
            title: 'Past Continuous',
            structure: 'Subject + was/were + V-ing',
            explanation: 'Used for actions in progress at a specific time in the past.',
            examples: [
              'I was reading when you called.\nTôi đang đọc sách khi bạn gọi.',
              'They were living in Paris at that time.\nHọ đang sống ở Paris vào thời điểm đó.',
              'What were you doing at 8 PM yesterday?\nBạn đang làm gì lúc 8 giờ tối hôm qua?',
            ],
            usage: 'Often used with past simple to show interrupted actions.',
            notes: 'Use "was" with I/he/she/it and "were" with you/we/they.',
            level: 'intermediate' as const,
          },
          {
            title: 'Present Perfect',
            structure: 'Subject + have/has + V3/past participle',
            explanation: 'Used for past actions with present relevance or unfinished time periods.',
            examples: [
              'I have lived here for 5 years.\nTôi đã sống ở đây được 5 năm.',
              'She has visited 20 countries.\nCô ấy đã đến thăm 20 quốc gia.',
              'Have you ever tried sushi?\nBạn đã bao giờ thử sushi chưa?',
            ],
            usage: 'Use with: ever, never, already, yet, just, for, since.',
            notes: 'Don\'t use with specific past time: NOT "I have seen him yesterday".',
            level: 'intermediate' as const,
          },
          {
            title: 'Present Perfect Continuous',
            structure: 'Subject + have/has + been + V-ing',
            explanation: 'Used to emphasize the duration of an action that started in the past and continues now.',
            examples: [
              'I have been studying English for 3 years.\nTôi đã học tiếng Anh được 3 năm.',
              'She has been working here since 2019.\nCô ấy đã làm việc ở đây từ năm 2019.',
              'How long have you been waiting?\nBạn đã đợi bao lâu rồi?',
            ],
            usage: 'Emphasizes duration and continuity. Use with "for" and "since".',
            notes: 'Similar to present perfect but focuses more on the activity itself.',
            level: 'intermediate' as const,
          },
        ],
      },
      {
        title: 'Lesson 2: Modal Verbs',
        description: 'Động từ khuyết thiếu',
        order: 2,
        grammarItems: [
          {
            title: 'Can / Could - Ability',
            structure: 'Subject + can/could + V(base)',
            explanation: 'Used to express ability or possibility.',
            examples: [
              'I can speak three languages.\nTôi có thể nói ba thứ tiếng.',
              'She could swim when she was five.\nCô ấy có thể bơi khi cô ấy 5 tuổi.',
              'Can you help me with this?\nBạn có thể giúp tôi việc này không?',
            ],
            usage: '"Can" for present ability, "could" for past ability or polite requests.',
            notes: 'No -s with he/she/it. No "to" after can/could.',
            level: 'intermediate' as const,
          },
          {
            title: 'Must / Have to - Obligation',
            structure: 'Subject + must/have to + V(base)',
            explanation: 'Used to express obligation or necessity.',
            examples: [
              'You must wear a seatbelt.\nBạn phải thắt dây an toàn.',
              'I have to work tomorrow.\nTôi phải làm việc ngày mai.',
              'Students must submit their assignments on time.\nHọc sinh phải nộp bài tập đúng hạn.',
            ],
            usage: '"Must" for strong obligation (rules/laws), "have to" for external obligation.',
            notes: 'Negative: "mustn\'t" = prohibition, "don\'t have to" = not necessary.',
            level: 'intermediate' as const,
          },
          {
            title: 'Should / Ought to - Advice',
            structure: 'Subject + should/ought to + V(base)',
            explanation: 'Used to give advice or recommendations.',
            examples: [
              'You should see a doctor.\nBạn nên đi khám bác sĩ.',
              'We ought to leave early to avoid traffic.\nChúng ta nên đi sớm để tránh kẹt xe.',
              'Should I apply for this job?\nTôi có nên nộp đơn xin việc này không?',
            ],
            usage: 'Use for suggestions and advice. "Ought to" is more formal.',
            notes: 'Negative: shouldn\'t = not advisable.',
            level: 'intermediate' as const,
          },
          {
            title: 'May / Might - Possibility',
            structure: 'Subject + may/might + V(base)',
            explanation: 'Used to express possibility or permission.',
            examples: [
              'It may rain tomorrow.\nTrời có thể mưa ngày mai.',
              'She might be late for the meeting.\nCô ấy có thể đến muộn cuộc họp.',
              'May I use your phone?\nTôi có thể dùng điện thoại của bạn không?',
            ],
            usage: '"May" for permission (formal) or 50% possibility. "Might" for lower possibility.',
            notes: '"Might" is slightly less certain than "may".',
            level: 'intermediate' as const,
          },
        ],
      },
    ],
  },
  {
    board: {
      name: 'Advanced Grammar',
      description: 'Complex grammar for IELTS Band 7.0+',
      type: 'grammar' as const,
      color: '#F59E0B',
      icon: '📙',
      order: 3,
    },
    lessons: [
      {
        title: 'Lesson 1: Conditionals',
        description: 'Câu điều kiện',
        order: 1,
        grammarItems: [
          {
            title: 'First Conditional',
            structure: 'If + present simple, will + base verb',
            explanation: 'Used for real and possible situations in the future.',
            examples: [
              'If it rains tomorrow, I will stay at home.\nNếu trời mưa ngày mai, tôi sẽ ở nhà.',
              'If you study hard, you will pass the exam.\nNếu bạn học chăm chỉ, bạn sẽ đậu kỳ thi.',
              'She will be happy if she gets the job.\nCô ấy sẽ vui nếu cô ấy nhận được công việc.',
            ],
            usage: 'Use for predictions and promises about real future situations.',
            notes: 'Can use modal verbs: If you come, you might/can/should see him.',
            level: 'advanced' as const,
          },
          {
            title: 'Second Conditional',
            structure: 'If + past simple, would + base verb',
            explanation: 'Used for hypothetical or unlikely situations in the present/future.',
            examples: [
              'If I had more money, I would travel the world.\nNếu tôi có nhiều tiền hơn, tôi sẽ đi du lịch vòng quanh thế giới.',
              'If she were taller, she could be a model.\nNếu cô ấy cao hơn, cô ấy có thể là người mẫu.',
              'What would you do if you won the lottery?\nBạn sẽ làm gì nếu bạn trúng số?',
            ],
            usage: 'Use for imaginary situations that are unlikely or impossible now.',
            notes: 'Use "were" for all persons with "be": If I were you... (formal).',
            level: 'advanced' as const,
          },
          {
            title: 'Third Conditional',
            structure: 'If + past perfect, would have + past participle',
            explanation: 'Used for hypothetical situations in the past (things that didn\'t happen).',
            examples: [
              'If I had studied harder, I would have passed the exam.\nNếu tôi đã học chăm chỉ hơn, tôi đã đậu kỳ thi.',
              'If they had left earlier, they wouldn\'t have missed the train.\nNếu họ đã đi sớm hơn, họ đã không lỡ tàu.',
              'She would have been happier if she had taken the job.\nCô ấy đã vui hơn nếu cô ấy nhận công việc đó.',
            ],
            usage: 'Use to express regret or imagine different past outcomes.',
            notes: 'Cannot change the past - this is purely hypothetical.',
            level: 'advanced' as const,
          },
          {
            title: 'Mixed Conditionals',
            structure: 'Various combinations of conditional forms',
            explanation: 'Combines different time references in condition and result.',
            examples: [
              'If I had studied medicine, I would be a doctor now.\nNếu tôi đã học y, bây giờ tôi sẽ là bác sĩ.',
              'If she were more organized, she wouldn\'t have missed the deadline.\nNếu cô ấy có tổ chức hơn, cô ấy đã không bỏ lỡ hạn chót.',
              'If I were you, I would have accepted the offer.\nNếu tôi là bạn, tôi đã chấp nhận lời đề nghị.',
            ],
            usage: 'Use when the time in the if-clause is different from the time in the result.',
            notes: 'Common in natural speech. Mix past condition with present result or vice versa.',
            level: 'advanced' as const,
          },
        ],
      },
      {
        title: 'Lesson 2: Passive Voice',
        description: 'Câu bị động',
        order: 2,
        grammarItems: [
          {
            title: 'Present Simple Passive',
            structure: 'Subject + am/is/are + past participle',
            explanation: 'Used when the focus is on the action, not who does it.',
            examples: [
              'English is spoken in many countries.\nTiếng Anh được nói ở nhiều quốc gia.',
              'The office is cleaned every day.\nVăn phòng được dọn dẹp mỗi ngày.',
              'These products are made in Vietnam.\nNhững sản phẩm này được sản xuất ở Việt Nam.',
            ],
            usage: 'Use when the doer is unknown, unimportant, or obvious.',
            notes: 'Form: be + past participle. Add "by + agent" if needed.',
            level: 'advanced' as const,
          },
          {
            title: 'Past Simple Passive',
            structure: 'Subject + was/were + past participle',
            explanation: 'Used for completed actions in the past (passive form).',
            examples: [
              'The book was written in 1960.\nCuốn sách được viết năm 1960.',
              'The thieves were caught by the police.\nBọn trộm đã bị cảnh sát bắt.',
              'The building was destroyed in the fire.\nTòa nhà đã bị phá hủy trong vụ cháy.',
            ],
            usage: 'Focus on the action or result, not the doer.',
            notes: 'Common in news reports and formal writing.',
            level: 'advanced' as const,
          },
          {
            title: 'Present Perfect Passive',
            structure: 'Subject + have/has been + past participle',
            explanation: 'Used for actions completed at an unspecified time (passive form).',
            examples: [
              'The report has been submitted.\nBáo cáo đã được nộp.',
              'Three people have been arrested.\nBa người đã bị bắt.',
              'Has the problem been solved?\nVấn đề đã được giải quyết chưa?',
            ],
            usage: 'Emphasizes the completion of an action with present relevance.',
            notes: 'Very common in formal and academic writing.',
            level: 'advanced' as const,
          },
          {
            title: 'Modal Passive',
            structure: 'Subject + modal + be + past participle',
            explanation: 'Used to express possibility, obligation, etc. in passive form.',
            examples: [
              'The work must be finished by Friday.\nCông việc phải được hoàn thành trước thứ Sáu.',
              'This form should be completed in English.\nMẫu đơn này nên được điền bằng tiếng Anh.',
              'The problem can be solved easily.\nVấn đề có thể được giải quyết dễ dàng.',
            ],
            usage: 'Combines modals (can, must, should, etc.) with passive voice.',
            notes: 'Form: modal + be + past participle.',
            level: 'advanced' as const,
          },
        ],
      },
    ],
  },
];

async function seedGrammarLessons() {
  console.log('🌱 Starting grammar lessons seed...');

  try {
    for (const boardData of grammarLessonsData) {
      // Create board
      const boardId = randomUUID();
      await db.insert(boards).values({
        id: boardId,
        name: boardData.board.name,
        type: boardData.board.type,
        description: boardData.board.description,
        color: boardData.board.color,
        icon: boardData.board.icon,
        itemIds: [],
        order: boardData.board.order,
      });

      console.log(`✅ Created board: ${boardData.board.name}`);

      // Create lessons and grammar items
      for (const lessonData of boardData.lessons) {
        const lessonId = randomUUID();
        const grammarIds: string[] = [];

        // Create grammar items
        for (const grammarItem of lessonData.grammarItems) {
          const grammarId = randomUUID();
          await db.insert(grammar).values({
            id: grammarId,
            title: grammarItem.title,
            structure: grammarItem.structure,
            explanation: grammarItem.explanation,
            examples: grammarItem.examples,
            usage: grammarItem.usage,
            notes: grammarItem.notes,
            topics: [],
            level: grammarItem.level,
          });
          grammarIds.push(grammarId);
        }

        // Create lesson
        await db.insert(lessons).values({
          id: lessonId,
          boardId: boardId,
          title: lessonData.title,
          description: lessonData.description,
          order: lessonData.order,
          itemIds: grammarIds,
        });

        console.log(`  ✅ Created lesson: ${lessonData.title} with ${grammarIds.length} grammar items`);
      }
    }

    console.log('✅ Grammar lessons seed completed!');
  } catch (error) {
    console.error('❌ Error seeding grammar lessons:', error);
    throw error;
  }
}

// Run if called directly
seedGrammarLessons()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

export { seedGrammarLessons };
