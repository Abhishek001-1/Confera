#pragma once

#include <drogon/HttpRequest.h>
#include <drogon/HttpResponse.h>
#include <json/json.h>

#include <optional>
#include <string>

namespace confera::http {

Json::Value requestJson(const drogon::HttpRequestPtr& request);
drogon::HttpResponsePtr jsonResponse(Json::Value body, drogon::HttpStatusCode status = drogon::k200OK);
drogon::HttpResponsePtr errorResponse(const std::string& message, drogon::HttpStatusCode status);
std::string bearerToken(const drogon::HttpRequestPtr& request);
std::optional<std::string> authenticatedUserId(const drogon::HttpRequestPtr& request);

} // namespace confera::http
