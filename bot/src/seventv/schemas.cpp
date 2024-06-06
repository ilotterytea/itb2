#include "schemas.hpp"

#include <optional>

#include "nlohmann/json.hpp"

namespace bot::seventv {
  // this shit runs on honesty
  std::optional<Payload<PayloadData<DispatchData>>> parse_dispatch_message(
      const std::string &msg) {
    nlohmann::json j = nlohmann::json::parse(msg);
    int op = j["op"];

    if (op != 0) {
      return std::nullopt;
    }

    Payload<PayloadData<DispatchData>> payload;
    payload.op = op;

    auto j_data = j["d"];

    PayloadData<DispatchData> payload_data;
    payload_data.type = j_data["type"];

    auto d_data = j_data["body"];
    DispatchData data;

    data.id = d_data["id"];

    // parsing actor name
    for (const auto &connection : d_data["actor"]["connections"]) {
      if (connection["platform"] == "TWITCH") {
        data.actor_name = connection["username"];
        break;
      }
    }

    // parsing new emotes
    if (!d_data["pushed"].is_null()) {
      for (const auto &pushed : d_data["pushed"]) {
        auto value = pushed["value"];
        data.pushed.push_back(value["name"]);
      }
    }

    // parsing deleted emotes
    if (!d_data["pulled"].is_null()) {
      for (const auto &pulled : d_data["pulled"]) {
        auto value = pulled["old_value"];
        data.pulled.push_back(value["name"]);
      }
    }

    // parsing updated emotes
    if (!d_data["updated"].is_null()) {
      for (const auto &updated : d_data["updated"]) {
        auto old_value = updated["old_value"];
        auto value = updated["value"];

        data.updated.push_back({old_value["name"], value["name"]});
      }
    }

    payload_data.condition = data;
    payload.d = payload_data;

    return payload;
  }
}
