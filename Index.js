// index.js
const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const { voteForTopic } = require('./vote');
const { collectInformation } = require('./collectInfo');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const port = process.env.PORT || 5000;
const mongoURI = process.env.MONGODB_URI;

// Sample data for users (you can replace this with data from your MongoDB collection)
const users = [
  {
    id: 1,
    username: 'user1',
    password: '$2a$10$zy03XK18vfgCLIdC0qIu5eiMEzrcWqq7ZwB8YyUICRQTP6x6F.TfG', // Hashed password: "password1"
  },
  // Add more user objects here
];

// Function to find a user by username
function findUserByUsername(username) {
  return users.find((user) => user.username === username);
}

// Function to find a user by ID
function findUserById(id) {
  return users.find((user) => user.id === id);
}

// Connect to MongoDB
const client = new MongoClient(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Configure Passport to use the LocalStrategy for username and password authentication
passport.use(
  new LocalStrategy((username, password, done) => {
    const user = findUserByUsername(username);

    if (!user) {
      return done(null, false, { message: 'Incorrect username.' });
    }

    // Compare the provided password with the hashed password
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) throw err;
      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Incorrect password.' });
      }
    });
  })
);

// Serialize and deserialize user objects to maintain user sessions
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  const user = findUserById(id);
  done(null, user);
});

client.connect((err) => {
  if (err) {
    console.error('Error connecting to MongoDB:', err);
    return;
  }
  console.log('Connected to MongoDB');
  const db = client.db();

  // Middleware for session management

app.get('/', (req, res) => {
  // Code to render and send the index page here
  res.sendFile(__dirname + '/public/index.html');
});

  app.use(
    session({
      secret: 'your-secret-key',
      resave: false,
      saveUninitialized: false,
    })
  );

  // Passport middleware for authentication
  app.use(passport.initialize());
  app.use(passport.session());

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

  // Route for fetching the current question and options
  app.get('/api/getCurrentQuestion', async (req, res) => {
    try {
      // Fetch the current question from MongoDB
      const currentQuestion = await db.collection('questions').findOne(
        { endTime: { $gt: new Date() } }, // Fetch the question that has not expired yet
        { projection: { _id: 1, text: 1, options: 1 } }
      );

      if (currentQuestion) {
        res.json(currentQuestion);
      } else {
        res.json({}); // Return an empty object if no question is available
      }
    } catch (err) {
      console.error('Error while fetching current question:', err);
      res.status(500).json({ error: 'An error occurred while fetching the current question.' });
    }
  });

  // Route for handling user login
  app.post('/api/login', passport.authenticate('local'), (req, res) => {
    // Authentication successful, send a response
    res.json({ message: 'Login successful!' });
  });

  // Route for handling user logout
  app.get('/api/logout', (req, res) => {
    req.logout();
    res.json({ message: 'Logout successful!' });
  });

  // Start the Express server
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});

app.get('/', (req, res) => {
  // Code to render and send the index page here
  res.sendFile(__dirname + '/public/index.html');

