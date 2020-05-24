const mongoose = require("mongoose");

const CandidateSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true },
  status: {
    type: String,
    enum: [
      "Applied",
      "Phone Screen",
      "Onsite",
      "Offered",
      "Accepted",
      "Rejected"
    ],
    required: true
  },
  email: { type: String }
});

module.exports = mongoose.model("Candidates", CandidateSchema);
