const mongoose = require("mongoose");
const createServer = require("./server");
const config = require("./config");

const { host: mongoUri } = config.mongo;
const { port } = config;

mongoose
  .connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log(`DB connection successful!`);

    const app = createServer();
    app.listen(port, () => {
      console.log(`Server has started on port ${port}!`);
    });
  })
  .catch((err) => {
    console.error(`unable to connect to database: ${mongoUri}`);
    console.log(err);
  });
