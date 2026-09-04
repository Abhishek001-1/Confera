#include "http/DocsController.h"

#include <string>

namespace confera::http {

void DocsController::docs(
    const drogon::HttpRequestPtr&,
    std::function<void(const drogon::HttpResponsePtr&)>&& callback) const {
    const std::string html = R"HTML(<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Confera API Docs</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css">
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script>
    window.onload = function () {
      SwaggerUIBundle({
        url: "/openapi.json",
        dom_id: "#swagger-ui"
      });
    };
  </script>
</body>
</html>)HTML";

    auto response = drogon::HttpResponse::newHttpResponse();
    response->setContentTypeCode(drogon::CT_TEXT_HTML);
    response->setBody(html);
    callback(response);
}

void DocsController::openApi(
    const drogon::HttpRequestPtr&,
    std::function<void(const drogon::HttpResponsePtr&)>&& callback) const {
    const std::string spec = R"JSON({
  "openapi": "3.0.3",
  "info": {
    "title": "Confera API",
    "version": "0.1.0",
    "description": "Initial REST and WebSocket signaling API for Confera."
  },
  "servers": [
    { "url": "http://localhost:8080" }
  ],
  "paths": {
    "/api/auth/register": { "post": { "summary": "Register user", "responses": { "201": { "description": "User registered" }, "400": { "description": "Invalid input" } } } },
    "/api/auth/login": { "post": { "summary": "Login user", "responses": { "200": { "description": "Login success" }, "401": { "description": "Invalid credentials" } } } },
    "/api/auth/logout": { "post": { "summary": "Logout user", "responses": { "200": { "description": "Logged out" } } } },
    "/api/auth/refresh": { "post": { "summary": "Validate current token", "responses": { "200": { "description": "Token valid" }, "401": { "description": "Unauthorized" } } } },
    "/api/auth/forgot-password": { "post": { "summary": "Request password reset", "responses": { "202": { "description": "Accepted" } } } },
    "/api/auth/reset-password": { "post": { "summary": "Reset password", "responses": { "202": { "description": "Accepted" } } } },
    "/api/users/me": {
      "get": { "summary": "Get current user", "responses": { "200": { "description": "Current user" }, "401": { "description": "Unauthorized" } } },
      "patch": { "summary": "Update current user", "responses": { "200": { "description": "Updated user" }, "401": { "description": "Unauthorized" } } },
      "delete": { "summary": "Delete current user", "responses": { "200": { "description": "User deleted" }, "401": { "description": "Unauthorized" } } }
    },
    "/api/meetings": {
      "get": { "summary": "List meetings for current user", "responses": { "200": { "description": "Meeting list" }, "401": { "description": "Unauthorized" } } },
      "post": { "summary": "Create meeting", "responses": { "201": { "description": "Meeting created" }, "400": { "description": "Invalid input" }, "401": { "description": "Unauthorized" } } }
    },
    "/api/meetings/{id}": {
      "get": { "summary": "Get meeting", "parameters": [{ "name": "id", "in": "path", "required": true, "schema": { "type": "string" } }], "responses": { "200": { "description": "Meeting" }, "404": { "description": "Not found" } } },
      "patch": { "summary": "Update meeting", "parameters": [{ "name": "id", "in": "path", "required": true, "schema": { "type": "string" } }], "responses": { "200": { "description": "Meeting updated" }, "401": { "description": "Unauthorized" } } },
      "delete": { "summary": "Delete meeting", "parameters": [{ "name": "id", "in": "path", "required": true, "schema": { "type": "string" } }], "responses": { "200": { "description": "Meeting deleted" }, "401": { "description": "Unauthorized" } } }
    },
    "/api/meetings/{id}/join": { "post": { "summary": "Join meeting", "parameters": [{ "name": "id", "in": "path", "required": true, "schema": { "type": "string" } }], "responses": { "200": { "description": "Joined" }, "401": { "description": "Unauthorized" } } } },
    "/api/meetings/{id}/leave": { "post": { "summary": "Leave meeting", "parameters": [{ "name": "id", "in": "path", "required": true, "schema": { "type": "string" } }], "responses": { "200": { "description": "Left" }, "401": { "description": "Unauthorized" } } } },
    "/api/meetings/{id}/participants": { "get": { "summary": "List participants", "parameters": [{ "name": "id", "in": "path", "required": true, "schema": { "type": "string" } }], "responses": { "200": { "description": "Participants" } } } },
    "/api/meetings/{id}/participants/{userId}": {
      "patch": { "summary": "Update participant", "parameters": [{ "name": "id", "in": "path", "required": true, "schema": { "type": "string" } }, { "name": "userId", "in": "path", "required": true, "schema": { "type": "string" } }], "responses": { "200": { "description": "Participant updated" }, "401": { "description": "Unauthorized" } } },
      "delete": { "summary": "Remove participant", "parameters": [{ "name": "id", "in": "path", "required": true, "schema": { "type": "string" } }, { "name": "userId", "in": "path", "required": true, "schema": { "type": "string" } }], "responses": { "200": { "description": "Participant removed" }, "401": { "description": "Unauthorized" } } }
    },
    "/api/meetings/{id}/messages": {
      "get": { "summary": "List messages", "parameters": [{ "name": "id", "in": "path", "required": true, "schema": { "type": "string" } }], "responses": { "200": { "description": "Messages" } } },
      "post": { "summary": "Create message", "parameters": [{ "name": "id", "in": "path", "required": true, "schema": { "type": "string" } }], "responses": { "201": { "description": "Message created" }, "401": { "description": "Unauthorized" } } }
    },
    "/health": {
      "get": {
        "summary": "Check backend health",
        "responses": {
          "200": {
            "description": "Backend is running",
            "content": {
              "application/json": {
                "schema": { "type": "object" }
              }
            }
          }
        }
      }
    },
    "/api": {
      "get": {
        "summary": "List basic API metadata",
        "responses": {
          "200": {
            "description": "API metadata and endpoint list",
            "content": {
              "application/json": {
                "schema": { "type": "object" }
              }
            }
          }
        }
      }
    },
    "/docs": {
      "get": {
        "summary": "Open Swagger UI",
        "responses": {
          "200": { "description": "Swagger UI HTML page" }
        }
      }
    },
    "/openapi.json": {
      "get": {
        "summary": "Return OpenAPI specification",
        "responses": {
          "200": {
            "description": "OpenAPI JSON",
            "content": {
              "application/json": {
                "schema": { "type": "object" }
              }
            }
          }
        }
      }
    },
    "/ws": {
      "get": {
        "summary": "WebSocket signaling endpoint",
        "description": "Connect with a WebSocket client. Supports join-room, leave-room, offer, answer, ice-candidate, chat, reaction, and raise-hand messages.",
        "responses": {
          "101": { "description": "WebSocket protocol upgrade" }
        }
      }
    }
  }
})JSON";

    auto response = drogon::HttpResponse::newHttpResponse();
    response->setContentTypeCode(drogon::CT_APPLICATION_JSON);
    response->setBody(spec);
    callback(response);
}

} // namespace confera::http
