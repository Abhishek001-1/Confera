#include "http/ParticipantController.h"

#include "core/AppStore.h"
#include "http/HttpUtils.h"

namespace confera::http {

void ParticipantController::list(
    const drogon::HttpRequestPtr&,
    std::function<void(const drogon::HttpResponsePtr&)>&& callback,
    std::string meetingId) const {
    Json::Value body;
    body["participants"] = core::AppStore::instance().listParticipants(meetingId);
    callback(jsonResponse(body));
}

void ParticipantController::update(
    const drogon::HttpRequestPtr& request,
    std::function<void(const drogon::HttpResponsePtr&)>&& callback,
    std::string meetingId,
    std::string userId) const {
    if (!authenticatedUserId(request)) {
        callback(errorResponse("valid bearer token is required", drogon::k401Unauthorized));
        return;
    }

    const auto participant = core::AppStore::instance().updateParticipant(meetingId, userId, requestJson(request));
    callback(participant ? jsonResponse(*participant) : errorResponse("participant not found", drogon::k404NotFound));
}

void ParticipantController::remove(
    const drogon::HttpRequestPtr& request,
    std::function<void(const drogon::HttpResponsePtr&)>&& callback,
    std::string meetingId,
    std::string userId) const {
    if (!authenticatedUserId(request)) {
        callback(errorResponse("valid bearer token is required", drogon::k401Unauthorized));
        return;
    }

    if (!core::AppStore::instance().removeParticipant(meetingId, userId)) {
        callback(errorResponse("participant not found", drogon::k404NotFound));
        return;
    }

    Json::Value body;
    body["message"] = "participant removed";
    callback(jsonResponse(body));
}

} // namespace confera::http
