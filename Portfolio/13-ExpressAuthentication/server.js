require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const findOrCreate = require("mongoose-findorcreate");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());
app.set("view engine", "ejs");

app.use(session({
  secret: process.env.SECRET || "secret alt",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());


//i am getting al the sensitive info from .env file so you might not be able to run this locally :(
const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/LOTR";
mongoose.connect(mongoUrl, { serverSelectionTimeoutMS: 5000 })
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Could not connect to MongoDB", err));

// Definition of a schema
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  googleId: String,
});
userSchema.set("strictQuery", true);

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile);
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);

app.get("/auth/google/secrets", 
  passport.authenticate("google", { failureRedirect: "/login" }),
  function(req, res) {
    res.redirect("/secrets");
  }
);

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/secrets", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("secrets");
  } else {
    res.redirect("/login");
  }
});

app.get("/logout", (req, res, next) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect("/");
  });
});

app.post("/register", (req, res) => {
  console.log("Registering user:", req.body.username);
  User.register({username: req.body.username, email: req.body.email}, req.body.password, (err, user) => {
    console.log("Register callback hit");
    if (err) {
      console.log("Register error:", err);
      res.redirect("/register");
    } else {
      console.log("Register success, authenticating...");
      passport.authenticate("local")(req, res, () => {
        console.log("Authentication success, redirecting...");
        res.redirect("/secrets");
      });
    }
  });
});

app.post("/login", async (req, res, next) => {
  console.log("Login attempt for user:", req.body.username);
  console.log("Request body:", req.body);

  try {
    const foundUser = await User.findOne({ username: req.body.username });
    console.log("Manual DB Find Result:", foundUser);
  } catch (dbErr) {
    console.error("Manual DB Find Error:", dbErr);
  }

  passport.authenticate("local", (err, user, info) => {
    console.log("Passport authenticate callback hit");
    if (err) {
      console.error("Passport error:", err);
      return next(err);
    }
    if (!user) {
      console.log("Login failed:", info);
      return res.redirect("/login");
    }
    req.logIn(user, (err) => {
      if (err) {
        console.error("req.logIn error:", err);
        return next(err);
      }
      console.log("Login successful for user:", user.username);
      return res.redirect("/secrets");
    });
  })(req, res, next);
});

app.listen(3000, (err) => {
  console.log("Listening on port 3000");
});
