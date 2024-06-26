#pragma once

#include <chrono>
#include <optional>
#include <pqxx/pqxx>
#include <string>

#include "../utils/chrono.hpp"

namespace bot::schemas {
  class User {
    public:
      User(const pqxx::row &row) {
        this->id = row[0].as<int>();
        this->alias_id = row[1].as<int>();
        this->alias_name = row[2].as<std::string>();

        this->joined_at =
            utils::chrono::string_to_time_point(row[3].as<std::string>());

        if (!row[4].is_null()) {
          this->opted_out_at =
              utils::chrono::string_to_time_point(row[4].as<std::string>());
        }
      }

      ~User() = default;

      const int &get_id() const { return this->id; }
      const int &get_alias_id() const { return this->alias_id; }
      const std::string &get_alias_name() const { return this->alias_name; }
      void set_alias_name(const std::string &alias_name) {
        this->alias_name = alias_name;
      }
      const std::chrono::system_clock::time_point &get_joined_at() const {
        return this->joined_at;
      }
      const std::optional<std::chrono::system_clock::time_point> &
      get_opted_out_at() const {
        return this->opted_out_at;
      }

    private:
      int id, alias_id;
      std::string alias_name;
      std::chrono::system_clock::time_point joined_at;
      std::optional<std::chrono::system_clock::time_point> opted_out_at;
  };

  enum PermissionLevel { SUSPENDED, USER, VIP, MODERATOR, BROADCASTER };

  class UserRights {
    public:
      UserRights(const pqxx::row &row) {
        this->id = row[0].as<int>();
        this->user_id = row[1].as<int>();
        this->channel_id = row[2].as<int>();
        this->level = static_cast<PermissionLevel>(row[3].as<int>());
      }

      ~UserRights() = default;

      const int &get_id() const { return this->id; }
      const int &get_user_id() const { return this->user_id; }
      const int &get_channel_id() const { return this->channel_id; }
      const PermissionLevel &get_level() const { return this->level; }
      void set_level(PermissionLevel level) { this->level = level; }

    private:
      int id, user_id, channel_id;
      PermissionLevel level;
  };
}
