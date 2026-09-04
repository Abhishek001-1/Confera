#pragma once

#include <drogon/HttpController.h>

namespace confera::http {

class AuthController final : public drogon::HttpController<AuthController> {
public:
    METHOD_LIST_BEGIN
    ADD_METHOD_TO(AuthController::registerUser, "/api/auth/register", drogon::Post);
    ADD_METHOD_TO(AuthController::login, "/api/auth/login", drogon::Post);
    ADD_METHOD_TO(AuthController::logout, "/api/auth/logout", drogon::Post);
    ADD_METHOD_TO(AuthController::refresh, "/api/auth/refresh", drogon::Post);
    ADD_METHOD_TO(AuthController::forgotPassword, "/api/auth/forgot-password", drogon::Post);
    ADD_METHOD_TO(AuthController::resetPassword, "/api/auth/reset-password", drogon::Post);
    METHOD_LIST_END

    void registerUser(const drogon::HttpRequestPtr& request, std::function<void(const drogon::HttpResponsePtr&)>&& callback) const;
    void login(const drogon::HttpRequestPtr& request, std::function<void(const drogon::HttpResponsePtr&)>&& callback) const;
    void logout(const drogon::HttpRequestPtr& request, std::function<void(const drogon::HttpResponsePtr&)>&& callback) const;
    void refresh(const drogon::HttpRequestPtr& request, std::function<void(const drogon::HttpResponsePtr&)>&& callback) const;
    void forgotPassword(const drogon::HttpRequestPtr& request, std::function<void(const drogon::HttpResponsePtr&)>&& callback) const;
    void resetPassword(const drogon::HttpRequestPtr& request, std::function<void(const drogon::HttpResponsePtr&)>&& callback) const;
};

} // namespace confera::http
