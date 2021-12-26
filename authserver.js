const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");

app.use(express.json());

const {
  PORT = "4000",
  JWT_ACCESS_TOKEN_SECERT = "46c6d558653e47a2ac2b620dfd1c528c90a12a88cb68a9775aa9fcd140c2a10dec142f1af11c46854a6b14146c1d2c752e8b0b385932abe4531d2ab7c3e5ebf6",
  JWT_REFRESH_TOKEN_SECRET = "68999b6642aedae1659e63f3ce0dea86bbb9c6aa60e1b4845baa1c2183664721a74f20a8de13b3859c88ba5da781da54d4b38619122432ae7e3950952f328e53",
} = process.env;

let refreshTokens = [];

app.delete("/logout", (req, res) => {
  refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
  res.sendStatus(204);
});

app.post("/token", (req, res) => {
  const refreshToken = req.body.token;
  if (refreshToken == null) {
    return res.sendStatus(401);
  }
  if (!refreshTokens.includes(refreshToken)) {
    return res.sendStatus(403);
  }
  jwt.verify(refreshToken, JWT_REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    const accessToken = genrateAccessToken({ name: user.name });
    res.json({ accessToken: accessToken });
  });
});

app.post("/login", (req, res) => {
  // Authenticate User

  const username = req.body.username;
  const user = {
    name: username,
  };

  const accessToken = genrateAccessToken(user);
  const refreshToken = jwt.sign(user, JWT_REFRESH_TOKEN_SECRET);
  refreshTokens.push(refreshToken);
  res.json({ accessToken: accessToken, refreshToken: refreshToken });
});

// middleware

function genrateAccessToken(user) {
  return jwt.sign(user, JWT_ACCESS_TOKEN_SECERT, { expiresIn: "15s" });
}

app.listen(PORT, () => {
  console.log(`serving port ${PORT}`);
});
