# Fix Quiz Access Control

## Problem
- QuizSessionPage shows "Quiz not found" instead of displaying the quiz sent from instructors
- The GET /quizzes/:id route is not protected and allows unauthorized access
- Students can potentially access quizzes they're not assigned to

## Solution
1. Add authentication to quizAPI.getQuizById
2. Protect the GET /quizzes/:id route with auth middleware
3. Add permission checks to ensure only instructors or assigned students can access quizzes
4. Hide questions appropriately based on permissions

## Changes Needed
- quizknow-app6/client/src/services/quizAPI.js: Add Authorization header to getQuizById
- quizknow-app6/routes/quizzes.js: Protect GET /:id route and add permission checks
