const { events, Client, errors } = require("@elastic/elasticsearch");
const client = new Client({
  node: "http://localhost:9200",
});
const nodemailer = require("./nodemailer");

//Sets lasttimestamp to current time
let currentTime = new Date();
let lastTimestamp = currentTime.toISOString();

function errorCheck() {
  client.search(
    {
      // which index to search
      index: "testdata",
      body: {
        size: 10000,
        sort: [{ timestamp: { order: "desc" } }],
        //searches must match error && in range of timestamp > lasttimestamp
        query: {
          bool: {
            must: [
              {
                range: {
                  timestamp: {
                    gt: lastTimestamp,
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
        //maps all the timestamps and sorts the timestamps
        nbrObjects = result.body.hits.hits
          .map((hits) => hits._source.timestamp)
          .sort();

        // checks if there are any new errors, nbrObjects is not empty
        if (nbrObjects.length > 0) {
          //gets the last timestamp in the list
          lastTimestamp = nbrObjects[nbrObjects.length - 1];
          //Takes every hit, stringifies it and mails it to the
          result.body.hits.hits.forEach((object) => {
            stringified = JSON.stringify(object);
            nodemailer.mailer(
              "Error in logfiles",
              stringified,
              process.argv[2]
            );
          });
        } else {
          console.log("No new errors found");
        }
      }
    }
  );
}
//Calls erroCheck 1 time
errorCheck();
//calls the function every 5 seconds
setInterval(errorCheck, 5000);
