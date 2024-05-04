#pragma once

#include <memory>
#include <optional>
#include <string>
#include <variant>
#include <vector>

#include "../bundle.hpp"
#include "request.hpp"

namespace bot {
  namespace command {
    enum CommandArgument {
      SUBCOMMAND,
      MESSAGE,
      INTERVAL,
      NAME,
      TARGET,
      VALUE,
      AMOUNT,
    };

    class Command {
      public:
        virtual std::string get_name() const = 0;
        virtual std::variant<std::vector<std::string>, std::string> run(
            const InstanceBundle &bundle, const Request &request) const = 0;
        virtual schemas::PermissionLevel get_permission_level() const {
          return schemas::PermissionLevel::USER;
        }
        virtual int get_delay_seconds() const { return 5; }
        virtual std::vector<std::string> get_subcommand_ids() const {
          return {};
        }
    };

    class CommandLoader {
      public:
        CommandLoader();
        ~CommandLoader() = default;

        void add_command(std::unique_ptr<Command> cmd);
        std::optional<std::variant<std::vector<std::string>, std::string>> run(
            const InstanceBundle &bundle, const Request &msg) const;

        const std::vector<std::unique_ptr<Command>> &get_commands() const {
          return this->commands;
        };

      private:
        std::vector<std::unique_ptr<Command>> commands;
    };
  }
}
