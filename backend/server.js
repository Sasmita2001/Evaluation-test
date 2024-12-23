const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());

const booksFilePath = path.join(__dirname, 'books.json');


app.get('/books', (req, res) => {
  fs.readFile(booksFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Unable to read books data' });
    }
    res.json(JSON.parse(data));
  });
});


app.post('/books', (req, res) => {
  const { title, author, year } = req.body;


  if (!title || !author || !year) {
    return res.status(400).json({ error: 'Missing title, author, or year' });
  }

  const newBook = { title, author, year };


  fs.readFile(booksFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Unable to read books data' });
    }

    const books = JSON.parse(data);

    books.push(newBook);


    fs.writeFile(booksFilePath, JSON.stringify(books, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Unable to save book' });
      }
      res.status(201).json(newBook);
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
