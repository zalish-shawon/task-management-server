const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port= process.env.PORT || 5000


app.use(cors());
app.use(express.json());

//users-task
// o5dwWNRUZpuv7LW2
const uri = "mongodb+srv://users-task:o5dwWNRUZpuv7LW2@cluster0.hrjn1tt.mongodb.net/?retryWrites=true&w=majority";
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

    const usersTaskCollection = client.db('usersTask').collection('tasks');
    const membersCollection = client.db('usersTask').collection('members');
    // data post request
    app.post("/usersTasks", async(req,res) => {
        const tasks = req.body
        // console.log(tasks);
        const result =  await usersTaskCollection.insertOne(tasks);
        res.send(result);

    })
    // read all users tasks
    app.get('/usersTasks', async(req,res) => {
        const result = await usersTaskCollection.find().toArray();
        res.send(result);
    })
    app.get('/usersTasks/:id', async(req, res ) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await usersTaskCollection.findOne(query);
      res.send(result);
    })
    // update userTaskCollection
    app.put('/usersTasks/:id', async(req,res) => {
      const id =  req.params.id;
      const filter = {_id: new ObjectId(id)};
      const options = {upsert: true};
      const updatedTask = req.body
      const task = {
        $set: {
            taskName: updatedTask.taskName,
            dueDate: updatedTask.dueDate,
            priority:updatedTask.priority, 
            memberName: updatedTask.memberName,
            description:updatedTask.description, 
        }
      }
      console.log(task);
      const result = await usersTaskCollection.updateOne(filter, task, options)
      res.send(result);
    })

    // delete a single task

    app.delete('/usersTasks/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await usersTaskCollection.deleteOne(query);
      res.send(result);
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
    res.send('Task management server is running')
})

app.listen(port, (req, res) => {
    console.log(`listening on ${port}`);
})