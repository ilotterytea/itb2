#pragma once

#include "irc/client.hpp"
#include "localization/localization.hpp"

namespace bot {
  struct InstanceBundle {
      const irc::Client &irc_client;
      const bot::loc::Localization &localization;
  };
}
