#include "client.hpp"

#include <optional>
#include <string>

#include "cpr/api.h"
#include "cpr/response.h"
#include "nlohmann/json.hpp"
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
}
