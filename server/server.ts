import { MongoClient } from 'mongodb';

const MONGODB_URI = 'mongodb://localhost:27017/maindb';

async function connectToDatabase() {
  const client = new MongoClient(MONGODB_URI, {
    maxPoolSize: 50, // Set your desired max pool size
    minPoolSize: 5,  // Set your desired min pool size
    // Other connection pool-related options can be added here if needed
  });

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    // Your database operations go here

  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  } finally {
    await client.close();
  }
}

connectToDatabase();
