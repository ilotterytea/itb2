#pragma once

#include <sstream>
#include <string>
#include <vector>

namespace bot {
  namespace utils {
    namespace string {
      std::vector<std::string> split_text(const std::string &text,
                                          char delimiter);
      std::string join_vector(const std::vector<std::string> &vec,
                              char delimiter);
      std::string join_vector(const std::vector<std::string> &vec);

      template <typename T>
      std::string str(T begin, T end, char delimiter) {
        std::stringstream ss;
        bool first = true;

        for (; begin != end; begin++) {
          if (!first) ss << delimiter;
          ss << *begin;
          first = false;
        }
        return ss.str();
      }
    }
  }
}
