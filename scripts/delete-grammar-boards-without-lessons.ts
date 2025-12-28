import { boardsRepo } from '../src/lib/repositories/boards';
import { lessonsRepo } from '../src/lib/repositories/lessons';
import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}
const sql = postgres(connectionString);

async function deleteGrammarBoardsWithoutLessons() {
  try {
    console.log('🔍 Đang tìm các board grammar không có lessons...\n');

    // Lấy tất cả boards grammar
    const grammarBoards = await boardsRepo.getAll({ type: 'grammar' });
    console.log(`📋 Tìm thấy ${grammarBoards.length} grammar boards\n`);

    let totalDeleted = 0;
    const boardsToDelete: Array<{ id: string; name: string }> = [];

    // Kiểm tra từng board xem có lessons không
    for (const board of grammarBoards) {
      const lessons = await lessonsRepo.getAll(board.id);
      
      if (lessons.length === 0) {
        boardsToDelete.push({ id: board.id, name: board.name });
        console.log(`  ❌ Board không có lessons: "${board.name}" (ID: ${board.id})`);
      } else {
        console.log(`  ✓ Board có ${lessons.length} lessons: "${board.name}"`);
      }
    }

    console.log(`\n📊 Tổng kết:`);
    console.log(`   - Tổng số grammar boards: ${grammarBoards.length}`);
    console.log(`   - Boards có lessons: ${grammarBoards.length - boardsToDelete.length}`);
    console.log(`   - Boards không có lessons: ${boardsToDelete.length}\n`);

    if (boardsToDelete.length === 0) {
      console.log('✅ Không có board nào cần xóa!');
      await sql.end();
      process.exit(0);
      return;
    }

    // Xóa các boards không có lessons
    console.log('🗑️  Đang xóa các boards không có lessons...\n');
    for (const board of boardsToDelete) {
      const deleted = await boardsRepo.delete(board.id);
      if (deleted) {
        totalDeleted++;
        console.log(`  ✅ Đã xóa: "${board.name}" (ID: ${board.id})`);
      } else {
        console.log(`  ❌ Không thể xóa: "${board.name}" (ID: ${board.id})`);
      }
    }

    console.log(`\n🎉 Hoàn thành! Đã xóa ${totalDeleted}/${boardsToDelete.length} grammar boards không có lessons.`);
    
    await sql.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi khi xóa boards:', error);
    await sql.end();
    process.exit(1);
  }
}

deleteGrammarBoardsWithoutLessons();
