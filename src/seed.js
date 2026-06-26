require('dotenv').config()
const { MongoClient } = require('mongodb')

const CATEGORIES = [
  'Electronics', 'Clothing', 'Books', 'Furniture',
  'Sports', 'Toys', 'Beauty', 'Automotive', 'Garden', 'Food'
]

const ADJECTIVES = ['Premium', 'Classic', 'Modern', 'Vintage', 'Pro', 'Ultra', 'Eco', 'Smart', 'Deluxe', 'Mini']
const NOUNS = ['Widget', 'Gadget', 'Gizmo', 'Device', 'Tool', 'Item', 'Unit', 'Kit', 'Set', 'Pack']

function randomBetween(min, max) {
  return Math.random() * (max - min) + min
}

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

async function seed() {
  const client = new MongoClient(process.env.MONGODB_URI)

  try {
    await client.connect()
    console.log('Connected to MongoDB')

    const db = client.db()
    const collection = db.collection('products')

    await collection.drop().catch(() => {}) 
    console.log('Cleared existing products')

    await collection.createIndex({ category: 1, _id: -1 })
    console.log('Index created: { category: 1, _id: -1 }')

    const TOTAL = 200_000
    const BATCH_SIZE = 5_000 
    const now = Date.now()
    const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000

    console.log(`Seeding ${TOTAL.toLocaleString()} products in batches of ${BATCH_SIZE.toLocaleString()}...`)

    let inserted = 0

    for (let batch = 0; batch < TOTAL / BATCH_SIZE; batch++) {
      const docs = Array.from({ length: BATCH_SIZE }, (_, i) => {
        const globalIndex = batch * BATCH_SIZE + i
        return {
          name: `${randomItem(ADJECTIVES)} ${randomItem(NOUNS)} ${globalIndex + 1}`,
          category: randomItem(CATEGORIES),
          price: parseFloat(randomBetween(1, 2000).toFixed(2)),
          createdAt: new Date(now - randomBetween(0, ONE_YEAR_MS)),
          updatedAt: new Date(now - randomBetween(0, ONE_YEAR_MS / 2)),
        }
      })

      await collection.insertMany(docs, { ordered: false })
      inserted += docs.length
      process.stdout.write(`\r  Inserted ${inserted.toLocaleString()} / ${TOTAL.toLocaleString()}`)
    }

    console.log('\nDone! Seeding complete.')

    const count = await collection.countDocuments()
    console.log(`Total documents in collection: ${count.toLocaleString()}`)

  } catch (err) {
    console.error('Seed failed:', err)
    process.exit(1)
  } finally {
    await client.close()
  }
}

seed()
