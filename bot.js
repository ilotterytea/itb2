// Libraries and files.
const tmi = require("tmi.js");
const fs = require("fs");
const telegram = require("node-telegram-bot-api");
let XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const dateLaunch = Date.now();
checkFiles();
const cfg = require("./data/config.json");

// Creating a Twitch and Telegram client
const client = new tmi.client({/*options: {debug: true},*/ channels: cfg.twitch.join});

const tgclient = new telegram(cfg.telegram.botToken, {polling: true});

// /start command (Telegram Bot)
tgclient.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const stickers = [
    "CAACAgIAAxkBAANYYYxAqmsfCWlNPYZS65Il4Mm66QQAAlMDAAK1cdoG7R_i-ZUnY-QiBA", // hiding dino
    "CAACAgIAAxkBAANZYYxAtLRicb2FSlOFgwtFjWIOuVUAAkoDAAK1cdoGwn4G-ptIHsQiBA", // chatting dino
    "CAACAgIAAxkBAANaYYxAwBt51-4yBIzikDRnC37aNFgAAlADAAK1cdoGw6r2jdDFosoiBA", // screaming dino
  ]

  tgclient.sendSticker(chatId, stickers[Math.floor(Math.random() * stickers.length)]);
});

// /ping command (Telegram Bot)
tgclient.onText(/\/ping/, (msg) => {
  const chatId = msg.chat.id;
  const username = msg.chat.username;
  let dateNow = Date.now()
  const Timestamps = [Math.round((dateNow / 1000)  - (dateLaunch / 1000)), Math.round((dateNow / 1000) - 1606321080)];

  tgclient.sendMessage(chatId, "@" + username + ", Pong! Session uptime: " + Math.round(Timestamps[0] / 86400) + "d " + Math.round(Timestamps[0] / 3600) + "h " + Math.round(Timestamps[0] / 60) + "m, _(since " + Math.round(Timestamps[1] / 86400) + "d)_. Bot collected *a total of " + (TOTAL_CHAT_LINES + SESSION_CHAT_LINES).toString() + " chat lines* and *" + SESSION_CHAT_LINES + " chat lines* in the current session. *" + cfg.twitch.join.length + " channels* are being tracked by the bot.", {parse_mode: "Markdown"});
});

// /req command (Telegram Bot)
tgclient.onText(/\/req/, (msg) => {
  const chatId = msg.chat.id;
  const username = msg.chat.username;
  const resp = msg.text.split(" ");

  if (resp.length < 2) { // if any tags are not provided.
    tgclient.sendMessage(chatId, "@" + username + ", Add a tag to your request that describes your request: \n`-a YourChannel` if you want to add your channel to the list of tracked channels. _Example: /req -a ilotterytea_\n`-t Text` if you want to send a message to the bot holder. _Example: /req -t Bla bla bla_ \n`-s` if you want to see the status of your requests. _Example: /req -s_", {parse_mode: "Markdown"});
  } else { // if one tag is provided
    const reqList = CSVToArray(fs.readFileSync("./users/requests.csv").toString())

    if (resp[1] == "-a") {
      if (cfg.twitch.join.includes("#" + resp[2])) { // checking if already exists.
        tgclient.sendMessage(chatId, "@" + username + ", *" + resp[2] + "* already in tracking channels.", {parse_mode: "Markdown"});
      } else { // if not exists, then...​​​​​​​​​​​
        fs.appendFileSync("./users/requests.csv", chatId + ",telegram," + username.toLowerCase() + ",add," + resp[2].toLowerCase() + ",notReviewed,empty\n");
        tgclient.sendMessage(chatId, "@" + username + ", a request to add *" + resp[2] + "* to the tracked channels has been sent. You can view the status of your requests by sending: _/req -s_", {parse_mode: "Markdown"});
      }
    }
    if (resp[1] == "-s") {
      let data = []
      let msg2 = ""

      for (let index = 0; index < reqList.length; index++) {
        if (reqList[index][0] == chatId.toString()) {
          data.push(reqList[index]);
        }
      }

      for (let index = 0; index < data.length; index++) {
        msg2 += "\n\n*Request " + index.toString() + "* => Alias ID: " + data[index][0] + "; Alias Platform: " + data[index][1] + "; Requested by @" + data[index][2] + "; Request Type: " + data[index][3] + "; Request Text: _" + data[index][4] + "_; Request Status: " + data[index][5] + "; Message by owner: _" + data[index][6] + "_;" 
      }
      if (msg2 != "" && data.length != 0) {
        tgclient.sendMessage(chatId, "@" + username + ", your requests:" + msg2, {parse_mode: "Markdown"});
      }
      if (data.length == 0) {
        tgclient.sendMessage(chatId, "@" + username + ", you do not seem to have sent any requests or are lost.", {parse_mode: "Markdown"});
      }
    }

    if (resp[1] == "-t") {
      const respTextReq = msg.text.split("/req -t ");

      fs.appendFileSync("./users/requests.csv", chatId + ",telegram," + username.toLowerCase() + ",req," + respTextReq[1] + ",notReviewed,empty\n");
      tgclient.sendMessage(chatId, "@" + username + ", a request has been sent. You can view the status of your requests by sending: _/req -s_", {parse_mode: "Markdown"});
    }
  }
});

// /logs command (Telegram Bot)
tgclient.onText(/\/logs/, (msg) => {
  const chatId = msg.chat.id;
  const username = msg.chat.username;
  const resp = msg.text.split(" ");

  if (resp.length < 2) { // if any tags are not provided.
    tgclient.sendMessage(chatId, "@" + username + ", you need to specify a twitch user. _Example: /logs ilotterytea_", {parse_mode: "Markdown"});
  } else { // if one tag is provided
    if (fs.existsSync("./users/logs/" + resp[1].toLowerCase() + ".txt") == false) { // checking if not exists.
      tgclient.sendMessage(chatId, "@" + username + ", *" + resp[1] + "* has never been seen by the bot or does not exist.", {parse_mode: "Markdown"});
    } else { // if exists, then...
      const stats = fs.statSync("./users/logs/" + resp[1].toLowerCase() + ".txt")
      tgclient.sendDocument(chatId, "./users/logs/" + resp[1].toLowerCase() + ".txt", {caption: "@" + username + ", *" + resp[1] + "*'s chat logs.\n\nThe file was created on _" + stats.birthtime + "_; the last modified file was on _" + stats.mtime + "_", parse_mode: "Markdown"});
    }
  }
});

// /user command (Telegram Bot)
tgclient.onText(/\/user/, (msg) => {
  const chatId = msg.chat.id;
  const username = msg.chat.username;
  const resp = msg.text.split(" ");

  if (resp.length < 2) { // if any tags are not provided.
    tgclient.sendMessage(chatId, "@" + username + ", you need to specify a twitch user. _Example: /user ilotterytea_", {parse_mode: "Markdown"});
  } else { // if one tag is provided
    if (fs.existsSync("./users/data/" + resp[1].toLowerCase() + ".json") == false) { // checking if not exists.
      tgclient.sendMessage(chatId, "@" + username + ", *" + resp[1] + "* has never been seen by the bot or does not exist.", {parse_mode: "Markdown"});
    } else { // if exists, then...
      const stats = fs.statSync("./users/data/" + resp[1].toLowerCase() + ".json")
      tgclient.sendMessage(chatId, "@" + username + ", * " + resp[1] + "*'s raw JSON data:\n ```JSON " + fs.readFileSync("./users/data/" + resp[1].toLowerCase() + ".json") + "```\n\nThe file was created on _" + stats.birthtime + "_; the last modified file was on _" + stats.mtime + "_", {parse_mode: "Markdown"});
    }
  }
});

// Connect to Twitch:
client.connect();

// Session and total chat lines.
let SESSION_CHAT_LINES = 0;
const TOTAL_CHAT_LINES = parseInt(fs.readFileSync("./data/stats.txt", 'utf-8'));
let CHAT_LINES = []

// Called every time a message comes in
client.on('message', (target, context, msg, self) => {
  const date = new Date(); 
  fs.appendFileSync("./users/logs/" + context["display-name"].toLowerCase() + ".txt", "[" + date.getUTCMonth() + "-" + date.getDate() + "-" + date.getUTCFullYear() + " " + date.getUTCHours() + ":" + date.getUTCMinutes() + ":" + date.getUTCSeconds() + "] " + context["display-name"] + "-" + context["user-id"] + " -> <" + target + "-" + context["room-id"] + ">: " + msg + "\n")

  let dataUser = {
    "user": {
      "displayName": context["display-name"],
      "id": null,
      "alias_id": context["user-id"],
      "creationTimeStamp": null,
      "avatar": null,
      "color": context["color"],
      "turbo": context["turbo"],
      "registeredByBotTimeStamp": fs.statSync("./users/logs/" + context["display-name"].toLowerCase() + ".txt")["birthtimeMs"]
    },
    "lastSeen": {
      "msg": msg,
      "roomId": "<" + target + "-" + context["room-id"] + ">",
      "timeStamp": Date.now()
    }
  };

  fs.writeFileSync("./users/data/" + context["display-name"].toLowerCase() + ".json", JSON.stringify(dataUser, null, 2));

  // Counts chat lines and write to the file.
  SESSION_CHAT_LINES += 1;
  fs.writeFileSync("./data/stats.txt", (TOTAL_CHAT_LINES + SESSION_CHAT_LINES).toString());

});

// HTTP Request.
function HTTPRequest(url, callback) {
  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = (e) => {
    if (xhr.readyState !== 4) {
      return;
    }

    if (xhr.status === 200) {
      return xhr.responseText;
    } else {
      console.warn('request_error');
    }
  };

  xhr.open('GET', url);
  xhr.send();
  return xhr.onreadystatechange();
}

// Check files on start.
function checkFiles() {
  const defaultData = [
    {
      "twitch": {
        "join": []
      },
      "telegram": {
        "botToken": null,
        "superAdmin": ""
      }
    }
  ]

  if (fs.existsSync("./users") == false) {
    fs.mkdirSync("./users/");
  }
  if (fs.existsSync("./users/data") == false) {
    fs.mkdirSync("./users/data");
  }
  if (fs.existsSync("./users/logs") == false) {
    fs.mkdirSync("./users/logs");
  }
  if (fs.existsSync("./users/requests.csv") == false) {
    fs.writeFileSync("./users/requests.csv", "aliasId,aliasPlatform,requestedBy,requestType,requestText,requestStatus,rejectedReason\n");
  }

  if (fs.existsSync("./data") == false) {
    fs.mkdirSync("./data");
  }
  if (fs.existsSync("./data/stats.txt") == false) {
    fs.writeFileSync("./data/stats.txt", "0");
  }
  
  if (fs.existsSync("./data/config.json") == false) {
    fs.writeFileSync("./data/config.json", JSON.stringify(defaultData[0], null, 2));
    console.error("You need to configure the bot in the \"data/config.json\" file. Read more here -> https://github.com/ilotterytea/ilotterybot2/blob/main/README.md");
    process.exit(1)
  }
}

// CSV to array
function CSVToArray( strData, strDelimiter ){
  // Check to see if the delimiter is defined. If not,
  // then default to comma.
  strDelimiter = (strDelimiter || ",");

  // Create a regular expression to parse the CSV values.
  var objPattern = new RegExp(
      (
          // Delimiters.
          "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

          // Quoted fields.
          "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

          // Standard fields.
          "([^\"\\" + strDelimiter + "\\r\\n]*))"
      ),
      "gi"
      );


  // Create an array to hold our data. Give the array
  // a default empty first row.
  var arrData = [[]];

  // Create an array to hold our individual pattern
  // matching groups.
  var arrMatches = null;


  // Keep looping over the regular expression matches
  // until we can no longer find a match.
  while (arrMatches = objPattern.exec( strData )){

      // Get the delimiter that was found.
      var strMatchedDelimiter = arrMatches[ 1 ];

      // Check to see if the given delimiter has a length
      // (is not the start of string) and if it matches
      // field delimiter. If id does not, then we know
      // that this delimiter is a row delimiter.
      if (
          strMatchedDelimiter.length &&
          strMatchedDelimiter !== strDelimiter
          ){

          // Since we have reached a new row of data,
          // add an empty row to our data array.
          arrData.push( [] );

      }

      var strMatchedValue;

      // Now that we have our delimiter out of the way,
      // let's check to see which kind of value we
      // captured (quoted or unquoted).
      if (arrMatches[ 2 ]){

          // We found a quoted value. When we capture
          // this value, unescape any double quotes.
          strMatchedValue = arrMatches[ 2 ].replace(
              new RegExp( "\"\"", "g" ),
              "\""
              );

      } else {

          // We found a non-quoted value.
          strMatchedValue = arrMatches[ 3 ];

      }


      // Now that we have our value string, let's add
      // it to the data array.
      arrData[ arrData.length - 1 ].push( strMatchedValue );
  }

  // Return the parsed data.
  return( arrData );
}