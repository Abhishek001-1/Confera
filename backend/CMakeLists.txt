cmake_minimum_required(VERSION 3.21)

project(confera_backend LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

find_package(Drogon CONFIG REQUIRED)

add_executable(confera_backend
    src/config/AppConfig.cpp
    src/core/AppStore.cpp
    src/http/ApiController.cpp
    src/http/AuthController.cpp
    src/http/DocsController.cpp
    src/http/HealthController.cpp
    src/http/HttpUtils.cpp
    src/http/MeetingController.cpp
    src/http/MessageController.cpp
    src/http/ParticipantController.cpp
    src/http/UserController.cpp
    src/main.cpp
    src/websocket/SignalingController.cpp
)

target_include_directories(confera_backend PRIVATE src)
target_link_libraries(confera_backend PRIVATE Drogon::Drogon)
