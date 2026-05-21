# API Contracts — Auth

Platform-level auth endpoints (cross-cutting; not owned by any single engine).

- `post-sessions.v1.yaml` — issue a bearer token via email+password (WP-A bootstrap; to coexist with OTP login from WP-B).
- `delete-sessions-current.v1.yaml` — revoke the bearer token tied to the current request.
