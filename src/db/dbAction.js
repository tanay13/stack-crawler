const { db } = require("./index");
var admin = require("firebase-admin");

async function saveData(_id, { QUESTIONS, VOTES, ANSWERS, VIEWS }) {
  const questionRef = db.collection("questions").doc(_id);
  const doc = await questionRef.get();

  if (!doc.exists) {
    questionRef.set({
      url: QUESTIONS,
      upvotes: VOTES,
      views: VIEWS,
      answers: ANSWERS.trim(),
      count: 1,
    });
  } else {
    questionRef.update({
      upvotes: VOTES,
      answers: ANSWERS.trim(),
      views: VIEWS,
      count: admin.firestore.FieldValue.increment(1),
    });
  }
}

module.exports = saveData;
