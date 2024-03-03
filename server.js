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

mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4  // Use IPv4
})
.then(() => {
    console.log("Connected to Database");
})
.catch((error) => {
    console.log("Unable to connect to Database.\n", error);
});

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
        const Entry = await budgetEntry.save();
        res.json(Entry);
    } catch (error) {
        console.error("Error adding expense:", error);
        res.status(400).json({ error: error.message });
    }
});
app.listen(port, () => {
    console.log(`API served at http://localhost:${port}`)
});
