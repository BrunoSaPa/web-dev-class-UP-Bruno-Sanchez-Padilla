const express = require("express");
const app = express();
const mongoose = require("mongoose");

const fs = require("fs");
const path = require("path");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.engine("ejs", require("ejs").renderFile);
app.set("view engine", "ejs");

//since i am using cloud this is not shown here cuz i don't want people to see that:)
const mongoUrl = "";
mongoose.connect(mongoUrl);

const nationalityMapping = {
  "British": "ENG",
  "Spanish": "SPA",
  "German": "GER",
  "French": "FRA",
  "Mexican": "MEX",
  "Australian": "AUS",
  "Finnish": "FIN",
  "Danish": "DEN",
  "Dutch": "NET",
  "Canadian": "CAN",
  "Monegasque": "MON",
  "Thai": "THA",
  "Japanese": "JAP",
  "Chinese": "CHI",
  "American": "USA"
};


const teamSchema = new mongoose.Schema({
  id: Number,
  name: String,
  nationality: String,
  url: String,
});
teamSchema.set("strictQuery", true);

const driverSchema = new mongoose.Schema({
  num: Number,
  code: String,
  forename: String,
  surname: String,
  dob: Date,
  nationality: String,
  url: String,
  team: teamSchema,
});
driverSchema.set("strictQuery", true);

const Team = mongoose.model("Team", teamSchema);
const Driver = mongoose.model("Driver", driverSchema);

let countries = [
  { code: "ENG", label: "England" },
  { code: "SPA", label: "Spain" },
  { code: "GER", label: "Germany" },
  { code: "FRA", label: "France" },
  { code: "MEX", label: "Mexico" },
  { code: "AUS", label: "Australia" },
  { code: "FIN", label: "Finland" },
  { code: "NET", label: "Netherlands" },
  { code: "CAN", label: "Canada" },
  { code: "MON", label: "Monaco" },
  { code: "THA", label: "Thailand" },
  { code: "JAP", label: "Japan" },
  { code: "CHI", label: "China" },
  { code: "USA", label: "USA" },
  { code: "DEN", label: "Denmark" },
];

//load data
app.use(async (req, res, next) => {
  try {
    const driverCount = await Driver.countDocuments();
    if (driverCount === 0) {
      console.log("Loading data from CSV...");
      const csvPath = path.join(__dirname, "public", "data", "f1_2023.csv");
      const csvData = fs.readFileSync(csvPath, "utf8");
      const lines = csvData.split("\n");
      
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const [number, code, forename, surname, dobStr, nationality, url, current_team] = line.split(",");
        
        const [day, month, year] = dobStr.split("/");
        const dob = new Date(`${year}-${month}-${day}`);
        
        const natCode = nationalityMapping[nationality] || nationality;
        
        const team = {
          name: current_team,
        };
        
        const driver = new Driver({
          num: parseInt(number),
          code: code,
          forename: forename,
          surname: surname,
          dob: dob,
          nationality: natCode,
          url: url,
          team: team
        });
        
        await driver.save();
      }
      console.log("Data loaded");
    }
    
    const teamCount = await Team.countDocuments();
    if (teamCount === 0) {
        const drivers = await Driver.find();
        const uniqueTeams = [...new Set(drivers.map(d => d.team.name))];
        
        for (const teamName of uniqueTeams) {
            if (teamName && teamName !== "N/A") {
                const teamCode = teamName.toLowerCase().replace(/\s+/g, "_");
                await Team.create({
                    name: teamName,
                    nationality: "Unknown",
                    url: ""
                });
            }
        }
    }

    next();
  } catch (err) {
    console.error("Error loading data:", err);
    next(err);
  }
});

app.get("/", async (req, res) => {
  try {
    const drivers = await Driver.find().sort({ num: 1 });
    const dbTeams = await Team.find().sort({ name: 1 });
    
    
    let viewTeams = dbTeams.map(t => ({
        code: t.name,
        label: t.name
    }));

    if (viewTeams.length === 0) {
      //if not in db use default
         viewTeams = [
          { code: "mercedes", label: "Mercedes" },
          { code: "aston_martin", label: "Aston Martin" },
          { code: "alpine", label: "Alpine" },
          { code: "hass_f1", label: "Hass F1 Team" },
          { code: "red_bull", label: "Red Bull Racing" },
          { code: "alpha_tauri", label: "Alpha Tauri" },
          { code: "alpha_romeo", label: "Alpha Romeo" },
          { code: "ferrari", label: "Ferrari" },
          { code: "williams", label: "Williams" },
          { code: "mc_laren", label: "McLaren" },
        ];
    }

    const view = req.query.view || 'drivers';
    res.render("index", { countries: countries, teams: viewTeams, drivers: drivers, dbTeams: dbTeams, view: view });
  } catch (err) {
    res.status(500).send("Error fetching data");
  }
});

app.post("/driver", async (req, res) => {
    try {
        const { num, code, name, lname, dob, url, nation, team } = req.body;
        
        const newDriver = new Driver({
            num: parseInt(num),
            code: code,
            forename: name,
            surname: lname,
            dob: new Date(dob),
            nationality: nation,
            url: url,
            team: {
                name: team,
                nationality: "Unknown",
                url: ""
            }
        });

        await newDriver.save();
        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error saving driver");
    }
});

app.post("/driver/update", async (req, res) => {
    try {
        const { id, num, code, forename, surname, nationality, team } = req.body;
        await Driver.findByIdAndUpdate(id, {
            num,
            code,
            forename,
            surname,
            nationality,
            "team.name": team
        });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post("/team/update", async (req, res) => {
    try {
        const { id, name, nationality, url } = req.body;
        await Team.findByIdAndUpdate(id, {
            name,
            nationality,
            url
        });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.listen(3000, (err) => {
  console.log("Listening on port 3000");
});
