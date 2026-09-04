#include "http/HttpUtils.h"

#include "core/AppStore.h"

namespace confera::http {

Json::Value requestJson(const drogon::HttpRequestPtr& request) {
    const auto json = request->getJsonObject();
    return json == nullptr ? Json::Value(Json::objectValue) : *json;
}

drogon::HttpResponsePtr jsonResponse(Json::Value body, drogon::HttpStatusCode status) {
    auto response = drogon::HttpResponse::newHttpJsonResponse(body);
    response->setStatusCode(status);
    return response;
}

drogon::HttpResponsePtr errorResponse(const std::string& message, drogon::HttpStatusCode status) {
    Json::Value body;
    body["error"] = message;
    return jsonResponse(body, status);
}

std::string bearerToken(const drogon::HttpRequestPtr& request) {
    const auto header = request->getHeader("Authorization");
    const std::string prefix = "Bearer ";
    if (header.rfind(prefix, 0) != 0) {
        return "";
    }
    return header.substr(prefix.size());
}

std::optional<std::string> authenticatedUserId(const drogon::HttpRequestPtr& request) {
    const auto token = bearerToken(request);
    if (token.empty()) {
        return std::nullopt;
    }
    return core::AppStore::instance().userIdForToken(token);
}

} // namespace confera::http
