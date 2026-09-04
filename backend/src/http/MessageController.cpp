#include "http/MessageController.h"

#include "core/AppStore.h"
#include "http/HttpUtils.h"

namespace confera::http {

void MessageController::list(
    const drogon::HttpRequestPtr&,
    std::function<void(const drogon::HttpResponsePtr&)>&& callback,
    std::string meetingId) const {
    Json::Value body;
    body["messages"] = core::AppStore::instance().listMessages(meetingId);
    callback(jsonResponse(body));
}

void MessageController::create(
    const drogon::HttpRequestPtr& request,
    std::function<void(const drogon::HttpResponsePtr&)>&& callback,
    std::string meetingId) const {
    const auto userId = authenticatedUserId(request);
    if (!userId) {
        callback(errorResponse("valid bearer token is required", drogon::k401Unauthorized));
        return;
    }

    const auto [ok, result] = core::AppStore::instance().createMessage(*userId, meetingId, requestJson(request));
    callback(ok ? jsonResponse(result, drogon::k201Created) : errorResponse(result["message"].asString(), drogon::k400BadRequest));
}

} // namespace confera::http
