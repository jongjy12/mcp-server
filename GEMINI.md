# MCP Server - Automated Login & Testing Workflow

This file contains instructions for the Gemini CLI to automate the login and testing process for the Catgworkzj web service.

## 🚀 Automation Flow

When asked to "Perform automated login and test factory", follow these steps:

1. **Mobile Login**: Call `POST /api/device/auth/login` using the `call_api` tool.
2. **Grab OTP**: Call `GET /tool/get_latest_otp` to automatically retrieve the latest OTP from the log file.
3. **Verify OTP**: Call `POST /api/2fa/verifyEmailOTP` using the `call_api` tool with the retrieved OTP and the temporary token.
4. **Update Postman**: Update the Postman environment with the full access token and authorization header.
5. **Test Factory**: Call `GET /api/factory` with the full access token and a provided `fid`.

## 🛠️ Tools Reference

- **`POST /tool/execute_sql`**: Execute SQL queries.
- **`POST /tool/call_api`**: Make HTTP requests to the web service.
- **`GET /tool/get_latest_otp`**: Automatically grab the latest OTP from `catgworkzj.log`.

## 📝 Configuration

- **Web Service URL**: `https://localhost/catgworkzj/api`
- **MCP Server URL**: `http://localhost:3000`
- **Log File**: `..\..\catgworkzj\catgworkzj.log`
