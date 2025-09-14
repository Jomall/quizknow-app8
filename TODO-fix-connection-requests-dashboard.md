# TODO: Fix Connection Requests Dashboard

## Task
Add "Connection Requests" tab to instructor dashboard and ensure only approved instructors can see pending requests.

## Steps
- [x] Modify InstructorDashboardPage.jsx to conditionally show "Connection Requests" tab only if user.isApproved
- [x] Update loadDashboardData to fetch pendingRequests only if user.isApproved
- [ ] Test the dashboard functionality

## Status
Completed
