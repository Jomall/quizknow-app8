# TODO: Implement Quiz Submission Review Feature

## Backend Changes
- [x] Add GET /quiz/:id/submissions route in routes/quiz.js to fetch completed sessions for a quiz (instructor only)

## Frontend Changes
- [x] Add getQuizSubmissions method to client/src/services/quizAPI.js
- [x] Add new "Review Submissions" tab in InstructorDashboardPage.jsx
- [x] Create QuizSubmissionReview.jsx component for displaying submission details
- [x] Update App.js routing for submission review page

## Testing
- [ ] Test backend route authorization
- [ ] Test API integration
- [ ] Test UI functionality for reviewing submissions
