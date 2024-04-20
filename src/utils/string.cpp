#include "string.hpp"

#include <sstream>
#include <string>
#include <vector>

namespace bot {
  namespace utils {
    namespace string {
      std::vector<std::string> split_text(const std::string &text,
                                          char delimiter) {
        std::vector<std::string> parts;

        std::istringstream iss(text);
        std::string part;

        while (std::getline(iss, part, delimiter)) {
          parts.push_back(part);
        }

        return parts;
      }

      std::string join_vector(const std::vector<std::string> &vec,
                              char delimiter) {
        std::string str;

        for (auto i = vec.begin(); i != vec.end() - 1; i++) {
          str += *i + delimiter;
        }

        str += vec[vec.size() - 1];

        return str;
      }

      std::string join_vector(const std::vector<std::string> &vec) {
        std::string str;

        for (const auto &e : vec) {
          str += e;
        }

        return str;
      }
    }
  }
}
