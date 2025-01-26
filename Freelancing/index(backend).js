const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Initialize the app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB (adjust with your own credentials if needed)
mongoose.connect('mongodb://localhost:27017/freelancePortfolio', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Models
const ContactMessage = mongoose.model('ContactMessage', new mongoose.Schema({
  name: String,
  email: String,
  message: String
}));

const Feedback = mongoose.model('Feedback', new mongoose.Schema({
  message: String,
  timestamp: { type: Date, default: Date.now }
}));

// Routes
// Contact Form Submission
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const newContactMessage = new ContactMessage({ name, email, message });
    await newContactMessage.save();
    res.status(200).json({ message: 'Contact form submitted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

// Feedback Form Submission
app.post('/api/feedback', async (req, res) => {
  try {
    const { message } = req.body;
    const newFeedback = new Feedback({ message });
    await newFeedback.save();
    res.status(200).json({ message: 'Feedback submitted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

// Serve Static Files (if needed)
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
