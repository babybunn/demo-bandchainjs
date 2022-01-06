const path = require("path");
const express = require("express");
const fs = require("fs");
const exec = require("child_process").exec;
var bodyParser = require("body-parser");

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.static(path.resolve(__dirname, "../client/build")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/compile", (req, res) => {
  res.json({ message: "Hello GET Compile" });
});

app.post("/compile", (req, res) => {
  const code = req.body.code;
  fs.writeFile("src/lib.rs", code, function (err) {
    if (err) throw err;

    execute(
      "RUSTFLAGS='-C link-arg=-s' cargo build --release --target wasm32-unknown-unknown",
      function (file) {
        const buf = fs.readFileSync("target/wasm32-unknown-unknown/release/crypto.wasm");
        return res.send(buf);
      }
    );
  });
});

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

function execute(command, callback) {
  exec(command, function (error, stdout, stderr) {
    callback(stdout);
  });
}
