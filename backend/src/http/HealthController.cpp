#include "http/HealthController.h"

#include <json/json.h>

namespace confera::http {

void HealthController::health(
    const drogon::HttpRequestPtr&,
    std::function<void(const drogon::HttpResponsePtr&)>&& callback) const {
    Json::Value body;
    body["status"] = "ok";
    body["service"] = "confera-backend";

    callback(drogon::HttpResponse::newHttpJsonResponse(body));
}

} // namespace confera::http
