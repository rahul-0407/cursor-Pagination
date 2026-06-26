const { MongoClient } = require('mongodb')

let db = null

async function connect() {
  if (db) return db

  const client = new MongoClient(process.env.MONGODB_URI)
  await client.connect()
  db = client.db()
  console.log('Connected to MongoDB')
  return db
}

module.exports = { connect }
