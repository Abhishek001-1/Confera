#include "http/ApiController.h"

#include <json/json.h>

namespace confera::http {

void ApiController::root(
    const drogon::HttpRequestPtr&,
    std::function<void(const drogon::HttpResponsePtr&)>&& callback) const {
    auto response = drogon::HttpResponse::newRedirectionResponse("/docs");
    callback(response);
}

void ApiController::index(
    const drogon::HttpRequestPtr&,
    std::function<void(const drogon::HttpResponsePtr&)>&& callback) const {
    Json::Value body;
    body["name"] = "Confera API";
    body["version"] = "0.1.0";

    Json::Value endpoints(Json::arrayValue);
    endpoints.append("GET /");
    endpoints.append("GET /health");
    endpoints.append("GET /api");
    endpoints.append("GET /docs");
    endpoints.append("GET /openapi.json");
    endpoints.append("POST /api/auth/register");
    endpoints.append("POST /api/auth/login");
    endpoints.append("POST /api/auth/logout");
    endpoints.append("POST /api/auth/refresh");
    endpoints.append("POST /api/auth/forgot-password");
    endpoints.append("POST /api/auth/reset-password");
    endpoints.append("GET /api/users/me");
    endpoints.append("PATCH /api/users/me");
    endpoints.append("DELETE /api/users/me");
    endpoints.append("POST /api/meetings");
    endpoints.append("GET /api/meetings");
    endpoints.append("GET /api/meetings/{id}");
    endpoints.append("PATCH /api/meetings/{id}");
    endpoints.append("DELETE /api/meetings/{id}");
    endpoints.append("POST /api/meetings/{id}/join");
    endpoints.append("POST /api/meetings/{id}/leave");
    endpoints.append("GET /api/meetings/{id}/participants");
    endpoints.append("PATCH /api/meetings/{id}/participants/{userId}");
    endpoints.append("DELETE /api/meetings/{id}/participants/{userId}");
    endpoints.append("GET /api/meetings/{id}/messages");
    endpoints.append("POST /api/meetings/{id}/messages");
    endpoints.append("WS /ws");
    body["endpoints"] = endpoints;

    callback(drogon::HttpResponse::newHttpJsonResponse(body));
}

} // namespace confera::http
