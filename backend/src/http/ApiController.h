#pragma once

#include <drogon/HttpController.h>

namespace confera::http {

class ApiController final : public drogon::HttpController<ApiController> {
public:
    METHOD_LIST_BEGIN
    ADD_METHOD_TO(ApiController::root, "/", drogon::Get);
    ADD_METHOD_TO(ApiController::index, "/api", drogon::Get);
    METHOD_LIST_END

    void root(
        const drogon::HttpRequestPtr& request,
        std::function<void(const drogon::HttpResponsePtr&)>&& callback) const;

    void index(
        const drogon::HttpRequestPtr& request,
        std::function<void(const drogon::HttpResponsePtr&)>&& callback) const;
};

} // namespace confera::http
