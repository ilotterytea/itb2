![Poster](http://xdlottery.7m.pl/assets/GitHub-xrpsxBotREADME.png)
### ![Python 3.8](https://img.shields.io/badge/-Python%203.8-informational) ![Twitch Bot](https://img.shields.io/badge/-Twitch%20Bot-blueviolet)
## Установка бота ![peepoChat (by saylermiu)](https://cdn.betterttv.net/emote/5e1bd08688e62a5f14dc6316/1x)
Установить бота на свой канал очень просто. Нужно изменить пару строк в файле **config.py**:
```Python
  HOST = "irc.twitch.tv" # Хост самого Twitch. Не изменять/удалять ни в коем случае!
  PORT = 6667 # Порт для входа на хост Twitch. Не изменять/удалять ни в коем случае!
  BOTNAME = "ИмяБота" # Имя бота. Измените его на своего бота.
  OAUTHTOKEN = "ВставьтеТокенСюда" # Токен входа в аккаунт бота. Можно получить на https://twitchapps.com/tmi/
  CHANNELJOIN = "НазваниеКанала" # Вход на канал. Боту нужно же куда-то печатать :)
```

## Запуск бота ![peepoArrive (by PhysiCle)](https://cdn.betterttv.net/emote/5f69d8fbb8762470a45abe51/1x)
### ![Windows Icon](https://icons.iconarchive.com/icons/tatice/operating-systems/16/Windows-icon.png) Windows:
```Python
  py -3 -m bot.py
```
### ![Mac OS? Icon](https://icons.iconarchive.com/icons/tatice/cristal-intense/16/Apple-multicolor-icon.png) MacOS / ![Linux](https://icons.iconarchive.com/icons/dakirby309/simply-styled/16/OS-Linux-icon.png) Linux:
```Python
  python3 bot.py
```

> Если у вас проблемы с запуском .py файла на Windows, то прочитайте [эту статью](https://ru.wikihow.com/%D0%B7%D0%B0%D0%BF%D1%83%D1%81%D1%82%D0%B8%D1%82%D1%8C-%D1%84%D0%B0%D0%B9%D0%BB-Python-%D1%81-%D0%BF%D0%BE%D0%BC%D0%BE%D1%89%D1%8C%D1%8E-%D0%9A%D0%BE%D0%BC%D0%B0%D0%BD%D0%B4%D0%BD%D0%BE%D0%B9-%D1%81%D1%82%D1%80%D0%BE%D0%BA%D0%B8-Windows) (лично мне она помогла)

## Команды бота ![HACKERMANS (by numrii)](https://cdn.betterttv.net/emote/5b490e73cf46791f8491f6f4/1x)
Это основные команды бота:
Команды | Применение | Как это работает?
---|---|---
+pasta | Заказать вкусную пасту ![Tasty (by ninjy)](https://cdn.betterttv.net/emote/5e830c3a269f8409604a06f9/1x)| ![+pasta](http://xdlottery.7m.pl/files/xrpsxbot-github/Github-xrpsxBot-pasta.png)
+me | Узнать кто ты сегодня.. ![Thonk (by Skyonis)](https://cdn.betterttv.net/emote/585231dd58af204561cd6036/1x) | ![+me](http://xdlottery.7m.pl/files/xrpsxbot-github/Github-xrpsxBot-me.png)
+do `(цель)` | Что-то сделать со зрителем ![FeelsNotSureMan (by HelSinki_)](https://cdn.frankerfacez.com/emoticon/200496/1) | ![+do](http://xdlottery.7m.pl/files/xrpsxbot-github/Github-xrpsxBot-do.png)
+steal `(цель)` | Украсть :money_with_wings: у зрителя ![WideHardo (by mr_allemann)](https://cdn.frankerfacez.com/emoticon/309114/1)| ![+steal](http://xdlottery.7m.pl/files/xrpsxbot-github/Github-xrpsxBot-steal.png)
+love `(цель)` | Измерить любовь к предмету или человеку ![hehL (by JesusAVGN)](https://static-cdn.jtvnw.net/emoticons/v1/664602/1.0) | ![+love](http://xdlottery.7m.pl/files/xrpsxbot-github/Github-xrpsxBot-love.png)
+rainbow `(цель)` | Сделать из текста радугу ![KappaPride (by Twitch)](https://static-cdn.jtvnw.net/emoticons/v1/55338/1.0) | ![+rainbow](http://xdlottery.7m.pl/files/xrpsxbot-github/Github-xrpsxBot-rainbow.png)
+key | Шанс сгенерированного ключа быть рабочим составляет 0.1%, но не ноль процентов ![peepoHACKER (by Reett__)](https://cdn.betterttv.net/emote/5f01110da2ac620530361e51/1x) | ![+key](http://xdlottery.7m.pl/files/xrpsxbot-github/Github-xrpsxBot-key.png)
+info | Информация о боте ![peepoShyH (by jessdesiderio)](https://cdn.betterttv.net/emote/5f77f2d8ce8bc74a942433ac/1x) | ![+info](http://xdlottery.7m.pl/files/xrpsxbot-github/Github-xrpsxBot-info.png)
+shutdown | Отключить бота (это могут сделать только пользователи в modList) ![sadCat (by Rikali)](https://cdn.betterttv.net/emote/5f32ab1dafb6965d6e7b71f7/1x) | ![+shutdown](http://xdlottery.7m.pl/files/xrpsxbot-github/Github-xrpsxBot-shutdown.png)
@xrpsxbot | ![Flushed (by PWGood)](https://cdn.betterttv.net/emote/5f1abc066f378244660150eb/1x) | ![xrpsxbot](http://xdlottery.7m.pl/files/xrpsxbot-github/Github-xrpsxBot-xrpsxBot.png)
> Команды будут добавлятся :blush: !

## Как добавить свою команду и изменить префикс? ![monkaHmm (by DigitalWelt_Original)](https://cdn.betterttv.net/emote/5f28433c713a6144748acd1e/1x)
Добавить команду очень просто! Вставьте этот текст в конце **def Commands()** и измените его в файле **bot.py**:
```Python
    if msg == PREFIX + 'ИмяВашейКоманды':
        sendMsg('Ваш Текст')
        sendMsg('Привет, ' + username) # username - никнейм отправителя команды
```
Но префикс ещё легче изменить! Поменяйте + в переменной **PREFIX** на другой любой символ, который вам нравится:
> (напоминаю, что он находится в начале текста в файле **bot.py**)
```Python
    PREFIX = "+" # Нужно поменять этот плюсик и не убирать кавычки
```

## На этом всё! ![peepoClap (by KekSee4ek)](https://cdn.betterttv.net/emote/5e20bbaa1df9195f1a4c7012/1x)
Я ответил на главные вопросы по xrpsxBot ![peepoOkay (by african_neighbor)](https://cdn.frankerfacez.com/emoticon/244565/1). Можете задавать вопросы по боту, а я отвечу на них как можно быстрее.
