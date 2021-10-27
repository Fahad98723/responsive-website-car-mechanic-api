const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const { MongoClient } = require('mongodb');
require('dotenv').config()
const cors = require('cors')
app.use(cors())
app.use(express.json())
const ObjectId = require('mongodb').ObjectId

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rf28w.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run () {
    try{
        await client.connect();

        const database = client.db("carMechanic");
        const serviceCollection = database.collection("services");
        //find all 
        app.get('/services',async(req,res) => {
            const cursor = serviceCollection.find({})
            const services = await cursor.toArray()
            res.send(services)
        }) 

        //find one
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id
            const query = {_id : ObjectId(id)}
            const perService = await serviceCollection.findOne(query)
            res.send(perService)
        })

        //post
        app.post('/services', async (req, res) => {      
            const service = req.body  
            const result = await serviceCollection.insertOne(service)
            console.log('hit thee post');
            res.json(result)
        })
        //delete api 
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id
            const query = {_id : ObjectId(id)}
            const result = await serviceCollection.deleteOne(query)
        })

        
    }
    finally{
        // await client.close()
    }
}
run().catch(console.dir)
app.get('/', (req, res) => {
    res.send('Running the server')
})
app.listen(port,() => {
    console.log('Running');
})