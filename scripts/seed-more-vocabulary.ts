import { vocabularyRepo } from '../src/lib/repositories/vocabulary';
import { boardsRepo } from '../src/lib/repositories/boards';
import { generateId } from '../src/lib/utils';
import postgres from 'postgres';

// Get database connection for cleanup
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}
const sql = postgres(connectionString);

async function seedMoreVocabulary() {
  try {
    // 27 từ vựng cho IELTS Band 7+ (15 từ cũ + 12 từ mới)
    const newVocabulary = [
      {
        id: generateId(),
        word: 'ubiquitous',
        phonetic: '/juːˈbɪkwɪtəs/',
        audioUrl: null,
        userAudioUrl: null,
        types: [{ type: 'adjective', meanings: ['present, appearing, or found everywhere'] }],
        examples: ['Smartphones have become ubiquitous in modern society.'],
        synonyms: ['omnipresent', 'pervasive', 'universal'],
        wordForms: ['ubiquitously', 'ubiquity'],
        topics: ['technology', 'society'],
        level: 'advanced' as const,
        band: 7.5,
        grammar: 'Used as an adjective to describe something that exists everywhere.',
      },
      {
        id: generateId(),
        word: 'mitigate',
        phonetic: '/ˈmɪtɪɡeɪt/',
        audioUrl: null,
        userAudioUrl: null,
        types: [{ type: 'verb', meanings: ['make less severe, serious, or painful'] }],
        examples: ['Governments must take action to mitigate climate change.'],
        synonyms: ['alleviate', 'reduce', 'diminish'],
        wordForms: ['mitigation', 'mitigating', 'mitigated'],
        topics: ['environment', 'business'],
        level: 'advanced' as const,
        band: 7.0,
        grammar: 'Transitive verb, often used in formal contexts.',
      },
      {
        id: generateId(),
        word: 'paradigm',
        phonetic: '/ˈpærədaɪm/',
        audioUrl: null,
        userAudioUrl: null,
        types: [{ type: 'noun', meanings: ['a typical example or pattern of something'] }],
        examples: ['The discovery led to a paradigm shift in scientific thinking.'],
        synonyms: ['model', 'pattern', 'example'],
        wordForms: ['paradigmatic'],
        topics: ['science', 'education'],
        level: 'advanced' as const,
        band: 7.5,
        grammar: 'Countable noun. Often used in academic contexts.',
      },
      {
        id: generateId(),
        word: 'scrutinize',
        phonetic: '/ˈskruːtənaɪz/',
        audioUrl: null,
        userAudioUrl: null,
        types: [{ type: 'verb', meanings: ['examine or inspect closely and thoroughly'] }],
        examples: ['The committee will scrutinize the proposal before making a decision.'],
        synonyms: ['examine', 'inspect', 'analyze'],
        wordForms: ['scrutiny', 'scrutinizing'],
        topics: ['research', 'investigation'],
        level: 'advanced' as const,
        band: 7.0,
        grammar: 'Transitive verb.',
      },
      {
        id: generateId(),
        word: 'proliferate',
        phonetic: '/prəˈlɪfəreɪt/',
        audioUrl: null,
        userAudioUrl: null,
        types: [{ type: 'verb', meanings: ['increase rapidly in numbers'] }],
        examples: ['Fast food chains have proliferated across the country.'],
        synonyms: ['multiply', 'increase', 'spread'],
        wordForms: ['proliferation', 'proliferating'],
        topics: ['growth', 'technology'],
        level: 'advanced' as const,
        band: 7.5,
        grammar: 'Intransitive verb.',
      },
      {
        id: generateId(),
        word: 'exacerbate',
        phonetic: '/ɪɡˈzæsərbeɪt/',
        audioUrl: null,
        userAudioUrl: null,
        types: [{ type: 'verb', meanings: ['make a problem or bad situation worse'] }],
        examples: ['The drought exacerbated the food shortage.'],
        synonyms: ['worsen', 'aggravate', 'intensify'],
        wordForms: ['exacerbation', 'exacerbating'],
        topics: ['problems', 'health'],
        level: 'advanced' as const,
        band: 7.0,
        grammar: 'Transitive verb.',
      },
      {
        id: generateId(),
        word: 'ambiguous',
        phonetic: '/æmˈbɪɡjuəs/',
        audioUrl: null,
        userAudioUrl: null,
        types: [{ type: 'adjective', meanings: ['open to more than one interpretation'] }],
        examples: ['The politician\'s statement was deliberately ambiguous.'],
        synonyms: ['unclear', 'vague', 'equivocal'],
        wordForms: ['ambiguity', 'ambiguously'],
        topics: ['communication', 'language'],
        level: 'advanced' as const,
        band: 7.0,
        grammar: 'Adjective.',
      },
      {
        id: generateId(),
        word: 'pragmatic',
        phonetic: '/præɡˈmætɪk/',
        audioUrl: null,
        userAudioUrl: null,
        types: [{ type: 'adjective', meanings: ['dealing with things sensibly and realistically'] }],
        examples: ['We need to take a pragmatic approach to solving this problem.'],
        synonyms: ['practical', 'realistic', 'sensible'],
        wordForms: ['pragmatism', 'pragmatically'],
        topics: ['problem-solving', 'philosophy'],
        level: 'advanced' as const,
        band: 7.0,
        grammar: 'Adjective.',
      },
      {
        id: generateId(),
        word: 'resilient',
        phonetic: '/rɪˈzɪliənt/',
        audioUrl: null,
        userAudioUrl: null,
        types: [{ type: 'adjective', meanings: ['able to withstand or recover quickly from difficult conditions'] }],
        examples: ['Children are remarkably resilient and can adapt to change.'],
        synonyms: ['tough', 'strong', 'hardy'],
        wordForms: ['resilience', 'resiliently'],
        topics: ['psychology', 'strength'],
        level: 'advanced' as const,
        band: 7.0,
        grammar: 'Adjective.',
      },
      {
        id: generateId(),
        word: 'substantiate',
        phonetic: '/səbˈstænʃieɪt/',
        audioUrl: null,
        userAudioUrl: null,
        types: [{ type: 'verb', meanings: ['provide evidence to support or prove the truth of'] }],
        examples: ['The witness was unable to substantiate her claims.'],
        synonyms: ['verify', 'confirm', 'prove'],
        wordForms: ['substantiation', 'substantiating'],
        topics: ['evidence', 'proof'],
        level: 'advanced' as const,
        band: 7.5,
        grammar: 'Transitive verb.',
      },
      {
        id: generateId(),
        word: 'meticulous',
        phonetic: '/məˈtɪkjələs/',
        audioUrl: null,
        userAudioUrl: null,
        types: [{ type: 'adjective', meanings: ['showing great attention to detail'] }],
        examples: ['She is meticulous in her research and never overlooks details.'],
        synonyms: ['careful', 'thorough', 'precise'],
        wordForms: ['meticulously', 'meticulousness'],
        topics: ['work', 'quality'],
        level: 'advanced' as const,
        band: 7.0,
        grammar: 'Adjective.',
      },
      {
        id: generateId(),
        word: 'detrimental',
        phonetic: '/ˌdetrɪˈmentl/',
        audioUrl: null,
        userAudioUrl: null,
        types: [{ type: 'adjective', meanings: ['tending to cause harm'] }],
        examples: ['Smoking is detrimental to your health.'],
        synonyms: ['harmful', 'damaging', 'injurious'],
        wordForms: ['detriment', 'detrimentally'],
        topics: ['health', 'effects'],
        level: 'advanced' as const,
        band: 7.0,
        grammar: 'Adjective. Often followed by "to".',
      },
      {
        id: generateId(),
        word: 'eloquent',
        phonetic: '/ˈeləkwənt/',
        audioUrl: null,
        userAudioUrl: null,
        types: [{ type: 'adjective', meanings: ['fluent or persuasive in speaking or writing'] }],
        examples: ['She gave an eloquent speech that moved the audience.'],
        synonyms: ['articulate', 'fluent', 'persuasive'],
        wordForms: ['eloquence', 'eloquently'],
        topics: ['communication', 'speaking'],
        level: 'advanced' as const,
        band: 7.0,
        grammar: 'Adjective.',
      },
      {
        id: generateId(),
        word: 'unprecedented',
        phonetic: '/ʌnˈpresɪdentɪd/',
        audioUrl: null,
        userAudioUrl: null,
        types: [{ type: 'adjective', meanings: ['never done or known before'] }],
        examples: ['The pandemic created unprecedented challenges for healthcare systems.'],
        synonyms: ['unparalleled', 'unequaled', 'extraordinary'],
        wordForms: ['unprecedentedly'],
        topics: ['uniqueness', 'history'],
        level: 'advanced' as const,
        band: 7.5,
        grammar: 'Adjective.',
      },
      {
        id: generateId(),
        word: 'facilitate',
        phonetic: '/fəˈsɪlɪteɪt/',
        audioUrl: null,
        userAudioUrl: null,
        types: [{ type: 'verb', meanings: ['make an action or process easy or easier'] }],
        examples: ['Technology can facilitate communication across distances.'],
        synonyms: ['enable', 'assist', 'help'],
        wordForms: ['facilitation', 'facilitating', 'facilitator'],
        topics: ['help', 'process'],
        level: 'advanced' as const,
        band: 7.0,
        grammar: 'Transitive verb.',
      },
      // 12 từ mới
      {
        id: generateId(),
        word: 'intricate',
        phonetic: '/ˈɪntrɪkət/',
        audioUrl: null,
        userAudioUrl: null,
        types: [{ type: 'adjective', meanings: ['very complicated or detailed'] }],
        examples: ['The watch has an intricate mechanism with hundreds of tiny parts.'],
        synonyms: ['complex', 'complicated', 'elaborate'],
        wordForms: ['intricacy', 'intricately'],
        topics: ['complexity', 'design'],
        level: 'advanced' as const,
        band: 7.0,
        grammar: 'Adjective.',
      },
      {
        id: generateId(),
        word: 'contemplate',
        phonetic: '/ˈkɒntəmpleɪt/',
        audioUrl: null,
        userAudioUrl: null,
        types: [{ type: 'verb', meanings: ['think about carefully'] }],
        examples: ['She sat quietly contemplating her future.'],
        synonyms: ['consider', 'ponder', 'reflect'],
        wordForms: ['contemplation', 'contemplating', 'contemplative'],
        topics: ['thinking', 'reflection'],
        level: 'advanced' as const,
        band: 7.0,
        grammar: 'Transitive or intransitive verb.',
      },
      {
        id: generateId(),
        word: 'advocate',
        phonetic: '/ˈædvəkeɪt/',
        audioUrl: null,
        userAudioUrl: null,
        types: [
          { type: 'verb', meanings: ['publicly recommend or support'] },
          { type: 'noun', meanings: ['a person who publicly supports a cause'] }
        ],
        examples: ['She advocates for environmental protection.'],
        synonyms: ['support', 'champion', 'promote'],
        wordForms: ['advocacy', 'advocating'],
        topics: ['support', 'promotion'],
        level: 'advanced' as const,
        band: 7.0,
        grammar: 'Can be used as both verb and noun.',
      },
      {
        id: generateId(),
        word: 'coherent',
        phonetic: '/kəʊˈhɪərənt/',
        audioUrl: null,
        userAudioUrl: null,
        types: [{ type: 'adjective', meanings: ['logical and consistent'] }],
        examples: ['She presented a coherent argument that convinced everyone.'],
        synonyms: ['logical', 'consistent', 'rational'],
        wordForms: ['coherence', 'coherently'],
        topics: ['logic', 'organization'],
        level: 'advanced' as const,
        band: 7.0,
        grammar: 'Adjective.',
      },
      {
        id: generateId(),
        word: 'diminish',
        phonetic: '/dɪˈmɪnɪʃ/',
        audioUrl: null,
        userAudioUrl: null,
        types: [{ type: 'verb', meanings: ['make or become less'] }],
        examples: ['The pain will gradually diminish over time.'],
        synonyms: ['decrease', 'reduce', 'lessen'],
        wordForms: ['diminishing', 'diminished'],
        topics: ['reduction', 'decrease'],
        level: 'advanced' as const,
        band: 7.0,
        grammar: 'Transitive or intransitive verb.',
      },
      {
        id: generateId(),
        word: 'encompass',
        phonetic: '/ɪnˈkʌmpəs/',
        audioUrl: null,
        userAudioUrl: null,
        types: [{ type: 'verb', meanings: ['include comprehensively'] }],
        examples: ['The course encompasses all aspects of business management.'],
        synonyms: ['include', 'contain', 'comprise'],
        wordForms: ['encompassing', 'encompassed'],
        topics: ['inclusion', 'coverage'],
        level: 'advanced' as const,
        band: 7.5,
        grammar: 'Transitive verb.',
      },
      {
        id: generateId(),
        word: 'fluctuate',
        phonetic: '/ˈflʌktʃueɪt/',
        audioUrl: null,
        userAudioUrl: null,
        types: [{ type: 'verb', meanings: ['rise and fall irregularly'] }],
        examples: ['Prices fluctuate according to supply and demand.'],
        synonyms: ['vary', 'change', 'oscillate'],
        wordForms: ['fluctuation', 'fluctuating'],
        topics: ['change', 'variation'],
        level: 'advanced' as const,
        band: 7.0,
        grammar: 'Intransitive verb.',
      },
      {
        id: generateId(),
        word: 'inherent',
        phonetic: '/ɪnˈhɪərənt/',
        audioUrl: null,
        userAudioUrl: null,
        types: [{ type: 'adjective', meanings: ['existing as a natural or permanent part'] }],
        examples: ['There are inherent risks in any business venture.'],
        synonyms: ['intrinsic', 'innate', 'built-in'],
        wordForms: ['inherently', 'inherence'],
        topics: ['nature', 'characteristics'],
        level: 'advanced' as const,
        band: 7.5,
        grammar: 'Adjective. Often followed by "in".',
      },
      {
        id: generateId(),
        word: 'legitimate',
        phonetic: '/lɪˈdʒɪtɪmət/',
        audioUrl: null,
        userAudioUrl: null,
        types: [{ type: 'adjective', meanings: ['conforming to the law or rules'] }],
        examples: ['She has a legitimate reason for being absent.'],
        synonyms: ['legal', 'lawful', 'valid'],
        wordForms: ['legitimacy', 'legitimately'],
        topics: ['legality', 'validity'],
        level: 'advanced' as const,
        band: 7.0,
        grammar: 'Adjective.',
      },
      {
        id: generateId(),
        word: 'obsolete',
        phonetic: '/ˈɒbsəliːt/',
        audioUrl: null,
        userAudioUrl: null,
        types: [{ type: 'adjective', meanings: ['no longer in use or out of date'] }],
        examples: ['Many traditional skills have become obsolete in the digital age.'],
        synonyms: ['outdated', 'outmoded', 'antiquated'],
        wordForms: ['obsolescence'],
        topics: ['technology', 'change'],
        level: 'advanced' as const,
        band: 7.0,
        grammar: 'Adjective.',
      },
      {
        id: generateId(),
        word: 'profound',
        phonetic: '/prəˈfaʊnd/',
        audioUrl: null,
        userAudioUrl: null,
        types: [{ type: 'adjective', meanings: ['very great or intense'] }],
        examples: ['The book had a profound effect on my thinking.'],
        synonyms: ['deep', 'intense', 'extreme'],
        wordForms: ['profoundly', 'profundity'],
        topics: ['depth', 'significance'],
        level: 'advanced' as const,
        band: 7.5,
        grammar: 'Adjective.',
      },
    ];

    // Create all vocabulary items
    console.log('🌱 Creating vocabulary items...\n');
    const createdVocab = [];
    
    for (const vocab of newVocabulary) {
      try {
        // Check if word already exists
        const existing = await vocabularyRepo.getByWord(vocab.word);
        if (existing) {
          console.log(`⚠️  Skipped: ${vocab.word} (already exists)`);
          continue;
        }
        
        const created = await vocabularyRepo.create(vocab);
        createdVocab.push(created);
        console.log(`✅ Created: ${vocab.word} (Band ${vocab.band})`);
      } catch (error: any) {
        console.log(`⚠️  Skipped: ${vocab.word} (${error.message})`);
      }
    }

    // Get all vocabulary boards
    const allBoards = await boardsRepo.getAll();
    const vocabularyBoards = allBoards.filter(b => b.type === 'vocabulary');

    if (vocabularyBoards.length === 0) {
      console.log('\n⚠️  No vocabulary boards found. Please run seed-boards.ts first.');
      await sql.end();
      process.exit(1);
    }

    if (createdVocab.length === 0) {
      console.log('\n⚠️  No new vocabulary items were created (all words already exist).');
      await sql.end();
      process.exit(0);
    }

    console.log(`\n📋 Found ${vocabularyBoards.length} vocabulary boards`);
    console.log('🔄 Distributing new vocabulary items to boards...\n');

    // Distribute new vocabulary to boards evenly
    const vocabPerBoard = Math.ceil(createdVocab.length / vocabularyBoards.length);
    
    for (let i = 0; i < vocabularyBoards.length; i++) {
      const board = vocabularyBoards[i];
      const startIdx = i * vocabPerBoard;
      const endIdx = Math.min(startIdx + vocabPerBoard, createdVocab.length);
      const newVocabIds = createdVocab.slice(startIdx, endIdx).map(v => v.id);
      
      // Get existing item IDs
      const existingIds = Array.isArray(board.itemIds) ? board.itemIds : [];
      
      // Merge with new IDs
      const updatedIds = [...existingIds, ...newVocabIds];
      
      await boardsRepo.update(board.id, { itemIds: updatedIds });
      console.log(`✅ Added ${newVocabIds.length} items to "${board.name}" (Total: ${updatedIds.length})`);
    }

    console.log('\n🎉 Successfully seeded vocabulary items!');
    console.log(`📊 Total new vocabulary items created: ${createdVocab.length}`);
    
    // Close database connection
    await sql.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding vocabulary:', error);
    await sql.end();
    process.exit(1);
  }
}

seedMoreVocabulary();

// Script to add 4 more vocabulary words
async function addMoreWords() {
  try {
    const moreWords = [
      {
        id: generateId(),
        word: 'versatile',
        phonetic: '/ˈvɜːsətaɪl/',
        audioUrl: null,
        userAudioUrl: null,
        types: [{ type: 'adjective', meanings: ['able to adapt or be adapted to many different functions'] }],
        examples: ['She is a versatile actress who can play many different roles.'],
        synonyms: ['adaptable', 'flexible', 'multifaceted'],
        wordForms: ['versatility', 'versatilely'],
        topics: ['ability', 'adaptation'],
        level: 'advanced' as const,
        band: 7.0,
        grammar: 'Adjective.',
      },
      {
        id: generateId(),
        word: 'tangible',
        phonetic: '/ˈtændʒəbl/',
        audioUrl: null,
        userAudioUrl: null,
        types: [{ type: 'adjective', meanings: ['perceptible by touch', 'clear and definite'] }],
        examples: ['We need to see tangible results from this project.'],
        synonyms: ['concrete', 'real', 'physical', 'palpable'],
        wordForms: ['tangibly', 'tangibility'],
        topics: ['reality', 'evidence'],
        level: 'advanced' as const,
        band: 7.0,
        grammar: 'Adjective.',
      },
      {
        id: generateId(),
        word: 'rigorous',
        phonetic: '/ˈrɪɡərəs/',
        audioUrl: null,
        userAudioUrl: null,
        types: [{ type: 'adjective', meanings: ['extremely thorough and careful'] }],
        examples: ['The study followed a rigorous scientific methodology.'],
        synonyms: ['strict', 'thorough', 'meticulous', 'stringent'],
        wordForms: ['rigorously', 'rigor'],
        topics: ['standards', 'quality'],
        level: 'advanced' as const,
        band: 7.5,
        grammar: 'Adjective.',
      },
      {
        id: generateId(),
        word: 'plausible',
        phonetic: '/ˈplɔːzəbl/',
        audioUrl: null,
        userAudioUrl: null,
        types: [{ type: 'adjective', meanings: ['seeming reasonable or probable'] }],
        examples: ['Her explanation sounds plausible.'],
        synonyms: ['believable', 'credible', 'reasonable', 'likely'],
        wordForms: ['plausibility', 'plausibly'],
        topics: ['reasoning', 'credibility'],
        level: 'advanced' as const,
        band: 7.0,
        grammar: 'Adjective.',
      },
    ];

    console.log('\n🌱 Adding 4 more vocabulary items...\n');
    const created = [];
    
    for (const vocab of moreWords) {
      try {
        const existing = await vocabularyRepo.getByWord(vocab.word);
        if (existing) {
          console.log(`⚠️  Skipped: ${vocab.word} (already exists)`);
          continue;
        }
        
        const item = await vocabularyRepo.create(vocab);
        created.push(item);
        console.log(`✅ Created: ${vocab.word} (Band ${vocab.band})`);
      } catch (error: any) {
        console.log(`⚠️  Skipped: ${vocab.word} (${error.message})`);
      }
    }

    if (created.length > 0) {
      const allBoards = await boardsRepo.getAll();
      const vocabularyBoards = allBoards.filter(b => b.type === 'vocabulary');
      
      console.log(`\n🔄 Distributing to ${vocabularyBoards.length} boards...\n`);
      
      const vocabPerBoard = Math.ceil(created.length / vocabularyBoards.length);
      
      for (let i = 0; i < vocabularyBoards.length; i++) {
        const board = vocabularyBoards[i];
        const startIdx = i * vocabPerBoard;
        const endIdx = Math.min(startIdx + vocabPerBoard, created.length);
        const newIds = created.slice(startIdx, endIdx).map(v => v.id);
        
        const existingIds = Array.isArray(board.itemIds) ? board.itemIds : [];
        const updatedIds = [...existingIds, ...newIds];
        
        await boardsRepo.update(board.id, { itemIds: updatedIds });
        console.log(`✅ Added ${newIds.length} items to "${board.name}" (Total: ${updatedIds.length})`);
      }
      
      console.log(`\n🎉 Added ${created.length} more vocabulary items!`);
    }
    
    await sql.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    await sql.end();
    process.exit(1);
  }
}

// Run if called directly with --more flag
if (process.argv.includes('--more')) {
  addMoreWords();
}
