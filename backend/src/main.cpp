#include "config/AppConfig.h"

#include <drogon/drogon.h>

#include <exception>
#include <iostream>

int main() {
    try {
        const auto config = confera::config::AppConfig::fromEnvironment();

        drogon::app()
            .addListener(config.host, config.port)
            .setLogLevel(trantor::Logger::kInfo);

        std::cout << "Confera backend listening on " << config.host << ':' << config.port << '\n';
        if (config.databaseUrl.empty()) {
            std::cout << "DATABASE_URL is not set; database features are disabled for now.\n";
        }

        drogon::app().run();
        return 0;
    } catch (const std::exception& error) {
        std::cerr << "Failed to start Confera backend: " << error.what() << '\n';
        return 1;
    }
}
