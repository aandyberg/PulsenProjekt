const { Client } = require("elasticsearch");
const client = new Client({
  node: "http://localhost:9200",
});
const nodemailer = require("./nodemailer");

client.search(
  {
    index: "logstash",
    body: {
      query: {
        match: { host: "Andreas-Dator" },
      },
    },
  },
  (err, result) => {
    if (err) {
      console.log(err);
    } else {
      nodemailer.mailer("testSubject", JSON.stringify(result.hits.hits));
      console.log(result.hits.hits.map((hits) => hits._source.message));
    }
  }
);
