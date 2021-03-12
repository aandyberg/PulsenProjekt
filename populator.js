const { events, Client, errors } = require("@elastic/elasticsearch");
const fs = require("fs");
const client = new Client({
  node: "http://localhost:9200",
});
const path = "./logs/";
const run = async () => {
  await fs.readdir(path, (err, files) => {
    if (err) {
      console.log(err);
    } else {
      files.forEach((file, i) => {
        setTimeout(() => {
          data = fs.readFileSync(path + file);
          jsonData = JSON.parse(data);
          ts = new Date().toISOString();
          jsonData.timeStamp = ts;
          ll = jsonData.logLevel;

          client.index(
            {
              index: "testindex",
              body: {
                timestamp: ts,
                logLevel: ll,
                jsonData,
              },
            },
            (err, res) => {
              if (err) {
                console.log(err);
              } else {
                if (res.statusCode == 201) {
                  console.log("Inserted log");
                } else {
                  console.log(res.statusCode);
                }
              }
            }
          );
          console.log("Log sent");
        }, i * 60000); //1 min
      });
    }
  });
};

run();
