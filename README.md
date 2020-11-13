![Poster](http://xdlottery.7m.pl/files/xrpsxbot-github/readme/GitHub-xrpsxBot-PreviewREADME-dark.png)
### ![License MIT](https://img.shields.io/badge/License-MIT-C5D2EC) ![Status Beta](https://img.shields.io/badge/Status-βeta-E9DACB) ![Python 3.8](https://img.shields.io/badge/-Python%203.8-informational) ![Twitch Bot](https://img.shields.io/badge/-Twitch%20Bot-blueviolet)
## Установка бота ![peepoChat (by saylermiu)](https://cdn.betterttv.net/emote/5e1bd08688e62a5f14dc6316/1x)
Настроить бота под себя очень просто. Нужно изменить пару строк в файле **config.py**:
```Python
  # Хост и порт для входа на сервера Twitch. Не изменять ни в коем случае, иначе работать не будет!
  HOST = "irc.twitch.tv"
  PORT = 6667

  # Настройки бота: Никнейм бота, токен бота и папка бота.
  BOTNAME = "имя_вашего_бота" # Писать нижними буквами!
  OAUTHTOKEN = "Вставьте свой токен сюда" # Токен аутентификации можно взять на https://twitchapps.com/tmi/
  BOTFOLDER = "C:\xrpsxBot" # Впишите путь в рабочую папку, где находится сам бот. Нужно для работы: +pasta и +art 

  # На какой канал заходить?
  CHANNELJOIN = "xrpsxbot" # Можно ввести только 1 канал, в будущем будет версия с мультиканалами :)

  modList = ['ilotterytea', 'YourNickname', 'Somebody'] # Эти пользователи имеют доступ к командам, которые могут спамить: +pasta, +art
  blackList = ['BadUser'] # Эти пользователи не смогут никак взаимодействовать с ботом ;(.
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

## Стандартные команды бота ![HACKERMANS (by numrii)](https://cdn.betterttv.net/emote/5b490e73cf46791f8491f6f4/1x)
Команды | Применение | Как это работает?
---|---|---
+pasta | Заказать вкусную пасту ![Tasty (by ninjy)](https://cdn.betterttv.net/emote/5e830c3a269f8409604a06f9/1x)! Держу в курсе, тут ровно 98 паст ![Sunglasses by dinnerparty](https://cdn.betterttv.net/emote/5e30f40cb1d0ac51e8ecfc72/1x) | ![+pasta](http://xdlottery.7m.pl/files/xrpsxbot-github/Github-xrpsxBot-pasta.png)
+art | Посмотреть на Искусства Интернета ![peepoWow (by HannahHyrule)](https://cdn.betterttv.net/emote/5ccb52bb83048c5cc0ef1a43/1x)| ![+pasta](http://xdlottery.7m.pl/files/xrpsxbot-github/Github-xrpsxBot-art.png)
+me | Узнать кто ты сегодня.. ![Thonk (by Skyonis)](https://cdn.betterttv.net/emote/585231dd58af204561cd6036/1x) | ![+me](http://xdlottery.7m.pl/files/xrpsxbot-github/Github-xrpsxBot-me.png)
+do `(цель)` | Что-то сделать со зрителем ![FeelsNotSureMan (by HelSinki_)](https://cdn.frankerfacez.com/emoticon/200496/1) `(С мультиворд поддержкой!)` | ![+do](http://xdlottery.7m.pl/files/xrpsxbot-github/Github-xrpsxBot-do.png)
+steal `(цель)` | Украсть :money_with_wings: у зрителя ![WideHardo (by mr_allemann)](https://cdn.frankerfacez.com/emoticon/309114/1) `(Вау! И это имеет мультиворд поддержку)` | ![+steal](http://xdlottery.7m.pl/files/xrpsxbot-github/Github-xrpsxBot-steal.png)
+love `(цель)` | Измерить любовь к предмету или человеку ![hehL (by JesusAVGN)](https://static-cdn.jtvnw.net/emoticons/v1/664602/1.0) `(В этом тоже есть мультиворд поддержка!!)` | ![+love](http://xdlottery.7m.pl/files/xrpsxbot-github/Github-xrpsxBot-love.png)
+rainbow `(цель)` | Сделать из текста радугу ![KappaPride (by Twitch)](https://static-cdn.jtvnw.net/emoticons/v1/55338/1.0) `(А тут обязательно должна быть мультиворд поддержка! Стоп.. Она тут есть!!)` | ![+rainbow](http://xdlottery.7m.pl/files/xrpsxbot-github/Github-xrpsxBot-newrainbow.png)
+key | Шанс сгенерированного ключа быть рабочим составляет 0.1%, но не ноль процентов ![peepoHACKER (by Reett__)](https://cdn.betterttv.net/emote/5f01110da2ac620530361e51/1x) | ![+key](http://xdlottery.7m.pl/files/xrpsxbot-github/Github-xrpsxBot-key.png)
+info | Информация о боте ![peepoShyH (by jessdesiderio)](https://cdn.betterttv.net/emote/5f77f2d8ce8bc74a942433ac/1x) | ![+info](http://xdlottery.7m.pl/files/xrpsxbot-github/Github-xrpsxBot-info.png)
+dethlette | Русская Рулетка на смерть ![sadCat (by Rikali)](https://cdn.betterttv.net/emote/5f32ab1dafb6965d6e7b71f7/1x) | ![+dethlette](http://xdlottery.7m.pl/files/xrpsxbot-github/Github-xrpsxBot-dethlette.png)
+rsong | Присылаем случайную музыку из [Newgrounds](https://www.newgrounds.com/audio) ![pepeJAM (by ShakoTheWacko)](https://cdn.betterttv.net/emote/5b77ac3af7bddc567b1d5fb2/1x) `(ID и ссылка прилагаются)` | ![+randomsong](http://xdlottery.7m.pl/files/xrpsxbot-github/Github-xrpsxBot-randomsong.png)
+song `Newgrounds Audio ID` | Ищем музыку из [Newgrounds](https://www.newgrounds.com/audio) по ID, который вы указали в сообщении ![pepeJaMi (by Hollowoff)](https://cdn.betterttv.net/emote/5e53081508b4447d56a95abd/1x) | ![+randomsong](http://xdlottery.7m.pl/files/xrpsxbot-github/Github-xrpsxBot-randomsong.png)
@xrpsxbot | ![Flushed (by PWGood)](https://cdn.betterttv.net/emote/5f1abc066f378244660150eb/1x) | ![xrpsxbot](http://xdlottery.7m.pl/files/xrpsxbot-github/Github-xrpsxBot-xrpsxBot.png)
> Для команды `+dethlette` боту нужно дать режим модератора, чтобы он мог временно отстранять проигравших на **1 мин. 30 сек**.
### Стандартные команды для игры [Geometry Dash](https://store.steampowered.com/app/322170) ![]()
Команды | Применение | Как это работает?
---|---|---
+user `Никнейм из игры` | Посмотреть информацию о игроке из игры ![Account Request Button](http://xdlottery.7m.pl/files/buttons/button-gd-accountrequest.png) | ![+user](http://xdlottery.7m.pl/files/xrpsxbot-github/Github-xrpsxBot-user.png)
+level `ID Уровня` | Показать указанный уровень из игры ![Hard Difficulty Button](http://xdlottery.7m.pl/files/buttons/button-gd-harddiff.png) | ![+level](http://xdlottery.7m.pl/files/xrpsxbot-github/Github-xrpsxBot-level.png)
+daily | Ежедневный уровень ![Daily Level Button](http://xdlottery.7m.pl/files/buttons/button-gd-dailylevel.png) | ![+daily](http://xdlottery.7m.pl/files/xrpsxbot-github/Github-xrpsxBot-daily.png)
+weekly | Eженедельный демонический уровень ![Weekly Level Button](http://xdlottery.7m.pl/files/buttons/button-gd-weeklydemon.png) | ![+weekly](http://xdlottery.7m.pl/files/xrpsxbot-github/Github-xrpsxBot-weekly.png)
> Спасибо Neptex за библиотеку [**GeometryPy**](https://github.com/Neptex/GeometryPy), с которой работают эти прекрасные команды сверху!

## Как добавить свою команду и изменить префикс? ![monkaHmm (by DigitalWelt_Original)](https://cdn.betterttv.net/emote/5f28433c713a6144748acd1e/1x)
Добавить команду очень просто! Вставьте этот текст в конце **def Commands()** и измените его в файле **bot.py**:
```Python
    if PREFIX + 'НазваниеВашейКоманды' in msg:
        sendMsg('Ваш Текст')
        sendMsg('Привет, @' + username) # username - никнейм отправителя команды
```
Но префикс ещё легче изменить! Поменяйте + в переменной **PREFIX** на другой любой символ, который вам нравится:
> (напоминаю, что префикс находится в файле **config.py**)
```Python
    PREFIX = "+" # Нужно поменять этот плюсик и не убирать кавычки
```

## На этом всё! ![peepoClap (by KekSee4ek)](https://cdn.betterttv.net/emote/5e20bbaa1df9195f1a4c7012/1x)
Я ответил на главные вопросы по xrpsxBot ![peepoOkay (by african_neighbor)](https://cdn.frankerfacez.com/emoticon/244565/1). Можете задавать вопросы по боту в [`issues`](https://github.com/ilotterytea/xrpsx-bot/issues), а я отвечу на них как можно быстрее.
