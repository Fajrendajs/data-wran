const file = require("./file.js");
const request = require("request-promise");

function readjson(fileName) {
  return file.read(fileName).then(textFileData => {
    return JSON.parse(textFileData);
  });
}

function restjson(url) {
  return request.get(url).then(response => {
    return JSON.parse(response);
  });
}

function exportjson(fileName, data) {
  const json = JSON.stringify(data, null, 4);
  return file.write(fileName, json);
}

exports.readjson = readjson;
exports.restjson = restjson;
exports.exportjson = exportjson;
