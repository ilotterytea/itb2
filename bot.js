const tmi = require("tmi.js");
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const settingsFile = require("./data/settings.json");
const cmdtmrFile = require("./data/commandstimers.json");
const usersFile = require("./data/users.json");
const funFile = require("./data/fun.json");
const lang = require("./lang/" + settingsFile['lang'][0] + "_" + settingsFile['lang'][1] + ".json");
const prefix = settingsFile['twitch']['commandprefix'];

const scripts = require("./bot.js");

// Create a client with our options
const client = new tmi.client({
  options: {debug: false},
    identity: {
      username: settingsFile['twitch']['botname'],
      password: settingsFile['twitch']['oauthtoken']
    },
    channels: settingsFile['twitch']['jointochannels']
});

var date = new Date()

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// заметка date.getMinutes()

// Connect to Twitch:
client.connect();

// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {
  // Remove whitespace from chat message
  const commandName = msg.trim();

  if (!(context['display-name'] in usersFile['roles']['bannedUsers'])) {
    msgSplitByPrefix = msg.split(prefix, 2);
    commandTagsSplit = msgSplitByPrefix[1].split(' ')
    console.log(commandTagsSplit)

    if (commandTagsSplit[1] in cmdtmrFile) {
      eval(cmdtmrFile['commands'][commandTagsSplit[1]]['script'])();
    }
  }

  if (self) { return; } // Ignore messages from the bot

  // If the command is known, let's execute it

  switch (commandName) {
    case prefix + 'art':
      let artFile = funFile['art'][Math.floor(Math.random() * funFile['art'].length)];
      client.say(target, artFile);
      console.log(target + ' / ' + context['display-name'] + lang['terminal.executed'] + `${commandName}`);
      break;
    case prefix + 'pasta':
      let pastaFile = funFile['pasta'][Math.floor(Math.random() * funFile['pasta'].length)];
      client.say(target, pastaFile);
      console.log(target + ' / ' + context['display-name'] + lang['terminal.executed'] + `${commandName}`);
      break;
    case prefix + 'send':
      client.say(target, lang['command.other.notcreated']);
      console.log(target + ' / ' + context['display-name'] + lang['terminal.executed'] + `${commandName}`);
      break;
    case prefix + 'dailyfact':
      client.say(target, lang['command.other.notcreated']);
      console.log(target + ' / ' + context['display-name'] + lang['terminal.executed'] + `${commandName}`);
      break;
    case prefix + 'steal':
      client.say(target, lang['command.other.notcreated']);
      console.log(target + ' / ' + context['display-name'] + lang['terminal.executed'] + `${commandName}`);
      break;
    case prefix + 'info':
      client.say(target, lang['command.other.notcreated']);
      console.log(target + ' / ' + context['display-name'] + lang['terminal.executed'] + `${commandName}`);
      setTimeout(delay=5000);
      break;
    case prefix + 'mojang':
      client.say(target, lang['command.other.notcreated']);
      console.log(target + ' / ' + context['display-name'] + lang['terminal.executed'] + `${commandName}`);
      break;
    case prefix + 'steam':
      client.say(target, lang['command.other.notcreated']);
      console.log(target + ' / ' + context['display-name'] + lang['terminal.executed'] + `${commandName}`);
      break;
    case prefix + 'throw':
      client.say(target, lang['command.other.notcreated']);
      console.log(target + ' / ' + context['display-name'] + lang['terminal.executed'] + `${commandName}`);
      break;
    case prefix + 'love':
      client.say(target, lang['command.other.notcreated']);
      console.log(target + ' / ' + context['display-name'] + lang['terminal.executed'] + `${commandName}`);
      break;
    case prefix + 'rr':
      client.say(target, lang['command.other.notcreated']);
      console.log(target + ' / ' + context['display-name'] + lang['terminal.executed'] + `${commandName}`);
      break;
    case prefix + 'ng':
      client.say(target, lang['command.other.notcreated']);
      console.log(target + ' / ' + context['display-name'] + lang['terminal.executed'] + `${commandName}`);
      break;
    case prefix + 'gd':
      client.say(target, lang['command.other.notcreated']);
      console.log(target + ' / ' + context['display-name'] + lang['terminal.executed'] + `${commandName}`);
      break;
    case prefix + 'notify':
      client.say(target, lang['command.other.notcreated']);
      console.log(target + ' / ' + context['display-name'] + lang['terminal.executed'] + `${commandName}`);
      break;
    case prefix + 'points':
      client.say(target, lang['command.other.notcreated']);
      console.log(target + ' / ' + context['display-name'] + lang['terminal.executed'] + `${commandName}`);
      break;
    case prefix + 'explode':
      client.say(target, lang['command.other.notcreated']);
      console.log(target + ' / ' + context['display-name'] + lang['terminal.executed'] + `${commandName}`);
      break;
    case prefix + 'picrandom':
      client.say(target, lang['command.other.notcreated']);
      console.log(target + ' / ' + context['display-name'] + lang['terminal.executed'] + `${commandName}`);
      break;
    case prefix + 'top':
      client.say(target, lang['command.other.notcreated']);
      console.log(target + ' / ' + context['display-name'] + lang['terminal.executed'] + `${commandName}`);
      break;
    case prefix + 'emoteoftheday':
      var emoteList = [];

      var getEmoteBTTV = httpGet('https://decapi.me/bttv/emotes/' + target.split('#')[1]);
      var getEmoteFFZ = httpGet('https://decapi.me/ffz/emotes/' + target.split('#')[1]);

      emoteList.push(getEmoteBTTV.split(' '), getEmoteFFZ.split(' '));
      emoteListMerged = [].concat.apply([], emoteList);

      var randomItem = emoteListMerged[Math.floor(Math.random() * emoteListMerged.length)];

      console.log(randomItem);

      client.say(target, randomItem);
      console.log(target + ' / ' + context['display-name'] + lang['terminal.executed'] + `${commandName}`);
      break;
  }
}

// Function called when command need a tag.
function hereTag(tag, message) {
  var someTag = '-' + tag + ':';
  if (some) {
    let someString = message.split(someTag);
    console.log(someString);
  }
}

// Sending and receiving HTTP requests
function httpGet(theUrl) {
    var xhr = new XMLHttpRequest();
    xhr.open( "GET", theUrl, false ); // false for synchronous request
    xhr.send( null );
    return xhr.responseText;
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(lang['terminal.connectedirc'] + `${addr}:${port}`);
  client.say('#' + settingsFile['twitch']['botname'], lang['bot.started']);
}

function quickStart() {

}

function saveLog(log) {
  console.log()
  write
}