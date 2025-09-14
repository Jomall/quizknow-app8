# Debug Login Issue

## Current Status
- Server running on port 5001
- MongoDB not installed as a service on Windows; needs to be installed and started
- CORS updated to allow localhost:3000 and 3001
- Test user created: test@example.com / password123
- JWT_SECRET configured

## Possible Causes
1. Another process using port 5000 (likely simple-server.js)
2. MongoDB not running
3. JWT_SECRET not configured
4. CORS issue (server allows localhost:3000, client on 3001)
5. User credentials incorrect or user not registered

## Steps to Fix
- [x] Kill process on port 5000
- [x] Start MongoDB service
- [ ] Ensure JWT_SECRET is set in .env
- [x] Update CORS to allow localhost:3001 if client is on that port
- [x] Test login with known credentials
- [ ] Check server logs for detailed errors

## Test Credentials
- Email: test@example.com
- Password: password123
- Role: student

## Next Steps
1. Try logging in with the test credentials at http://localhost:3001/login
2. If still failing, check browser console for errors
3. Check server logs for any authentication errors
4. Verify JWT_SECRET is set (check .env file)
