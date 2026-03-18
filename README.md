# MCP Server for Web Service Automation

This project is a Node.js-based Model Context Protocol (MCP) server designed to act as a bridge between an AI/LLM client and various local services, including databases, web APIs, and system logs.

It allows you to automate complex testing and development workflows with natural language prompts.

## ✨ Features

- **SQL Tool**: Execute SQL queries against a MariaDB database.
- **Web API Tool**: Call external REST APIs.
- **OTP Automation**: Automatically retrieve One-Time Passwords from a local log file.
- **Git Tool**: Perform Git operations on the repository.
- **Audit Monitoring**: Check for audit trails in the database.
- **Live Log Analysis**: Monitor and filter Spring Boot application logs.
- **Dockerized**: Includes a `Dockerfile` for easy containerization.

## ⚙️ Local Setup

Follow these steps to set up and run the server on your local machine.

### **1. Prerequisites**

- **Node.js**: v18 or later.
- **MariaDB**: A running local or network-accessible instance.
- **Git**: For version control.

### **2. Installation**

1. **Clone the repository:**
   ```bash
   git clone https://github.com/jongjy12/mcp-server.git
   cd mcp-server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

### **3. Configuration**

The server is configured via environment variables. You can create a `.env` file in the project root or set them directly in your shell.

- **`DB_HOST`**: The hostname of your MariaDB instance (default: `localhost`).
- **`DB_USER`**: Your database username (default: `pcmadmin`).
- **`DB_PASSWORD`**: Your database password (default: `c1030a8edf1d1ee2`).
- **`DB_SCHEMA`**: The name of the database to connect to (default: `ppcm`).
- **`PROJECT_NAME`**: The name of your target project (default: `catgworkzj`). This is used to construct API URLs and find the log file.
- **`LOG_FILE_PATH`**: The absolute path to the log file. If not set, it defaults to `../../[PROJECT_NAME]/[PROJECT_NAME].log`.

### **4. Running the Server**

1. **Start the server:**
   ```bash
   node server.js
   ```
   Or with a custom project name:
   ```bash
   PROJECT_NAME=my-new-project node server.js
   ```

2. **Verify it's running:**
   You should see the following output in your console:
   ```
   MCP Server running on http://localhost:3000
   Watching logs at: [path_to_your_log_file]
   ```

## 🐳 Docker Setup

Alternatively, you can run the server in a Docker container.

1. **Build the image:**
   ```bash
   docker build -t mcp-server .
   ```

2. **Run the container:**
   Make sure to provide the necessary environment variables.
   ```bash
   docker run -p 3000:3000 \
     -e PROJECT_NAME=my-new-project \
     -e DB_HOST=host.docker.internal \
     -e DB_SCHEMA=ppcm \
     -v /path/to/your/project/logs:/path/in/container \
     mcp-server
   ```
   *(Note: You need to mount the log file directory into the container using the `-v` flag).*

## 🤖 Automated Testing

This server is designed to work with an LLM-based CLI (like Gemini CLI) to automate workflows. The `call_api` tool requires you to construct the full URL, including the project name.

**Example Prompt**:
> *"Call the login API for the 'catgworkzj' project."*

This will be translated into an API call to `https://localhost/catgworkzj/api/device/auth/login`.

- **Monitor Logs**: *"Check the Spring Boot log at `C:\path\to\app.log` for any 'ERROR' messages."* (Using `get_live_log` tool)

