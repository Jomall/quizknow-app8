# TODO: Fix Delete and Block User Functionality in Admin Dashboard

## Information Gathered
- AdminDashboardPage.jsx has delete and suspend buttons with handlers that call API endpoints
- routes/users.js has DELETE /:id and PUT /suspend/:id routes implemented
- Missing ContentView import in routes/users.js causes ReferenceError when deleting instructors
- Frontend lacks user feedback for API call results
- "Block" button refers to suspend functionality

## Plan
- [x] Add missing ContentView import to routes/users.js
- [x] Add success/error handling with alerts in AdminDashboardPage.jsx
- [x] Restart server to apply backend changes
- [ ] Test delete and suspend functionality

## Dependent Files to be edited
- quizknow-app4/routes/users.js
- quizknow-app4/client/src/pages/AdminDashboardPage.jsx

## Followup steps
- Test delete user for student, instructor, admin roles
- Test suspend/unsuspend user
- Verify cascading deletes work correctly
