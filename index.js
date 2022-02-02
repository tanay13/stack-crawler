const cheerio = require("cheerio");
const Bottleneck = require("bottleneck");
const axios = require("axios");
const saveData = require("./src/db/dbAction");
const addData = require("./src/csv");

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

      questions = {
        QUESTIONS: prefix + link,
        VOTES: votes,
        ANSWERS: answers.trim(),
        VIEWS: views,
      };

      await addData(questions);

      const _id = link.substring(11, 19);

      await saveData(_id, questions);
    });
    console.log(`Page successfully saved...`);
  });
}

const throttledCrawling = limiter.wrap(crawler);

async function getAllResults() {
  const pageNums = [];
  const count = 20;
  for (let i = 1; i <= count; i++) {
    pageNums.push({
      page: i,
    });
  }
  const allThePromises = pageNums.map((page) => {
    return throttledCrawling(page);
  });
  try {
    const results = await Promise.all(allThePromises);
  } catch (err) {
    console.log(err);
  }
}

getAllResults();
