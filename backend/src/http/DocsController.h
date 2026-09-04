#pragma once

#include <drogon/HttpController.h>

namespace confera::http {

class DocsController final : public drogon::HttpController<DocsController> {
public:
    METHOD_LIST_BEGIN
    ADD_METHOD_TO(DocsController::docs, "/docs", drogon::Get);
    ADD_METHOD_TO(DocsController::openApi, "/openapi.json", drogon::Get);
    METHOD_LIST_END

    void docs(
        const drogon::HttpRequestPtr& request,
        std::function<void(const drogon::HttpResponsePtr&)>&& callback) const;

    void openApi(
        const drogon::HttpRequestPtr& request,
        std::function<void(const drogon::HttpResponsePtr&)>&& callback) const;
};

} // namespace confera::http
