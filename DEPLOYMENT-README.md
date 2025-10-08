# QuizKnow Deployment Guide

This guide will help you deploy the QuizKnow application to Vercel.

## Prerequisites

1. **MongoDB Atlas Account**: Set up a cloud MongoDB database
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **Git Repository**: Push your code to GitHub/GitLab

## Step 1: Set up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster (free tier is fine)
3. Create a database user
4. Get your connection string (it should look like):
   ```
   mongodb+srv://username:password@cluster.mongodb.net/quizknow?retryWrites=true&w=majority
   ```

## Step 2: Environment Variables

In your Vercel project settings, add these environment variables:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/quizknow?retryWrites=true&w=majority
JWT_SECRET=your-super-secure-random-string-here
NODE_ENV=production
```

## Step 3: Deploy to Vercel

### Option A: Using Vercel CLI (Recommended)

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. Follow the prompts and set environment variables when asked.

### Option B: Using Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your Git repository
4. Configure the project:
   - **Framework Preset**: Other
   - **Root Directory**: `./` (leave as is)
   - **Build Command**: Leave default
   - **Output Directory**: Leave default

5. Add environment variables in the project settings

## Step 4: Post-Deployment Configuration

### Update CORS (if needed)
The application is configured to allow Vercel domains automatically. If you need to allow additional domains, update the CORS configuration in `server.js`.

### File Uploads
Currently, file uploads are stored locally. For production, consider using:
- **AWS S3** or **Cloudinary** for file storage
- Update the multer configuration in `server.js`

## Step 5: Testing Your Deployment

1. **API Testing**: Visit `https://your-app.vercel.app/api/auth/test` (create a test route if needed)
2. **Frontend**: Visit `https://your-app.vercel.app` and try logging in/registering
3. **Database**: Check MongoDB Atlas to see if data is being saved

## Known Limitations

1. **WebSocket Real-time Features**: Socket.io is disabled in Vercel serverless environment. Real-time notifications won't work.
2. **File Uploads**: Large files may cause issues. Consider cloud storage.
3. **Serverless Cold Starts**: Initial requests may be slower due to serverless architecture.

## Troubleshooting

### Build Fails
- Check that all dependencies are in `package.json`
- Ensure `vercel.json` is correct
- Check build logs in Vercel dashboard

### API Not Working
- Verify environment variables are set correctly
- Check MongoDB connection string
- Ensure CORS is allowing your domain

### Frontend Not Loading
- Check that the build completed successfully
- Verify the routing in `vercel.json`

## Alternative Deployment Options

If Vercel doesn't meet your needs, consider:
- **Railway**: Better for persistent connections and file uploads
- **Render**: Similar to Vercel but with persistent services
- **Heroku**: Traditional but more expensive
- **AWS/DigitalOcean**: Full control but more complex

## Support

If you encounter issues, check:
1. Vercel deployment logs
2. MongoDB Atlas connection
3. Environment variables configuration
4. CORS settings
