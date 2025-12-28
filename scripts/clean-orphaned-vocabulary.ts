import { vocabularyRepo } from '../src/lib/repositories/vocabulary';
import { boardsRepo } from '../src/lib/repositories/boards';
import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}
const sql = postgres(connectionString);

async function cleanOrphanedVocabulary() {
  try {
    console.log('🧹 Cleaning orphaned vocabulary items...\n');

    // Get all boards
    const allBoards = await boardsRepo.getAll();
    const vocabularyBoards = allBoards.filter(b => b.type === 'vocabulary');

    // Collect all vocabulary IDs that are in boards
    const vocabularyIdsInBoards = new Set<string>();
    for (const board of vocabularyBoards) {
      const itemIds = Array.isArray(board.itemIds) ? board.itemIds : [];
      itemIds.forEach(id => vocabularyIdsInBoards.add(id as string));
    }

    console.log(`📋 Found ${vocabularyBoards.length} vocabulary boards`);
    console.log(`📝 Total vocabulary items in boards: ${vocabularyIdsInBoards.size}\n`);

    // Get all vocabulary items
    const allVocabulary = await vocabularyRepo.getAll();
    console.log(`📚 Total vocabulary items in database: ${allVocabulary.length}\n`);

    // Find orphaned items (not in any board)
    const orphanedItems = allVocabulary.filter(
      vocab => !vocabularyIdsInBoards.has(vocab.id)
    );

    if (orphanedItems.length === 0) {
      console.log('✅ No orphaned vocabulary items found. Database is clean!');
      await sql.end();
      process.exit(0);
    }

    console.log(`🗑️  Found ${orphanedItems.length} orphaned vocabulary items:\n`);
    orphanedItems.forEach(item => {
      console.log(`   - ${item.word} (${item.id})`);
    });

    console.log('\n🗑️  Deleting orphaned items...\n');

    let deletedCount = 0;
    for (const item of orphanedItems) {
      const deleted = await vocabularyRepo.delete(item.id);
      if (deleted) {
        deletedCount++;
        console.log(`✅ Deleted: ${item.word}`);
      } else {
        console.log(`⚠️  Failed to delete: ${item.word}`);
      }
    }

    console.log(`\n🎉 Cleanup complete! Deleted ${deletedCount} orphaned vocabulary items.`);
    
    await sql.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error cleaning vocabulary:', error);
    await sql.end();
    process.exit(1);
  }
}

cleanOrphanedVocabulary();
