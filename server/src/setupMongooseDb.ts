import mongoose from "mongoose"

export async function setupMongooseDB() {
  const connectionString = process.env.LAMP_MONGO_DB_CONNECTION_STRING
  if (!connectionString) throw Error("Connection string required.")

  await mongoose.connect(connectionString, {
    dbName: "i-love-lamp",
  })
}
