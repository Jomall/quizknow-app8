# Student Dashboard Updates

## Requirements
- Update Total Quizzes count once a quiz is received (already implemented via /quiz-stats)
- Do AVG Score calculation on all quizzes once completed (already implemented)
- Study time based on time it took to finish quizzes (already implemented, only quiz timeSpent)
- Update Available Quizzes: show complete status on completed quizzes
- Pending Quizzes: show submitted but not reviewed quizzes, remove completed from pending

## Changes Needed
1. Modify `/pending` route in `routes/quizzes.js` to return quizzes with submissions that are not completed
2. Update `StudentDashboardPage.jsx` to show status in Available Quizzes list and change button text for completed quizzes
3. Ensure stats are updated correctly (already done)

## Implementation Steps
1. Update pending quizzes logic
2. Update frontend display for available quizzes
3. Test the changes
