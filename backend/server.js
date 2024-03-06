const cors = require("cors");
const express = require("express");
const dotenv = require("dotenv");
const multer = require("multer");
const upload = multer();
const { createFile } = require("./utils.js");
const fs = require("fs");

dotenv.config();
const PORT = process.env.PORT;

const server = express();

server.use(cors());
// server.use(express.raw({
//     type: "image/jpeg",
//     limit: "5mb"
// }));
server.use(express.json());

server.post("/files/new/images", upload.array("photo"), async (req, res) => {
    const { body, files } = req;
    console.log(body);
    console.log(files);

    try {
        if (Array.isArray(files)){
            let promises = [];
            files.forEach((file) => {
                promises.push(createFile(`images/${file.originalname}`, file.buffer));
            });
            Promise.allSettled(promises)
            .then(resArr => {
                console.log(resArr);
                if (resArr.every(result => result.status == "fulfilled")){
                    res.json({
                        success: true,
                        filesCreated: resArr.length
                    })
                }
            });
        } else {
            res.json({
                err: new Error("Error: Did not find files to add")
            });
        }
    } catch (err) {
        console.error(err);
        res.json({
            err: new Error("Error creating image files")
        })
    }
    
});

server.post("/files/new/:singleImage", async (req, res) => {
    let { singleImage } = req.params;

    try {
        const result = await createFile(`images/${singleImage}`, req.body);
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.json({
            err: new Error("Error creating image file")
        })
    }
});

server.listen(PORT, () => console.log(`Server listening on port ${PORT}...`));