import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import chalk from "chalk";

dotenv.config()

const Client = process.env.MONGO_URL + '&ssl=true&tlsAllowInvalidCertificates=true';

async function init() {
  const mongoClient = new MongoClient(Client);
  await mongoClient.connect();
  console.log(chalk.green("Database is connected!"));
  const database = mongoClient.db(process.env.DATABASE);

  return database;
}

const db = init();

export default db;