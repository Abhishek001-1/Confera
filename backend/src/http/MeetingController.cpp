#include "http/MeetingController.h"

#include "core/AppStore.h"
#include "http/HttpUtils.h"

namespace confera::http {
namespace {

std::optional<std::string> requireUser(
    const drogon::HttpRequestPtr& request,
    const std::function<void(const drogon::HttpResponsePtr&)>& callback) {
    const auto userId = authenticatedUserId(request);
    if (!userId) {
        callback(errorResponse("valid bearer token is required", drogon::k401Unauthorized));
    }
    return userId;
}

} // namespace

void MeetingController::create(
    const drogon::HttpRequestPtr& request,
    std::function<void(const drogon::HttpResponsePtr&)>&& callback) const {
    const auto userId = requireUser(request, callback);
    if (!userId) {
        return;
    }

    const auto [ok, result] = core::AppStore::instance().createMeeting(*userId, requestJson(request));
    callback(ok ? jsonResponse(result, drogon::k201Created) : errorResponse(result["message"].asString(), drogon::k400BadRequest));
}

void MeetingController::list(
    const drogon::HttpRequestPtr& request,
    std::function<void(const drogon::HttpResponsePtr&)>&& callback) const {
    const auto userId = requireUser(request, callback);
    if (!userId) {
        return;
    }

    Json::Value body;
    body["meetings"] = core::AppStore::instance().listMeetings(*userId);
    callback(jsonResponse(body));
}

void MeetingController::get(
    const drogon::HttpRequestPtr&,
    std::function<void(const drogon::HttpResponsePtr&)>&& callback,
    std::string meetingId) const {
    const auto meeting = core::AppStore::instance().getMeeting(meetingId);
    callback(meeting ? jsonResponse(*meeting) : errorResponse("meeting not found", drogon::k404NotFound));
}

void MeetingController::update(
    const drogon::HttpRequestPtr& request,
    std::function<void(const drogon::HttpResponsePtr&)>&& callback,
    std::string meetingId) const {
    const auto userId = requireUser(request, callback);
    if (!userId) {
        return;
    }

    const auto [ok, result] = core::AppStore::instance().updateMeeting(*userId, meetingId, requestJson(request));
    callback(ok ? jsonResponse(result) : errorResponse(result["message"].asString(), drogon::k400BadRequest));
}

void MeetingController::remove(
    const drogon::HttpRequestPtr& request,
    std::function<void(const drogon::HttpResponsePtr&)>&& callback,
    std::string meetingId) const {
    const auto userId = requireUser(request, callback);
    if (!userId) {
        return;
    }

    if (!core::AppStore::instance().deleteMeeting(*userId, meetingId)) {
        callback(errorResponse("meeting not found or user is not host", drogon::k404NotFound));
        return;
    }

    Json::Value body;
    body["message"] = "meeting deleted";
    callback(jsonResponse(body));
}

void MeetingController::join(
    const drogon::HttpRequestPtr& request,
    std::function<void(const drogon::HttpResponsePtr&)>&& callback,
    std::string meetingId) const {
    const auto userId = requireUser(request, callback);
    if (!userId) {
        return;
    }

    const auto [ok, result] = core::AppStore::instance().joinMeeting(*userId, meetingId);
    callback(ok ? jsonResponse(result) : errorResponse(result["message"].asString(), drogon::k404NotFound));
}

void MeetingController::leave(
    const drogon::HttpRequestPtr& request,
    std::function<void(const drogon::HttpResponsePtr&)>&& callback,
    std::string meetingId) const {
    const auto userId = requireUser(request, callback);
    if (!userId) {
        return;
    }

    if (!core::AppStore::instance().leaveMeeting(*userId, meetingId)) {
        callback(errorResponse("active participant not found", drogon::k404NotFound));
        return;
    }

    Json::Value body;
    body["message"] = "left meeting";
    callback(jsonResponse(body));
}

} // namespace confera::http
