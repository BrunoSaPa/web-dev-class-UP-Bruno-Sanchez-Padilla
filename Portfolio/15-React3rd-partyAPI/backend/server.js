require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/starwars_react_api";
mongoose.connect(mongoUrl)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Could not connect to MongoDB", err));

//schema
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
        date: { type: Date, default: Date.now }
    }]
});

const Movie = mongoose.model('Movie', movieSchema);

// Routes

//get movies
app.get('/api/movies', async (req, res) => {
    try {
        const movies = await Movie.find();
        res.json(movies);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//get single
app.get('/api/movies/:id', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) return res.status(404).json({ message: 'Movie not found' });
        res.json(movie);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//like
app.post('/api/movies/:id/like', async (req, res) => {
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

//dislike decrements likes
app.post('/api/movies/:id/dislike', async (req, res) => {
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

//comment
app.post('/api/movies/:id/comments', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) return res.status(404).json({ message: 'Movie not found' });
        
        const { text } = req.body;
        if (!text) return res.status(400).json({ message: 'Comment text is required' });

        movie.comments.push({ text });
        await movie.save();
        res.json(movie);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
