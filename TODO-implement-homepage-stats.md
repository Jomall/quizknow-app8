# TODO: Implement Homepage Stats Features

## Backend Changes
- [x] Add `/api/users/global-stats` public endpoint in `routes/users.js`
  - Returns activeUsers, quizzesCreated, questionsAnswered

## Frontend Changes
- [x] Add `getGlobalStats` function in `client/src/services/quizAPI.js`
- [x] Update `HomePage.jsx` to fetch stats on mount and display real numbers
  - Add state for stats
  - Add useEffect to fetch
  - Update JSX to use dynamic values
