#include "config/AppConfig.h"

#include <cstdlib>
#include <fstream>
#include <limits>
#include <stdexcept>
#include <string_view>
#include <utility>

namespace confera::config {
namespace {

std::string trim(std::string_view value) {
    const auto start = value.find_first_not_of(" \t\r\n");
    if (start == std::string_view::npos) {
        return "";
    }

    const auto end = value.find_last_not_of(" \t\r\n");
    return std::string(value.substr(start, end - start + 1));
}

void setEnvIfMissing(const std::string& key, const std::string& value) {
    if (std::getenv(key.c_str()) != nullptr) {
        return;
    }

#ifdef _WIN32
    _putenv_s(key.c_str(), value.c_str());
#else
    setenv(key.c_str(), value.c_str(), 0);
#endif
}

void loadDotEnv(const std::string& path) {
    std::ifstream file(path);
    if (!file) {
        return;
    }

    std::string line;
    while (std::getline(file, line)) {
        const auto trimmed = trim(line);
        if (trimmed.empty() || trimmed.starts_with('#')) {
            continue;
        }

        const auto equals = trimmed.find('=');
        if (equals == std::string::npos) {
            continue;
        }

        const auto key = trim(std::string_view(trimmed).substr(0, equals));
        const auto value = trim(std::string_view(trimmed).substr(equals + 1));
        if (!key.empty()) {
            setEnvIfMissing(key, value);
        }
    }
}

std::string readEnv(const char* key, std::string fallback = "") {
    const char* value = std::getenv(key);
    return value == nullptr ? std::move(fallback) : std::string(value);
}

std::uint16_t readPort() {
    const auto value = readEnv("CONFERA_PORT", "8080");
    const auto port = std::stoul(value);

    if (port == 0 || port > std::numeric_limits<std::uint16_t>::max()) {
        throw std::runtime_error("CONFERA_PORT must be between 1 and 65535");
    }

    return static_cast<std::uint16_t>(port);
}

} // namespace

AppConfig AppConfig::fromEnvironment() {
    loadDotEnv(".env");

    AppConfig config;
    config.host = readEnv("CONFERA_HOST", config.host);
    config.port = readPort();
    config.databaseUrl = readEnv("DATABASE_URL");
    return config;
}

} // namespace confera::config
