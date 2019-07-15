const file = require("./file.js");

function regex_txt() {
  function parseCustomData(textFileData) {
    const regex = /(.*)\|(.*)\|(.*)\|(.*)\|(.*)\|(.*)\|(.*)\|(.*)\|(.*)\|(.*)\|(.*)\|(.*)\|(.*)$/gm;

    var rows = [];
    var m;

    while ((m = regex.exec(textFileData)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === regex.lastIndex) {
        regex.lastIndex++;
      }

      m.shift();

      rows.push(m);
    }

    var header = rows.shift();
    var data = rows.map(row => {
      var hash = {};
      for (var i = 0; i < header.length; ++i) {
        hash[header[i]] = row[i];
      }
      return hash;
    });

    return data;
  }

  file
    .read("./public/data/earth.txt")
    .then(textFileData => parseCustomData(textFileData))
    .then(data => {
      //console.log(data);
    })
    .catch(err => {
      console.error("An error occurred.");
      console.error(err.stack);
    });
}
exports.regex_txt = regex_txt;
