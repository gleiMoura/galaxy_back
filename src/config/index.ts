import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import chalk from "chalk";

dotenv.config()

const prisma = new PrismaClient();

async function init() {
  try {
    await prisma.$connect();
    console.log(chalk.green("Database is connected!"))
  } catch (error) {
    console.error(chalk.red("Error connecting to the database:", error))
  }
}

init();

export default prisma;