const express=require("express");
const router=express.Router();
const Bug=require("../models/Bug");
const auth=require("../middleware/auth");
const { GoogleGenAI } = require("@google/genai");

// Will use process.env.GEMINI_API_KEY automatically if not provided explicitly, but better to pass or handle fallback
let ai;
try {
  ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "dummy" });
} catch (e) {
  console.log("Failed to initialize GoogleGenAI", e);
}

router.post("/", auth, async(req, res)=>
{
    try{
        const{title, description, steps, codeSnippet, severity}=req.body;
        const bug=new Bug({
            userId:req.user.userId,
            title,
            description,
            steps,
            codeSnippet,
            severity
        });
        await bug.save();
        res.status(201).json(bug);
    }catch(err){
        res.status(500).json({message:"Server error"});
    }
});

router.get("/", auth, async(req, res)=>
{
    try{
        const bugs=await Bug.find({userId:req.user.userId});
        res.json(bugs);

    }catch{
        res.status(500).json({message:"Server Error"});
    }
});

router.put("/:id", auth, async(req, res)=>{
    try{
        const bug=await Bug.findOneAndUpdate(
            {_id:req.params.id, userId:req.user.userId},
            req.body,
            {new:true}
        );
        if(!bug)
        {
            return res.status(404).json({message:"Bug not found"});
        }
        res.json(bug);
    }catch{
        console.error(err);
        res.status(500).json({message:"Server Error"});
    }
});

router.delete("/:id", auth, async(req, res)=>
{
    try{
        await Bug.findOneAndDelete({
            _id:req.params.id,
            userId:req.user.userId
        });
        res.json({message:"Bug deleted"});
    }catch{
        res.status(500).json({message:"Server Error"});
    }
});

router.get("/:id/suggest", auth, async(req, res) => {
    try {
        const bug = await Bug.findOne({ _id: req.params.id, userId: req.user.userId });
        if (!bug) return res.status(404).json({ message: "Bug not found" });

        if (!process.env.GEMINI_API_KEY) {
             return res.json({ suggestion: "No GEMINI_API_KEY configured. General idea: Check logs, verify the environment, and step through the code to isolate the issue." });
        }

        let prompt = `As a senior software engineer, provide a brief, actionable suggestion on how to solve this bug:\nTitle: ${bug.title}\nSeverity: ${bug.severity}\nDescription/Steps: ${bug.description || bug.steps || "No additional context"}\n`;
        
        if (bug.codeSnippet) {
            prompt += `\nHere is the code associated with the bug:\n\`\`\`\n${bug.codeSnippet}\n\`\`\`\nPlease debug the code and suggest what might be wrong.\n`;
        }

        prompt += `\nKeep the suggestion under 4 sentences.`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        res.json({ suggestion: response.text });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error generating suggestion" });
    }
});

module.exports=router;