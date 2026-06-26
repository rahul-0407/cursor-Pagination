const { Router } = require('express')
const { ObjectId } = require('mongodb')
const { connect } = require('../db')

const router = Router()


router.get('/', async (req, res) => {
  try {
    const db = await connect()
    const collection = db.collection('products')

    const limit = Math.min(parseInt(req.query.limit) || 20, 100)

    const query = {}

    if (req.query.category) {
      query.category = req.query.category
    }

    if (req.query.cursor) {
      let cursorId
      try {
        cursorId = new ObjectId(req.query.cursor)
      } catch {
        return res.status(400).json({ error: 'Invalid cursor' })
      }
      query._id = { $lt: cursorId }
    }

    const products = await collection
      .find(query)
      .sort({ _id: -1 })
      .limit(limit + 1)
      .toArray()

    const hasMore = products.length > limit
    if (hasMore) products.pop() 

    const nextCursor = hasMore ? products[products.length - 1]._id.toString() : null

    res.json({
      data: products,
      nextCursor,
      hasMore,
      count: products.length,
    })
  } catch (err) {
    console.error('GET /products error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.get('/categories', async (req, res) => {
  try {
    const db = await connect()
    const categories = await db.collection('products').distinct('category')
    res.json({ categories: categories.sort() })
  } catch (err) {
    console.error('GET /categories error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router
