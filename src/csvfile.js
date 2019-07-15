const papa = require("papaparse");
const request = require("request-promise");
const file = require("./file.js");

function importcsv(filePath) {
  return file.read(filePath).then(textFileData => {
    const result = papa.parse(textFileData, {
      header: true,
      dynamicTyping: true
    });
    return result.data;
  });
}

function importcsvrest(url) {
  return request
    .get({
      uri: url,
      json: false
    })
    .then(response => {
      const result = papa.parse(response, {
        header: true,
        dynamicTyping: true
      });
      return result.data;
    });
}

function exportcsv(fileName, data) {
  const csv = papa.unparse(data);
  return file.write(fileName, csv);
}
exports.importcsv = importcsv;
exports.importcsvrest = importcsvrest;
exports.exportcsv = exportcsv;
