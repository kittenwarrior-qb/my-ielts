import 'dotenv/config';
import { boardsRepo } from '../src/lib/repositories/boards';
import { lessonsRepo } from '../src/lib/repositories/lessons';
import { grammarRepo } from '../src/lib/repositories/grammar';
import { vocabularyRepo } from '../src/lib/repositories/vocabulary';
import { expressionsRepo } from '../src/lib/repositories/expressions';
import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL || '');

async function cleanOrphanedData() {
  console.log('🧹 Starting cleanup of orphaned data...\n');

  try {
    // Get all boards
    const allBoards = await boardsRepo.getAll();
    const boardIds = new Set(allBoards.map(b => b.id));
    console.log(`📋 Found ${allBoards.length} boards in database\n`);

    // 1. Clean orphaned lessons (lessons pointing to non-existent boards)
    console.log('🔍 Checking for orphaned lessons...');
    const allLessons = await sql`SELECT * FROM lessons`;
    let orphanedLessonsCount = 0;
    let orphanedGrammarFromLessons = 0;

    for (const lesson of allLessons) {
      if (!boardIds.has(lesson.board_id)) {
        console.log(`  ❌ Found orphaned lesson: "${lesson.title}" (board_id: ${lesson.board_id})`);
        
        // Delete grammar items in this orphaned lesson
        const itemIds = Array.isArray(lesson.item_ids) ? lesson.item_ids : [];
        if (itemIds.length > 0) {
          console.log(`     Deleting ${itemIds.length} grammar items from orphaned lesson...`);
          for (const itemId of itemIds) {
            await grammarRepo.delete(itemId as string);
            orphanedGrammarFromLessons++;
          }
        }
        
        // Delete the orphaned lesson
        await lessonsRepo.delete(lesson.id);
        orphanedLessonsCount++;
      }
    }
    console.log(`✅ Deleted ${orphanedLessonsCount} orphaned lessons and ${orphanedGrammarFromLessons} grammar items\n`);

    // 2. Clean orphaned grammar items (not in any board or lesson)
    console.log('🔍 Checking for orphaned grammar items...');
    const allGrammarItems = await sql`SELECT * FROM grammar`;
    const validGrammarIds = new Set<string>();

    // Collect all grammar IDs that are referenced
    for (const board of allBoards) {
      if (board.type === 'grammar') {
        const itemIds = Array.isArray(board.itemIds) ? board.itemIds : [];
        itemIds.forEach((id: string) => validGrammarIds.add(id));
      }
    }

    const validLessons = await lessonsRepo.getAll();
    for (const lesson of validLessons) {
      const itemIds = Array.isArray(lesson.itemIds) ? lesson.itemIds : [];
      itemIds.forEach((id: string) => validGrammarIds.add(id));
    }

    let orphanedGrammarCount = 0;
    for (const grammar of allGrammarItems) {
      if (!validGrammarIds.has(grammar.id)) {
        console.log(`  ❌ Found orphaned grammar: "${grammar.title}" (id: ${grammar.id})`);
        await grammarRepo.delete(grammar.id);
        orphanedGrammarCount++;
      }
    }
    console.log(`✅ Deleted ${orphanedGrammarCount} orphaned grammar items\n`);

    // 3. Clean orphaned vocabulary items (not in any board)
    console.log('🔍 Checking for orphaned vocabulary items...');
    const allVocabularyItems = await sql`SELECT * FROM vocabulary`;
    const validVocabularyIds = new Set<string>();

    for (const board of allBoards) {
      if (board.type === 'vocabulary') {
        const itemIds = Array.isArray(board.itemIds) ? board.itemIds : [];
        itemIds.forEach((id: string) => validVocabularyIds.add(id));
      }
    }

    let orphanedVocabularyCount = 0;
    for (const vocab of allVocabularyItems) {
      if (!validVocabularyIds.has(vocab.id)) {
        console.log(`  ❌ Found orphaned vocabulary: "${vocab.word}" (id: ${vocab.id})`);
        await vocabularyRepo.delete(vocab.id);
        orphanedVocabularyCount++;
      }
    }
    console.log(`✅ Deleted ${orphanedVocabularyCount} orphaned vocabulary items\n`);

    // 4. Clean orphaned expression/idiom items (not in any board)
    console.log('🔍 Checking for orphaned expression/idiom items...');
    const allExpressionItems = await sql`SELECT * FROM expressions`;
    const validExpressionIds = new Set<string>();

    for (const board of allBoards) {
      if (board.type === 'idioms') {
        const itemIds = Array.isArray(board.itemIds) ? board.itemIds : [];
        itemIds.forEach((id: string) => validExpressionIds.add(id));
      }
    }

    let orphanedExpressionCount = 0;
    for (const expr of allExpressionItems) {
      if (!validExpressionIds.has(expr.id)) {
        console.log(`  ❌ Found orphaned expression: "${expr.expression}" (id: ${expr.id})`);
        await expressionsRepo.delete(expr.id);
        orphanedExpressionCount++;
      }
    }
    console.log(`✅ Deleted ${orphanedExpressionCount} orphaned expression items\n`);

    // Summary
    console.log('📊 Cleanup Summary:');
    console.log(`   - Orphaned lessons: ${orphanedLessonsCount}`);
    console.log(`   - Grammar items from orphaned lessons: ${orphanedGrammarFromLessons}`);
    console.log(`   - Orphaned grammar items: ${orphanedGrammarCount}`);
    console.log(`   - Orphaned vocabulary items: ${orphanedVocabularyCount}`);
    console.log(`   - Orphaned expression items: ${orphanedExpressionCount}`);
    console.log(`   - Total items deleted: ${orphanedLessonsCount + orphanedGrammarFromLessons + orphanedGrammarCount + orphanedVocabularyCount + orphanedExpressionCount}`);
    console.log('\n✨ Cleanup completed successfully!');

  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    throw error;
  } finally {
    await sql.end();
  }
}

cleanOrphanedData();
