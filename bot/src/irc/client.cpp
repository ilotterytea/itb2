#include "client.hpp"

#include <ixwebsocket/IXWebSocketMessage.h>
#include <ixwebsocket/IXWebSocketMessageType.h>

#include <algorithm>
#include <optional>
#include <random>
#include <string>
#include <vector>

#include "../logger.hpp"
#include "message.hpp"

using namespace bot::irc;

void Client::run() {
  this->websocket.setOnMessageCallback([this](
                                           const ix::WebSocketMessagePtr &msg) {
    switch (msg->type) {
      case ix::WebSocketMessageType::Message: {
        log::debug("IRC", "Received message: " + msg->str);

        std::vector<std::string> lines =
            utils::string::split_text(msg->str, '\n');

        for (std::string &line : lines) {
          line.erase(
              std::remove_if(
                  line.begin(), line.end(),
                  [](char c) { return c == '\n' || c == '\r' || c == '\t'; }),
              line.end());

          std::optional<MessageType> type = define_message_type(line);

          if (!type.has_value()) {
            break;
          }

          MessageType m_type = type.value();

          if (m_type == MessageType::Privmsg) {
            std::optional<Message<MessageType::Privmsg>> message =
                parse_message<MessageType::Privmsg>(line);

            if (message.has_value()) {
              this->onPrivmsg(message.value());
            }
          } else if (m_type == MessageType::Ping) {
            // as the docs say, the message should be the same as the one
            // from the ping
            std::string response_text = msg->str.substr(4, msg->str.size());

            this->raw("PONG" + response_text);
          }
        }

        break;
      }
      case ix::WebSocketMessageType::Open: {
        log::info("IRC", "Connected to Twitch IRC");
        this->is_connected = true;
        this->authorize();

        if (!this->started_up &&
            this->configuration.fun.send_message_at_startup &&
            this->configuration.owner.name.has_value()) {
          this->started_up = true;
          std::vector<std::string> lines = utils::string::split_text(
              this->configuration.fun.startup_lines, ',');

          if (!lines.empty()) {
            std::random_device dev;
            std::mt19937 rng(dev());

            std::uniform_int_distribution<std::mt19937::result_type> dist(
                0, lines.size() - 1);

            this->say(this->configuration.owner.name.value(), lines[dist(rng)]);
          }
        }

        for (const auto &msg : this->pool) {
          this->websocket.send(msg);
        }
        this->pool.clear();
        break;
      }
      case ix::WebSocketMessageType::Close: {
        log::info("IRC", "Twitch IRC connection closed");
        this->is_connected = false;

        for (const auto &x : this->joined_channels) {
          this->raw("JOIN #" + x);
        }

        break;
      }
      default: {
        break;
      }
    }
  });

  this->websocket.start();
}

void Client::say(const std::string &channel_login, const std::string &message) {
  this->raw("PRIVMSG #" + channel_login + " :" + message);
  log::debug("IRC", "Sent '" + message + "' in #" + channel_login);
}

bool Client::join(const std::string &channel_login) {
  auto already_joined =
      std::any_of(this->joined_channels.begin(), this->joined_channels.end(),
                  [&](const auto &x) { return x == channel_login; });

  if (!already_joined) {
    this->raw("JOIN #" + channel_login);
    this->joined_channels.push_back(channel_login);
    log::info("IRC", "Joined #" + channel_login);
  }

  return !already_joined;
}

void Client::raw(const std::string &raw_message) {
  std::string msg = raw_message + "\r\n";
  if (this->is_connected) {
    this->websocket.send(msg);
  } else {
    this->pool.push_back(msg);
  }
}

void Client::authorize() {
  if (this->username.empty() || this->token.empty()) {
    log::error("IRC", "Bot username and token must be set for authorization!");
    return;
  }

  log::info("IRC", "Authorizing on Twitch IRC servers...");

  this->raw("PASS oauth:" + this->token);
  this->raw("NICK " + this->username);
  this->raw("CAP REQ :twitch.tv/membership");
  this->raw("CAP REQ :twitch.tv/commands");
  this->raw("CAP REQ :twitch.tv/tags");
}
