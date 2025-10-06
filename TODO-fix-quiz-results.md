# Fix Quiz Results Display Issue

## Problem
Quiz results are showing incorrect scores even when students enter correct answers. The issue is in the backend submission logic where answers are not being properly compared to correct answers.

## Root Cause
In `routes/submissions.js`, the submission endpoint expects `answer.selectedAnswer` but the frontend sends `answer.answer`. This causes all answers to be marked as incorrect.

## Steps to Fix
- [ ] Fix answer field access in `routes/submissions.js` submission endpoint
- [ ] Ensure consistent answer field naming between frontend and backend
- [ ] Test the fix by running the app and verifying quiz results display correctly
- [ ] Update any related code if needed

## Files to Edit
- `routes/submissions.js` - Fix answer comparison logic
