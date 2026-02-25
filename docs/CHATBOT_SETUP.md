# Chatbot Setup Instructions (Railway)

The chatbot uses Google Gemini AI to understand natural language queries and search the manuscript database.

## 1. Get a Gemini API Key (Free - 30 seconds)

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

## 2. Deploy to Railway

You already have Railway for Umami analytics, so we'll add the chatbot API there.

### Option A: Deploy from GitHub (Recommended)

1. **Push these changes to GitHub:**
   ```bash
   git add api/gemini.js pages/chatbot.md CHATBOT_SETUP.md
   git commit -m "Add Gemini chatbot API"
   git push
   ```

2. **Create new Railway service:**
   - Go to [railway.app](https://railway.app)
   - Open your existing Railway project (or create new one)
   - Click **+ New** → **GitHub Repo**
   - Select your `unknownhands` repository
   - Railway will auto-detect and deploy the `/api` directory

3. **Add environment variable:**
   - In your new service, go to **Variables** tab
   - Click **+ New Variable**
   - Add:
     - **Key**: `GEMINI_API_KEY`
     - **Value**: [paste your Gemini API key]
   - Click **Add**

4. **Get your Railway URL:**
   - Go to **Settings** tab
   - Under **Domains**, click **Generate Domain**
   - Copy the URL (e.g., `https://your-app.up.railway.app`)

5. **Update chatbot code:**
   - Open `pages/chatbot.md`
   - Find line ~325: `const RAILWAY_API_URL = 'https://YOUR-APP.up.railway.app/api/gemini';`
   - Replace `YOUR-APP` with your actual Railway domain
   - Commit and push:
     ```bash
     git add pages/chatbot.md
     git commit -m "Update Railway API URL"
     git push
     ```

### Option B: Quick Deploy via Railway CLI

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Deploy
railway up

# Add environment variable
railway variables set GEMINI_API_KEY="your-api-key-here"

# Get deployment URL
railway domain
```

## 3. Test the Chatbot

Once deployed and the URL is updated:

1. Visit your GitHub Pages site: `https://estellegvl.github.io/unknownhands/chatbot/`
2. Try queries like:
   - "manuscripts from the 15th century"
   - "Dominican monasteries in Germany"
   - "manuscripts from Deventer"

## How It Works

1. User asks a question in natural language
2. Frontend sends query to Railway API (`https://your-app.up.railway.app/api/gemini`)
3. Railway function calls Gemini API with your secure API key
4. Gemini parses the query into structured filters (type, date, location, etc.)
5. Frontend applies filters to the database and shows results

## Security

✅ **API key is secure**: Stored in Railway environment variables, never exposed to users  
✅ **Free tier**: 1500 requests/day (more than enough for an academic site)  
✅ **CORS enabled**: Only your site can call the API  

## Troubleshooting

### "Server configuration error: API key not set"
- Make sure you added `GEMINI_API_KEY` to Railway environment variables
- Ensure the variable name is exactly `GEMINI_API_KEY` (case-sensitive)
- Redeploy: `railway up` or push to GitHub

### "Failed to fetch" or CORS error
- Check that you updated the `RAILWAY_API_URL` in `pages/chatbot.md`
- Verify the Railway URL is correct
- Check Railway logs: `railway logs`

### "AI service error: 400"
- Your API key might be invalid
- Generate a new key at [Google AI Studio](https://aistudio.google.com/apikey)
- Update the environment variable in Railway

### Check Railway logs
```bash
railway logs
```

## Cost

**Railway Free Tier:**
- $5 credit per month
- Should be enough for low/moderate traffic
- Serverless functions are very cheap (~$0.000001 per request)

**Google Gemini Free Tier:**
- 15 requests per minute
- 1,500 requests per day
- 1 million tokens per month

Both are more than sufficient for a research website!

