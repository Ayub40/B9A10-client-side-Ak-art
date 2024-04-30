const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());



console.log(process.env.DB_USER);
console.log(process.env.DB_PASS);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uxvdig6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri);


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const artsCollection = client.db('artsDB').collection('arts');


        app.get('/arts', async (req, res) => {
            const cursor = artsCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/arts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await artsCollection.findOne(query);
            res.send(result);
        })

        // app.get('/crafts/:email', async (req, res) => {
        //     const email = req.params.email;
        //     const query = { email: (email) }
        //     const result = await artsCollection.find(query).toArray();
        //     res.send(result);
        // })



        app.post('/arts', async (req, res) => {
            const artCraft = req.body;
            console.log(artCraft);
            const result = await artsCollection.insertOne(artCraft);
            res.send(result);
        })


        app.get('/myProduct/:email', async (req, res) => {
            console.log(req.params.email);
            const result = await artsCollection.find({ email: req.params.email }).toArray();
            res.send(result);
        })



        // app.get('/arts/:email', async (req, res) => {
        //     console.log(req.params.email);
        //     const result = await artsCollection.find({ email: req.params.email }).toArray();
        //     res.send(result);
        // })

        app.put('/arts/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const option = { upsert: true };
            const updateArtCraft = req.body;
            const artsItem = {
                $set: {
                    email: updateArtCraft.email,
                    name: updateArtCraft.name,
                    item: updateArtCraft.item,
                    description: updateArtCraft.description,
                    price: updateArtCraft.price,
                    rating: updateArtCraft.rating,
                    photo: updateArtCraft.photo,
                    selectedCustom: updateArtCraft.selectedCustom,
                    selectedStock: updateArtCraft.selectedStock,
                    selectedSubcategory: updateArtCraft.selectedSubcategory,
                    selectedProcessing: updateArtCraft.selectedProcessing
                }
            }

            const result = await artsCollection.updateOne(filter, artsItem, option)
            res.send(result);
        })



        app.delete('/arts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await artsCollection.deleteOne(query);
            res.send(result);
        })

        app.delete('/delete/:id', async (req, res) => {
            const result = await artsCollection.deleteOne({ _id: new ObjectId(req.params.id) })
            console.log(result);
            res.send(result)
        })



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('ak server is running')
})

app.listen(port, () => {
    console.log(`ak server is on port: ${port}`);
})