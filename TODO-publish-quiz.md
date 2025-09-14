# Implement Quiz Publishing to Selected Students

## Issue
Instructor needs to be able to publish quizzes to selected connected students from the dashboard, similar to how content is assigned.

## Solution
Add publish functionality that sets quiz as published and assigns to selected students in one action.

## Plan
- [ ] Add publish endpoint in routes/quizzes.js that sets isPublished=true and assigns to studentIds
- [ ] Update ManageAssignmentsPage.jsx to show publish status of quizzes
- [ ] Add "Publish Quiz" button for unpublished quizzes that opens student selector
- [ ] Keep "Assign Students" for already published quizzes
- [ ] Test publishing and verify quiz appears on student dashboard

## Files to Modify
- quizknow-app4/routes/quizzes.js
- quizknow-app4/client/src/pages/ManageAssignmentsPage.jsx
