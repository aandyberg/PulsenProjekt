const { events, Client, errors } = require("@elastic/elasticsearch");
const { ResponseError } = require("@elastic/elasticsearch/lib/errors");
const { timeStamp } = require("console");
const client = new Client({
  node: "http://localhost:9200",
});
const nodemailer = require("./nodemailer");

/*client.ping({}, { requestTimeout: 3000 }, (err, response) => {
  if (err) {
    console.log("här");
    console.log(err);
  } else {
    console.log(response);
  }
});*/
let lastTimstamp = Date.now().toString;
let count = 0;
function errorCheck() {
  client.search(
    {
      index: "testdata",
      body: {
        size: 10000,
        sort: [{ timestamp: { order: "desc" } }],
        query: {
          bool: {
            must: [
              {
                range: {
                  timestamp: {
                    gt: lastTimstamp,
                  },
                },
              },
              {
                match: { level: "ERROR" },
              },
            ],
          },
        },
      },
    },
    (err, result) => {
      if (err) {
        console.log(err.meta.body.error);
      } else {
        nbrObjects = result.body.hits.hits
          .map((hits) => hits._source.timestamp)
          .sort();
        if (nbrObjects.length > 0) {
          lastTimstamp = nbrObjects[nbrObjects.length - 1];
          if (count > 0) {
            console.log(lastTimstamp);
            //console.log(result.body.hits.hits.map((hits) => hits._source.level));
            result.body.hits.hits.forEach((object) => {
              stringified = JSON.stringify(object);
              console.log(stringified);
              nodemailer.mailer("Error in logfiles", stringified);
            });
          }
        }
      }
      console.log(count);
      count++;
    }
  );
}

errorCheck();
//calls the function every 5 seconds
setInterval(errorCheck, 5000);
