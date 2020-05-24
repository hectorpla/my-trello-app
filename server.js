"use strict";
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const CandidateService = require("./services/candidateCrud");

const jsonParser = bodyParser.json();

const HOST = "0.0.0.0";
const port = process.env.PORT || 8080;
const dbLink = `mongodb://user:password123@ds363118.mlab.com:63118/candidates_management_db`;

mongoose.connect(
  dbLink,
  { useNewUrlParser: true, useFindAndModify: false },
  error => {
    if (error) {
      console.log(
        `Error connecting to MongoDB link ${dbLink}..., error: ${error}`
      );
    } else {
      console.log(`sucessfully connected to ${dbLink}.`);
    }
  }
);

// App
const app = express();
app.use(cors()); // For dev

const staticPath = path.join(__dirname, "status-management", "build");
app.use(express.static(staticPath));

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: staticPath });
});

app.get("/candidates", (req, res) => {
  CandidateService.getCandidates()
    .then(candidates => {
      // console.log(`sending candidates: ${candidates}`);
      res.json(candidates);
    })
    .catch(err => console.log(`[ERROR] GET /candidates: ${err}`));
});

app.post("/candidates", jsonParser, (req, res) => {
  console.log(req.body);
  const { name } = req.body;

  CandidateService.addCandidate({
    name
  })
    .then(doc => res.json(doc))
    .catch(err => {
      console.log(err);
      res.status(500).send(err);
    });
});

app.put("/candidates", jsonParser, (req, res) => {
  const { name, status } = req.body;
  CandidateService.changeCandidateStatus(name, status)
    .then(doc => res.json({ message: `updated ${doc.name} -> ${doc.status}` }))
    .catch(err => res.status(400).send(err));
});

app.listen(port, () => {
  console.log(`========================== Listening on http://${HOST}:${port}`);
});
