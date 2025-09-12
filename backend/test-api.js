const express = require('express');
const app = express();

// Test route
app.get('/api/courses', (req, res) => {
  console.log('Courses API endpoint hit!');
  res.json({ success: true, message: 'Courses API is working' });
});

app.listen(5001, () => {
  console.log('Test server running on port 5001');
});
