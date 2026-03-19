import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';
import WatQuestion from '../models/WatQuestion';
import WatSet from '../models/WatSet';

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ Please define the MONGODB_URI environment variable inside .env');
  process.exit(1);
}

const SET_SIZE = 60; // Each WAT set contains 60 questions

async function createWatSets() {
  try {
    // 1. Connect to MongoDB
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI!);
    console.log('✅ Connected to MongoDB successfully');

    // 2. Fetch all WAT questions from the raw "WAT" collection, sorted by creation order
    console.log('📥 Fetching WAT questions from the "WAT" collection...');
    const questions = await WatQuestion.find({}).sort({ createdAt: 1 });

    if (questions.length === 0) {
      console.warn('⚠️  Warning: No questions found in the WAT collection. Nothing to migrate.');
      process.exit(0);
    }

    console.log(`📊 Found ${questions.length} questions in the database.`);

    // 3. Clear old WatSets to avoid duplicates
    console.log('🗑️  Clearing existing WatSets...');
    const deleteResult = await WatSet.deleteMany({});
    console.log(`   Deleted ${deleteResult.deletedCount} existing sets.`);

    // 4. Group questions into sets of SET_SIZE (60 per set)
    const watSets = [];
    const totalSets = Math.ceil(questions.length / SET_SIZE);

    for (let i = 0; i < questions.length; i += SET_SIZE) {
      const chunk = questions.slice(i, i + SET_SIZE);
      const setNumber = Math.floor(i / SET_SIZE) + 1;

      const formattedQuestions = chunk.map((q) => ({
        word: q.word,
        sentences: q.sentences,
      }));

      watSets.push({
        setName: `Set ${setNumber}`,
        questions: formattedQuestions,
      });

      console.log(
        `   📦 Prepared Set ${setNumber}/${totalSets} — ${formattedQuestions.length} questions`
      );
    }

    // 5. Insert all sets into the WatSet collection
    if (watSets.length > 0) {
      console.log(`\n💾 Inserting ${watSets.length} WatSets into the database...`);
      await WatSet.insertMany(watSets);
      console.log(`✅ Successfully created ${watSets.length} WatSets.`);
    }

    // 6. Summary
    console.log('\n--- Migration Summary ---');
    console.log(`  Total questions migrated : ${questions.length}`);
    console.log(`  Total sets created       : ${watSets.length}`);
    console.log(`  Questions per set        : ${SET_SIZE}`);
    if (questions.length % SET_SIZE !== 0) {
      console.log(
        `  ⚠️  Last set has only ${questions.length % SET_SIZE} questions (incomplete set)`
      );
    }
    console.log('-------------------------');
  } catch (error) {
    console.error('❌ Critical Error:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed.');
  }
}

createWatSets();
