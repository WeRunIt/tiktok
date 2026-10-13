const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const { Client } = require("pg");

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: "superSecretKey",
  resave: false,
  saveUninitialized: false
}));

// Serve static files (CSS, HTML)
app.use(express.static(__dirname));

// PostgreSQL connection
const db = new Client({
  user: "tiktokuser_user",
  host: "postgresql://tiktokuser_user:iCWCSCXhvJZegXW9mbENN3I23SrTFF7U@dpg-db6upk0m7kps73bf04cg-a.oregon-postgres.render.com/tiktokuser",
  database: "tiktokuser",
  password: "iCWCSCXhvJZegXW9mbENN3I23SrTFF7U",
  port: 5432,
});
db.connect();
app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});

app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = req.body.password;

  try {
    await db.query(
      "INSERT INTO users (email, password) VALUES ($1, $2)",
      [email, hashedPassword]
    );
    // After successful signup, redirect to login page
    res.redirect("/index.html");
  } catch (err) {
    console.error(err);
    res.send("Error: Email already exists");
  }
});

