import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function query() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));

    for (const c of collections) {
      if (c.name.includes('coordinator')) {
        const count = await db.collection(c.name).countDocuments();
        console.log(`Collection ${c.name} has ${count} documents`);
        const sample = await db.collection(c.name).find().limit(3).toArray();
        console.log(`Sample from ${c.name}:`, JSON.stringify(sample, null, 2));
      }
    }

    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
  }
}

query();
