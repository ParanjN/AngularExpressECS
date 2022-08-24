const express = require('express');
const app = express(),
    bodyParser = require("body-parser");
port = 3080;
var AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });
var cors = require('cors')

// Create the DynamoDB service object
var ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

app.use(cors())
app.use(bodyParser.json());
app.use("/", express.static(process.cwd() + "/integration-demo/dist/integration-demo/"));


app.get('/fetchDetails', function (req, res) {
    console.log("inside fetchDetails")
    user = {};
    var params = {
        Key: {
            "id": { "S": "1" }
        },
        TableName: "hackathon"
    };

    // Call DynamoDB to read the item from the table
    ddb.getItem(params, function (err, data) {
        if (err) {
            console.log("Error", err);
            res.send({ "error": true })
        } else {
            console.log("Success", data.Item);

            user["addToCard"] = data.Item["addToCard"]["S"]
            user["activeSessions"] = data.Item["activeSessions"]["S"]
            res.json(user)
        }
    });




})

app.get('/', (req, res) => {
    console.log("Inside server /")
    res.sendFile(process.cwd() + "/integration-demo/dist/integration-demo/index.html")
});

app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
});