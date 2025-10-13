const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/public/html');
let nextId = 0;
let currentUser = null;

// TODO: configure the express server

const longContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";

let posts = [];
let name;
let message = "";

app.get("/", (req, res) => {

  res.render("index" ,{message: message});
});

app.get('/login', (req, res) => {
  
    const name = req.query.name;
    currentUser = name;
    message = `Hello ${name}, you logged in via GET which is a secured method`;
    res.redirect('/');});


app.post('/login', (req, res) => {
    const name = req.body.name;
    currentUser = name;
    message = `Hello ${name}, you logged in via POST which is a secured method`;
    res.render("index" ,{message: message});
});

app.get('/test', (req, res) => {
    if (!currentUser) {
        return res.redirect('/');
    }
    res.render('test', { 
        username: currentUser,
    });
});

app.get('/home', (req, res) => {
    if (!currentUser) {
        return res.redirect('/');
    }
    res.render('home', { 
        username: currentUser,
        posts: posts
    });
});

app.post('/post', (req, res) => {
    if (!currentUser) {
        return res.redirect('/');
    }
    
    const { title, content } = req.body;
    
    if (title && content) {
        posts.push({
            id: nextId++,
            title: title,
            content: content
        });
    }
    
    res.redirect('/home');
});

app.get('/post/:id', (req, res) => {
    if (!currentUser) {
        return res.redirect('/');
    }
    
    const postId = parseInt(req.params.id);
    const post = posts.find(p => p.id === postId);
    
    if (!post) {
        return res.redirect('/home');
    }
    
    res.render('post', { 
        username: currentUser,
        post: post
    });
});

app.post('/post/:id/edit', (req, res) => {
    if (!currentUser) {
        return res.redirect('/');
    }
    
    const postId = parseInt(req.params.id);
    const { title, content } = req.body;
    const post = posts.find(p => p.id === postId);
    
    if (!post) {
        return res.redirect('/home');
    }

    if (title && content) {
        post.title = title;
        post.content = content;
    }
    
    res.redirect(`/post/${postId}`);
});

app.post('/post/:id/delete', (req, res) => {
    if (!currentUser) {
        return res.redirect('/');
    }
    
    const postId = parseInt(req.params.id);
    posts = posts.filter(p => p.id !== postId);
    
    res.redirect('/home');
});

app.listen(3000, (err) => {
  console.log("Listening on port 3000");
});
