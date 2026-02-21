import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

async function testConnection() {
  try {
    console.log('🔌 Attempting to connect to MongoDB...');
    console.log(`📍 URI: ${MONGODB_URI?.substring(0, 50)}...`);

    const conn = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log('✅ Connection successful!');
    console.log(`📊 Database: ${conn.connection.db.databaseName}`);
    console.log(`🖥️  Host: ${conn.connection.host}`);
    console.log(`🔗 State: ${conn.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);

    await mongoose.connection.close();
    console.log('✅ Connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed!');
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

testConnection();
