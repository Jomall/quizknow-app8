# TODO: Fix Delete Submission Functions

## Current Status
- Backend batch delete route implemented in `routes/submissions.js`
- Frontend API service method implemented in `client/src/services/quizAPI.js`
- Frontend UI updated in `client/src/pages/InstructorDashboardPage.jsx` to support batch selection and deletion

## Changes Made
- Fixed `quizSubmissions` state to be an object keyed by quizId instead of array
- Added batch selection functionality for submissions
- Implemented batch delete API call in frontend
- Added debugging logs to track API calls

## Testing Steps
- [ ] Start the application (backend and frontend)
- [ ] Navigate to instructor dashboard
- [ ] Go to "Review Submissions" tab
- [ ] Select multiple submissions from different quizzes using checkboxes
- [ ] Click "Clear Selected" button
- [ ] Verify submissions are deleted and UI updates correctly
- [ ] Check browser console for any errors
- [ ] Verify database: submissions removed, student records updated for retakes
- [ ] Test individual submission deletion still works
- [ ] Test edge cases: empty selection, single selection, all submissions selected

## Files Modified
- `client/src/pages/InstructorDashboardPage.jsx` - Updated state management and UI logic
- `routes/submissions.js` - Already had batch delete route
- `client/src/services/quizAPI.js` - Already had batch delete method

## Next Steps
- Run application and test the functionality
- Fix any issues found during testing
- Remove debug console.log statements after verification
