const cheerio = require("cheerio");

const axios = require("axios");
const saveData = require("./src/db/dbAction");
const addData = require("./src/csv");

const Bottleneck = require("bottleneck");
const performTask = require("./src/throttle");

// setting the minimum relaxation time and maximum concurrency
const limiter = new Bottleneck({
  minTime: 200,
  maxConcurrent: 5,
});

// Function to crawl the pages and store data
function crawler(number) {
  return axios(
    `https://stackoverflow.com/questions?tab=newest&page=${number}`
  ).then((res) => {
    const $ = cheerio.load(res.data);

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

      const views = $(e).children(".statscontainer").children(".views").text();

      const url = prefix + link;
      const answer = answers.trim();

      questions = {
        QUESTIONS: url,
        VOTES: votes,
        ANSWERS: answer,
        VIEWS: views,
      };

      await addData(questions);

      const _id = link.substring(11, 19);
      await saveData(_id, url, votes, answer, views);
    });
    console.log(`Page successfully saved...`);
  });
}

const throttledCrawling = limiter.wrap(crawler);

performTask(throttledCrawling);
