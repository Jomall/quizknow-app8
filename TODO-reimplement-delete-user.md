# TODO: Re-implement Delete and Suspend User Features for Admin Dashboard

## Tasks
- [x] Add isSuspended field to User model
- [x] Add checkSuspended middleware
- [x] Add PUT /suspend/:id route to routes/users.js
- [x] Add DELETE /:id route to routes/users.js with cascading deletes
- [x] Add suspend icon button to AdminDashboardPage.jsx for each user
- [x] Add delete icon button to AdminDashboardPage.jsx for each user
- [x] Add handleSuspendUser and handleDeleteUser functions and confirmation dialogs to AdminDashboardPage.jsx
- [x] Add BlockIcon, CheckCircleIcon, DeleteIcon imports to AdminDashboardPage.jsx
- [x] Add Dialog components for suspend and delete confirmations to AdminDashboardPage.jsx
- [x] Update TODO-delete-user-registrations.md to reflect re-implementation
- [ ] Test the suspend and delete functionalities
