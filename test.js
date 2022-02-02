const Bottleneck = require("bottleneck");

const limiter = new Bottleneck({
  maxConcurrent: 5,
  minTime: 1000,
});

function myFunction() {
  return new Promise((resolve, reject) => {
    var i = 0;
    while (i < 100000) {
      console.log("Hey");
      i++;
    }
    resolve();
  });
}

const wrapped = limiter.wrap(myFunction);

wrapped().then((result) => {
  /* handle result */
  console.log("WAIT");
});
