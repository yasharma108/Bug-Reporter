const express=require('express');
const mongoose=require('mongoose');
const cors=require('cors');
require("dotenv").config();

const path = require("path");


const app=express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../client")));

const authRoutes=require("./routes/auth");
app.use("/api/auth", authRoutes);

const bugRoutes=require("./routes/bugs");
app.use("/api/bugs", bugRoutes);

app.get("/", (req, res)=>{
    res.send("API is running...");
});
mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MONGODB CONNECTED"))
.catch(err=>console.log(err));



const PORT=process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log(`Server running on PORT ${PORT}`);
});