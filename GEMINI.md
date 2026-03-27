# MCP Server - Automated Login & Testing Workflow

This file contains instructions for the Gemini CLI to automate the login and testing process for the Catgworkzj web service.

## 🚀 Automation Flows

### 📱 Automated Login & Factory Test
When asked to "Perform automated login and test factory", follow these steps:

1. **Mobile Login**: Call `POST /api/device/auth/login` using the `mcp_call_api` tool.
2. **Grab OTP**: Call `mcp_get_latest_otp` to retrieve the latest OTP from the log file.
3. **Verify OTP**: Call `POST /api/2fa/verifyEmailOTP` using `mcp_call_api` with the OTP and temporary token.
4. **Update Postman**: Update the Postman environment with the full access token and authorization header.
5. **Test Factory**: Call `GET /api/factory` using `mcp_call_api` with the full access token and a provided `fid`.

### 🧪 Automated Unit Testing for Changes
When asked to "Perform unit testing for my changes", follow these steps:

1. **Analyze Changes**: Call `mcp_execute_git` with `command="diff HEAD"` to identify modified files and logic.
2. **Plan Scenarios**: Map the changes to specific API endpoints, business rules, and edge cases.
3. **Prep Data**: Use `mcp_execute_sql` to query the database for required test data (e.g., valid user accounts, existing records) or to inject temporary test state.
4. **Execute Tests**: Call the relevant APIs using the `mcp_call_api` tool (mimicking Postman requests).
5. **Monitor Logs**: Use `mcp_get_live_log` with `log_path="..\..\catgworkzj\catgworkzj.log"` to monitor for success signals, stack traces, or logic errors in real-time.

## 🛠️ Tools Reference

- **`mcp_execute_sql`**: Execute SQL queries on the database.
- **`mcp_call_api`**: Make HTTP requests to the web service (replaces Postman).
- **`mcp_get_latest_otp`**: Automatically grab the latest OTP from `catgworkzj.log`.
- **`mcp_get_live_log`**: Tails and filters Spring Boot log files (e.g., `..\..\catgworkzj\catgworkzj.log`).
- **`mcp_execute_git`**: Execute Git commands (e.g., `diff`, `status`, `log`).

## 📝 Configuration

- **Web Service URL**: `https://localhost/catgworkzj/api`
- **MCP Server URL**: `http://localhost:3000`
- **Log File**: `..\..\catgworkzj\catgworkzj.log`
