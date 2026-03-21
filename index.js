const http = require("http");
const { MongoClient } = require("mongodb");

const PORT = 3000;
const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017";

let db;

// Connect to MongoDB
async function connectDB() {
  try {
    const client = await MongoClient.connect(MONGO_URL);
    db = client.db("learn-devops");
    console.log("Connected to MongoDB!");

    // Insert a welcome record if collection is empty
    const count = await db.collection("visits").countDocuments();
    if (count === 0) {
      await db.collection("visits").insertOne({ page: "home", count: 0 });
    }
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
  }
}

const server = http.createServer(async (req, res) => {
  if (req.url === "/") {
    let visitCount = 0;
    if (db) {
      // Increment visit count
      const result = await db.collection("visits").findOneAndUpdate(
        { page: "home" },
        { $inc: { count: 1 } },
        { returnDocument: "after" }
      );
      visitCount = result.count;
    }
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({
      message: "Hello DevOps! Now with Docker Compose + MongoDB!",
      visits: visitCount,
      database: db ? "connected" : "disconnected"
    }));
  } else if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok", database: db ? "connected" : "disconnected" }));
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not found" }));
  }
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

connectDB();

module.exports = server;
