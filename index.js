let express = require('express');
let app = express();
let sqlite3 = require('sqlite3');

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'pug');
app.use('/static', express.static('public'));

const db = new sqlite3.Database('./notes.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) console.log(err.message);

  console.log('Connection successful!');
});

// db.run(
//   'CREATE TABLE notes (id INTEGER PRIMARY KEY, description VARCHAR(255), archived int)'
// );

app.get('/home', (req, res) => {
  res.render('home');
});

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/notes', (req, res) => {
  db.all('select * FROM notes WHERE archived = 0', [], (err, rows) => {
    if (err) console.log(err.message);

    res.render('notes', { notes: rows });
  });
});

app.listen(3000);
