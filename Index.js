// index.js
const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const { voteForTopic } = require('./vote');
const { collectInformation } = require('./collectInfo');
require('dotenv').config();

const port = process.env.PORT || 5000;
const mongoURI = process.env.MONGODB_URI;

// Connect to MongoDB
const client = new MongoClient(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err) => {
  if (err) {
    console.error('Error connecting to MongoDB:', err);
    return;
  }
  console.log('Connected to MongoDB');
  const db = client.db();

  // Route for voting
  app.post('/vote/:topicId', async (req, res) => {
    const { topicId } = req.params;
    try {
      const result = await voteForTopic(db, topicId);
      res.send(result);
    } catch (err) {
      console.error('Error while voting:', err);
      res.status(500).send('An error occurred while voting.');
    }
  });

  // Route for collecting information
  app.post('/collect-info', express.json(), async (req, res) => {
    const { info } = req.body;
    try {
      const result = await collectInformation(db, info);
      res.send(result);
    } catch (err) {
      console.error('Error while collecting information:', err);
      res.status(500).send('An error occurred while collecting information.');
    }
  });

  // Start the Express server
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
