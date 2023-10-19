const express = require('express');
const app = express();
const path = require('path')
const port = 3000;

// other
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use('/static', express.static(path.join(__dirname, 'public')))



// Parse URL-encoded bodies (as sent by HTML forms)
app.use(bodyParser.urlencoded({ extended: true }));

// Create a new SQLite database connection
const db = new sqlite3.Database('data.db');

// Create a table to store form submissions if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT,
  message TEXT
)`);

app.get('/', (req, res) => {
  res.render('index', { title: 'Simple Node.js App' });
  //res.send("<h1>Simple Web Application is UP</h1>");
});

app.post('/', (req, res) => {
  const { name, email, message } = req.body;

  // Insert the form submission into the database
  db.run(`INSERT INTO submissions (name, email, message) VALUES (?, ?, ?)`, [name, email, message], (error) => {
    if (error) {
      console.error(error);
    }
  });

  const submittedData = { name, email, message };
  res.render('index', { title: 'Simple Node.js App', submittedData });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
