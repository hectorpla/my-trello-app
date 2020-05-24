import React, { useState } from "react";
import DragItem from "./components/drag-item";
import DropItem from "./components/drop-item";
import {
  getCandidates,
  addCandidate,
  changeCandidateStatus
} from "./network-utils";

import "./styles.css";

const AddCandidate = ({ handleAdd }) => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState(null);

  return (
    <>
      <div className="form">
        <label htmlFor="candidateName"></label>
        <input
          name="candidateName"
          type="text"
          onChange={e => setName(e.target.value)}
        />
        <input
          type="submit"
          onClick={e => {
            e.preventDefault();
            handleAdd(name).then(message => {
              if (message) setMessage(JSON.stringify(message));
            });
          }}
        />
      </div>
      {message && <div>{message}</div>}
    </>
  );
};

const StatusBoards = [
  {
    title: "Applied"
  },
  {
    title: "Phone Screen"
  },
  {
    title: "Onsite"
  },
  {
    title: "Offered"
  },
  {
    title: "Accepted"
  },
  {
    title: "Rejected"
  }
];

const toCandidateModel = dbCandidate => ({
  name: dbCandidate.name,
  status: dbCandidate.status
});

const changedCandidateStatus = (candidate, status) => ({
  ...candidate,
  status
});

function ManagementApp() {
  const [candidates, setCandidates] = useState([]);
  const [message, setMessage] = useState(null);

  const softRefreshCandidatesWithStatusChange = React.useCallback(
    (name, status) => {
      setCandidates(
        candidates.map(candidate => {
          if (candidate.name === name) {
            return changedCandidateStatus(candidate, status);
          }
          return candidate;
        })
      );
    },
    [candidates]
  );

  const fetchAllcandidates = React.useCallback(() => {
    getCandidates(candidates =>
      setCandidates(candidates.map(toCandidateModel))
    );
  }, []);

  React.useEffect(() => {
    fetchAllcandidates();
  }, []);

  return (
    <div className="App">
      Candiates:
      {/* {JSON.stringify(candidates)} */}
      <div className="box">
        {StatusBoards.map(board => (
          <DropItem
            heading={board.title}
            onDrop={candidateName => {
              console.log(`dropping id ${candidateName}`);
              changeCandidateStatus(candidateName, board.title)
                .then(message => {
                  softRefreshCandidatesWithStatusChange(
                    candidateName,
                    board.title
                  );
                  setMessage(null);
                })
                .catch(err => {
                  console.log(err);
                  setMessage(`failed to change status for ${candidateName}`);
                });
            }}
          >
            {candidates
              .filter(candidate => candidate.status === board.title)
              .map(candidate => (
                <DragItem
                  id={candidate.name}
                  key={candidate.name}
                  data={{ text: candidate.name }}
                />
              ))}
          </DropItem>
        ))}
      </div>
      {message && <div>{message}</div>}
      <AddCandidate
        handleAdd={candidateName => {
          console.log(`adding candidate ${candidateName}...`);
          return addCandidate(candidateName)
            .then(doc => {
              const message = `candidate ${candidateName} successfully added`;
              console.log(message, doc);
              fetchAllcandidates();
              return message;
            })
            .catch(err => {
              console.log(err);
              return "failed. Maybe try a new one";
            });
        }}
      />
    </div>
  );
}

export default ManagementApp;
