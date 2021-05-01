const dotenv = require("dotenv");
dotenv.config();

const config = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
  mongo: {
    host: process.env.MONGO_HOST,
    host_test: process.env.MONGO_HOST_TEST,
  },
};

module.exports = config;
