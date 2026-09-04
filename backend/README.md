# Confera Backend

This is the first backend setup for Confera. It is intentionally small: enough to run an HTTP API, accept WebSocket signaling messages, and prepare PostgreSQL tables without adding unfinished business logic.

## What Is Used

- **C++20**: modern C++ language version.
- **CMake**: builds the C++ project.
- **vcpkg**: installs C++ dependencies from `vcpkg.json`.
- **Drogon**: C++ web framework used for REST endpoints and WebSockets.
- **PostgreSQL / Supabase**: main database. The schema starts in `database/migrations/001_initial_schema.sql`.

## Folder Structure

```text
backend/
  CMakeLists.txt
  vcpkg.json
  .env.example
  database/
    migrations/
  src/
    config/       environment configuration
    http/         REST controllers
    websocket/    WebSocket signaling controller
    main.cpp      application entry point
```

## Environment Variables

Create a local `.env` file or set these variables in your terminal:

```text
CONFERA_HOST=0.0.0.0
CONFERA_PORT=8080
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.yplxmvfitidghhdbhbje.supabase.co:5432/postgres?sslmode=require
```

Do not commit real passwords. The repository ignores `.env` files.

When you run `confera_backend.exe` from the `backend` folder, it loads `backend/.env` automatically.

## Build

### 1. Check MSYS2 UCRT64 Tools

Run these inside the **MSYS2 UCRT64** terminal:

```bash
git --version
g++ --version
cmake --version
mingw32-make --version
which git
which g++
which mingw32-make
```

The `which` commands should point to `/ucrt64/bin/...`.

Avoid running CMake for this project from normal PowerShell if you have an old `C:\MinGW` installed. It can make vcpkg pick the wrong compiler. Use MSYS2 UCRT64.

If `git` is missing, install it:

```bash
pacman -S git
```

### 2. Install vcpkg

Pick a folder for vcpkg. This example uses `C:\dev\vcpkg`, which appears as `/c/dev/vcpkg` inside MSYS2:

```bash
mkdir -p /c/dev
cd /c/dev
git clone https://github.com/microsoft/vcpkg.git
cd vcpkg
./bootstrap-vcpkg.bat
```

Set `VCPKG_ROOT` in the same terminal:

```bash
export VCPKG_ROOT=/c/dev/vcpkg
```

To make it permanent for future UCRT64 terminals:

```bash
echo 'export VCPKG_ROOT=/c/dev/vcpkg' >> ~/.bashrc
```

### 3. Configure and Build Confera Backend

From the backend folder:

```bash
cd /e/Confera/backend
export VCPKG_MAX_CONCURRENCY=2
export CMAKE_BUILD_PARALLEL_LEVEL=2
rm -rf build/ucrt64-debug
cmake --preset ucrt64-debug
cmake --build --preset ucrt64-debug
```

This reads `vcpkg.json`, installs Drogon with PostgreSQL support, and builds the backend.

You can also run CMake manually:

```bash
cmake -S . -B build/ucrt64-debug -G "MinGW Makefiles" \
  -DCMAKE_BUILD_TYPE=Debug \
  -DCMAKE_C_COMPILER=C:/msys64/ucrt64/bin/gcc.exe \
  -DCMAKE_CXX_COMPILER=C:/msys64/ucrt64/bin/g++.exe \
  -DCMAKE_MAKE_PROGRAM=C:/msys64/ucrt64/bin/mingw32-make.exe \
  -DCMAKE_TOOLCHAIN_FILE="$VCPKG_ROOT/scripts/buildsystems/vcpkg.cmake" \
  -DVCPKG_TARGET_TRIPLET=x64-mingw-dynamic \
  -DVCPKG_HOST_TRIPLET=x64-mingw-dynamic

cmake --build build/ucrt64-debug
```

Run:

```bash
./build/ucrt64-debug/confera_backend.exe
```

For Release:

```bash
rm -rf build/ucrt64-release
cmake --preset ucrt64-release
cmake --build --preset ucrt64-release
./build/ucrt64-release/confera_backend.exe
```

### Troubleshooting vcpkg Triplets

If CMake or vcpkg mentions `x64-windows` or says it cannot find Visual Studio, vcpkg is using the wrong host triplet. This project uses MSYS2 UCRT64, so both triplets must be `x64-mingw-dynamic`.

If Drogon fails with `cc1plus.exe: out of memory`, lower the parallel build count:

```bash
export VCPKG_MAX_CONCURRENCY=2
export CMAKE_BUILD_PARALLEL_LEVEL=2
```

Delete the failed build folder before configuring again:

```bash
cd /e/Confera/backend
export VCPKG_MAX_CONCURRENCY=2
export CMAKE_BUILD_PARALLEL_LEVEL=2
rm -rf build/ucrt64-debug
cmake --preset ucrt64-debug
```

## Current API

Swagger UI:

```http
GET /docs
```

Use `POST /api/auth/register` first. Copy the returned `accessToken`, then use it as:

```text
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Health Check

```http
GET /health
```

Response:

```json
{
  "status": "ok",
  "service": "confera-backend"
}
```

### API Info

```http
GET /api
```

Returns the backend name, version, and currently available endpoints.

### Swagger UI

```http
GET /docs
```

Opens a Swagger-style API docs page in the browser.

### OpenAPI JSON

```http
GET /openapi.json
```

Returns the OpenAPI document used by `/docs`.

### Root

```http
GET /
```

Redirects to `/docs`.

## WebSocket Signaling

Connect to:

```text
ws://localhost:8080/ws
```

Supported client messages:

```json
{ "type": "join-room", "roomId": "abc123", "userId": "user123" }
```

```json
{ "type": "leave-room" }
```

```json
{ "type": "offer", "roomId": "abc123", "target": "user456", "payload": {} }
```

```json
{ "type": "answer", "roomId": "abc123", "target": "user123", "payload": {} }
```

```json
{ "type": "ice-candidate", "roomId": "abc123", "target": "user456", "payload": {} }
```

```json
{ "type": "chat", "roomId": "abc123", "message": "Hello" }
```

The signaling server keeps active rooms in memory for now. Later, Redis can replace this in-memory room state when the app needs multiple backend instances.

## Database Setup

The first migration creates:

- `users`
- `meetings`
- `meeting_participants`
- `messages`

Run `database/migrations/001_initial_schema.sql` in Supabase SQL Editor or with `psql`.

## Next Backend Steps

1. Add real database access through repositories.
2. Implement auth endpoints: register, login, refresh token.
3. Add password hashing and JWT signing.
4. Add meeting CRUD endpoints.
5. Persist chat messages.
6. Move active room presence from memory to Redis when scaling beyond one backend server.
