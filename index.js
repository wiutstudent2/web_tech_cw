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

app.get('/create', (req, res) => {
  res.render('create');
});

app.post('/create', (req, res) => {
  const userInput = req.body;

  if (userInput.note.length === 0) {
    res.render('create', { fail: true });
  } else {
    db.run(
      'insert into notes(description, archived) values (?, 0)',
      [userInput.note],
      (err) => {
        if (err) console.log(err.message);

        db.all('select * FROM notes WHERE archived = 0', [], (err, rows) => {
          if (err) console.log(err.message);

          res.render('notes', { notes: rows });
        });
      }
    );
  }
});

app.get('/notes/:id/deleteunarchived', (req, res) => {
  id = req.params.id;

  db.run('DELETE FROM notes WHERE id=?', id, (err) => {
    if (err) console.log(err.message);

    res.redirect('/notes');
  });
});

app.listen(3000);
