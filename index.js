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
    const collection = client.db(process.env.DB_NAME).collection("products");
    console.log('DB Connected Successfully!');

    app.post('/addProduct', (req, res) => {
        const products = req.body;
        // collection.insertOne(newProduct)
        collection.insertMany(products)
        .then(result => res.status(200).send(result.insertedCount.toString())); // send(status) if status is a numeric value then you will get an error
    })

    app.get('/products', (req, res) => {
        collection.find({}).limit(20)
        .then((err, documents) => {
            res.status(200).send(documents);
        })
    })
});

app.listen(port, () => {
  console.log(`Ema-John App listening at http://localhost:${port}`)
})