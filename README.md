# Deno RestAPI Gateway Auth

Deno & Oak Framework RestAPI with authentication.

## Features
- Authentication System - Access Token, Refresh Token (Refresh Token Rotation)
- Create / View / Edit / Delete Account.

## Endpoint
| Path | Parameter | Body | Auth | Description |
| --- | --- | --- | --- | --- |
| `POST /account` | - | `email, password` | - | Create account. |
| `GET /account/:uuid` | `account uuid` | - | bearer | View account data (Account Owner Only). |
| `PUT /account/:uuid` | `account uuid` | `email, password` - optional | bearer | Edit account data (Account Owner Only). |
| `DELETE /account/:uuid` | `account uuid` | - | bearer | Delete account (Account Owner Only). |
| `POST /auth/login` | - | `email, password` | - | Login. |
| `GET /auth/check` | - | - | bearer | Check if authenticated. ||
| `POST /auth/refresh` | - | `token` | - | Refresh access token with refresh token. |
| `POST /auth/logout` | - | `token` | bearer | Logout with refresh token (Also require access token authorization header). |

## Note
A secure (maybe) REST API & authentication system with refresh token rotation as API gateway with other microservices in mind for educational purpose.
