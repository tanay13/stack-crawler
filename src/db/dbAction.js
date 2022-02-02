const { db } = require("./index");

async function saveData(_id, url, votes, answer, views) {
  const questionRef = db.collection("questions").doc(_id);
  const doc = await questionRef.get();
  if (!doc.exists) {
    questionRef.set({
      url,
      upvotes: votes,
      views: views,
      answers: answer,
    });
  } else {
    questionRef.update({
      upvotes: votes,
      answers: answer,
      views: views,
    });
  }
}

module.exports = saveData;
