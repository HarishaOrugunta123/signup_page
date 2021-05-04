const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const user = require("./routes/users");

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
  }
  const port = process.env.PORT || 3000
  const InitiateMongoServer = require("./config/db");
 

app.use(cors);
app.use(bodyParser.json());
app.get("/", (req, res) =>{
    res.send("get method");
})

app.use("/api/user", user);


app.listen(port, async (error) => {
    await  InitiateMongoServer();
    if (error) throw error;
    console.log("Server is Running on PORT", port);
  })