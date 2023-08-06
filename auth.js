// auth.js
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

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
