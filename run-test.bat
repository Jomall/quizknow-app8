@echo off
echo Running test server...
cd /d %~dp0
node test-simple-server.js
pause
