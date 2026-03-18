import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';
import OirQuestion from '../models/OirQuestion';
import OirSet from '../models/OirSet';

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Please define the MONGODB_URI environment variable inside .env');
  process.exit(1);
}

async function createOirSets() {
  try {
    // 1. Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI!);
    console.log('Connected to MongoDB successfully');

    // 2. Clear old sets to avoid duplicates
    console.log('Clearing old OirSets...');
    const deleteResult = await OirSet.deleteMany({});
    console.log(`Deleted ${deleteResult.deletedCount} existing sets.`);

    // 3. Fetch all OirQuestions (getting all data: question, options, answer)
    console.log('Fetching OirQuestions...');
    const questions = await OirQuestion.find({}).sort({ createdAt: 1 });
    
    if (questions.length === 0) {
      console.warn('Warning: No questions found in OirQuestion collection.');
      process.exit(0);
    }

    console.log(`Found ${questions.length} questions in the database.`);

    // 4. Group questions into sets of 40 (storing full question data)
    const SET_SIZE = 40;
    const oirSets = [];

    for (let i = 0; i < questions.length; i += SET_SIZE) {
      const chunk = questions.slice(i, i + SET_SIZE);
      const setNumber = Math.floor(i / SET_SIZE) + 1;
      
      // We map the question data directly into the set
      const formattedQuestions = chunk.map(q => ({
        question: q.question,
        options: q.options,
        answer: q.answer
      }));

      oirSets.push({
        setName: `Set ${setNumber}`,
        questions: formattedQuestions,
      });
    }

    // 5. Insert the new sets with full question data
    if (oirSets.length > 0) {
      console.log(`Creating ${oirSets.length} sets with full question data...`);
      await OirSet.insertMany(oirSets);
      console.log(`Successfully created ${oirSets.length} sets.`);
    }

  } catch (error) {
    console.error('Critical Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
  }
}

createOirSets();
