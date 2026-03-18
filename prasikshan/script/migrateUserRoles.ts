import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';
import User from '../models/User';

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ Please define the MONGODB_URI environment variable inside .env');
  process.exit(1);
}

async function migrateUserRoles() {
  try {
    // 1. Connect to MongoDB
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI!);
    console.log('✅ Connected to MongoDB successfully\n');

    // 2. Find users who do NOT have the role field set
    const usersWithoutRole = await User.countDocuments({ role: { $exists: false } });
    console.log(`📊 Users without a role field: ${usersWithoutRole}`);

    if (usersWithoutRole === 0) {
      console.log('✅ All users already have a role assigned. Nothing to migrate.');
    } else {
      // 3. Update ALL users missing the role field to have role: 'user'
      // This does NOT overwrite users who already have a role set (e.g., an existing admin)
      const result = await User.updateMany(
        { role: { $exists: false } }, // Only target documents without the role field
        { $set: { role: 'user' } }
      );
      console.log(`✅ Successfully updated ${result.modifiedCount} users → role: "user"`);
    }

    // 4. Print a summary of all roles in the database
    console.log('\n📋 Role Distribution Summary:');
    const adminCount = await User.countDocuments({ role: 'admin' });
    const userCount = await User.countDocuments({ role: 'user' });
    const noRoleCount = await User.countDocuments({ role: { $exists: false } });
    console.log(`   👑 Admins : ${adminCount}`);
    console.log(`   👤 Users  : ${userCount}`);
    console.log(`   ❓ No role: ${noRoleCount}`);
    console.log('\n📝 Tip: To make a user an admin, manually update their role in MongoDB Atlas:');
    console.log('   db.users.updateOne({ email: "your@email.com" }, { $set: { role: "admin" } })');

  } catch (error) {
    console.error('❌ Critical Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 MongoDB connection closed.');
  }
}

migrateUserRoles();
