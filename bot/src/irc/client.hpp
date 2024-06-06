#pragma once

#include <ixwebsocket/IXWebSocket.h>

#include <string>
#include <vector>

#include "../config.hpp"
#include "../logger.hpp"
#include "cpr/api.h"
#include "cpr/response.h"
#include "message.hpp"
#include "nlohmann/json.hpp"

namespace bot {
  namespace irc {
    class Client {
      public:
        Client(std::string client_id, std::string token,
               const Configuration &configuration)
            : client_id(client_id),
              token(token),
              configuration(configuration),
              host("wss://irc-ws.chat.twitch.tv"),
              port("443") {
          this->websocket.setUrl(this->host + ":" + this->port);

          // getting token owner
          cpr::Response response =
              cpr::Get(cpr::Url{"https://api.twitch.tv/helix/users"},
                       cpr::Bearer{this->token},
                       cpr::Header{{"Client-Id", this->client_id}});

          if (response.status_code != 200) {
            log::warn("IRC", "Failed to get bot username from Twitch API: " +
                                 std::to_string(response.status_code) + " " +
                                 response.status_line);
          } else {
            nlohmann::json j = nlohmann::json::parse(response.text);

            auto d = j["data"][0];
            this->id = std::stoi(d["id"].get<std::string>());
            this->username = d["login"];
          }
        }

        ~Client() = default;

        void run();

        void say(const std::string &channel_login, const std::string &message);
        bool join(const std::string &channel_login);
        void raw(const std::string &raw_message);

        template <MessageType T>
        void on(typename MessageHandler<T>::fn function) {
          switch (T) {
            case Privmsg:
              this->onPrivmsg = function;
              break;
            default:
              break;
          }
        }

        const std::string &get_bot_username() const { return this->username; };
        const int &get_bot_id() const { return this->id; }

      private:
        void authorize();

        std::string client_id, token, username;

        std::string host;
        std::string port;

        const Configuration &configuration;

        int id;

        ix::WebSocket websocket;

        bool is_connected = false, started_up = false;
        std::vector<std::string> pool;

        std::vector<std::string> joined_channels;

        // Message handlers
        typename MessageHandler<MessageType::Privmsg>::fn onPrivmsg;
    };
  }
}
