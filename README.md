# Slack Connect
A full-stack application that allows users to connect their Slack workspace, send messages instantly, and schedule messages for future delivery.

# 📦 Tech Stack
Frontend: React, TypeScript  
Backend: Node.js, Express.js, TypeScript  
Database: SQLite / MongoDB / LowDB  
Authentication: OAuth 2.0 (Slack)  
 
# 🧠 Architectural Overview
  OAuth Flow  
    User clicks "Connect to Slack".  
    Redirects to Slack OAuth page.  
    On success, Slack returns an access token and refresh token.  
    Tokens are securely stored in the backend.  

Token Management  
    Access tokens are stored with expiry time.  
    When expired, backend uses refresh token to get a new access token.  
    This ensures seamless user experience without re-authentication.  

Message Scheduling  
    Messages are stored with timestamp and channel info.  
    checks for due messages and sends them via Slack API.  

# 🧗 Challenges & Learnings  
Challenges  
    Understanding Slack's OAuth flow and scopes  
    Managing token expiry and refresh logic  
    Ensuring scheduled messages are reliably sent  

Learnings  
    Deepened understanding of OAuth 2.0 and token lifecycle  
    Improved skills in full-stack development and API integration  
    Learned how to manage background tasks in Node.js  


# Live Demo - https://cobalt-assignment.netlify.app/ 
