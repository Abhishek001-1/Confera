#pragma once

#include <json/json.h>

#include <mutex>
#include <optional>
#include <string>
#include <unordered_map>
#include <utility>
#include <vector>

namespace confera::core {

class AppStore {
public:
    static AppStore& instance();

    std::pair<bool, Json::Value> registerUser(const Json::Value& input);
    std::pair<bool, Json::Value> login(const Json::Value& input);
    bool logout(const std::string& token);
    std::optional<std::string> userIdForToken(const std::string& token) const;
    std::optional<Json::Value> currentUser(const std::string& userId) const;
    std::optional<Json::Value> updateUser(const std::string& userId, const Json::Value& input);
    bool deleteUser(const std::string& userId);

    std::pair<bool, Json::Value> createMeeting(const std::string& userId, const Json::Value& input);
    Json::Value listMeetings(const std::string& userId) const;
    std::optional<Json::Value> getMeeting(const std::string& meetingId) const;
    std::pair<bool, Json::Value> updateMeeting(const std::string& userId, const std::string& meetingId, const Json::Value& input);
    bool deleteMeeting(const std::string& userId, const std::string& meetingId);

    std::pair<bool, Json::Value> joinMeeting(const std::string& userId, const std::string& meetingId);
    bool leaveMeeting(const std::string& userId, const std::string& meetingId);
    Json::Value listParticipants(const std::string& meetingId) const;
    bool removeParticipant(const std::string& meetingId, const std::string& userId);
    std::optional<Json::Value> updateParticipant(const std::string& meetingId, const std::string& userId, const Json::Value& input);

    Json::Value listMessages(const std::string& meetingId) const;
    std::pair<bool, Json::Value> createMessage(const std::string& userId, const std::string& meetingId, const Json::Value& input);

private:
    struct User {
        std::string id;
        std::string name;
        std::string email;
        std::string passwordHash;
        std::string avatarUrl;
        std::string createdAt;
        std::string updatedAt;
    };

    struct Meeting {
        std::string id;
        std::string roomId;
        std::string hostId;
        std::string title;
        std::string startTime;
        std::string endTime;
        std::string passwordHash;
        std::string status;
        std::string createdAt;
    };

    struct Participant {
        std::string meetingId;
        std::string userId;
        std::string role;
        std::string joinedAt;
        std::string leftAt;
        bool muted = false;
        bool cameraEnabled = true;
        bool handRaised = false;
    };

    struct Message {
        std::string id;
        std::string meetingId;
        std::string userId;
        std::string body;
        std::string type;
        std::string createdAt;
    };

    static Json::Value userJson(const User& user);
    static Json::Value meetingJson(const Meeting& meeting);
    static Json::Value participantJson(const Participant& participant);
    static Json::Value messageJson(const Message& message);

    std::string createToken();
    static std::string createId(const std::string& prefix);
    static std::string createRoomId();
    static std::string hashPassword(const std::string& password);
    static std::string now();

    mutable std::mutex mutex_;
    std::unordered_map<std::string, User> users_;
    std::unordered_map<std::string, std::string> userIdsByEmail_;
    std::unordered_map<std::string, std::string> userIdsByToken_;
    std::unordered_map<std::string, Meeting> meetings_;
    std::unordered_map<std::string, std::vector<Participant>> participantsByMeeting_;
    std::unordered_map<std::string, std::vector<Message>> messagesByMeeting_;
};

} // namespace confera::core
