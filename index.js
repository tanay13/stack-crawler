const request = require("request");
const cheerio = require("cheerio");

request("https://stackoverflow.com/questions", (error, response, html) => {
  const $ = cheerio.load(html);

  $(".question-summary").each((i, e) => {
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
    console.log(answers);
  });
});
