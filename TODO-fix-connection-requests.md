# Fix Instructor Dashboard Not Showing Student Connection Requests

## Problem
- Instructor dashboard not displaying student connection requests
- ConnectionRequests component uses incorrect API_BASE_URL default ('http://localhost:5000/api' instead of '/api')
- Server runs on port 5001, proxy set to 5001, but component defaults to 5000

## Root Cause
- In ConnectionRequests.jsx, API_BASE_URL defaults to 'http://localhost:5000/api' while other components use '/api'
- This causes API calls to hit wrong port (5000 instead of 5001 via proxy)

## Solution
- Update ConnectionRequests.jsx to use '/api' as default for API_BASE_URL
- Ensure instructor account is approved (isApproved: true)
- Verify connection requests exist in database

## Steps
- [ ] Update API_BASE_URL in ConnectionRequests.jsx
- [ ] Check if instructor is approved using approve-instructor.js
- [ ] Test connection request flow: student sends request, instructor sees it
- [ ] Verify API endpoint /api/connections/pending-requests works

## Files to Modify
- quizknow-app4/client/src/components/common/ConnectionRequests.jsx
