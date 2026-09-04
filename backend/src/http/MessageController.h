#pragma once

#include <drogon/HttpController.h>

#include <string>

namespace confera::http {

class MessageController final : public drogon::HttpController<MessageController> {
public:
    METHOD_LIST_BEGIN
    ADD_METHOD_TO(MessageController::list, "/api/meetings/{}/messages", drogon::Get);
    ADD_METHOD_TO(MessageController::create, "/api/meetings/{}/messages", drogon::Post);
    METHOD_LIST_END

    void list(const drogon::HttpRequestPtr& request, std::function<void(const drogon::HttpResponsePtr&)>&& callback, std::string meetingId) const;
    void create(const drogon::HttpRequestPtr& request, std::function<void(const drogon::HttpResponsePtr&)>&& callback, std::string meetingId) const;
};

} // namespace confera::http
