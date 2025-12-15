const { MongoClient, ServerApiVersion } = require('mongodb');
const dbname = "ChatApp"
const username = "aman010"
const password = "admin1234";

const uri = `mongodb+srv://${username}:${password}@cluster0.5m5hj38.mongodb.net/${dbname}?appName=Cluster0`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
const mongoose = require('mongoose');

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("Connected to MongoDB via Mongoose");
})
.catch(err => {
  console.error("Mongoose connection error:", err);
});