import { boardsRepo } from '../src/lib/repositories/boards';
import { vocabularyRepo } from '../src/lib/repositories/vocabulary';
import { expressionsRepo } from '../src/lib/repositories/expressions';

async function seedBoardItems() {
  try {
    // Get all boards
    const allBoards = await boardsRepo.getAll();
    
    // Get all vocabulary
    const allVocabulary = await vocabularyRepo.getAll();
    
    // Get all expressions
    const allExpressions = await expressionsRepo.getAll();

    // Assign vocabulary to vocabulary boards
    const vocabularyBoards = allBoards.filter(b => b.type === 'vocabulary');
    const vocabPerBoard = Math.ceil(allVocabulary.length / vocabularyBoards.length);
    
    for (let i = 0; i < vocabularyBoards.length; i++) {
      const board = vocabularyBoards[i];
      const startIdx = i * vocabPerBoard;
      const endIdx = Math.min(startIdx + vocabPerBoard, allVocabulary.length);
      const vocabIds = allVocabulary.slice(startIdx, endIdx).map(v => v.id);
      
      await boardsRepo.update(board.id, { itemIds: vocabIds });
      console.log(`✅ Added ${vocabIds.length} vocabulary items to "${board.name}"`);
    }

    // Assign expressions to idioms boards
    const idiomsBoards = allBoards.filter(b => b.type === 'idioms');
    const expPerBoard = Math.ceil(allExpressions.length / idiomsBoards.length);
    
    for (let i = 0; i < idiomsBoards.length; i++) {
      const board = idiomsBoards[i];
      const startIdx = i * expPerBoard;
      const endIdx = Math.min(startIdx + expPerBoard, allExpressions.length);
      const expIds = allExpressions.slice(startIdx, endIdx).map(e => e.id);
      
      await boardsRepo.update(board.id, { itemIds: expIds });
      console.log(`✅ Added ${expIds.length} expression items to "${board.name}"`);
    }

    console.log('\n🎉 Successfully seeded all board items!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding board items:', error);
    process.exit(1);
  }
}

seedBoardItems();
