require('dotenv').config()

const express = require('express')
const cors = require('cors')
const path = require('path')
const { connect } = require('./db')
const productsRouter = require('./routes/products')

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.use(express.static(path.join(__dirname, '../public')))

app.use('/api/products', productsRouter)

app.get('/health', (req, res) => res.json({ status: 'ok' }))

connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err)
    process.exit(1)
  })
  
