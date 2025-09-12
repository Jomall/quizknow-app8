# Fix Quiz Creation Issue

## Problem
When clicking "PUBLISH QUIZ" on the Create New Quiz page, a 500 Internal Server Error occurs because the quiz data format doesn't match the server expectations.

## Root Causes
1. **Difficulty mismatch**: Client sends 'easy'/'medium'/'hard', but server expects 'beginner'/'intermediate'/'advanced'/'mixed'
2. **timeLimit location**: Client sends timeLimit at root level, but server expects it in settings.timeLimit
3. **Missing isPublished**: Quiz is created but not published (isPublished defaults to false)
4. **Extra fields**: Questions have 'isRequired' field not expected by server

## Solution
Transform quizData in handlePublish before sending to API:
- Map difficulty values
- Move timeLimit to settings.timeLimit
- Set isPublished: true
- Remove 'isRequired' from questions

## Files to Edit
- quizknow-app4/client/src/pages/CreateQuizPage.jsx: Update handlePublish to transform data
