import { boardsRepo } from '../src/lib/repositories/boards';

async function checkBoards() {
  const boards = await boardsRepo.getAll();
  console.log('\nBoards:');
  boards.forEach(b => {
    console.log(`- ${b.name} (${b.type}): ${(b.itemIds as string[]).length} items`);
  });
  process.exit(0);
}

checkBoards();
