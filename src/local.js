const express = require('express');
const { getConnection } = require('./config/database');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Middleware to handle database connection
app.use(async (req, res, next) => {
  try {
    req.db = await getConnection();
    next();
  } catch (err) {
    res.status(500).json({ message: 'Database connection error' });
  }
});

// Routes
app.get('/items', async (req, res) => {
  try {
    const result = await req.db.request()
      .query('SELECT * FROM Items');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching items' });
  }
});

app.post('/items', async (req, res) => {
  try {
    await req.db.request()
      .input('name', sql.NVarChar, req.body.name)
      .input('description', sql.NVarChar, req.body.description)
      .query('INSERT INTO Items (name, description) VALUES (@name, @description)');
    res.json({ message: 'Item created successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error creating item' });
  }
});

app.listen(port, () => {
  console.log(`Local server running on port ${port}`);
});