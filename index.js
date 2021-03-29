const express = require('express');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.boucr.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();
const port = 4000;

app.use(cors());
app.use(bodyParser.json());

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const productsCollection = client.db(process.env.DB_NAME).collection("products");
    const ordersCollection = client.db(process.env.DB_NAME).collection("orders");

    console.log('DB Connected Successfully!');

    app.post('/addProduct', (req, res) => {
        const products = req.body;
        // productsCollection.insertOne(newProduct)
        productsCollection.insertMany(products)
        .then(result => res.status(200).send(result.insertedCount > 0 ? "Product Added Successfully!" : "Failed to Add Product!")); // send(status) if status is a numeric value then you will get an error
    })

    app.get('/products', (req, res) => {
        productsCollection.find({})
        .toArray((err, documents) => {
            res.status(200).send(documents);
        })
    })

    app.get('/product/:key', (req, res) => {
        productsCollection.find({key: req.params.key})
        .toArray((err, documents) => {
            res.status(200).send(documents[0]);
        })
    })

    app.post('/productsByKeys', (req, res) => {
        const productKeys = req.body;
        productsCollection.find({key: {$in: productKeys}})
        .toArray((err, documents) => {
            res.status(200).send(documents);
        })
    })

    app.post('/addOrder', (req, res) => {
        const orders = req.body;
        ordersCollection.insertOne(orders)
        .then(result => {
            res.status(200).send(result.insertedCount > 0)
        }); // send(status) if status is a numeric value then you will get an error
    })
});

app.listen(port, () => {
  console.log(`Ema-John App listening at http://localhost:${port}`)
})