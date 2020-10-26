![Poster](http://xdlottery.7m.pl/assets/GitHub-xrpsxBotREADME.png)
## Установка бота ![peepoChat (by saylermiu)](https://cdn.betterttv.net/emote/5e1bd08688e62a5f14dc6316/1x)
Установить бота на свой канал очень просто. Нужно изменить пару строк в начале файла **bot.py**:
```Python
  HOST = "irc.twitch.tv"  # Хост для твича. Не изменять ни в каком случае!
  NICK = ""  # Вставьте имя вашего бота, чтобы всё работало.
  PORT = 6667  # Порт для входа на хост. Не изменять ни в каком случае!
  PASS = "oauth:"  # Токен для входа! Узнать свой токен можно на https://twi.twitch.tv/
  
  CHANNEL_NAME = '' # Вставьте Twitch канал, где боту надо печатать.
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
Команды | Применение | Пример использования
---|---|---
+pasta | Заказать вкусную пасту ![Tasty (by ninjy)](https://cdn.betterttv.net/emote/5e830c3a269f8409604a06f9/1x)| +pasta
+me | Узнать кто ты сегодня.. ![Thonk (by Skyonis)](https://cdn.betterttv.net/emote/585231dd58af204561cd6036/1x) | +me
+do | Что-то сделать со зрителем ![FeelsNotSureMan (by HelSinki_)](https://cdn.frankerfacez.com/emoticon/200496/1) | +do kekwottery
+steal | Украсть :money_with_wings: у зрителя ![WideHardo (by mr_allemann)](https://cdn.frankerfacez.com/emoticon/309114/1)| +steal kekwottery
+love | Измерить любовь к предмету или человеку ![hehL (by JesusAVGN)](https://static-cdn.jtvnw.net/emoticons/v1/664602/1.0) | +love питса
> Команды будут добавлятся :blush: !

## Как добавить свою команду и изменить префикс? ![monkaHmm (by DigitalWelt_Original)](https://cdn.betterttv.net/emote/5f28433c713a6144748acd1e/1x)
Добавить команду очень просто! Вставьте этот текст в конце **def Commands()** в файле **bot.py**:
```Python
    if msg == PREFIX + 'ИмяВашейКоманды':
        sendMsg('Ваш Текст')
        sendMsg('Привет, ' + username) # username - никнейм отправителя команды
```
Но префикс ещё легче изменить! Поменяйте + в переменной PREFIX на другой любой символ, который вам нравится:
> (напоминаю, что он находится в начале текста в файле **bot.py**)
```Python
    PREFIX = "+" # Нужно поменять этот плюсик и не убирать кавычки
```

## На этом всё! ![peepoClap (by KekSee4ek)](https://cdn.betterttv.net/emote/5e20bbaa1df9195f1a4c7012/1x)
Я ответил на главные вопросы по xrpsxBot ![peepoOkay (by african_neighbor)](https://cdn.frankerfacez.com/emoticon/244565/1). Можете задавать вопросы по боту, а я отвечу на них как можно быстрее.
