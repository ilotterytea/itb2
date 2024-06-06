#include "client.hpp"

#include <optional>
#include <string>

#include "../logger.hpp"
#include "cpr/api.h"
#include "cpr/response.h"
#include "ixwebsocket/IXWebSocketMessage.h"
#include "ixwebsocket/IXWebSocketMessageType.h"
#include "nlohmann/json.hpp"
#include "pqxx/pqxx"
#include "schemas.hpp"

namespace bot::seventv {
  std::optional<User> APIClient::get_user_by_twitch_id(
      const int &alias_id) const {
    cpr::Response response = cpr::Get(
        cpr::Url{this->url + "/users/twitch/" + std::to_string(alias_id)});

    if (response.status_code != 200) {
      return std::nullopt;
    }

    User user;
    nlohmann::json j = nlohmann::json::parse(response.text);
    user.id = j["user"]["id"];

    for (const auto &connection : j["user"]["connections"]) {
      if (connection["platform"] == "TWITCH") {
        user.alias_id = std::stoi((std::string)connection["id"]);
        user.emote_set_id = connection["emote_set"]["id"];
        break;
      }
    }

    if (user.emote_set_id.empty()) {
      return std::nullopt;
    }

    return user;
  }

  std::optional<User> APIClient::get_user_by_emote_set_id(
      const std::string &emote_set_id) const {
    cpr::Response response =
        cpr::Get(cpr::Url{this->url + "/emote-sets/" + emote_set_id});

    if (response.status_code != 200) {
      return std::nullopt;
    }

    nlohmann::json j = nlohmann::json::parse(response.text);

    return this->get_user_by_id(j["owner"]["id"]);
  }

  std::optional<User> APIClient::get_user_by_id(const std::string &id) const {
    cpr::Response response = cpr::Get(cpr::Url{this->url + "/users/" + id});

    if (response.status_code != 200) {
      return std::nullopt;
    }

    User user;
    nlohmann::json j = nlohmann::json::parse(response.text);
    user.id = j["id"];

    for (const auto &connection : j["connections"]) {
      if (connection["platform"] == "TWITCH") {
        user.alias_id = std::stoi((std::string)connection["id"]);
        user.emote_set_id = connection["emote_set"]["id"];
        break;
      }
    }

    if (user.emote_set_id.empty()) {
      return std::nullopt;
    }

    return user;
  }

  void Client::run() {
    this->ws.setOnMessageCallback([this](const ix::WebSocketMessagePtr &msg) {
      log::debug("7TV EventAPI", "Received message from 7TV: " + msg->str);

      switch (msg->type) {
        case ix::WebSocketMessageType::Open: {
          log::info("7TV EventAPI", "Connection open!");
          pqxx::work work(this->conn);
          pqxx::result channels = work.exec(
              "SELECT alias_id FROM channels WHERE opted_out_at is null");

          for (const auto &c : channels) {
            int id = c[0].as<int>();
            std::optional<User> user =
                this->api_client.get_user_by_twitch_id(id);

            if (!user.has_value()) {
              continue;
            }

            this->ws.send(
                "{\"op\": 35, \"d\": {\"type\": "
                "\"emote_set.update\",\"condition\": "
                "{\"object_id\": \"" +
                user->emote_set_id + "\"}}}");

            log::info("7TV EventAPI",
                      "Listening emote set updates for alias ID " +
                          std::to_string(id));
          }

          work.commit();
          break;
        }
        case ix::WebSocketMessageType::Close: {
          log::info("7TV EventAPI", "Connection closed!");
          break;
        }
        case ix::WebSocketMessageType::Message: {
          this->process_message(msg);
          break;
        }
        default:
          break;
      }
    });

    this->ws.start();
  }

  void Client::process_message(const ix::WebSocketMessagePtr &msg) {
    auto x = parse_dispatch_message(msg->str);
    if (!x.has_value()) {
      return;
    }

    std::optional<User> user =
        this->api_client.get_user_by_emote_set_id(x->d.condition.id);

    if (!user.has_value()) {
      return;
    }

    pqxx::work work(this->conn);

    pqxx::result channels =
        work.exec("SELECT id, alias_name FROM channels WHERE alias_id = " +
                  std::to_string(user->alias_id));

    if (channels.empty()) {
      work.commit();
      return;
    }

    std::string locale = DEFAULT_LOCALE_ID;

    pqxx::result prefs =
        work.exec("SELECT locale FROM channel_preferences WHERE channel_id = " +
                  std::to_string(channels[0][0].as<int>()));

    if (!prefs.empty()) {
      locale = prefs[0][0].as<std::string>();
    }

    std::string channel_name = channels[0][1].as<std::string>();

    for (const auto &y : x->d.condition.pushed) {
      this->irc_client.say(
          channel_name,
          this->localization
              .get_formatted_line(locale, loc::LineId::EmotePushed,
                                  {x->d.condition.actor_name, y})
              .value());
    }

    for (const auto &y : x->d.condition.pulled) {
      this->irc_client.say(
          channel_name,
          this->localization
              .get_formatted_line(locale, loc::LineId::EmotePulled,
                                  {x->d.condition.actor_name, y})
              .value());
    }

    for (const auto &y : x->d.condition.updated) {
      this->irc_client.say(
          channel_name, this->localization
                            .get_formatted_line(
                                locale, loc::LineId::EmoteUpdated,
                                {x->d.condition.actor_name, y.first, y.second})
                            .value());
    }

    work.commit();
  }
}
