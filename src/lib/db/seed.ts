import { db } from './client';
import { vocabulary, idioms, phrases, topics } from './schema';
import vocabularyData from '../../data/vocabulary.json';
import idiomsData from '../../data/idioms.json';
import phrasesData from '../../data/phrases.json';
import topicsData from '../../data/topics.json';

async function seed() {
  console.log('🌱 Seeding database...');

  try {
    // Seed topics
    console.log('📚 Seeding topics...');
    const topicsToInsert = topicsData.map(topic => ({
      ...topic,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await db.insert(topics).values(topicsToInsert).onConflictDoNothing();
    console.log(`✅ Seeded ${topicsData.length} topics`);

    // Seed vocabulary
    console.log('📖 Seeding vocabulary...');
    const vocabularyToInsert = vocabularyData.map(vocab => ({
      ...vocab,
      createdAt: new Date(vocab.createdAt),
      updatedAt: new Date(vocab.updatedAt),
    }));
    await db.insert(vocabulary).values(vocabularyToInsert).onConflictDoNothing();
    console.log(`✅ Seeded ${vocabularyData.length} vocabulary entries`);

    // Seed idioms
    console.log('💬 Seeding idioms...');
    const idiomsToInsert = idiomsData.map(idiom => ({
      ...idiom,
      createdAt: new Date(idiom.createdAt),
      updatedAt: new Date(idiom.updatedAt),
    }));
    await db.insert(idioms).values(idiomsToInsert).onConflictDoNothing();
    console.log(`✅ Seeded ${idiomsData.length} idioms`);

    // Seed phrases
    console.log('✍️ Seeding phrases...');
    const phrasesToInsert = phrasesData.map(phrase => ({
      ...phrase,
      createdAt: new Date(phrase.createdAt),
      updatedAt: new Date(phrase.updatedAt),
    }));
    await db.insert(phrases).values(phrasesToInsert).onConflictDoNothing();
    console.log(`✅ Seeded ${phrasesData.length} phrases`);

    console.log('🎉 Database seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }

  process.exit(0);
}

seed();
