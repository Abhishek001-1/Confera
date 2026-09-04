#include "websocket/SignalingController.h"

#include <sstream>
#include <vector>

namespace confera::websocket {
namespace {

bool hasText(const Json::Value& value, const char* key) {
    return value.isMember(key) && value[key].isString() && !value[key].asString().empty();
}

Json::Value eventMessage(const std::string& type, const std::string& roomId, const std::string& userId) {
    Json::Value event;
    event["type"] = type;
    event["roomId"] = roomId;
    event["userId"] = userId;
    return event;
}

} // namespace

void SignalingController::handleNewConnection(
    const drogon::HttpRequestPtr&,
    const drogon::WebSocketConnectionPtr&) {}

void SignalingController::handleConnectionClosed(const drogon::WebSocketConnectionPtr& connection) {
    leaveRoom(connection);
}

void SignalingController::handleNewMessage(
    const drogon::WebSocketConnectionPtr& connection,
    std::string&& rawMessage,
    const drogon::WebSocketMessageType& type) {
    if (type != drogon::WebSocketMessageType::Text) {
        sendError(connection, "Only JSON text messages are supported.");
        return;
    }

    Json::Value message;
    Json::CharReaderBuilder builder;
    std::string error;
    std::istringstream messageStream(rawMessage);

    if (!Json::parseFromStream(builder, messageStream, &message, &error)) {
        sendError(connection, "Invalid JSON message.");
        return;
    }

    if (!hasText(message, "type")) {
        sendError(connection, "Message must include a string type.");
        return;
    }

    const auto messageType = message["type"].asString();

    if (messageType == "join-room") {
        joinRoom(connection, message);
        return;
    }

    if (messageType == "leave-room") {
        leaveRoom(connection);
        return;
    }

    if (messageType == "offer" || messageType == "answer" || messageType == "ice-candidate") {
        forwardToTarget(message);
        return;
    }

    if (messageType == "chat" || messageType == "reaction" || messageType == "raise-hand") {
        broadcastToRoom(message);
        return;
    }

    sendError(connection, "Unsupported message type.");
}

void SignalingController::joinRoom(
    const drogon::WebSocketConnectionPtr& connection,
    const Json::Value& message) {
    if (!hasText(message, "roomId") || !hasText(message, "userId")) {
        sendError(connection, "join-room requires roomId and userId.");
        return;
    }

    const auto roomId = message["roomId"].asString();
    const auto userId = message["userId"].asString();

    {
        std::scoped_lock lock(mutex_);
        rooms_[roomId][userId] = connection;
        sessions_[connection.get()] = Session{roomId, userId};
    }

    broadcastToRoom(eventMessage("participant-joined", roomId, userId));
}

void SignalingController::leaveRoom(const drogon::WebSocketConnectionPtr& connection) {
    Session session;
    bool hadSession = false;

    {
        std::scoped_lock lock(mutex_);
        const auto sessionIt = sessions_.find(connection.get());
        if (sessionIt == sessions_.end()) {
            return;
        }

        session = sessionIt->second;
        sessions_.erase(sessionIt);

        auto roomIt = rooms_.find(session.roomId);
        if (roomIt != rooms_.end()) {
            roomIt->second.erase(session.userId);
            if (roomIt->second.empty()) {
                rooms_.erase(roomIt);
            }
        }

        hadSession = true;
    }

    if (hadSession) {
        broadcastToRoom(eventMessage("participant-left", session.roomId, session.userId));
    }
}

void SignalingController::forwardToTarget(const Json::Value& message) {
    if (!hasText(message, "roomId") || !hasText(message, "target")) {
        return;
    }

    drogon::WebSocketConnectionPtr targetConnection;
    {
        std::scoped_lock lock(mutex_);
        const auto roomIt = rooms_.find(message["roomId"].asString());
        if (roomIt == rooms_.end()) {
            return;
        }

        const auto targetIt = roomIt->second.find(message["target"].asString());
        if (targetIt == roomIt->second.end()) {
            return;
        }

        targetConnection = targetIt->second;
    }

    targetConnection->send(message.toStyledString());
}

void SignalingController::broadcastToRoom(const Json::Value& message) {
    if (!hasText(message, "roomId")) {
        return;
    }

    std::vector<drogon::WebSocketConnectionPtr> connections;
    {
        std::scoped_lock lock(mutex_);
        const auto roomIt = rooms_.find(message["roomId"].asString());
        if (roomIt == rooms_.end()) {
            return;
        }

        for (const auto& [_, connection] : roomIt->second) {
            connections.push_back(connection);
        }
    }

    const auto payload = message.toStyledString();
    for (const auto& connection : connections) {
        connection->send(payload);
    }
}

void SignalingController::sendError(
    const drogon::WebSocketConnectionPtr& connection,
    const std::string& detail) {
    Json::Value error;
    error["type"] = "error";
    error["detail"] = detail;
    connection->send(error.toStyledString());
}

} // namespace confera::websocket
