const request = require("request-promise");
const cheerio = require("cheerio");
const _ = require("lodash");

function scrapeWebPage(url) {
  return request.get(url).then(response => {
    const $ = cheerio.load(response);
    // const $ = cheerio.load(response, {
    // decodeEntities: false
    //});
    const headers = $("thead tr")
      .map((i, el) => {
        return $(el)
          .find("th")
          .map((i, el) => {
            return $(el).text();
          })
          .toArray();
      })
      .toArray();

    const rows = $("tbody tr")
      .map((i, el) => {
        return [
          $(el)
            .find("td")
            .map((i, el) => {
              return $(el).text();
            })
            .toArray()
        ];
      })
      .toArray();

    return rows.map((row, ind) => {
      const record = {};
      headers.forEach((fieldName, columnIndex) => {
        if (fieldName.trim().length > 0) {
          //record[fieldName] = row[columnIndex];
          record[fieldName] = row[columnIndex].trim();

          /* dodano posebno za covers.com*/
          if (fieldName.trim() === "Date") {
            const datetemp = handleDate(row[columnIndex]);
            for (const key of Object.keys(datetemp)) {
              record[key] = datetemp[key].trim();
            }
          }
          if (fieldName.trim() === "Score") {
            const scoretemp = handlescore(row[columnIndex]);

            for (const key of Object.keys(scoretemp)) {
              record[key] = scoretemp[key].trim();
            }
          }
          if (fieldName.trim().includes("Line")) {
            const linetemp = handleline(fieldName, row[columnIndex]);
            //console.log(linetemp)
            for (const key of Object.keys(linetemp)) {
              record[key] = linetemp[key].trim();
            }
          }
          if (fieldName.trim().includes("O/U")) {
            const linetemp = handleou(row[columnIndex]);
            //console.log(linetemp)
            for (const key of Object.keys(linetemp)) {
              record[key] = linetemp[key].trim();
            }
          }
          if (fieldName.trim().includes("Vs")) {
            const linetemp = handlevs(row[columnIndex]);
            //console.log(linetemp)
            for (const key of Object.keys(linetemp)) {
              record[key] = linetemp[key].trim();
            }
          }

          record["rbrd"] = ind + 1;

          /* kraj dodano posebno za covers.com*/
        }
      });
      return record;
    });
  });
}

function handleDate(data) {
  const obj = {};

  const tempdata = data.trim().split("/");
  obj.month = tempdata[0];
  obj.day = tempdata[1];
  obj.year = tempdata[2];
  obj.fullyear = "20" + tempdata[2];
  obj.usadatefull = tempdata[0] + "/" + tempdata[1] + "/" + "20" + tempdata[2];
  obj.eudatefull = tempdata[1] + "." + tempdata[0] + "." + "20" + tempdata[2];
  obj.isodatefull = "20" + tempdata[2] + "-" + tempdata[0] + "-" + tempdata[1];

  return obj;
}

function handlescore(data) {
  const obj = {};

  const tempdata = data.trim().split(" ");
  const tempdata2 = tempdata[1].trim().split("-");
  obj.resulttype = tempdata[0];
  obj.teampoints = tempdata2[0];
  obj.opponentteampoints = tempdata2[1];

  return obj;
}

function handleline(key, data) {
  const obj = {};
  //    'LAD Line': 'L -168',
  const tempdata = data.trim().split(" ");
  const tempkey = key.trim().split(" ");
  obj.resulttypeteam = tempdata[0];
  obj.lineteam = tempdata[1];
  obj.nameteam = tempkey[0];

  return obj;
}

function handleou(data) {
  const obj = {};
  //    'O/U': 'O 8 -114'
  const tempdata = data.trim().split(" ");
  obj.resultou = tempdata[0];
  obj.numberou = tempdata[1];
  if (tempdata[0].trim() === "O") {
    obj.lineo = tempdata[2];
  } else if (tempdata[0].trim() === "U") {
    obj.lineu = tempdata[2];
  } else {
    obj.linep = tempdata[2];
  }

  return obj;
}

function handlevs(data) {
  const obj = {};
  //    Vs: '@ COL'

  if (data.trim().includes("@")) {
    obj.teamplace = "@";
    obj.oppositeteamplace = "vs";
    data.replace("@", "");
  } else {
    obj.teamplace = "vs";
    obj.oppositeteamplace = "@";
  }
  obj.oppositeteam = data.trim();

  return obj;
}

function sort_data(objs) {
  var sortedObjs = _.sortBy(objs, "rbrd");
  //var sortedObjs = _.orderBy( objs, ['first_nom'],['dsc'] );
  return sortedObjs;
}

function handlestatsinit(data) {
  const obj = {
    teamhomevictory: 0,
    teamawayvictory: 0,
    teamvictory: 0,
    teamlost: 0,
    teamawaylost: 0,
    teamhomelost: 0
  };

  data.map((row, i) => {
    return Object.assign(row, obj);
  });
}

function handlestats(data) {
  const obj = {};

  if (data["teamplace"] === "vs") {
  }
  // team home victory
  if (
    data["teamplace"] === "vs" &&
    data["teamponits"] > data["opponentteampoints"]
  ) {
    obj.teamhomevictory = obj.teamhomevictory + 1;
  }
  // team away victory
  if (
    data["teamplace"] !== "vs" &&
    data["teamponits"] > data["opponentteampoints"]
  ) {
    obj.teamhomevictory = obj.teamhomevictory + 1;
  }
  // team  victory
  if (data["teamponits"] > data["opponentteampoints"]) {
    obj.teamhomevictory = obj.teamhomevictory + 1;
  }
  // team  victory
  if (data["teamponits"] > data["opponentteampoints"]) {
    obj.teamhomevictory = obj.teamhomevictory + 1;
  }
  // team home lost
  if (data["teamplace"] === "vs" &&
    data["teamponits"] < data["opponentteampoints"]) {
    obj.teamhomevictory = obj.teamhomevictory + 1;
  }
  // team away lost
  if (data["teamplace"] !== "vs" &&
    data["teamponits"] < data["opponentteampoints"]) {
    obj.teamhomevictory = obj.teamhomevictory + 1;
  }

  return obj;
}

function scrape_html(url) {
  //let url = "https://earthquake.usgs.gov/earthquakes/browse/largest-world.php";
  //  url = 'https://www.covers.com/Sports/mlb/teams/pastresults/2019/2967'
  return scrapeWebPage(url)
    .then(data => {
      //console.log(data);

      const datasort = sort_data(data);
      handlestatsinit(datasort);
      handlestats();
      console.log(datasort);
      return data;
    })
    .catch(err => {
      console.error(err);
    });
}
exports.scrape_html = scrape_html;
