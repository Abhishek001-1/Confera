#pragma once

#include <drogon/HttpController.h>

namespace confera::http {

class UserController final : public drogon::HttpController<UserController> {
public:
    METHOD_LIST_BEGIN
    ADD_METHOD_TO(UserController::me, "/api/users/me", drogon::Get);
    ADD_METHOD_TO(UserController::updateMe, "/api/users/me", drogon::Patch);
    ADD_METHOD_TO(UserController::deleteMe, "/api/users/me", drogon::Delete);
    METHOD_LIST_END

    void me(const drogon::HttpRequestPtr& request, std::function<void(const drogon::HttpResponsePtr&)>&& callback) const;
    void updateMe(const drogon::HttpRequestPtr& request, std::function<void(const drogon::HttpResponsePtr&)>&& callback) const;
    void deleteMe(const drogon::HttpRequestPtr& request, std::function<void(const drogon::HttpResponsePtr&)>&& callback) const;
};

} // namespace confera::http
