const express = require("express");
const path = require("path");
const session = require("express-session");
const bcrypt = require("bcryptjs");

const app = express();
const PORT = 3000;

// ---- SIMPLE HARDCODED ADMIN (FOR NOW) ----
const ADMIN_USER = {
  username: "admin",
  // password is: admin123
  passwordHash: bcrypt.hashSync("admin123", 10),
};

// ---- MIDDLEWARE ----
app.use(express.urlencoded({ extended: true })); // reads form data

app.use(
  session({
    secret: "nu-trendz-super-secret-key", // change this later
    resave: false,
    saveUninitialized: false,
  })
);

// Serve static files from /public (CSS, images, public HTML)
app.use(express.static(path.join(__dirname, "public")));

// Middleware to protect admin routes
function requireLogin(req, res, next) {
  if (req.session && req.session.isAdmin) {
    next();
  } else {
    res.redirect("/login.html");
  }
}

// Home page (later we’ll put your real site here)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Handle login POST
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const isUsernameOk = username === ADMIN_USER.username;
  const isPasswordOk = bcrypt.compareSync(password, ADMIN_USER.passwordHash);

  if (isUsernameOk && isPasswordOk) {
    req.session.isAdmin = true;
    res.redirect("/admin");
  } else {
    res.redirect("/login.html?error=1");
  }
});

// Admin dashboard (protected)
app.get("/admin", requireLogin, (req, res) => {
  res.sendFile(path.join(__dirname, "protected", "admin.html"));
});

// Logout
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login.html");
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Nu-Trendz admin running on http://localhost:${PORT}`);
});
