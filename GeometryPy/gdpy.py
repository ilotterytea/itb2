#-------------------------------------#
#  Библиотека "GeometryPy" от Neptex  #
#-------------------------------------#

# Библиотеки
from xrpsxBot.bot import *
from xrpsxBot.emotes import *
from xrpsxBot.GeometryPy.gdpyUtils import *
import base64


# Список уровней - "+level"
def GetLevelList(Page, Param_Type):
    Page = str(Page)
    Param_Type = str(Param_Type)

    URLParameters = {
        "gameVersion": "21",
        "binaryVersion": "35",
        "gdw": "0",
        "len": "-",
        "type": Param_Type,
        "diff": "-",
        "featured": "0",
        "original": "0",
        "twoPlayer": "0",
        "coins": "0",
        "page": Page,
        "epic": "0",
        "secret": "Wmfd2893gb7"

    }
    Response = SendHTTPRequest("getGJLevels21", URLParameters)

    if Response == "-1":
        return -1

    LevelsList = []
    LevelParser = Response.split("|")
    AuthorsData = Response.split("#")[1].split("|")
    AuthorIndex = 0

    for i in LevelParser:
        LevelData = i.split(":")
        try:
            for i in range(len(AuthorsData)):
                if AuthorsData[i].split(":")[0] == LevelData[7]:
                    AuthorIndex = i
                    break

            LevelInfo = {
                "name": LevelData[3],
                "author": {
                    "name": AuthorsData[AuthorIndex].split(":")[1],
                    "accountid": AuthorsData[AuthorIndex].split(":")[0],
                    "userid": AuthorsData[AuthorIndex].split(":")[2]
                },
                "id": LevelData[1],
                "downloads": LevelData[13],
                "likes": LevelData[19],
                "description": base64.b64decode(str(LevelData[35])).decode(),
                "original": LevelData[39],
                "difficulty": GetDifficulty(LevelData),
                "length": GetLength(LevelData[37])
            }

            LevelsList.append(LevelInfo)
        except:
            pass

    return LevelsList

# Получение информации о игроке через никнейм или Account ID - "+user"
def GetUserInfo(User):
    User = str(User)
    AccountID = str(User)

    if User == "":
        return
    elif not User.isdigit():

        ## Получение AccountID через никнейм
        URLParameters = {
            "gameVersion": "21",
            "binaryVersion": "35",
            "gdw": "0",
            "str": User,
            "secret": "Wmfd2893gb7"
        }
        Response = SendHTTPRequest("getGJUsers20", URLParameters)

        if Response != "-1":
            AccountID = Response.split(":")[21]
        else:
            return -1

    # Поиск игроков
    URLParameters = {
        "gameVersion": "21",
        "binaryVersion": "35",
        "gdw": "1",
        "targetAccountID": AccountID,
        "secret": "Wmfd2893gb7"
    }
    Response = SendHTTPRequest("getGJUserInfo21", URLParameters)

    if Response == "-1":
        return -1

    DataParser = Response.split(":")
    UserInfos = StructureUser(DataParser)
    print(Response)

    return UserInfos

# Информация о уровне через запрос HTTP - "+level"
def GetLevelInfo(LevelName, creator=None):
    if creator == "" or creator == None:
        result = GetLevelInfoByName(LevelName)
        return result
    else:
        result = GetLevelInfoByAuthor(creator)
        return result


# Информация о уровне через название уровня и создателя - "+level -na"
def GetLevelInfoByAuthor(LevelName, creator):
    Creator = str(creator)

    # Get the accountID of the researched creator
    URLParameters = {
        "gameVersion": "21",
        "binaryVersion": "35",
        "str": Creator,
        "total": "0",
        "page": "0",
        "secret": "Wmfd2893gb7"}

    Response = SendHTTPRequest("getGJUsers20", URLParameters)

    if Response == "-1":
        levelText = 'Not Found' + Sadge_BEmote
        return levelText

    AccountID = str(Response.split(":")[3])

    # Использование AccountID, чтобы найти другие уровни пользователя
    URLParameters = {
        "gameVersion": "21",
        "binaryVersion": "35",
        "gdw": "0",
        "str": AccountID,
        "len": "-",
        "type": "5",
        "diff": "-",
        "featured": "0",
        "original": "0",
        "twoPlayer": "0",
        "coins": "0",
        "page": "0",
        "epic": "0",
        "secret": "Wmfd2893gb7"
    }
    Response = SendHTTPRequest("getGJLevels21", URLParameters)

    if Response == "-1":
        levelText = 'Not Found' + Sadge_BEmote
        return levelText

    LevelParser = Response.split("|")
    LevelIndex = 0
    AuthorIndex = 0

    # Look for each levels in creator account to see if level name correspond to the researched one
    for i in range(len(LevelParser)):
        ThisLevel = LevelParser[i].split(":")

        if ThisLevel[3].lower() == levelName.lower():
            LevelIndex = i
            break
        elif i == len(LevelParser) - 1:
            LevelIndex = -1
            break

    # Если уровень найден
    if levelIndex == -1:
        return LEVEL_NOT_FOUND_ERROR
    else:

        LevelData = LevelParser[levelIndex].split(":")
        AuthorsData = Response.split("#")[1].split("|")

        for i in range(len(AuthorsData)):
            try:
                if AuthorsData[i].split(":")[0] == LevelData[7]:
                    AuthorIndex = i
                    break
            except:
                pass

            if LevelData[39] == "0":
                LevelData[39] = "true"

        LevelInfos = {
            "name": LevelData[3],
            "author": AuthorsData[authorIndex].split(":")[1],
            #"author": {
            #    "name": AuthorsData[authorIndex].split(":")[1],
            #    "accountid": AuthorsData[authorIndex].split(":")[0],
            #    "userid": AuthorsData[authorIndex].split(":")[2]
            #},
            "stars": LevelData[27],
            "id": LevelData[1],
            "downloads": LevelData[13],
            "likes": LevelData[19],
            #"description": LevelData.b64decode(str(LevelData[35])).decode(),
            "original": LevelData[39],
            "difficulty": GetDifficulty(LevelData),
            "length": GetLength(LevelData[37])},

        levelName = LevelInfos["name"]
        levelAuthor = LevelInfos["author"]
        levelStars = LevelInfos["stars"]
        levelID = LevelInfos["id"]
        levelDownloads = LevelInfos["downloads"]
        levelLikes = LevelInfos["likes"]
        levelDiff = LevelInfos["difficulty"]
        levelLength = LevelInfos["length"]

        levelText = str(levelName) + ' от ' + str(levelAuthor) + ' (ID: ' + str(levelID) + ', ' + levelDiff + ' ' + str(levelStars) + ' ⭐)' + ' - ' + str(levelDownloads) + ' загрузок, ' + str(levelLikes) + ' лайков, ' + levelLength + ' ' + ppHop_BEmote

        return levelText

# Получение информации о уровне через название уровня - "+level -n"
def GetLevelInfoByName(LevelName):
    LevelName = str(LevelName)
    URLParameters = {
        "gameVersion": "21",
        "binaryVersion": "35",
        "gdw": "0",
        "str": LevelName,
        "len": "-",
        "type": "1",
        "diff": "-",
        "featured": "0",
        "original": "0",
        "twoPlayer": "0",
        "coins": "0",
        "page": "2",
        "epic": "0",
        "secret": "Wmfd2893gb7"

    }
    Response = SendHTTPRequest("getGJLevels21", URLParameters)

    if Response == "-1":
        levelText = 'Not Found ' + Sadge_BEmote
        return levelText

    LevelParser = Response.split("|")
    AuthorIndex = 0

    LevelData = LevelParser[0].split(":")
    AuthorsData = Response.split("#")[1].split("|")

    # Find level author informations
    for i in range(len(AuthorsData)):
        try:
            if AuthorsData[i].split(":")[0] == LevelData[7]:
                AuthorIndex = i
                break
        except:
            pass

    if LevelData[39] == "0":
        LevelData[39] = "true"

    print(LevelData)
    LevelInfos = {
        "name": LevelData[3],
        "author": AuthorsData[AuthorIndex].split(":")[1],
        #"author": {
        #    "authorname": AuthorsData[AuthorIndex].split(":")[1],
        #    "accountid": AuthorsData[AuthorIndex].split(":")[0],
        #    "userid": AuthorsData[AuthorIndex].split(":")[2]
        #},
        "stars": LevelData[27],
        "id": LevelData[1],
        "downloads": LevelData[13],
        "likes": LevelData[19],
        #"description": base64.b64decode(str(LevelData[35])).decode(),
        "original": LevelData[39],
        "difficulty": GetDifficulty(LevelData),
        "length": GetLength(LevelData[37])
    }

    levelName = LevelInfos["name"]
    levelAuthor = LevelInfos["author"]
    levelStars = LevelInfos["stars"]
    levelID = LevelInfos["id"]
    levelDownloads = LevelInfos["downloads"]
    levelLikes = LevelInfos["likes"]
    levelDiff = LevelInfos["difficulty"]
    levelLength = LevelInfos["length"]

    levelText = str(levelName) + ' от ' + str(levelAuthor) + ' (ID: ' + str(levelID) + ', ' + levelDiff + ' ' + str(levelStars) + ' ⭐)' + ' - ' + str(levelDownloads) + ' загрузок, ' + str(levelLikes) + ' лайков, ' + levelLength + ' ' + ppHop_BEmote

    return levelText

# Получение информации о песни - "+song" и "+rsong"
def GetSongInfo(songid):
    URLParameters = {
        "gameVersion": "21",
        "binaryVersion": "35",
        "songID": str(songid),
        "secret": "Wmfd2893gb7"

    }
    Response = SendHTTPRequest("getGJSongInfo", URLParameters)

    if Response == "-1":
        SongText = 'Not Found ' + Sadge_BEmote
        return SongText

    DataParser = Response.split("~|~")

    SongInfos = {
        "name": DataParser[3],
        "id": DataParser[1],
        "author": DataParser[7],
        "size": DataParser[9] + "MB"
    }

    SongName = SongInfos["name"]
    SongID = SongInfos["id"]
    SongAuthor = SongInfos["author"]
    SongLinkID = 0 + int(SongID)
    SongLink = 'https://www.newgrounds.com/audio/listen/' + str(SongLinkID)

    if Response != "-1":
        SongText = SongName + ' - ' + SongAuthor + ' [ ID: ' + SongID + ' / ' + SongLink + ' ] ' + pJAM_BEmote
        return SongText

# Ежедневные уровни - "+daily"
def GetDailyLevel():
    URLParameters = {
        "gameVersion": "21",
        "binaryVersion": "35",
        "gdw": "0",
        "levelID": "-1",
        "secret": "Wmfd2893gb7"

    }
    Response = SendHTTPRequest("downloadGJLevel22", URLParameters)

    LevelID = Response.split(":")[1]
    LevelInfos = GetLevelInfo(LevelID, "")

    return LevelInfos

# Еженедельные демонические уровни - "+weekly"
def GetWeeklyLevel():
    URLParameters = {
        "gameVersion": "21",
        "binaryVersion": "35",
        "gdw": "0",
        "levelID": "-2",
        "secret": "Wmfd2893gb7"

    }
    Response = SendHTTPRequest("downloadGJLevel22", URLParameters)

    LevelID = Response.split(":")[1]
    LevelInfos = GetLevelInfo(LevelID, "")

    return LevelInfos

# Топ игроков - "+leaderboard -p"
def GetPlayersLeaderboard(PlayersCount):
    PlayersCount = str(PlayersCount)

    URLParameters = {
        "gameVersion": "21",
        "binaryVersion": "35",
        "gdw": "0",
        "type": "top",
        "count": PlayersCount,
        "secret": "Wmfd2893gb7"

    }
    Response = SendHTTPRequest("getGJScores20", URLParameters)

    if Response == "-1":
        return -1

    UsersList = []
    PlayersParser = Response.split("|")
    ReturnedPlayersCount = 0

    for Player in PlayersParser:
        PlayerInfos = Player.split(":")

        try:
            UsersList.append(PlayerInfos[1])
            ReturnedPlayersCount += 1
        except:
            pass

    return UsersList

# Топ игроков по поинтам создания - "+leaderboard -cp"
def GetCreatorsLeaderboard(PlayersCount):
    PlayersCount = str(PlayersCount)

    URLParameters = {
        "gameVersion": "21",
        "binaryVersion": "35",
        "gdw": "0",
        "type": "creators",
        "count": PlayersCount,
        "secret": "Wmfd2893gb7"

    }
    Response = SendHTTPRequest("getGJScores20", URLParameters)

    if Response == "-1":
        return -1

    UsersList = []
    PlayersParser = Response.split("|")
    ReturnedPlayersCount = 0

    for Player in PlayersParser:
        PlayerInfos = Player.split(":")

        try:
            UsersList.append(PlayerInfos[1])
            ReturnedPlayersCount += 1
        except:
            pass

    return UsersList

# Хорошие уровни - "+level"
def GetFeaturedLevels(page):
    result = GetLevelList(page, 6)
    return result

# Самые скачиваемые уровни - "+level"
def GetMostDownloadedLevels(page):
    result = GetLevelList(page, 1)
    return result

# Уровни в тренде - "+level"
def GetTrending(page):
    result = GetLevelList(page, 3)
    return result

# Недавние уровни - "+level"
def GetRecentLevels(page):
    result = GetLevelList(page, 4)
    return result

# Награжденные уровни - "+level"
def GetAwardedLevels(page):
    result = GetLevelList(page, 11)
    return result

# Магические уровни? - "+level"
def GetMagicLevels(page):
    result = GetLevelList(page, 7)
    return result