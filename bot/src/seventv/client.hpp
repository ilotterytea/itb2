#pragma once

#include <optional>
#include <string>

#include "schemas.hpp"

namespace bot::seventv {
  class APIClient {
    public:
      APIClient() = default;
      ~APIClient() = default;

      std::optional<User> get_user_by_twitch_id(const int &alias_id) const;
      std::optional<User> get_user_by_emote_set_id(
          const std::string &emote_id) const;
      std::optional<User> get_user_by_id(const std::string &id) const;

    private:
      const std::string url = "https://7tv.io/v3";
  };
}
