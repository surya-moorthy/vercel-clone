import express, { Request, Response } from "express"
import {generate} from "./utils/utils";
import cors from "cors"
import simpleGit from "simple-git";
import path from "path";
import { getAllfiles } from "./utils/getFiles";
import { uploadFile } from "./utils/uploadFile";
const app = express();


app.use(cors());
app.use(express.json());

app.post("/deploy", async (req : Request ,res : Response) => {
    const repoUrl = req.body.repoUrl;
    const repoid = generate();

    await simpleGit().clone(repoUrl,path.join(__dirname,`output/${repoid}`));

    const files = await getAllfiles(path.join(__dirname,`output/${repoid}`));

     files.forEach(async (file)=> {
         await uploadFile(file.slice(__dirname.length + 1),file);
     })
    res.json({
        id : repoid
    })
    
    
})

app.listen(3000,()=> {
    console.log("the app is running at port 3000.");
})