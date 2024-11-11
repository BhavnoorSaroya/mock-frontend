const express = require("express");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const bodyParser = require("body-parser");
const path = require("path");
const crypto = require('crypto');
const { verify } = require("crypto");
const { restore } = require("buffer-equal-constant-time");
const { count } = require("console");
const counter = {};
const url = require("url");
const app = express();
app.use(bodyParser.json());
app.use(express.static("public"));



// Load the public key
const publicKey = fs.readFileSync("public.pem", "utf8");

function verifySignature(signature, payload) {
  try {

    const verifier = crypto.createVerify("SHA256");

    verifier.update(payload);
    verifier.end();

    const decodedSignature = Buffer.from(signature, "base64");
    const isVerified = verifier.verify(publicKey, decodedSignature);

    if (isVerified) {
      console.log("Signature is valid");
      return true;
    }
    return false;
  } catch (err) {
    console.log(err);
    return false;
  }
}



app.use((req, res, next) => {
  console.log("Request received");
  const signature = req.headers["x-gateway-signature"];
  const url = req.url;
  const method = req.method;
  const payload = `${method}${url}`;
  verifySignature(signature, payload);
  next();
}
);

// Serve the login page
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

// Serve the dashboard only if the JWT is valid
app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});

app.get("/password-reset", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "reset.html"));
});

app.get("/forgot", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "forgot.html"));
});

// Serve the home page (index)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "register.html"));
});

app.get("/message", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "message.html"));
});

app.get("/detect", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "detect.html"))
})

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin.html"))
})

// Start the server
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`JWT Auth server running on port ${PORT}`);
});
