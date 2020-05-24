const CandidateModel = require("../models/candidates");

const STATUS_LIST = [
  "Applied",
  "Phone Screen",
  "Onsite",
  "Offered",
  "Accepted",
  "Rejected"
];

const getCandidates = () =>
  new Promise((resolve, reject) => {
    CandidateModel.find({}, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });

const changeCandidateStatus = (candidateName, status) => {
  return new Promise((resolve, reject) => {
    if (!STATUS_LIST.includes(status)) {
      reject(`invalid status, should one of ${STATUS_LIST}`);
    }
    return CandidateModel.findOneAndUpdate(
      { name: candidateName },
      { status },
      (err, doc) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve({ name: candidateName, status });
        }
      }
    );
  });
};

const addCandidate = candidate => {
  console.log("addCandidate", candidate);
  return new Promise((resolve, reject) => {
    new CandidateModel({
      ...candidate,
      status: "Applied"
    }).save((err, product) => {
      if (err) {
        console.log("failed to add candidate", err);
        reject(`failed to add candidate -- ${candidate.name}`);
      }
      resolve(product);
    });
  });
};

module.exports = { addCandidate, changeCandidateStatus, getCandidates };
