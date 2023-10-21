// import mariadb from "mariadb"

// const pool = mariadb.createPool({
//   host: process.env.LAMP_DB_HOST,
//   user: process.env.LAMP_DB_USER,
//   password: process.env.LAMP_DB_PASS,
// })

import { Sequelize } from "sequelize"

export const sequelize = new Sequelize({
  host: process.env.LAMP_DB_HOST || "",
  username: process.env.LAMP_DB_USER || "",
  password: process.env.LAMP_DB_PASS || "",
  database: process.env.LAMP_DB_DBNAME || "",
  dialect: "mariadb",
})

export async function setupDb() {
  try {
    await sequelize.authenticate()
    console.log("Connected to DB")
  } catch (error) {
    console.error("Couldn't connect to db", error)
  }
}