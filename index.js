require('dotenv').config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;


// Middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.x6gil.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function Main() {
  const gameReviewData = client.db("gameReviewData").collection("submitdata");
  const watchList = client.db("gameReviewData").collection("watchlist");

  app.post("/addReview", async (req, res) => {
    const data = req.body;

    const result = await gameReviewData.insertOne(data);
    res.send(result);
  });
  app.get("/addReview", async (req, res) => {
    const filter = req.query;

    const cursor = gameReviewData.find(filter);
    const result = await cursor.toArray();
    res.send(result);
  });

  app.get("/review/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await gameReviewData.findOne(query);
    res.send(result);
  });

  app.get('/reviews/limit',async(req,res) =>{
    const cursor = gameReviewData.find().sort({rating: -1}).limit(6);
    const result = await cursor.toArray();
    res.send(result)
  })

  app.delete("/review/:id", async (req, res) => {
    const id = req.params.id;

    const query = { _id: new ObjectId(id) };
    const result = await gameReviewData.deleteOne(query);
    res.send(result);
  });

  app.patch("/review/:id", async (req, res) => {
    const id = req.params.id;
    const data = req.body;
    const query = { _id: new ObjectId(id) };

    const update = {
      $set: {
        title: data.title,
        rating: data.rating,
        genres: data.genres,
        year: data.year,
      },
    };

    const result = await gameReviewData.updateOne(query, update);
    res.send(result);
  });



  //-----------> Watch List section
  app.post('/watchlist', async(req,res)=>{
    const data = req.body;
    const result = await watchList.insertOne(data);
    res.send(result);
  });

  app.get("/watchlist", async (req, res) => {
    const filter = req.query;
    const cursor = watchList.find(filter);
    const result = await cursor.toArray();
    res.send(result);
  });
}
Main();
// Checking is it work
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Start the Express server
app.listen(port, () => {
  console.log(`Game Server is running on port ${port}`);
});
