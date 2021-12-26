const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");

app.use(express.json());

const {
  PORT = "3000",
  JWT_ACCESS_TOKEN_SECERT = "46c6d558653e47a2ac2b620dfd1c528c90a12a88cb68a9775aa9fcd140c2a10dec142f1af11c46854a6b14146c1d2c752e8b0b385932abe4531d2ab7c3e5ebf6",
  JWT_REFRESH_TOKEN_SECRET = "68999b6642aedae1659e63f3ce0dea86bbb9c6aa60e1b4845baa1c2183664721a74f20a8de13b3859c88ba5da781da54d4b38619122432ae7e3950952f328e53",
} = process.env;

const post = [
  {
    username: "kamal",
    password: 123,
  },
  {
    username: "kaju",
    password: 123,
  },
  {
    username: "raju",
    password: 123,
  },
];

app.get("/post", AuthenticateToken, (req, res) => {
  console.log(req.user);
  res.json(
    post.filter((p) => {
      return p.username === req.user.name;
    })
  );
});

app.post("/login", (req, res) => {
  // Authenticate User

  const username = req.body.username;
  const user = {
    name: username,
  };

  const accessToken = jwt.sign(user, JWT_ACCESS_TOKEN_SECERT);

  res.json({ accessToken: accessToken });
});

// middleware

function AuthenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    return res.sendStatus(401);
  }

  jwt.verify(token, JWT_ACCESS_TOKEN_SECERT, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }

    req.user = user;
    next();
  });
}

app.listen(PORT, () => {
  console.log(`serving port ${PORT}`);
});
