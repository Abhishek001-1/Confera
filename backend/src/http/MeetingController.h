#pragma once

#include <drogon/HttpController.h>

#include <string>

namespace confera::http {

class MeetingController final : public drogon::HttpController<MeetingController> {
public:
    METHOD_LIST_BEGIN
    ADD_METHOD_TO(MeetingController::create, "/api/meetings", drogon::Post);
    ADD_METHOD_TO(MeetingController::list, "/api/meetings", drogon::Get);
    ADD_METHOD_TO(MeetingController::get, "/api/meetings/{}", drogon::Get);
    ADD_METHOD_TO(MeetingController::update, "/api/meetings/{}", drogon::Patch);
    ADD_METHOD_TO(MeetingController::remove, "/api/meetings/{}", drogon::Delete);
    ADD_METHOD_TO(MeetingController::join, "/api/meetings/{}/join", drogon::Post);
    ADD_METHOD_TO(MeetingController::leave, "/api/meetings/{}/leave", drogon::Post);
    METHOD_LIST_END

    void create(const drogon::HttpRequestPtr& request, std::function<void(const drogon::HttpResponsePtr&)>&& callback) const;
    void list(const drogon::HttpRequestPtr& request, std::function<void(const drogon::HttpResponsePtr&)>&& callback) const;
    void get(const drogon::HttpRequestPtr& request, std::function<void(const drogon::HttpResponsePtr&)>&& callback, std::string meetingId) const;
    void update(const drogon::HttpRequestPtr& request, std::function<void(const drogon::HttpResponsePtr&)>&& callback, std::string meetingId) const;
    void remove(const drogon::HttpRequestPtr& request, std::function<void(const drogon::HttpResponsePtr&)>&& callback, std::string meetingId) const;
    void join(const drogon::HttpRequestPtr& request, std::function<void(const drogon::HttpResponsePtr&)>&& callback, std::string meetingId) const;
    void leave(const drogon::HttpRequestPtr& request, std::function<void(const drogon::HttpResponsePtr&)>&& callback, std::string meetingId) const;
};

} // namespace confera::http
