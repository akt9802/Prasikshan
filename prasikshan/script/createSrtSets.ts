import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';
import SrtQuestion from '../models/SrtQuestion';
import SrtSet from '../models/SrtSet';

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ Please define the MONGODB_URI environment variable inside .env');
  process.exit(1);
}

const SET_SIZE = 60; // Each SRT set contains 60 situations

async function createSrtSets() {
  try {
    // 1. Connect to MongoDB
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI!);
    console.log('✅ Connected to MongoDB successfully');

    // 2. Fetch all SRT questions from the raw "SRT" collection, sorted by situation_id
    console.log('📥 Fetching SRT questions from the "SRT" collection...');
    // Sorting by situation_id ensures the natural original ordering is preserved
    const questions = await SrtQuestion.find({}).sort({ situation_id: 1, createdAt: 1 });

    if (questions.length === 0) {
      console.warn('⚠️  Warning: No questions found in the SRT collection. Nothing to migrate.');
      process.exit(0);
    }

    console.log(`📊 Found ${questions.length} situations in the database.`);

    // 3. Clear old SrtSets to avoid duplicates if re-running
    console.log('🗑️  Clearing existing SrtSets...');
    const deleteResult = await SrtSet.deleteMany({});
    console.log(`   Deleted ${deleteResult.deletedCount} existing sets.`);

    // 4. Group questions into sets of SET_SIZE (60 per set)
    const srtSets = [];
    const totalSets = Math.ceil(questions.length / SET_SIZE);

    for (let i = 0; i < questions.length; i += SET_SIZE) {
      const chunk = questions.slice(i, i + SET_SIZE);
      const setNumber = Math.floor(i / SET_SIZE) + 1;

      const formattedQuestions = chunk.map((q) => ({
        situation: q.situation,
        sample_reaction: q.sample_reaction || '',
      }));

      srtSets.push({
        setName: `Set ${setNumber}`,
        questions: formattedQuestions,
      });

      console.log(
        `   📦 Prepared Set ${setNumber}/${totalSets} — ${formattedQuestions.length} situations`
      );
    }

    // 5. Insert all sets into the SrtSet collection
    if (srtSets.length > 0) {
      console.log(`\n💾 Inserting ${srtSets.length} SrtSets into the database...`);
      await SrtSet.insertMany(srtSets);
      console.log(`✅ Successfully created ${srtSets.length} SrtSets.`);
    }

    // 6. Summary
    console.log('\n--- Migration Summary ---');
    console.log(`  Total situations migrated : ${questions.length}`);
    console.log(`  Total sets created        : ${srtSets.length}`);
    console.log(`  Situations per set        : ${SET_SIZE}`);
    if (questions.length % SET_SIZE !== 0) {
      console.log(
        `  ⚠️  Last set has only ${questions.length % SET_SIZE} situations (incomplete set)`
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

createSrtSets();
