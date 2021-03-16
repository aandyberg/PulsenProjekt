const { events, Client, errors } = require("@elastic/elasticsearch");
const client = new Client({
  node: "http://localhost:9200",
});
const nodemailer = require("./nodemailer");
const fs = require("fs");

//Sets lasttimestamp to current time
let currentTime = new Date();
console.log(Date.now());
const halfDayinMiliseconds = 43200000;
let ignoreList = [];
let lastTimestamp = currentTime.toISOString();
console.log(currentTime);
function errorCheck() {
  client.search(
    {
      // which index to search
      index: "testindex",
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
                match: { logLevel: "ERROR" },
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

        for (let key in ignoreList) {
          if (ignoreList[key] < Date.now()) {
            delete ignoreList[key];
          } else {
            console.log(
              "Time left in ignorelist for " +
                key +
                ": " +
                Math.round((ignoreList[key] - Date.now()) / 3600000) +
                " hours left"
            );
          }
        }
        // checks if there are any new errors, nbrObjects is not empty
        if (nbrObjects.length > 0) {
          //gets the last timestamp in the list
          lastTimestamp = nbrObjects[nbrObjects.length - 1];

          //Checks if object in ignorelist, if not sends mail and adds it for 12 hours
          result.body.hits.hits.forEach((object) => {
            if (object._source.sendingSystem in ignoreList) {
              console.log("I ignoreList");
            } else {
              //Takes every hit, stringifies it and mails it to the
              fs.readFile(process.argv[2], "utf-8", (err, data) => {
                if (err) {
                  console.log(err);
                  return;
                } else {
                  mailListArray = data.split(/\r\n|\n/);
                  //Sends mail
                  //result.body.hits.hits.forEach((object) => {
                  stringified = JSON.stringify(object);
                  nodemailer.mailer(
                    "Error in logfiles",
                    stringified,
                    mailListArray
                  );
                  //});
                  //Adds it to ignoreList
                  let sendingSyst = object._source.sendingSystem;
                  ignoreList[sendingSyst] = Date.now() + halfDayinMiliseconds;
                  console.log(
                    " Sent mail and Added " +
                      sendingSyst +
                      " to ignoreList for 12 hours"
                  );
                }
              });
            }
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
