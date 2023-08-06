// client.js
document.addEventListener('DOMContentLoaded', async () => {
  const questionElement = document.getElementById('currentQuestion');
  const votingForm = document.getElementById('votingForm');

  async function updateQuestion() {
    // ... (rest of the updateQuestion function, as provided in your code)

    // Call the updateQuestion function initially to populate the current question and options
    await updateQuestion();

    // Set an interval to update the question every 10 seconds (adjust as needed)
    setInterval(updateQuestion, 10000);
  });

  // Handle user login
  const loginForm = document.getElementById('loginForm');
  const logoutButton = document.getElementById('logoutButton');

  // Handle user login
  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        alert('Login successful!');
        // Hide the login form and show the logout button
        loginForm.style.display = 'none';
        logoutButton.style.display = 'block';
      } else {
        alert('Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      alert('An error occurred while logging in.');
    }
  });

  // Handle user logout
  logoutButton.addEventListener('click', async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'GET',
      });

      if (response.ok) {
        alert('Logout successful!');
        // Hide the logout button and show the login form
        logoutButton.style.display = 'none';
        loginForm.style.display = 'block';
      } else {
        alert('Logout failed. Please try again.');
      }
    } catch (error) {
      console.error('Error logging out:', error);
      alert('An error occurred while logging out.');
    }
  });
});
