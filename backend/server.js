const cors = require("cors");
const express = require("express");
const dotenv = require("dotenv");
const fs = require("fs");

dotenv.config();
const PORT = process.env.PORT;

const server = express();

server.use(cors());
server.use(express.raw({
    type: "image/jpeg",
    limit: "5mb"
}));
server.use(express.json());

server.post("/files/new/:fileName", async (req, res) => {
    let fileName = req.params.fileName;
    fs.writeFile(`images/${fileName}`, req.body, (err) => {
        if (err) {
            console.error(err);
            res.status(500).json({
                err: new Error("Error saving file to server")
            });
        } else {
            console.log("File saved");
            res.status(200).json({
                fileName
            });
        }
    });
    
});

server.listen(PORT, () => console.log(`Server listening on port ${PORT}...`));