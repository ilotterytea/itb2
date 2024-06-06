#pragma once

#include <string>

namespace bot::seventv {
  struct User {
      std::string id, emote_set_id;
      int alias_id;
  };
}
