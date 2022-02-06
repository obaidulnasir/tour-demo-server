const express = require("express");
const app = express();
var cors = require("cors");
require('dotenv').config()

const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const email = require("mongodb").email;




// port
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());


// mongodb URL 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rmbaw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

console.log(uri);

// Client 
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        console.log('database connect');

        //Database
        const tourPackage = client.db("tourPackages");

        //Package Collection
        const package = tourPackage.collection("package");
        //Booking Collection
        const bookingCollection = tourPackage.collection("bookingCollection");




        //ADD Package API
        app.post('/addPackage', async (req, res) => {
            const addPackage = req.body;
            // console.log(req.body);
            const result = await package.insertOne(addPackage);
            console.log(`A document was inserted with the _id: ${result.insertedId}`);
            res.send(result);
        });

        //GET All Packages
        app.get("/allPackages", async(req, res)=>{
            const result = await package.find({}).toArray();
            res.send(result);
        });

        //GET Single Package
        app.get("/singlePackage/:id", async(req, res)=>{
            const packageId = req.params.id;
            const query = {_id: ObjectId(packageId)};
            const result = await package.findOne(query);
            res.send(result);
        });

        // Make an Order
        //ADD an order in database
        app.post('/booking', async(req, res)=>{
        const bookingData = req.body;
        console.log(bookingData)
        const result = await bookingCollection.insertOne(bookingData);
        res.send(result)
      });

      //MY Order
      app.get("/myOrder/:email", async(req, res)=>{
        const myAllOrders = req.params.email;
        const query = {email:myAllOrders}
        const result = await bookingCollection.find(query).toArray();
        // console.log(result);
        res.send(result);
      });

      //DELETE Single Order
      app.delete('/deleteBooking/:id', async (req, res)=>{
        const deleteMyBooking = req.params.id;
        // console.log(deleteMyBooking)
        const query = {_id: ObjectId(deleteMyBooking)};
        const result = await bookingCollection.deleteOne(query);
        res.send(result);
      })

    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);








app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});