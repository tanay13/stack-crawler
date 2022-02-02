const fs = require("fs");
const { format } = require("@fast-csv/format");

const fileName = __dirname + "/../../randoms.csv";

// CSV file setup
const csvFile = fs.createWriteStream(fileName, { flags: "a" });
const stream = format({ headers: true });
stream.pipe(csvFile);

async function addData(questions) {
  stream.write(questions);
}
module.exports = addData;
