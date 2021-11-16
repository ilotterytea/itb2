![a](https://repos.ilteapls.ru/assets/images/ilotterybot2-Banner.png)

[![wakatime](https://wakatime.com/badge/user/09f67b1c-0691-482a-a1d4-e4751e6962de/project/dbf68ebf-fa75-4a76-b014-a33b9da2ae5c.svg?style=social)](https://wakatime.com/badge/user/09f67b1c-0691-482a-a1d4-e4751e6962de/project/dbf68ebf-fa75-4a76-b014-a33b9da2ae5c)

# <img src="https://cdn.betterttv.net/emote/60bfa528f8b3f62601c3abd3/3x" height=24> ilotterybot² - ilotterytea's twitch/telegram tracking bot.

ilotterybot² is an improvement on the last bot. The bot is simpler and faster than its predecessor. Features of the bot:
- 👁 Bot collects messages from Twitch chats and also makes user cards.
- 💾 All data collected by the bot is saved only on your device.
- 📨 ilotterybot² uses Telegram as a way to get data via commands.
- [And there will be more...](https://github.com/users/ilotterytea/projects/2#card-72657765)

## " <img src="https://static-cdn.jtvnw.net/emoticons/v2/34/static/light/3.0" height=24> I WANT TO TEST THE BOT !!!"
ilotterybot² works on [Telegram (@ilottery2bot)](https://t.me/ilottery2bot) !!!! If you want to create your own bot, take a look at Getting Started.

## Default Commands:
Command | Description | Platform | Example
---| --- |--- | ---
/hello | 👋 | Telegram | ![](https://repos.ilteapls.ru/assets/images/screenshots/ilotterybot2-scr1.png)
/ping | Checking if it's alive, and a bunch of other data, like latency, how many channels the bot is connected to, the uptime of the bot and logged chat lines in session. | Telegram | ![](https://repos.ilteapls.ru/assets/images/screenshots/ilotterybot2-scr2.png)
/req | Send a request to the owner of the bot. Send the command "/req" to get more information about the tags. | Telegram | ![](https://repos.ilteapls.ru/assets/images/screenshots/ilotterybot2-scr5.png)
/logs `TwitchUser` | Get all registered chat logs of specified twitch user. | Telegram | ![](https://repos.ilteapls.ru/assets/images/screenshots/ilotterybot2-scr3.png)
/user `TwitchUser` | Get all known data of specified twitch user. | Telegram | ![](https://repos.ilteapls.ru/assets/images/screenshots/ilotterybot2-scr4.png)

# <img src="https://cdn.betterttv.net/emote/60d25e1e8ed8b373e4217fe2/3x" height=24> Getting Started
## Install step-by-step
1. Download the bot by clicking on _Code -> Download ZIP_.
2. Unzip the bot into any folder you like.
3. If you are on Windows, run the bot through the _start.bat_.
4. When all the necessary files have been created, you must close the terminal.
5. Fill in the data in _data/config.json_:
```JavaScript
{
  "twitch": {
    "join": [] // Enter the Twitch channels you want to track here. /req -add also adds channels (only after reloading the bot)
  },
  "telegram": {
    "botToken": null, // If you want to use a Telegram bot, instead of NULL - insert the token obtained by BotFather.
    "superAdmin": "" // Insert your Telegram nickname to get super permissions.
  }
}
```
> Do not use the example above for config.json, because it will break it. Delete the file and re-run bot to create a new config.json

6. Start the bot via _start.bat_.
7. ???
8. PROFIT !

## ilotterybot² uses:
- [Node.JS (JavaScript runtime)](https://nodejs.org/)
- [Tmi.js (Library)](https://tmijs.com/)
- [fs (Library)](https://www.npmjs.com/package/fs)
- [XMLHttpRequest (Library)](https://www.npmjs.com/package/xmlhttprequest)
- [node-telegram-bot-api (Library)](https://www.npmjs.com/package/node-telegram-bot-api)
