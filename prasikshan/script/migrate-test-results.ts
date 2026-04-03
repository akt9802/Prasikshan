import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

/**
 * Migration script to move testsTaken from User model to UserResult model.
 * Run this script to restructure your database.
 * 
 * Usage: npx tsx script/migrate-test-results.ts
 */

const migrate = async () => {
  try {
    console.log('--- Starting Migration ---');
    console.log('URI check:', process.env.MONGODB_URI ? 'Defined' : 'UNDEFINED');
    
    // Dynamically import models after dotenv setup
    const { default: connectDB } = await import('../lib/db');
    const { default: User } = await import('../models/User');
    const { default: UserResult } = await import('../models/UserResult');

    await connectDB();
    console.log('Connected to database.');

    const users = await User.find({});
    console.log(`Found ${users.length} users to process.`);

    for (const user of users) {
      console.log(`Processing user: ${user.username} (${user._id})`);

      // Check if UserResult already exists for this user
      let userResult = await UserResult.findOne({ userId: user._id });
      
      if (!userResult) {
        userResult = new UserResult({
          userId: user._id,
          oir: [],
          ppdt: [],
          tat: [],
          wat: [],
          srt: [],
          lecturette: [],
          pi: [],
        });
      }

      const testsTaken = (user as any).testsTaken || [];
      
      if (testsTaken.length > 0) {
        console.log(`- Migrating ${testsTaken.length} test results...`);
        
        for (const test of testsTaken) {
          // Normalize test name
          const testName = (test.toObject?.().testName || test.testName || 'Unknown').toUpperCase();
          
          if (testName.includes('OIR')) {
            userResult.oir.push(test);
          } else if (testName.includes('PPDT')) {
            userResult.ppdt.push(test);
          } else if (testName.includes('TAT')) {
            userResult.tat.push(test);
          } else if (testName.includes('WAT')) {
            userResult.wat.push(test);
          } else if (testName.includes('SRT')) {
            userResult.srt.push(test);
          } else if (testName.includes('LECTURETTE')) {
            userResult.lecturette.push(test);
          } else if (testName.includes('PI') || testName.includes('PERSONAL INTERVIEW')) {
            userResult.pi.push(test);
          } else {
            console.warn(`  ! Unknown test type found: ${testName}`);
          }
        }

        await userResult.save();
        console.log(`  ✓ Successfully migrated results for ${user.username}`);
      } else {
        console.log(`  - No results to migrate for ${user.username}`);
      }
    }

    console.log('--- Migration Completed Successfully ---');
    process.exit(0);
  } catch (error) {
    console.error('--- Migration Failed! ---');
    console.error(error);
    process.exit(1);
  }
};

migrate();
