#-------------------------#
#  Сам бот и его команды  #
#-------------------------#

# Библиотеки
import random
import string
import time
import threading
import traceback
import sys
import os
import psutil
import json
import logging
import urllib.request
from urllib.request import urlopen, Request
import itertools
from itertools import cycle
import base64
from utils import *
from GeometryPy.gdpy import *
from config import *
from emotes import *
#from xrpsxBot.randomSong import *

betaMode = 1 # Бета-тестирование. 1 - Включить, 0 - выключить.
activeList = {}
rlydethList = {}

# Если бот присоединился к вашему каналу, то он отправит это сообщение!
print('202 - Bot connected to ' + CHANNELJOIN)
sendMsg('/me : Status 200 - xrpsxBot v1.00 RarePepe')


# Для команды "+love"
def rainbowTarget(userTarget, itemTarget):
    global activeList
    #activeList[itemTarget] = userTarget
    sendMsg('/color red')
    rbMsg = '/me {}'.format(itemTarget)
    sendMsg(rbMsg)
    sendMsg('/color orangered')
    rbMsg = '/me {}'.format(itemTarget)
    sendMsg(rbMsg)
    sendMsg('/color goldenrod')
    rbMsg = '/me {}'.format(itemTarget)
    sendMsg(rbMsg)
    sendMsg('/color seagreen')
    rbMsg = '/me {}'.format(itemTarget)
    sendMsg(rbMsg)
    sendMsg('/color dodgerblue')
    rbMsg = '/me {}'.format(itemTarget)
    sendMsg(rbMsg)
    sendMsg('/color blue')
    rbMsg = '/me {}'.format(itemTarget)
    sendMsg(rbMsg)
    sendMsg('/color blueviolet')
    rbMsg = '/me {}'.format(itemTarget)
    sendMsg(rbMsg)
    sendMsg('/color hotpink')

    activeList.clear()

# Для команды "+do"
def stealTarget(userTarget, itemTarget):
    global activeList
    activeList[itemTarget] = userTarget
    # Рандомная цифра
    xpRand_St = random.randint(0, 5000)

    # Вариации ответа
    if xpRand_St <= 50:
        stMsg = '@{} украл '.format(userTarget) + str(xpRand_St) + ' руб. у {} '.format(itemTarget) + LUL_TEmote
        sendMsg(stMsg)
    if 50 <= xpRand_St <= 1000:
        stMsg = '@{} украл '.format(userTarget) + str(xpRand_St) + ' руб. у {} '.format(itemTarget) + BOP_TEmote
        sendMsg(stMsg)
    if 1000 <= xpRand_St <= 4500:
        stMsg = '@{} украл '.format(userTarget) + str(xpRand_St) + ' руб. у {} '.format(itemTarget) + PogChamp_TEmote
        sendMsg(stMsg)
    if xpRand_St >= 4500:
        stMsg = '@{} украл '.format(userTarget) + str(xpRand_St) + ' руб. у {} '.format(itemTarget) + TriHard_TEmote + ' ' + ThumbsUp_Emoji
        sendMsg(stMsg)

    activeList.clear()

# Для команды "+love"
def loveTarget(userTarget, itemTarget):
    global activeList
    activeList[itemTarget] = userTarget
    # Рандомная цифра
    xpRand_Lv = random.randint(0, 100)

    # Вариации ответа
    if xpRand_Lv <= 10:
        lvMsg = '@{} любит {}'.format(userTarget, itemTarget) + ' на ' + str(xpRand_Lv) + '% '+ BibleThump_TEmote + ' ' + Heart_TEmote
        sendMsg(lvMsg)
    if 10 <= xpRand_Lv <= 50:
        lvMsg = '@{} любит {}'.format(userTarget, itemTarget) + ' на ' + str(xpRand_Lv) + '% ' + Heart_TEmote
        sendMsg(lvMsg)
    if 50 <= xpRand_Lv <= 95:
        lvMsg = '@{} любит {}'.format(userTarget, itemTarget) + ' на ' + str(xpRand_Lv) + '% ' + BleedPurple_TEmote
        sendMsg(lvMsg)
    if xpRand_Lv >= 95:
        lvMsg = '@{} очень сильно любит {}'.format(userTarget, itemTarget) + ' (' + str(xpRand_Lv) + '%) ' + BleedPurple_TEmote + ' ' + Heart_TEmote
        sendMsg(lvMsg)

    activeList.clear()

# Для команды "+do"
def doTarget(userTarget, itemTarget):
    global activeList
    activeList[itemTarget] = userTarget
    # Рандомная цифра
    xpRand_Do = random.randint(0, 10)

    # Вариации ответа
    if xpRand_Do == 1:
        useItemMsg = '@{} пнул {} '.format(userTarget, itemTarget) + Gasp_BEmote
    if xpRand_Do == 2:
        useItemMsg = '@{} пьёт чай вместе с {} '.format(userTarget, itemTarget) + TeaTime_TEmote
    if xpRand_Do == 3:
        useItemMsg = '@{} обнял {} '.format(userTarget, itemTarget) + peepoHug_BEmote
    if xpRand_Do == 4:
        useItemMsg = '@{} и {} ппХоппят вместе '.format(userTarget, itemTarget) + ppHop_BEmote
    if xpRand_Do == 5:
        useItemMsg = '@{} слил {} в Интернет HACKERMANS '.format(userTarget, itemTarget)
    if xpRand_Do == 6:
        useItemMsg = '@{} крепко дружит с {} peepoFriendship'.format(userTarget, itemTarget)
    if xpRand_Do == 7:
        useItemMsg = '@{} игнорит {} peepoIgnore peepoSad'.format(userTarget, itemTarget)
    if xpRand_Do == 8:
        useItemMsg = '@{} подарил цветочек {} peepoFlower'.format(userTarget, itemTarget)
    if xpRand_Do == 9:
        useItemMsg = '@{} рассказал анекдот {} forsenKek'.format(userTarget, itemTarget)
    if xpRand_Do == 10:
        useItemMsg = '@{} нападает на {} seriouslyBro'.format(userTarget, itemTarget)

    activeList.clear()


def cmds(msg, username):
    global activeList

    # Если пользователя нету в чёрном списке, то бот будет отвечат на его команды.
    # Также если пользователь находится в чёрном списке, то бот не будет никак реагировать на него.
    if username not in blackList:
        # Команда "@xrpsxbot" - :flushed:
        if msg == '@' + BOTNAME:
            sendMsg('@' + username + ' 😳')

        # Команда "+info" - Информация о боте.
        if PREFIX + 'info' in msg:
            sendMsg('Ку, @' + username + '! Полный список команд можно найти на GitHub: https://github.com/ilotterytea/xrpsx-bot ' + peepoChat_BEmote)

        # Команда "+key" - Сгенерировать рандомный ключ
        if PREFIX + 'key' in msg:
            chrsKey = 'ABCDEF0123456789'  # Символы
            numKey = 6  # Размер слов

            keyA = ''.join(random.choices(chrsKey, k=5))
            keyB = ''.join(random.choices(chrsKey, k=5))
            keyC = ''.join(random.choices(chrsKey, k=5))

            sendMsg('@' + username + ', ваш рандомный ключ: ' + keyA + '-' + keyB + '-' + keyC + '. Желаем удачи <3!')

        # Команда "+shutdown" - Отключить бота :(
        if PREFIX + 'shutdown' in msg and username in modList:
            xyShutdown = random.randint(51, 100)
            sendMsg('@' + username + ', за что? Я сделала всё, что мне сказали :(')
            time.sleep(2)
            sendMsg('/me - It burns! I am on fire: CPU overload 👉 ' + str(xyShutdown) + '% ItsBoshyTime')
            time.sleep(5)
            sendMsg('/me - Critical Error. Goodnight 💤')
            sys.exit(0)

        # Команда "+dethlette" - Русская рулетка.
        if PREFIX + 'dethlette' in msg:
            xyDethlette = random.randint(1, 5)
            sendMsg('/me : @' + username + ' прислонил водяной пистолет к голове.. Sadge 🔫')
            time.sleep(2)
            if xyDethlette == 1:
                sendMsg('/me Спусковой крючок нажат! Водяной пистолет брызгает и @' + username + ' намочился полностью Sadge')
                sendMsg('/timeout ' + username + ' 90 Вы не выжили в Водяной рулетке.. (+dethlette)')
            if xyDethlette == 2:
                sendMsg('/me Спусковой крючок нажат! Водяной пистолет брызгает и @' + username + ' остался сухим?.. MonkaHmm')
                sendMsg('/timeout ' + username + ' 5 Как вы остались сухим? (+dethlette)')
            if xyDethlette > 2:
                sendMsg('/me Спусковой крючок нажат! Водяной пистолет щёлкает и @' + username + ' выжил в водяной рулетке EZY Clap ')

        # Команда "+steal" - Украсть денег у зрителя
        if PREFIX + 'steal' in msg:
            msgList = msg.split()
            alTable = str.maketrans("", "")
            alStrip = [w.translate(alTable) for w in msgList]
            activeLengthPP = " ".join(alStrip)
            activeLength = activeLengthPP

            alLength = 5 + 1  # Впишите кол-во букв команды в первое число, чтобы убрать команду из ответа.

            if activeLength not in activeList:
                stealTarget(username, activeLength[alLength:])
            else:
                activeList.clear()
                stealTarget(username, activeLength[alLength:])

        # Команда "+do" - Сделать что-то со зрителем.
        if PREFIX + 'do' in msg:
            msgList = msg.split()
            msgList = [e.lower() for e in msgList]
            index = msgList.index(PREFIX + 'do')

            if msgList[index + 1] not in activeList:
                doTarget(username, msgList[index + 1])
            else:
                del activeList[msgList[index + 1]]
                doTarget(username, msgList[index + 1])

        # Команда "+rainbow" - Сделать из текста радугу.
        if PREFIX + 'rainbow' in msg:
            msgList = msg.split()
            alTable = str.maketrans("", "")
            alStrip = [w.translate(alTable) for w in msgList]
            activeLengthPP = " ".join(alStrip)
            activeLength = activeLengthPP

            alLength = 7 + 1

            if activeLength not in activeList:
                rainbowTarget(username, activeLength[alLength:])
            else:
                activeList.clear()
                rainbowTarget(username, activeLength[alLength:])

        # Команда "+love" - Измерить любовь к предмету.
        if PREFIX + 'love' in msg:
            msgList = msg.split()
            alTable = str.maketrans("", "")
            alStrip = [w.translate(alTable) for w in msgList]
            activeLengthPP = " ".join(alStrip)
            activeLength = activeLengthPP

            alLength = 4 + 1

            if activeLength not in activeList:
                loveTarget(username, activeLength[alLength:])
            else:
                activeList.clear()
                loveTarget(username, activeLength[alLength:])

        # Команда "+rsong" - Рандомная музыка из Newgrounds
        if PREFIX + 'rsong' in msg:
            xpRand_rSong = random.randint(1100, 999999)
            GetSongInfo(str(xpRand_rSong))

        # Команда "+song" - Поиск музыки из Newgrounds
        if PREFIX + 'song' in msg:
            msgList = msg.split()
            alTable = str.maketrans("", "")
            alStrip = [w.translate(alTable) for w in msgList]
            activeLengthPP = " ".join(alStrip)
            activeLength = activeLengthPP

            alLength = 4 + 1

            if activeLength not in activeList:
                sendMsg('@' + username + ', найденная музыка из Newgrounds по ID: ' + str(GetSongInfo(str(activeLength[alLength:]))))
            else:
                activeList.clear()
                sendMsg('@' + username + ', найденная музыка из Newgrounds по ID: ' + str(GetSongInfo(str(activeLength[alLength:]))))

        # Команда "+level" - Информация о уровне из Geometry Dash
        if PREFIX + 'level -na' in msg:
            msgList = msg.split()
            alTable = str.maketrans("", "")
            alStrip = [w.translate(alTable) for w in msgList]
            activeLengthPP = " ".join(alStrip)
            activeLength = activeLengthPP

            alLength = 9 + 1

            if activeLength not in activeList:
                sendMsg('@' + username + ', найденный уровень по вашему запросу: ' + GetLevelInfoByAuthor(str(activeLength[alLength:])))
            else:
                activeList.clear()
                sendMsg(GetLevelInfoByName(str(activeLength[alLength:])))

        # Команда "+daily" - Ежедневный уровень из Geometry Dash
        if PREFIX + 'daily' in msg:
            sendMsg('@' + username + ', сегодняшний уровень в GD: ' + GetDailyLevel())

        # Команда "+weekly" - Еженедельный демонический уровень из Geometry Dash
        if PREFIX + 'weekly' in msg:
            sendMsg('@' + username + ', сегодняшний демонический уровень в GD: ' + GetWeeklyLevel())

        if PREFIX + 'topcreators' in msg:
            sendMsg('@' + username + ', топ 5 игроков по строительным поинтам в GD: ' + str(GetCreatorsLeaderboard(5)))

        if PREFIX + 'topusers' in msg:
            sendMsg('@' + username + ', оффициальный топ 5 игроков в GD: ' + str(GetPlayersLeaderboard(5)))


        # Команда "+pasta" - Заказать вкусную пасту
        if PREFIX + 'pasta' in msg and username in modList:
            xyPasta = random.randint(0, 36)

            filePasta = open(BOTFOLDER + '/pastas.txt', 'r', encoding="utf-8")
            pastaLines = filePasta.readlines()
            pastaMsg = pastaLines[xyPasta] + ' (' + str(xyPasta) + ')'
            sendMsg(pastaMsg)

            pastaLines.clear()

        # Команда "+art" - Посмотреть на ASCII-арты
        if PREFIX + 'art' in msg and username in modList:
            xyASCIIArt = random.randint(0, 12)

            fileASCIIArt = open(BOTFOLDER + '/arts.txt', 'r', encoding="utf-8")
            asciiartLines = fileASCIIArt.readlines()
            asciiartMsg = asciiartLines[xyASCIIArt] + ' (' + str(xyASCIIArt) + ')'
            sendMsg(asciiartMsg)

            asciiartLines.clear()

        # Команда "+me" - Узнать кто ты сегодня?..
        if PREFIX + 'me' in msg:
            xpRand_Me = random.randint(1, 10)

            # Вариации команды +me
            if xpRand_Me == 1:
                sendMsg('@' + username + ' крутой ' + Cool_TEmote)

            if xpRand_Me == 2:
                sendMsg('@' + username + ' ппхоппит туда сюда.. ' + ppHop_BEmote)

            if xpRand_Me == 3:
                sendMsg('@' + username + ' что-то увидел страшное краем глаза ' + monkaS_BEmote)

            if xpRand_Me == 4:
                sendMsg('@' + username + ' кушает питсу peepoPizza')

            if xpRand_Me == 5:
                sendMsg('@' + username + ' нне умиет.. писыаьть букфамии...ю. FeelsDyslexiaMan')

            if xpRand_Me == 6:
                sendMsg('@' + username + ' молится DORIME')

            if xpRand_Me == 7:
                sendMsg('@' + username + ' донк peepoOkayDank')

            if xpRand_Me == 8:
                sendMsg('@' + username + ' VON ZULUL')

            if xpRand_Me == 9:
                sendMsg('@' + username + ' упал и хохочет ROFL')

            if xpRand_Me == 10:
                sendMsg('@' + username + ' вкусно поел ' + Tasty_BEmote)

t = threading.Thread(target=puppet).start()

def msgLoop():
    while True:
        global s, readBuffer

        try:
            readBuffer = readBuffer + s.recv(1024).decode("UTF-8")
        except KeyboardInterrupt:
            raise
        except:
            print(traceback.format_exc())

        temp = str.split(readBuffer, "\r\n")
        #temp = [ str(e.encode('UTF-8')).rstrip() for e in temp ]
        readBuffer = temp.pop()

        for line in temp:
            if (line[0] == "PING"):
                s.send(bytes("PONG %s\r\n" % line[1], "UTF-8"))
            else:
                parts = str.split(line, ":")
                try:
                    msg = parts[2][:len(parts[2])]
                except:
                    msg = ""

                usernamesplit = str.split(parts[1], "!")
                username = usernamesplit[0]

                print('[ch: ' + CHANNELJOIN + '] ' + username + ': ' + msg)
                cmds(msg, username.lower())

while True:
    try:
        msgLoop()
    except KeyboardInterrupt:
        raise
    except:
        print(traceback.format_exc())
        socketConnection()
        msgLoop()
