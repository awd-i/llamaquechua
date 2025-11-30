# LlamaQuechua API Setup Guide

## Overview
Your backend now supports **REAL translation APIs** with automatic fallback to mock data if APIs aren't configured.

---

## Required APIs

### 1. Google Cloud Translation API

**Cost**: Free tier includes $300 credit (~15M characters)

#### Setup Steps:

1. **Create Google Cloud Account**
   - Go to https://console.cloud.google.com/
   - Create a new project (e.g., "LlamaQuechua")

2. **Enable Translation API**
   - Navigate to "APIs & Services" > "Library"
   - Search for "Cloud Translation API"
   - Click "Enable"

3. **Create Service Account**
   - Go to "IAM & Admin" > "Service Accounts"
   - Click "Create Service Account"
   - Name: `llamaquechua-translator`
   - Role: `Cloud Translation API User`
   - Click "Done"

4. **Generate JSON Key**
   - Click on the service account you just created
   - Go to "Keys" tab
   - Click "Add Key" > "Create new key"
   - Choose "JSON" format
   - Save the file to your backend folder (e.g., `google-credentials.json`)

5. **Get Project ID**
   - Find your project ID in the Google Cloud Console dashboard

---

### 2. OpenAI API (ChatGPT)

**Cost**: Pay-as-you-go
- GPT-4o-mini: ~$0.15/$0.60 per 1M tokens (input/output) - **RECOMMENDED**
- GPT-4o: ~$2.50/$10 per 1M tokens

#### Setup Steps:

1. **Create OpenAI Account**
   - Go to https://platform.openai.com/
   - Sign up or log in

2. **Add Payment Method**
   - Go to "Billing" > "Payment methods"
   - Add a credit card
   - Set up billing limits if desired

3. **Create API Key**
   - Go to "API keys" section
   - Click "Create new secret key"
   - Name it "LlamaQuechua"
   - **Copy the key immediately** (you won't see it again!)

---

## Configuration

### Step 1: Create `.env` file

In `/backend` folder, create a file named `.env`:

```bash
# Google Cloud Translation API
GOOGLE_APPLICATION_CREDENTIALS=./google-credentials.json
GOOGLE_PROJECT_ID=your-project-id-here

# OpenAI API
OPENAI_API_KEY=sk-your-openai-key-here

# Server
PORT=3001
```

### Step 2: Add your credentials

Replace the placeholders:
- `your-project-id-here` → Your Google Cloud project ID
- `sk-your-openai-key-here` → Your OpenAI API key
- Ensure `google-credentials.json` is in the backend folder

### Step 3: Secure your credentials

**IMPORTANT**: Add to `.gitignore`:

```
.env
google-credentials.json
```

---

## Testing

### Start the Backend

```bash
cd backend
node index.js
```

You should see:
```
🔧 Translation Mode: REAL APIs
✅ Google Cloud Translation API: Configured
✅ OpenAI API: Configured
Server running on http://localhost:3001
```

### Test Single Translation

```bash
curl "http://localhost:3001/api/translate?sentence=hello%20world"
```

### Test Experiment (100 sentences)

```bash
curl -X POST http://localhost:3001/api/experiment \
  -H "Content-Type: application/json" \
  -d '{"numSentences": 100}'
```

---

## Cost Estimates

### For 100 Sentences Experiment:
- **Google Translate**: ~$0.01-0.02 (500-1000 chars)
- **OpenAI (GPT-4o-mini)**: ~$0.01-0.03 per experiment
- **Total**: ~$0.02-0.05 per 100 translations

### Monthly Usage (assuming 50 experiments/month):
- **Total Cost**: ~$1-2.50/month

---

## Demo Mode (No APIs Required)

If you don't configure APIs, the system automatically uses **mock translations**:
- Google: Adds "qa" suffix to words
- ChatGPT: Randomly adds "kuna" or "mana" to simulate hallucinations
- All math/statistics remain accurate

---

## Troubleshooting

### "No API keys found" message
- Check `.env` file exists in `/backend`
- Verify all three variables are set
- Check file paths are correct

### Google API errors
- Verify billing is enabled in Google Cloud
- Check Translation API is enabled
- Ensure service account has correct permissions

### OpenAI API errors
- Check API key is valid
- Verify billing is set up
- Check usage limits haven't been exceeded

---

## Security Best Practices

1. **Never commit** `.env` or credentials files
2. **Set API quotas** in Google Cloud to prevent overuse
3. **Set spending limits** in OpenAI billing settings
4. **Rotate keys** periodically
5. Use **environment variables** in production

---

## Need Help?

- Google Cloud Translation: https://cloud.google.com/translate/docs
- OpenAI API: https://platform.openai.com/docs
- Issues: Check console logs for detailed error messages
