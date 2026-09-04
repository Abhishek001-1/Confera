#include "http/UserController.h"

#include "core/AppStore.h"
#include "http/HttpUtils.h"

namespace confera::http {

void UserController::me(
    const drogon::HttpRequestPtr& request,
    std::function<void(const drogon::HttpResponsePtr&)>&& callback) const {
    const auto userId = authenticatedUserId(request);
    if (!userId) {
        callback(errorResponse("valid bearer token is required", drogon::k401Unauthorized));
        return;
    }

    const auto user = core::AppStore::instance().currentUser(*userId);
    callback(user ? jsonResponse(*user) : errorResponse("user not found", drogon::k404NotFound));
}

void UserController::updateMe(
    const drogon::HttpRequestPtr& request,
    std::function<void(const drogon::HttpResponsePtr&)>&& callback) const {
    const auto userId = authenticatedUserId(request);
    if (!userId) {
        callback(errorResponse("valid bearer token is required", drogon::k401Unauthorized));
        return;
    }

    const auto user = core::AppStore::instance().updateUser(*userId, requestJson(request));
    callback(user ? jsonResponse(*user) : errorResponse("user not found", drogon::k404NotFound));
}

void UserController::deleteMe(
    const drogon::HttpRequestPtr& request,
    std::function<void(const drogon::HttpResponsePtr&)>&& callback) const {
    const auto userId = authenticatedUserId(request);
    if (!userId) {
        callback(errorResponse("valid bearer token is required", drogon::k401Unauthorized));
        return;
    }

    if (!core::AppStore::instance().deleteUser(*userId)) {
        callback(errorResponse("user not found", drogon::k404NotFound));
        return;
    }

    Json::Value body;
    body["message"] = "user deleted";
    callback(jsonResponse(body));
}

} // namespace confera::http
