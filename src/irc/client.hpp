#pragma once

#include <ixwebsocket/IXWebSocket.h>

#include <string>

namespace RedpilledBot {
  namespace IRC {
    class Client {
      public:
        Client(std::string username, std::string password);
        ~Client() = default;

      private:
        std::string username;
        std::string password;

        ix::WebSocket websocket;
    };
  }
}
