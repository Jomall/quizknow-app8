# Debug Connection Requests Issue - SOLVED

## Problem
Instructor dashboard is not showing connection requests from students because the instructor account is not approved.

## Root Cause
From the console logs, we can see:
- Status: 403 Forbidden
- Response: "Account not approved"

This happens because:
1. In the User model, instructors default to `isApproved: false`
2. The `checkApproved` middleware blocks API calls for unapproved users
3. The `/api/connections/pending-requests` endpoint requires approval

## Solution
The instructor account needs to be approved. Here's how to fix it:

### Option 1: Use the Approval Script (Recommended)
1. Run the approval script I created:
   ```bash
   cd quizknow-app4
   node approve-instructor.js <instructor_username_or_email>
   ```

2. Replace `<instructor_username_or_email>` with the actual instructor's username or email

### Option 2: Manual Database Update
If you have access to MongoDB:
```javascript
// Connect to your database and run:
db.users.updateOne(
  { role: "instructor", username: "<instructor_username>" },
  { $set: { isApproved: true } }
)
```

### Option 3: Via Admin API (if you have an admin account)
If there's an admin user, they can approve instructors via:
```
PUT /api/users/approve-instructor/<instructor_id>
```

## After Approval
Once the instructor is approved:
1. Refresh the instructor dashboard
2. The connection requests should now load properly
3. You should see pending requests from students

## Verification
After running the approval script, check the console again. You should see:
- No more 403 errors
- API response with connection requests data
- Requests displayed in the UI

## Next Steps
1. Run the approval script with the instructor's credentials
2. Test the instructor dashboard
3. Verify that connection requests are now visible
