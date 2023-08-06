// setupData.js
const { MongoClient } = require('mongodb');
require('dotenv').config();

const mongoURI = process.env.MONGODB_URI;

// Sample data for questions and options
const sampleData = [
  {
    text: 'What is your favorite color?',
    options: [
      { text: 'Red' },
      { text: 'Blue' },
      { text: 'Green' },
      { text: 'Yellow' },
    ],
    endTime: new Date(Date.now() + 3600000), // Set the end time to one hour from now
  },
  {
    text: 'What is your favorite animal?',
    options: [
      { text: 'Dog' },
      { text: 'Cat' },
      { text: 'Elephant' },
      { text: 'Dolphin' },
    ],
    endTime: new Date(Date.now() + 7200000), // Set the end time to two hours from now
  },
];

// Connect to MongoDB
const client = new MongoClient(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function setupSampleData() {
  try {
    await client.connect();
    const db = client.db();

    // Insert the sample data into the 'questions' collection
    const result = await db.collection('questions').insertMany(sampleData);
    console.log(`Inserted ${result.insertedCount} sample questions.`);

    // Close the connection to MongoDB
    await client.close();
    console.log('Connection to MongoDB closed.');
  } catch (err) {
    console.error('Error setting up sample data:', err);
  }
}

setupSampleData();
