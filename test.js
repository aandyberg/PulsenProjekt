const { Client } = require("elasticsearch");
const client = new Client({
  node: "http://localhost:9200",
  log: "error",
});
const nodemailer = require("./nodemailer");

/*function checker() {
  client.search(
    {
      index: "testindex",
      body: {
        query: {
          match: { loglevel: "info" },
        },
      },
    },
    (err, result) => {
      console.log(result);
      if (err) {
        console.log(err);
      } else {
        //nodemailer.mailer("testSubject", JSON.stringify(result.hits.hits));
        console.log(result.hits.hits.map((hits) => hits._source.logMsg));
        //console.log(result.hits.hits.map((hits) => hits._source.message));
      }
    }
  );
}

setInterval(checker, 5000);*/

let fruits = { apple: "red", pear: "green", banana: "yellow", plum: "purple" };
console.log(fruits);
for (let k in fruits) {
  console.log(k + " is " + fruits[k]);
}
