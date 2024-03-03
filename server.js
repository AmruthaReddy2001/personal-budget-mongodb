// Budget API
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
const budgetdata = require('./Json-Data/budgetEntryModel');

app.use(cors());
app.use(bodyParser.json());
app.use('/', express.static("public"));

const mongoURL = "mongodb://localhost:27017/Budget";

try {
    mongoose.connect(mongoURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        family: 4  // Use IPv4
    });
    console.log("Connected to Mongo-Database");
} catch (error) {
    console.error("Error Connecting to Mongo-Database", error);
}


app.get('/api/budget', async (req, res) => {
    try {
        const data = await budgetdata.find();
        res.json(data);
    } catch (error) {
        console.error("Error fetching expenses:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.post('/api/budget', async (req, res) => {
    try {
        const budgetEntry = new budgetdata(req.body);
        const entry = await budgetEntry.save();
        res.json(entry);
    } catch (error) {
        console.error("Error adding expense:", error);
        if (error.name === 'ValidationError') {
            res.status(400).json({ error: 'Validation Error', details: error.errors });
        } else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});

app.listen(port, () => {
    console.log(`API served at http://localhost:${port}`)
});
