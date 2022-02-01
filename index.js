const request = require("request");
const cheerio = require("cheerio");
const { db } = require("./src/db");
const admin = require("firebase-admin");

request("https://stackoverflow.com/questions", (error, response, html) => {
  const $ = cheerio.load(html);

  $(".question-summary").each(async (i, e) => {
    const prefix = "https://stackoverflow.com";
    const link = $(e)
      .children(".summary")
      .children("h3")
      .children("a")
      .attr("href");

    const votes = $(e)
      .children(".statscontainer")
      .children(".stats")
      .children(".vote")
      .children(".votes")
      .children(".vote-count-post")
      .text();

    const answers = $(e)
      .children(".statscontainer")
      .children(".stats")
      .children(".status")
      .text();

    const _id = link.substring(11, 19);

    const questionRef = db.collection("questions").doc(_id);
    const doc = await questionRef.get();

    if (!doc.exists) {
      questionRef.set({
        url: prefix + link,
        upvotes: votes,
        answers: answers.trim(),
        count: 1,
      });
    } else {
      questionRef.update({
        upvotes: votes,
        answers: answers.trim(),
        count: admin.firestore.FieldValue.increment(1),
      });
    }
  });
});
