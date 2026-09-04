#pragma once

#include <cstdint>
#include <string>

namespace confera::config {

struct AppConfig {
    std::string host = "0.0.0.0";
    std::uint16_t port = 8080;
    std::string databaseUrl;

    static AppConfig fromEnvironment();
};

} // namespace confera::config
