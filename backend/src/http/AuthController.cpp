#include "http/AuthController.h"

#include "core/AppStore.h"
#include "http/HttpUtils.h"

namespace confera::http {

void AuthController::registerUser(
    const drogon::HttpRequestPtr& request,
    std::function<void(const drogon::HttpResponsePtr&)>&& callback) const {
    const auto [ok, result] = core::AppStore::instance().registerUser(requestJson(request));
    callback(ok ? jsonResponse(result, drogon::k201Created) : errorResponse(result["message"].asString(), drogon::k400BadRequest));
}

void AuthController::login(
    const drogon::HttpRequestPtr& request,
    std::function<void(const drogon::HttpResponsePtr&)>&& callback) const {
    const auto [ok, result] = core::AppStore::instance().login(requestJson(request));
    callback(ok ? jsonResponse(result) : errorResponse(result["message"].asString(), drogon::k401Unauthorized));
}

void AuthController::logout(
    const drogon::HttpRequestPtr& request,
    std::function<void(const drogon::HttpResponsePtr&)>&& callback) const {
    core::AppStore::instance().logout(bearerToken(request));
    Json::Value body;
    body["message"] = "logged out";
    callback(jsonResponse(body));
}

void AuthController::refresh(
    const drogon::HttpRequestPtr& request,
    std::function<void(const drogon::HttpResponsePtr&)>&& callback) const {
    const auto userId = authenticatedUserId(request);
    if (!userId) {
        callback(errorResponse("valid bearer token is required", drogon::k401Unauthorized));
        return;
    }

    Json::Value body;
    body["message"] = "token is still valid";
    body["userId"] = *userId;
    callback(jsonResponse(body));
}

void AuthController::forgotPassword(
    const drogon::HttpRequestPtr&,
    std::function<void(const drogon::HttpResponsePtr&)>&& callback) const {
    Json::Value body;
    body["message"] = "password reset email provider is not configured yet";
    callback(jsonResponse(body, drogon::k202Accepted));
}

void AuthController::resetPassword(
    const drogon::HttpRequestPtr&,
    std::function<void(const drogon::HttpResponsePtr&)>&& callback) const {
    Json::Value body;
    body["message"] = "password reset token flow is not configured yet";
    callback(jsonResponse(body, drogon::k202Accepted));
}

} // namespace confera::http
