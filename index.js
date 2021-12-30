const express = require('express');

const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;



const app= express();
const port = process.env.PORT || 4500;




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gb1g6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {  useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());
app.use(express.json());


async function run(){
    try{
        await client.connect();
        console.log('connected');
        const database = client.db('Assignment-12');
        const productCollection= database.collection('explore-products');

        const orderCollection = database.collection('orders');

        const reviewsCollection = database.collection('reviews');

        const usersCollection = database.collection('users');

        //GET API
        app.get('/services', async(req,res)=>{
           
            const cursor = productCollection.find({});
            const services= await cursor.toArray();
            res.send(services);
        });



        //GET single product
        app.get('/services/:id',async(req,res)=>{
            const id= req.params.id;
            const query= { _id: ObjectId(id)};
            const service= await productCollection.findOne(query);
            res.json(service);

        })
        // GET ORDER
        app.get('/orders', async(req,res)=>{
            const cursor = orderCollection.find({});
            const services= await cursor.toArray();
            res.send(services);
        });
        // GET review
        app.get('/reviewpost', async(req,res)=>{
            const cursor = reviewsCollection.find({});
            const reviews= await cursor.toArray();
            res.send(reviews);
        });

        //GET myOrder
        app.get('/myOrder', async(req,res)=>{
            const email = req.query.email;
            const query= {email : email}
            const cursor = orderCollection.find(query);
    
            const users= await cursor.toArray();
    
            res.json(users);
        });

        

        //GET all Orders
        app.get('/allOrders', async(req,res)=>{
            const cursor = orderCollection.find({});
    
            const users= await cursor.toArray();
    
            res.send(users);
        })

        //GET single allorders
        app.get('/allOrders/:id', async(req,res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const user= await orderCollection.findOne(query);
            console.log('load user with id :', id);
            res.send(user);
        })
        //POST API product
        app.post('/services', async(req,res)=>{
            
            const service = req.body;
            console.log("hit the post", service);
            const result = await productCollection.insertOne(service);

            console.log(result);
            res.json(result);
        })
        // get admin
        app.get('/users/:email', async (req, res) => {
            const email= req.params.email;
            const query = {email : email};
            const user = await usersCollection.findOne(query);
            let isAdmin= false;
            if(user?.role==='admin'){
                isAdmin=true;
            }
            res.json({admin: isAdmin});
        })

        //POST API users
        app.post('/users', async(req,res)=>{
            
            const user = req.body;
            console.log("hit the post", user);
            const result = await usersCollection.insertOne(user);

            console.log(result);
            res.json(result);
        })

        //POST API orders
        app.post('/orders', async(req,res)=>{
            
            const order = req.body;
            console.log("hit the post", order);
            const result = await orderCollection.insertOne(order);

            console.log(result);
            res.json(result);
        })

        //post reviews
        app.post('/reviewpost', async(req,res)=>{
            
            const review = req.body;
            console.log("hit the post", review);
            const result = await reviewsCollection.insertOne(review);

            console.log(result);
            res.json(result);
        })

        // DELETE myOrder API

            app.delete('/myOrder/:id', async(req,res)=>{
                const id= req.params.id;
                const query = {_id: ObjectId(id)};
                const result = await orderCollection.deleteOne(query);
                console.log('deleting user with id', result);
                res.json(result);
            })

         // DELETE all Order API

            app.delete('/allOrders/:id', async(req,res)=>{
                const id= req.params.id;
                const query = {_id: ObjectId(id)};
                const result = await orderCollection.deleteOne(query);
                console.log('deleting user with id', result);
                res.json(result);
            })

            //role

            app.put('/users', async(req,res) => {
                const user = req.body;
                const filter = {email: user.email};
                const updateDoc= { $set: {role: 'admin'} };
                const result= await usersCollection.updateOne(filter,updateDoc);
                res.json(result);
            })
    }
    finally{
       // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req,res)=>{
    res.send('Hello world');
});

app.listen(port, ()=>{
    console.log('listening to port', port  );
})