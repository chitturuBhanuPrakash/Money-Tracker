const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3033;

// Connect to MongoDB
mongoose.connect('mongodb://localhost/money_tracker', { useNewUrlParser: true, useUnifiedTopology: true });

// Create schema and model
const transactionSchema = new mongoose.Schema({
  type: String,
  description: String,
  amount: Number,
  date: { type: Date, default: Date.now }
});
const Transaction = mongoose.model('Transaction', transactionSchema);

// Middleware
app.use(express.json());

// Serve static files
app.use(express.static('public'));

// API endpoint to get transactions
app.get('/api/transactions', async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API endpoint to add a new transaction
app.post('/api/transactions', async (req, res) => {
  try {
    const { type, description, amount } = req.body;
    const transaction = new Transaction({ type, description, amount });
    await transaction.save();
    res.json(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});