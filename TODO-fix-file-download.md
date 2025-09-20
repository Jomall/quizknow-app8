# TODO: Fix File Download Issue

## Description
When file download is clicked on the students dashboard under Received Content then view, nothing is downloaded to the user local machine.

## Root Cause
- The original code used `window.open()` to open the file URL directly, but the URL was incorrect (pointing to client instead of server).
- No authentication check for file downloads.

## Solution
- Add a secure download endpoint in the server that checks permissions and serves the file.
- Update the client to use the new endpoint with proper download triggering.

## Steps Completed
- [x] Add GET /:id/download route in routes/content.js
  - Checks if user is instructor or allowed student
  - Uses res.download() to send the file
- [x] Update handleDownload in ContentViewPage.jsx
  - Creates a temporary link to the download endpoint
  - Sets download attribute to force download
  - Clicks the link programmatically

## Next Steps
- [ ] Test the download functionality
  - Start the server and client
  - Upload content as instructor
  - Assign to student
  - Login as student, go to dashboard, view content, click download
  - Verify file downloads to local machine

## Files Modified
- quizknow-app6/routes/content.js: Added download endpoint
- quizknow-app6/client/src/pages/ContentViewPage.jsx: Updated handleDownload function
