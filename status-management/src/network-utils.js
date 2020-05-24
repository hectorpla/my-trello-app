const host = ""; // http://localhost:8080

export const getCandidates = onSuccess =>
  fetch(`${host}/candidates`, {
    mode: "cors"
  })
    .then(res => {
      return res.json();
    })
    .then(data => {
      onSuccess(data);
    })
    .catch(err => console.log(err));

export const changeCandidateStatus = (name, status) =>
  fetch(`${host}/candidates`, {
    mode: "cors",
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name,
      status
    })
  }).then(res => {
    console.log(res);
    if (res.status !== 200) {
      throw Error("failed to modify");
    }
    return res.json();
  });

export const addCandidate = name =>
  fetch(`${host}/candidates`, {
    mode: "cors",
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name
    })
  }).then(res => {
    console.log(res);
    if (res.status !== 200) {
      throw Error("failed to add");
    }
    return res.json();
  });
