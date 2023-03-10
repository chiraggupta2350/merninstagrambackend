const express = require("express");
const app = express();
const mongoose = require("mongoose");
const PORT = process.env.PORT || 5000;
const cors = require("cors")

// Config
require("dotenv").config();

app.use(cors());
app.use(express.json());


app.use(require("./routes/auth"));
app.use(require("./routes/post"));
// app.use(require("./routes/user"));

mongoose.connect(process.env.MONGOURI,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log("connection successful");
}).catch((err)=>{
    console.log(err);
});

if(process.env.NODE_ENV=="production"){
    app.use(express.static("client/build"))
    const path = require("path")
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,"client","build","index.html"))
    })
}
app.listen(PORT,()=>{
   console.log("server is running on",PORT)
});
