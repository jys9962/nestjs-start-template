import * as dotenv from "dotenv";

dotenv.config();

export const env = {
  isDev: process.env.NODE_ENV !== "production",
  mainDb: {
    connectionLimit: 30,
    host: process.env.MYSQL_MAIN_HOST,
    database: process.env.MYSQL_MAIN_DATABASE,
    user: process.env.MYSQL_MAIN_USER,
    password: process.env.MYSQL_MAIN_PASSWORD
  },
  aws: {
    accessKey: '',
    secretKey: ''
  }
};
