#pragma once

#include <drogon/HttpController.h>

#include <string>

namespace confera::http {

class ParticipantController final : public drogon::HttpController<ParticipantController> {
public:
    METHOD_LIST_BEGIN
    ADD_METHOD_TO(ParticipantController::list, "/api/meetings/{}/participants", drogon::Get);
    ADD_METHOD_TO(ParticipantController::update, "/api/meetings/{}/participants/{}", drogon::Patch);
    ADD_METHOD_TO(ParticipantController::remove, "/api/meetings/{}/participants/{}", drogon::Delete);
    METHOD_LIST_END

    void list(const drogon::HttpRequestPtr& request, std::function<void(const drogon::HttpResponsePtr&)>&& callback, std::string meetingId) const;
    void update(const drogon::HttpRequestPtr& request, std::function<void(const drogon::HttpResponsePtr&)>&& callback, std::string meetingId, std::string userId) const;
    void remove(const drogon::HttpRequestPtr& request, std::function<void(const drogon::HttpResponsePtr&)>&& callback, std::string meetingId, std::string userId) const;
};

} // namespace confera::http
