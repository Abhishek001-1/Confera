#include "core/AppStore.h"

#include <algorithm>
#include <chrono>
#include <functional>
#include <iomanip>
#include <random>
#include <sstream>

namespace confera::core {
namespace {

bool hasText(const Json::Value& value, const char* key) {
    return value.isMember(key) && value[key].isString() && !value[key].asString().empty();
}

std::string optionalText(const Json::Value& value, const char* key, const std::string& fallback = "") {
    return hasText(value, key) ? value[key].asString() : fallback;
}

} // namespace

AppStore& AppStore::instance() {
    static AppStore store;
    return store;
}

std::pair<bool, Json::Value> AppStore::registerUser(const Json::Value& input) {
    if (!hasText(input, "name") || !hasText(input, "email") || !hasText(input, "password")) {
        Json::Value error;
        error["message"] = "name, email and password are required";
        return {false, error};
    }

    std::scoped_lock lock(mutex_);
    const auto email = input["email"].asString();
    if (userIdsByEmail_.contains(email)) {
        Json::Value error;
        error["message"] = "email is already registered";
        return {false, error};
    }

    User user;
    user.id = createId("usr");
    user.name = input["name"].asString();
    user.email = email;
    user.passwordHash = hashPassword(input["password"].asString());
    user.avatarUrl = optionalText(input, "avatarUrl");
    user.createdAt = now();
    user.updatedAt = user.createdAt;

    users_[user.id] = user;
    userIdsByEmail_[user.email] = user.id;

    const auto token = createToken();
    userIdsByToken_[token] = user.id;

    Json::Value result;
    result["user"] = userJson(user);
    result["accessToken"] = token;
    result["refreshToken"] = token;
    return {true, result};
}

std::pair<bool, Json::Value> AppStore::login(const Json::Value& input) {
    if (!hasText(input, "email") || !hasText(input, "password")) {
        Json::Value error;
        error["message"] = "email and password are required";
        return {false, error};
    }

    std::scoped_lock lock(mutex_);
    const auto emailIt = userIdsByEmail_.find(input["email"].asString());
    if (emailIt == userIdsByEmail_.end()) {
        Json::Value error;
        error["message"] = "invalid email or password";
        return {false, error};
    }

    const auto& user = users_.at(emailIt->second);
    if (user.passwordHash != hashPassword(input["password"].asString())) {
        Json::Value error;
        error["message"] = "invalid email or password";
        return {false, error};
    }

    const auto token = createToken();
    userIdsByToken_[token] = user.id;

    Json::Value result;
    result["user"] = userJson(user);
    result["accessToken"] = token;
    result["refreshToken"] = token;
    return {true, result};
}

bool AppStore::logout(const std::string& token) {
    std::scoped_lock lock(mutex_);
    return userIdsByToken_.erase(token) > 0;
}

std::optional<std::string> AppStore::userIdForToken(const std::string& token) const {
    std::scoped_lock lock(mutex_);
    const auto tokenIt = userIdsByToken_.find(token);
    if (tokenIt == userIdsByToken_.end()) {
        return std::nullopt;
    }
    return tokenIt->second;
}

std::optional<Json::Value> AppStore::currentUser(const std::string& userId) const {
    std::scoped_lock lock(mutex_);
    const auto userIt = users_.find(userId);
    if (userIt == users_.end()) {
        return std::nullopt;
    }
    return userJson(userIt->second);
}

std::optional<Json::Value> AppStore::updateUser(const std::string& userId, const Json::Value& input) {
    std::scoped_lock lock(mutex_);
    auto userIt = users_.find(userId);
    if (userIt == users_.end()) {
        return std::nullopt;
    }

    auto& user = userIt->second;
    user.name = optionalText(input, "name", user.name);
    user.avatarUrl = optionalText(input, "avatarUrl", user.avatarUrl);
    user.updatedAt = now();
    return userJson(user);
}

bool AppStore::deleteUser(const std::string& userId) {
    std::scoped_lock lock(mutex_);
    const auto userIt = users_.find(userId);
    if (userIt == users_.end()) {
        return false;
    }

    userIdsByEmail_.erase(userIt->second.email);
    users_.erase(userIt);
    return true;
}

std::pair<bool, Json::Value> AppStore::createMeeting(const std::string& userId, const Json::Value& input) {
    if (!hasText(input, "title")) {
        Json::Value error;
        error["message"] = "title is required";
        return {false, error};
    }

    std::scoped_lock lock(mutex_);
    Meeting meeting;
    meeting.id = createId("mtg");
    meeting.roomId = optionalText(input, "roomId", createRoomId());
    meeting.hostId = userId;
    meeting.title = input["title"].asString();
    meeting.startTime = optionalText(input, "startTime");
    meeting.endTime = optionalText(input, "endTime");
    meeting.passwordHash = hasText(input, "password") ? hashPassword(input["password"].asString()) : "";
    meeting.status = optionalText(input, "status", "scheduled");
    meeting.createdAt = now();

    meetings_[meeting.id] = meeting;

    Participant host;
    host.meetingId = meeting.id;
    host.userId = userId;
    host.role = "host";
    host.joinedAt = meeting.createdAt;
    participantsByMeeting_[meeting.id].push_back(host);

    return {true, meetingJson(meeting)};
}

Json::Value AppStore::listMeetings(const std::string& userId) const {
    std::scoped_lock lock(mutex_);
    Json::Value meetings(Json::arrayValue);
    for (const auto& [_, meeting] : meetings_) {
        if (meeting.hostId == userId) {
            meetings.append(meetingJson(meeting));
        }
    }
    return meetings;
}

std::optional<Json::Value> AppStore::getMeeting(const std::string& meetingId) const {
    std::scoped_lock lock(mutex_);
    const auto meetingIt = meetings_.find(meetingId);
    if (meetingIt == meetings_.end()) {
        return std::nullopt;
    }
    return meetingJson(meetingIt->second);
}

std::pair<bool, Json::Value> AppStore::updateMeeting(const std::string& userId, const std::string& meetingId, const Json::Value& input) {
    std::scoped_lock lock(mutex_);
    auto meetingIt = meetings_.find(meetingId);
    if (meetingIt == meetings_.end()) {
        Json::Value error;
        error["message"] = "meeting not found";
        return {false, error};
    }
    if (meetingIt->second.hostId != userId) {
        Json::Value error;
        error["message"] = "only the host can update this meeting";
        return {false, error};
    }

    auto& meeting = meetingIt->second;
    meeting.title = optionalText(input, "title", meeting.title);
    meeting.startTime = optionalText(input, "startTime", meeting.startTime);
    meeting.endTime = optionalText(input, "endTime", meeting.endTime);
    meeting.status = optionalText(input, "status", meeting.status);
    return {true, meetingJson(meeting)};
}

bool AppStore::deleteMeeting(const std::string& userId, const std::string& meetingId) {
    std::scoped_lock lock(mutex_);
    const auto meetingIt = meetings_.find(meetingId);
    if (meetingIt == meetings_.end() || meetingIt->second.hostId != userId) {
        return false;
    }

    meetings_.erase(meetingIt);
    participantsByMeeting_.erase(meetingId);
    messagesByMeeting_.erase(meetingId);
    return true;
}

std::pair<bool, Json::Value> AppStore::joinMeeting(const std::string& userId, const std::string& meetingId) {
    std::scoped_lock lock(mutex_);
    if (!meetings_.contains(meetingId)) {
        Json::Value error;
        error["message"] = "meeting not found";
        return {false, error};
    }

    for (auto& participant : participantsByMeeting_[meetingId]) {
        if (participant.userId == userId) {
            participant.leftAt = "";
            return {true, participantJson(participant)};
        }
    }

    Participant participant;
    participant.meetingId = meetingId;
    participant.userId = userId;
    participant.role = "participant";
    participant.joinedAt = now();
    participantsByMeeting_[meetingId].push_back(participant);
    return {true, participantJson(participant)};
}

bool AppStore::leaveMeeting(const std::string& userId, const std::string& meetingId) {
    std::scoped_lock lock(mutex_);
    for (auto& participant : participantsByMeeting_[meetingId]) {
        if (participant.userId == userId && participant.leftAt.empty()) {
            participant.leftAt = now();
            return true;
        }
    }
    return false;
}

Json::Value AppStore::listParticipants(const std::string& meetingId) const {
    std::scoped_lock lock(mutex_);
    Json::Value participants(Json::arrayValue);
    const auto participantsIt = participantsByMeeting_.find(meetingId);
    if (participantsIt == participantsByMeeting_.end()) {
        return participants;
    }

    for (const auto& participant : participantsIt->second) {
        participants.append(participantJson(participant));
    }
    return participants;
}

bool AppStore::removeParticipant(const std::string& meetingId, const std::string& userId) {
    std::scoped_lock lock(mutex_);
    auto& participants = participantsByMeeting_[meetingId];
    const auto oldSize = participants.size();
    std::erase_if(participants, [&](const Participant& participant) {
        return participant.userId == userId;
    });
    return participants.size() != oldSize;
}

std::optional<Json::Value> AppStore::updateParticipant(const std::string& meetingId, const std::string& userId, const Json::Value& input) {
    std::scoped_lock lock(mutex_);
    for (auto& participant : participantsByMeeting_[meetingId]) {
        if (participant.userId == userId) {
            participant.role = optionalText(input, "role", participant.role);
            if (input.isMember("muted")) {
                participant.muted = input["muted"].asBool();
            }
            if (input.isMember("cameraEnabled")) {
                participant.cameraEnabled = input["cameraEnabled"].asBool();
            }
            if (input.isMember("handRaised")) {
                participant.handRaised = input["handRaised"].asBool();
            }
            return participantJson(participant);
        }
    }
    return std::nullopt;
}

Json::Value AppStore::listMessages(const std::string& meetingId) const {
    std::scoped_lock lock(mutex_);
    Json::Value messages(Json::arrayValue);
    const auto messagesIt = messagesByMeeting_.find(meetingId);
    if (messagesIt == messagesByMeeting_.end()) {
        return messages;
    }

    for (const auto& message : messagesIt->second) {
        messages.append(messageJson(message));
    }
    return messages;
}

std::pair<bool, Json::Value> AppStore::createMessage(const std::string& userId, const std::string& meetingId, const Json::Value& input) {
    if (!hasText(input, "message")) {
        Json::Value error;
        error["message"] = "message is required";
        return {false, error};
    }

    std::scoped_lock lock(mutex_);
    if (!meetings_.contains(meetingId)) {
        Json::Value error;
        error["message"] = "meeting not found";
        return {false, error};
    }

    Message message;
    message.id = createId("msg");
    message.meetingId = meetingId;
    message.userId = userId;
    message.body = input["message"].asString();
    message.type = optionalText(input, "type", "text");
    message.createdAt = now();
    messagesByMeeting_[meetingId].push_back(message);
    return {true, messageJson(message)};
}

Json::Value AppStore::userJson(const User& user) {
    Json::Value json;
    json["id"] = user.id;
    json["name"] = user.name;
    json["email"] = user.email;
    json["avatarUrl"] = user.avatarUrl;
    json["createdAt"] = user.createdAt;
    json["updatedAt"] = user.updatedAt;
    return json;
}

Json::Value AppStore::meetingJson(const Meeting& meeting) {
    Json::Value json;
    json["id"] = meeting.id;
    json["roomId"] = meeting.roomId;
    json["hostId"] = meeting.hostId;
    json["title"] = meeting.title;
    json["startTime"] = meeting.startTime;
    json["endTime"] = meeting.endTime;
    json["status"] = meeting.status;
    json["createdAt"] = meeting.createdAt;
    return json;
}

Json::Value AppStore::participantJson(const Participant& participant) {
    Json::Value json;
    json["meetingId"] = participant.meetingId;
    json["userId"] = participant.userId;
    json["role"] = participant.role;
    json["joinedAt"] = participant.joinedAt;
    json["leftAt"] = participant.leftAt;
    json["muted"] = participant.muted;
    json["cameraEnabled"] = participant.cameraEnabled;
    json["handRaised"] = participant.handRaised;
    return json;
}

Json::Value AppStore::messageJson(const Message& message) {
    Json::Value json;
    json["id"] = message.id;
    json["meetingId"] = message.meetingId;
    json["userId"] = message.userId;
    json["message"] = message.body;
    json["type"] = message.type;
    json["createdAt"] = message.createdAt;
    return json;
}

std::string AppStore::createToken() {
    return createId("tok") + createId("");
}

std::string AppStore::createId(const std::string& prefix) {
    static std::random_device device;
    static std::mt19937_64 generator(device());
    static std::mutex randomMutex;

    std::scoped_lock lock(randomMutex);
    std::uniform_int_distribution<unsigned long long> distribution;
    std::ostringstream id;
    if (!prefix.empty()) {
        id << prefix << '_';
    }
    id << std::hex << distribution(generator);
    return id.str();
}

std::string AppStore::createRoomId() {
    return createId("room");
}

std::string AppStore::hashPassword(const std::string& password) {
    return std::to_string(std::hash<std::string>{}(password));
}

std::string AppStore::now() {
    const auto time = std::chrono::system_clock::to_time_t(std::chrono::system_clock::now());
    std::tm utc{};
#ifdef _WIN32
    gmtime_s(&utc, &time);
#else
    gmtime_r(&time, &utc);
#endif

    std::ostringstream timestamp;
    timestamp << std::put_time(&utc, "%Y-%m-%dT%H:%M:%SZ");
    return timestamp.str();
}

} // namespace confera::core
