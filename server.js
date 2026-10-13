const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const { Pool } = require("pg");
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

// PostgreSQL connection (Pool, no db.connect())
const db = new Pool({
  connectionString: "postgresql://tiktokuser_user:iCWCSCXhvJZegXW9mbENN3I23SrTFF7U@dpg-db6upk0m7kpg73bf04cg-a.oregon-postgres.render.com:5432/tiktokuser",
  ssl: { rejectUnauthorized: false }
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});

// Register route with bcrypt
app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = req.body.password;

  try {
    await db.query(
      "INSERT INTO users (email, password) VALUES ($1, $2)",
      [email, hashedPassword]
    );
    res.redirect("/index.html");
  } catch (err) {
    console.error(err);
    res.send("Error: Email already exists");
  }
});
