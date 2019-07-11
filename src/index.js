var express = require("express");
var app = express();
const fs = require("fs");
const path = require("path");
const file = require("./file.js");
const scrape_html = require("./scrape_html.js");
const papa = require("papaparse");

app.set("port", process.env.PORT || 5000);
app.use(express.static(__dirname + "/public"));

//scraping html
app.get("/scrape_html", function(request, response) {
  const url = "https://www.covers.com/Sports/mlb/teams/pastresults/2019/2967";
  const filenamearr = url.split("/");
  console.log(filenamearr.length);
  const filename =
    "./public/data/team_" +
    filenamearr[8] +
    "_season_" +
    filenamearr[7] +
    ".csv";
  const filename2 =
    "team_" + filenamearr[8] + "_season_" + filenamearr[7] + ".csv";
  console.log(filename2);
  //scrape_html.scrape_html();
  scrape_html.scrape_html(url).then(data => {
    //console.log(data);
    const result = papa.unparse(data);
    //console.log(result);
    // file.write(filename2, result);
    spremi(filename2, result);
  });
});

function spremi(filename, result) {
  console.log("Results Received hdshshshs: " + filename);
  let baseDir = path.join(__dirname, "/./public/data/");
  fs.open(`${baseDir}+${filename}`, "wx", (err, desc) => {
    console.log("Results Received ddd: " + desc);
    if (!err && desc) {
      fs.writeFile(desc, result, err => {
        // Rest of your code
        if (err) throw err;
        console.log("Results Received");
      });
    }
  });
}

app.listen(app.get("port"), function() {
  console.log("Node app is running at localhost:" + app.get("port"));
});
