# TODO: Fix Delete and Block User Functionality in Admin Dashboard

## Issues Identified
- Missing import for ContentView in routes/users.js causing ReferenceError on delete
- No user feedback on success/failure of delete/suspend operations
- "Block" button is actually suspend/unsuspend functionality

## Tasks
- [x] Add ContentView import to routes/users.js (already present)
- [x] Add success/error alerts in AdminDashboardPage.jsx for delete and suspend operations (already present)
- [x] Add role check in backend to ensure only admin can delete/suspend
- [x] Fix opening 2 dialogs by adding stopPropagation and simplifying CustomDialog
- [x] Update button labels to "Block"/"Unblock" for clarity
- [ ] Test delete functionality for different user roles
- [ ] Test suspend/unsuspend functionality
