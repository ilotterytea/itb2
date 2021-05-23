const bot = require('./bot.js');

function scripts(scriptname){
    var response = ''
    

    switch (scriptname) {
        case artFunction:
            let artFile = funFile['art'][Math.floor(Math.random() * funFile['art'].length)];
            client.say(target, artFile);
            console.log(target + ' / ' + context['display-name'] + lang['terminal.executed'] + `${commandName}`);
            break;
    }
}