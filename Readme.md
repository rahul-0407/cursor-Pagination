# Product Browser Backend

A lightweight backend application built for the CodeVector Backend Internship assignment.
The application generates and serves approximately **200,000 products**, supports **fast cursor-based pagination**, **category filtering**, and guarantees stable pagination while new products are being added.

---

## Tech Stack

* Node.js
* Express.js
* MongoDB
* MongoDB Native Driver (No Mongoose)

---

## Features

* Generate 200,000 sample products
* Cursor-based pagination
* Category filtering
* Fast pagination using MongoDB indexes
* Batch seeding with `insertMany()`
* Simple frontend served from the same Express application
* Health check endpoint

---

## Project Structure

```
product-browser/
│
├── public/
├── src/
│   ├── db.js
│   ├── server.js
│   ├── seed.js
│   └── routes/
│       └── products.js
│
├── .env
├── package.json
└── README.md
```

---

## Installation

Clone the repository.

```bash
git clone <repository-url>
```

Install dependencies.

```bash
npm install
```

Create a `.env` file.

```env
MONGODB_URI=<your-mongodb-connection-string>
PORT=3000
```

Generate the dataset.

```bash
node src/seed.js
```

Start the server.

```bash
node src/server.js
```

---

## API Endpoints

### Health Check

```
GET /health
```

Returns

```json
{
  "status": "ok"
}
```

---

### Get Categories

```
GET /api/products/categories
```

Response

```json
{
  "categories": [
    "Automotive",
    "Beauty",
    "Books",
    "Clothing",
    "Electronics",
    "Food",
    "Furniture",
    "Garden",
    "Sports",
    "Toys"
  ]
}
```

---

### Get Products

```
GET /api/products
```

Query Parameters

| Parameter | Description                               |
| --------- | ----------------------------------------- |
| limit     | Number of products to fetch (maximum 100) |
| cursor    | Cursor for pagination                     |
| category  | Filter by category                        |

Example

```
GET /api/products?limit=20
```

Next page

```
GET /api/products?limit=20&cursor=<nextCursor>
```

Category filter

```
GET /api/products?category=Electronics
```

Response

```json
{
  "data": [...],
  "nextCursor": "...",
  "hasMore": true,
  "count": 20
}
```

---

## Why Cursor Pagination?

The assignment requires that users **must not see duplicate products or miss products while new data is being added**.

Offset pagination (`skip` + `limit`) can produce duplicate or missing records when new documents are inserted.

To avoid this, this project uses **cursor pagination** based on MongoDB's `_id`.

Products are always sorted by:

```js
{ _id: -1 }
```

The client sends the `_id` of the last received product as the cursor, allowing the next page to continue from exactly that position.

---

## Database Index

The application creates the following compound index:

```js
{ category: 1, _id: -1 }
```

This supports efficient category filtering together with cursor-based pagination.

---

## Seeding Strategy

Instead of inserting 200,000 documents one by one, products are generated in batches of **5,000** using `Array.from()` and inserted using `insertMany()`.

This approach significantly reduces execution time and avoids unnecessary memory usage.

---

## Future Improvements

* Automated API tests
* Better request validation
* Request logging
* Rate limiting
* Performance benchmarking
* Previous-page cursor navigation
* Docker support

---

## Author

Rahul Kumar Gupta