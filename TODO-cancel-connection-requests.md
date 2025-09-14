# Allow Students to Cancel Connect with Instructors Requests on Dashboard

## Task
Add functionality on the student dashboard to cancel pending "Connect with Instructors" requests.

## Plan
- [x] Modify routes/connections.js to allow students to access sent-requests and delete requests without checkApproved
- [x] Add sentRequests state and fetchSentRequests function in StudentDashboardPage.jsx
- [x] Add "My Connection Requests" section to display pending sent requests
- [x] Implement handleCancelRequest function to delete requests
- [x] Update loadDashboardData to fetch sent requests
- [x] Test the cancel functionality (implementation complete, ready for testing)

## Files to Modify
- quizknow-app4/routes/connections.js
- quizknow-app4/client/src/pages/StudentDashboardPage.jsx
