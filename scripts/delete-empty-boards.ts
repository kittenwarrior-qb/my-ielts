import { boardsRepo } from '../src/lib/repositories/boards';

async function deleteEmptyBoards() {
  try {
    const targetTypes = ['idioms', 'vocabulary', 'grammar'] as const;
    
    console.log('🔍 Đang tìm các board rỗng...\n');
    
    let totalDeleted = 0;
    
    for (const type of targetTypes) {
      console.log(`📋 Kiểm tra boards loại: ${type}`);
      
      // Lấy tất cả boards theo type
      const boards = await boardsRepo.getAll({ type });
      
      // Lọc các board rỗng (không có items)
      const emptyBoards = boards.filter(board => {
        const itemIds = board.itemIds as string[];
        return !itemIds || itemIds.length === 0;
      });
      
      if (emptyBoards.length === 0) {
        console.log(`  ✓ Không có board rỗng\n`);
        continue;
      }
      
      console.log(`  Tìm thấy ${emptyBoards.length} board rỗng:`);
      
      // Xóa từng board rỗng
      for (const board of emptyBoards) {
        const deleted = await boardsRepo.delete(board.id);
        if (deleted) {
          console.log(`  ✅ Đã xóa: "${board.name}" (ID: ${board.id})`);
          totalDeleted++;
        } else {
          console.log(`  ❌ Không thể xóa: "${board.name}" (ID: ${board.id})`);
        }
      }
      
      console.log('');
    }
    
    console.log(`\n🎉 Hoàn thành! Đã xóa ${totalDeleted} board rỗng.`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi khi xóa boards:', error);
    process.exit(1);
  }
}

deleteEmptyBoards();
