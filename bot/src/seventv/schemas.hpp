#pragma once

#include <optional>
#include <string>
#include <utility>
#include <vector>

namespace bot::seventv {
  struct User {
      std::string id, emote_set_id;
      int alias_id;
  };

  template <typename T>
  struct PayloadData {
      std::string type;
      T condition;
  };

  template <typename T>
  struct Payload {
      int op;
      T d;
  };

  struct DispatchData {
      std::string id, actor_name;
      std::vector<std::string> pushed = {}, pulled = {};
      std::vector<std::pair<std::string, std::string>> updated = {};
  };

  std::optional<Payload<PayloadData<DispatchData>>> parse_dispatch_message(
      const std::string &msg);
}
