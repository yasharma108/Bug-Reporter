const mongoose=require("mongoose");

const bugSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    title:{
        type:String,
        required:true
    },
    description:String,
    steps:String,
    codeSnippet:String,
    severity:{
        type:String,
        enum:["low", "medium", "high"],
        default:"low"
    },
    status:{
        type:String,
        enum:["open", "in-progress", "resolved"],
        default:"open"
    }
}, {timestamps:true});

module.exports=mongoose.model("Bug", bugSchema);