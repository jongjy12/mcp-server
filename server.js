const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2/promise");
const axios = require("axios");
const https = require("https");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const app = express();
app.use(bodyParser.json());

// 🔐 Configuration
const DB_HOST = process.env.DB_HOST || "localhost";
const DB_USER = process.env.DB_USERNAME || "pcmadmin";
const DB_PASSWORD = process.env.DB_PASSWORD || "c1030a8edf1d1ee2";
const DB_NAME = process.env.DB_SCHEMA || "ppcm";
const PROJECT_NAME = process.env.PROJECT_NAME || "catgworkzj";
const LOG_FILE_PATH = process.env.LOG_FILE_PATH || path.join(__dirname, "..", "..", PROJECT_NAME, `${PROJECT_NAME}.log`);

// 🔌 MariaDB connection
const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
});

// 🌐 Axios instance for API calls
const apiClient = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
});

// 🧠 Tool: execute SQL
app.post("/tool/execute_sql", async (req, res) => {
  const { query } = req.body;
  if (!query) return res.json({ success: false, error: "Query is required" });

  const forbidden = ["drop", "truncate"];
  if (forbidden.some(word => query.toLowerCase().includes(word))) {
    return res.json({ success: false, error: "Dangerous query blocked" });
  }

  try {
    console.log("Executing SQL:", query);
    const [rows] = await pool.query(query);
    res.json({ success: true, rows });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

// 🧠 Tool: call API
app.post("/tool/call_api", async (req, res) => {
  const { method, url, data, headers } = req.body;
  if (!url) return res.json({ success: false, error: "URL is required" });

  try {
    console.log(`Calling API: ${method || "GET"} ${url}`);
    const response = await apiClient({
      method: method || "GET",
      url,
      data,
      headers,
    });
    res.json({ success: true, status: response.status, data: response.data });
  } catch (err) {
    res.json({ success: false, error: err.message, data: err.response ? err.response.data : null });
  }
});

// 🧠 Tool: get latest OTP
app.get("/tool/get_latest_otp", (req, res) => {
  try {
    if (!fs.existsSync(LOG_FILE_PATH)) {
      return res.json({ success: false, error: `Log file not found at ${LOG_FILE_PATH}` });
    }

    const content = fs.readFileSync(LOG_FILE_PATH, "utf8");
    const lines = content.split("\n");
    
    // Look for "Generated OTP: 656967"
    const otpRegex = /Generated OTP: (\d+)/;
    let latestOtp = null;

    // Search from the end for the most recent one
    for (let i = lines.length - 1; i >= 0; i--) {
      const match = lines[i].match(otpRegex);
      if (match) {
        latestOtp = match[1];
        break;
      }
    }

    if (latestOtp) {
      res.json({ success: true, otp: latestOtp });
    } else {
      res.json({ success: false, error: "No OTP found in log file" });
    }
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

// 🧠 Tool: get table schema
app.get("/tool/get_schema/:table", async (req, res) => {
  try {
    const [rows] = await pool.query(`DESCRIBE ${req.params.table}`);
    res.json({ success: true, schema: rows });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

// 🧠 Tool: get latest audit
app.get("/tool/get_latest_audit", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM audittrails ORDER BY id DESC LIMIT 5");
    res.json({ success: true, audits: rows });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

// 🧠 Tool: execute Git command
app.post("/tool/execute_git", (req, res) => {
  const { command } = req.body;
  if (!command) return res.json({ success: false, error: "Git command is required" });

  // Basic security: only allow 'git ' commands
  if (!command.trim().startsWith("git ")) {
    return res.json({ success: false, error: "Only Git commands are allowed" });
  }

  // Prevent command injection (simple check)
  if (command.includes(";") || command.includes("&&") || command.includes("||")) {
    return res.json({ success: false, error: "Chained commands are not allowed for safety" });
  }

  console.log(`Executing Git: ${command}`);
  exec(command, { cwd: __dirname }, (error, stdout, stderr) => {
    if (error) {
      return res.json({ success: false, error: error.message, stderr });
    }
    res.json({ success: true, stdout, stderr });
  });
});

// 🧠 Tool: get live application log
app.get("/tool/get_live_log", (req, res) => {
  const { log_path, filter, lines = 200 } = req.query;
  if (!log_path) return res.json({ success: false, error: "log_path query parameter is required" });

  try {
    if (!fs.existsSync(log_path)) {
      return res.json({ success: false, error: `Log file not found at ${log_path}` });
    }

    const content = fs.readFileSync(log_path, "utf8");
    const allLines = content.split("\n");
    const recentLines = allLines.slice(-parseInt(lines, 10));
    
    let filteredLines = recentLines;
    if (filter) {
      const filterRegex = new RegExp(filter, "i"); // case-insensitive search
      filteredLines = recentLines.filter(line => filterRegex.test(line));
    }

    res.json({ success: true, log: filteredLines });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

// ❤️ Health check
app.get("/", (req, res) => {
  res.send("MCP Server is running 🚀");
});

app.listen(3000, () => {
  console.log("MCP Server running on http://localhost:3000");
  console.log(`Watching logs at: ${LOG_FILE_PATH}`);
});

app.listen(3000, () => {
  console.log("MCP Server running on http://localhost:3000");
  console.log(`Watching logs at: ${LOG_FILE_PATH}`);
});