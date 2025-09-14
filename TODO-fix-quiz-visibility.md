# Fix Quiz Visibility on Student Dashboard

## Issue
A quiz was sent (assigned) to a student from an instructor but does not appear on the student dashboard.

## Root Cause
The `/quizzes/available` endpoint returns all quizzes assigned to the student regardless of publish status and connection status. Students should only see published quizzes from connected instructors.

## Solution
Modify the available quizzes endpoint to only return published quizzes assigned to the student from instructors they are connected to.

## Plan
- [x] Modify `/quizzes/available` route in `routes/quizzes.js` to filter by `isPublished: true`
- [ ] Test the change by assigning a published quiz and verifying it appears on student dashboard
- [ ] Test assigning an unpublished quiz and verify it does not appear

## Files to Modify
- quizknow-app4/routes/quizzes.js
