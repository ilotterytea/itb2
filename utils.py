#------------------------------------------------------------------------#
#  Нужные утилиты для работы бота: Отправка сообщений, тайм-ауты и баны  #
#------------------------------------------------------------------------#

# Библиотеки
import socket
from xrpsxBot.bot import *
from xrpsxBot.config import *

s = socket.socket()
readBuffer = ""
ResidentSleep = 120

s.connect((HOST, PORT))
s.send(bytes("PASS %s\r\n" % OAUTHTOKEN, "UTF-8"))
s.send(bytes("NICK %s\r\n" % BOTNAME, "UTF-8"))
s.send(bytes("JOIN #%s\r\n" % CHANNELJOIN, "UTF-8"))
s.send(bytes("CAP REQ :twitch.tv/membership\r\n", "UTF-8"))
s.send(bytes("CAP REQ :twitch.tv/commands\r\n", "UTF-8"))
s.send(bytes("CAP REQ :twitch.tv/tags\r\n", "UTF-8"))

def socketConnection():
    global s, HOST, PORT, BOTNAME, CHANNELJOIN
    try:
        s.close()
        s.socket.socket()
        s.connect((HOST, PORT))
        s.send(bytes("PASS %s\r\n" % OAUTHTOKEN, "UTF-8"))
        s.send(bytes("NICK %s\r\n" % BOTNAME, "UTF-8"))
        s.send(bytes("JOIN #%s\r\n" % CHANNELJOIN, "UTF-8"))
        s.send(bytes("CAP REQ :twitch.tv/membership\r\n", "UTF-8"))
        s.send(bytes("CAP REQ :twitch.tv/commands\r\n", "UTF-8"))
        s.send(bytes("CAP REQ :twitch.tv/tags\r\n", "UTF-8"))
    except:
        print(traceback.format_exc())

def puppet():
    try:
        while True:
            msg = input(' assuming direct control: ')
            sendMsg(msg)
            cmds(msg, BOTNAME)
    except BrokenPipeError:
        socketConnection()

def sendMsg(text):
    # Method for sending a msg
    s.send(bytes("PRIVMSG #" + CHANNELJOIN + " :" + str(text) + "\r\n", "UTF-8"))


def timeoutUser(user, secs):
    timeoutMsg = "PRIVMSG #" + CHANNELJOIN + ": /timeout %s %s\r\n" % (user, secs)
    s.send(bytes(timeoutMsg), "UTF-8")