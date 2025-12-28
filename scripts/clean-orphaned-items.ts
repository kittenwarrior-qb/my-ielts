import { vocabularyRepo } from '../src/lib/repositories/vocabulary';
import { expressionsRepo } from '../src/lib/repositories/expressions';
import { grammarRepo } from '../src/lib/repositories/grammar';
import { boardsRepo } from '../src/lib/repositories/boards';
import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}
const sql = postgres(connectionString);

async function cleanOrphanedItems() {
  try {
    console.log('🧹 Cleaning orphaned items from database...\n');

    // Get all boards
    const allBoards = await boardsRepo.getAll();
    const vocabularyBoards = allBoards.filter(b => b.type === 'vocabulary');
    const idiomsBoards = allBoards.filter(b => b.type === 'idioms');
    const grammarBoards = allBoards.filter(b => b.type === 'grammar');

    let totalDeleted = 0;

    // ===== Clean Vocabulary =====
    console.log('📚 Checking vocabulary items...');
    const vocabularyIdsInBoards = new Set<string>();
    for (const board of vocabularyBoards) {
      const itemIds = Array.isArray(board.itemIds) ? board.itemIds : [];
      itemIds.forEach(id => vocabularyIdsInBoards.add(id as string));
    }

    const allVocabulary = await vocabularyRepo.getAll();
    const orphanedVocabulary = allVocabulary.filter(
      item => !vocabularyIdsInBoards.has(item.id)
    );

    console.log(`   Found ${vocabularyBoards.length} vocabulary boards`);
    console.log(`   Total vocabulary in boards: ${vocabularyIdsInBoards.size}`);
    console.log(`   Total vocabulary in database: ${allVocabulary.length}`);
    console.log(`   Orphaned vocabulary items: ${orphanedVocabulary.length}\n`);

    if (orphanedVocabulary.length > 0) {
      console.log('🗑️  Deleting orphaned vocabulary items:');
      for (const item of orphanedVocabulary) {
        const deleted = await vocabularyRepo.delete(item.id);
        if (deleted) {
          totalDeleted++;
          console.log(`   ✅ Deleted: ${item.word}`);
        }
      }
      console.log('');
    }

    // ===== Clean Expressions (Idioms) =====
    console.log('💬 Checking expression/idiom items...');
    const expressionIdsInBoards = new Set<string>();
    for (const board of idiomsBoards) {
      const itemIds = Array.isArray(board.itemIds) ? board.itemIds : [];
      itemIds.forEach(id => expressionIdsInBoards.add(id as string));
    }

    const allExpressions = await expressionsRepo.getAll();
    const orphanedExpressions = allExpressions.filter(
      item => !expressionIdsInBoards.has(item.id)
    );

    console.log(`   Found ${idiomsBoards.length} idioms boards`);
    console.log(`   Total expressions in boards: ${expressionIdsInBoards.size}`);
    console.log(`   Total expressions in database: ${allExpressions.length}`);
    console.log(`   Orphaned expression items: ${orphanedExpressions.length}\n`);

    if (orphanedExpressions.length > 0) {
      console.log('🗑️  Deleting orphaned expression items:');
      for (const item of orphanedExpressions) {
        const deleted = await expressionsRepo.delete(item.id);
        if (deleted) {
          totalDeleted++;
          console.log(`   ✅ Deleted: ${item.expression}`);
        }
      }
      console.log('');
    }

    // ===== Clean Grammar =====
    console.log('📖 Checking grammar items...');
    const grammarIdsInBoards = new Set<string>();
    for (const board of grammarBoards) {
      const itemIds = Array.isArray(board.itemIds) ? board.itemIds : [];
      itemIds.forEach(id => grammarIdsInBoards.add(id as string));
    }

    const allGrammar = await grammarRepo.getAll();
    const orphanedGrammar = allGrammar.filter(
      item => !grammarIdsInBoards.has(item.id)
    );

    console.log(`   Found ${grammarBoards.length} grammar boards`);
    console.log(`   Total grammar in boards: ${grammarIdsInBoards.size}`);
    console.log(`   Total grammar in database: ${allGrammar.length}`);
    console.log(`   Orphaned grammar items: ${orphanedGrammar.length}\n`);

    if (orphanedGrammar.length > 0) {
      console.log('🗑️  Deleting orphaned grammar items:');
      for (const item of orphanedGrammar) {
        const deleted = await grammarRepo.delete(item.id);
        if (deleted) {
          totalDeleted++;
          console.log(`   ✅ Deleted: ${item.title}`);
        }
      }
      console.log('');
    }

    // ===== Summary =====
    if (totalDeleted === 0) {
      console.log('✅ No orphaned items found. Database is clean!');
    } else {
      console.log(`🎉 Cleanup complete! Deleted ${totalDeleted} orphaned items total.`);
    }

    await sql.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error cleaning items:', error);
    await sql.end();
    process.exit(1);
  }
}

cleanOrphanedItems();
