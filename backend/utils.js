const fs = require("fs");

function createFile(filePath, data, options) {
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, data, options, (err) => {
            if (err) reject(err);
            else resolve({
                success: true,
                filePath
            });
        });
    });
}

module.exports = {
    createFile
}