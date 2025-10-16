const express = require('express');
const https = require('https');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index');
});




app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});