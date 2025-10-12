const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/', (req, res) => {
    const weight = parseFloat(req.body.weight);
    const height = parseFloat(req.body.height);
    
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);

    console.log(bmi);
    res.send("Your BMI is " + bmi);
});

app.listen(port, () => {
  console.log("listening on port " + port);
});