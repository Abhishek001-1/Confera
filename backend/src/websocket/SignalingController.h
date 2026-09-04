#pragma once

#include <drogon/WebSocketController.h>
#include <json/json.h>

#include <mutex>
#include <string>
#include <unordered_map>

namespace confera::websocket {

class SignalingController final : public drogon::WebSocketController<SignalingController> {
public:
    WS_PATH_LIST_BEGIN
    WS_PATH_ADD("/ws");
    WS_PATH_LIST_END

    void handleNewMessage(
        const drogon::WebSocketConnectionPtr& connection,
        std::string&& message,
        const drogon::WebSocketMessageType& type) override;

    void handleNewConnection(
        const drogon::HttpRequestPtr& request,
        const drogon::WebSocketConnectionPtr& connection) override;

    void handleConnectionClosed(
        const drogon::WebSocketConnectionPtr& connection) override;

private:
    struct Session {
        std::string roomId;
        std::string userId;
    };

    static void joinRoom(
        const drogon::WebSocketConnectionPtr& connection,
        const Json::Value& message);

    static void leaveRoom(const drogon::WebSocketConnectionPtr& connection);
    static void forwardToTarget(const Json::Value& message);
    static void broadcastToRoom(const Json::Value& message);
    static void sendError(const drogon::WebSocketConnectionPtr& connection, const std::string& detail);

    static inline std::mutex mutex_;
    static inline std::unordered_map<std::string, std::unordered_map<std::string, drogon::WebSocketConnectionPtr>> rooms_;
    static inline std::unordered_map<const drogon::WebSocketConnection*, Session> sessions_;
};

} // namespace confera::websocket
