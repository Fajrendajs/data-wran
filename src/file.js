const fs = require("fs");

function read(fileName) {
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, "utf8", function(err, textFileData) {
      if (err) {
        reject(err);
        return;
      }

      resolve(textFileData);
    });
  });
}

function write(fileName, textFileData) {
  return new Promise((resolve, reject) => {
    fs.writeFile(fileName, textFileData, err => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });
}
exports.read = read;
exports.write = write;
/*
module.exports = {
  readcsv: readcsv
};*/
