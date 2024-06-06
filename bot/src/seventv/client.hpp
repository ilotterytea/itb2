#pragma once

#include <optional>
#include <string>

#include "../api/twitch/helix_client.hpp"
#include "../config.hpp"
#include "../irc/client.hpp"
#include "../localization/localization.hpp"
#include "ixwebsocket/IXWebSocket.h"
#include "ixwebsocket/IXWebSocketMessage.h"
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

  class Client {
    public:
      Client(const api::twitch::HelixClient &helix_client,
             irc::Client &irc_client, const Configuration &configuration,
             const loc::Localization &localization)
          : helix_client(helix_client),
            irc_client(irc_client),
            configuration(configuration),
            localization(localization),
            api_client({}),
            conn(GET_DATABASE_CONNECTION_URL(configuration)) {
        this->ws.setUrl("wss://events.7tv.io/v3");
      }

      void run();

    private:
      void process_message(const ix::WebSocketMessagePtr &msg);
      void process_event_message();
      void process_emote_event();

      const api::twitch::HelixClient &helix_client;
      irc::Client &irc_client;
      const Configuration &configuration;
      const loc::Localization &localization;
      const APIClient api_client;

      ix::WebSocket ws;

      pqxx::connection conn;
  };
}
