require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportLocalMongoose = require('passport-local-mongoose').default;

const app = express();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 
    }
}));


app.use(passport.initialize());
app.use(passport.session());


const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/starwars_auth_redux";
mongoose.connect(mongoUrl)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Could not connect to MongoDB", err));


// User Schema
const userSchema = new mongoose.Schema({
    username: String,
});
userSchema.plugin(passportLocalMongoose);
const User = mongoose.model('User', userSchema);

// Movie Schema
const movieSchema = new mongoose.Schema({
    episode: String,
    title: String,
    year: Number,
    poster: String,
    best_character: {
        name: String,
        affiliation: String,
        image: String,
        bio: String,
    },
    likes: { type: Number, default: 0 },
    comments: [{
        text: String,
        author: String, // Add author to comment
        date: { type: Date, default: Date.now }
    }]
});
const Movie = mongoose.model('Movie', movieSchema);

// Passport Strategy
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ message: 'You must be logged in to perform this action' });
};




app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = new User({ username });
        await User.register(user, password);
        passport.authenticate('local')(req, res, () => {
            res.json({ user: { id: req.user._id, username: req.user.username } });
        });
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
});

app.post('/login', passport.authenticate('local'), (req, res) => {
    res.json({ user: { id: req.user._id, username: req.user.username } });
});

app.post('/logout', (req, res) => {
    req.logout((err) => {
        if (err) return res.status(500).json({ message: err.message });
        res.json({ message: 'Logged out' });
    });
});

app.get('/user', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ user: { id: req.user._id, username: req.user.username } });
    } else {
        res.json({ user: null });
    }
});


app.get('/api/movies', async (req, res) => {
    try {
        const movies = await Movie.find();
        res.json(movies);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


app.get('/api/movies/:id', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) return res.status(404).json({ message: 'Movie not found' });
        res.json(movie);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/movies/:id/like', isLoggedIn, async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) return res.status(404).json({ message: 'Movie not found' });
        
        movie.likes += 1;
        await movie.save();
        res.json(movie);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/movies/:id/dislike', isLoggedIn, async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) return res.status(404).json({ message: 'Movie not found' });
        
        movie.likes = Math.max(0, movie.likes - 1);
        await movie.save();
        res.json(movie);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


app.post('/api/movies/:id/comments', isLoggedIn, async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) return res.status(404).json({ message: 'Movie not found' });
        
        const { text } = req.body;
        if (!text) return res.status(400).json({ message: 'Comment text is required' });

        // Add author to comment
        movie.comments.push({ text, author: req.user.username });
        await movie.save();
        res.json(movie);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
