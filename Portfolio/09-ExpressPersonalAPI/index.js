const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/html');

let names = [];
let tasks = [];

app.get("/", (req, res) => {
    res.render("index", { names: names, tasks: tasks });
});

app.get('/greet', (req, res) => {
    const name = req.query.name;
    
      console.log('Received name:', name);
    names.push(name);

    res.redirect('/');
  });

app.get('/greet/:index', (req, res, next) => {
    const index = parseInt(req.params.index);
    
    if (index < 0 || index >= names.length) {
        const error = `Index ${index} is out of range the valid range is  0-${names.length - 1}`;
        return res.render('index', { names, tasks, error });
    }
    
    res.render('wazzup', { name: names[index] });
});

app.post('/task', (req, res) => {
    const task = req.body.task;
    tasks.push(task);
    res.redirect('/');
});

app.get('/task', (req, res) => {
    res.json({ tasks });
});

app.post('/task/move/:index/:direction', (req, res) => {
    const index = parseInt(req.params.index);
    const direction = req.params.direction;
    
    if (index >= 0 && index < tasks.length) {
        if (direction === 'up' && index > 0) {
            [tasks[index], tasks[index - 1]] = [tasks[index - 1], tasks[index]];
        } else if (direction === 'down' && index < tasks.length - 1) {
            [tasks[index], tasks[index + 1]] = [tasks[index + 1], tasks[index]];
        }
    }
    res.redirect('/');
});

app.post('/task/:index', (req, res) => {
    const index = parseInt(req.params.index);
    if (index >= 0 && index < tasks.length) {
        tasks.splice(index, 1);
    }
    res.redirect('/');
});


app.put('/greet/:name', (req, res) => {
    const name = req.params.name;
    names.push(name);
    res.json({ names });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});