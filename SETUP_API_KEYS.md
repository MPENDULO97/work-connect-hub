# 🔑 Setup API Keys - Quick Guide

Your Work Connect platform needs 3 API keys to enable all features. Here's how to get them:

---

## 1. Stripe (Payment Processing) 💳

### Sign Up
1. Go to: https://dashboard.stripe.com/register
2. Create account (use your email)
3. Complete business information

### Get Test Keys
1. Go to: https://dashboard.stripe.com/test/apikeys
2. Copy **Publishable key** (starts with `pk_test_`)
3. Click "Reveal test key" for **Secret key** (starts with `sk_test_`)

### Setup Webhook
1. Go to: https://dashboard.stripe.com/test/webhooks
2. Click "Add endpoint"
3. Endpoint URL: `http://localhost:5000/api/payments/webhook`
4. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
5. Copy **Signing secret** (starts with `whsec_`)

### Add to .env
```env
STRIPE_SECRET_KEY="sk_test_51..."
STRIPE_PUBLISHABLE_KEY="pk_test_51..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

**Cost:** FREE for testing, 2.9% + R2 per transaction in production

---

## 2. Mapbox (Maps & Directions) 🗺️

### Sign Up
1. Go to: https://account.mapbox.com/auth/signup/
2. Create account
3. Verify email

### Get Access Token
1. Go to: https://account.mapbox.com/access-tokens/
2. Copy your **Default public token** (starts with `pk.eyJ1`)
3. Or create new token with these scopes:
   - `styles:read`
   - `fonts:read`
   - `datasets:read`

### Add to .env
```env
MAPBOX_TOKEN="pk.eyJ1..."
VITE_MAPBOX_TOKEN="pk.eyJ1..."
```

**Cost:** FREE tier includes:
- 50,000 map loads/month
- 100,000 API requests/month

---

## 3. OpenWeather (Weather Data) ☀️

### Sign Up
1. Go to: https://home.openweathermap.org/users/sign_up
2. Create account
3. Verify email

### Get API Key
1. Go to: https://home.openweathermap.org/api_keys
2. Copy your **API key** (or create new one)
3. Wait 10-15 minutes for activation

### Add to .env
```env
OPENWEATHER_KEY="your_api_key_here"
```

**Cost:** FREE tier includes:
- 1,000 API calls/day
- Current weather + 5-day forecast

---

## Complete .env File

After getting all keys, your `.env` should look like this:

```env
# MongoDB Configuration
MONGO_URI="mongodb://localhost:27017/workconnect"

# JWT Secret
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_ORIGIN="http://localhost:8080"

# Frontend API URL
VITE_API_BASE_URL="http://localhost:5000"

# Stripe Configuration
STRIPE_SECRET_KEY="sk_test_51..."
STRIPE_PUBLISHABLE_KEY="pk_test_51..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Mapbox Configuration
MAPBOX_TOKEN="pk.eyJ1..."
VITE_MAPBOX_TOKEN="pk.eyJ1..."

# OpenWeather Configuration
OPENWEATHER_KEY="your_api_key_here"
```

---

## After Adding Keys

### 1. Restart Server
```bash
# Stop server (Ctrl+C)
npm run dev
```

### 2. Verify Setup

#### Test Stripe
```bash
curl -X POST http://localhost:5000/api/payments/create-intent \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"jobId":"test","paymentMethod":"card"}'
```

#### Test Mapbox
```bash
curl "http://localhost:5000/api/directions?from=28.0473,-26.2041&to=28.1881,-25.7479"
```

#### Test OpenWeather
```bash
curl "http://localhost:5000/api/weather?lat=-26.2041&lon=28.0473"
```

---

## Troubleshooting

### Stripe Errors

**"Invalid API Key"**
- Check if key starts with `sk_test_` (not `pk_test_`)
- Ensure no extra spaces in .env
- Restart server after adding key

**"Webhook signature verification failed"**
- Check webhook secret starts with `whsec_`
- Ensure webhook endpoint is correct
- Test with Stripe CLI: `stripe listen --forward-to localhost:5000/api/payments/webhook`

### Mapbox Errors

**"Unauthorized"**
- Check token starts with `pk.eyJ1`
- Ensure token has correct scopes
- Token might take a few minutes to activate

**"Map not loading"**
- Check `VITE_MAPBOX_TOKEN` is set (for frontend)
- Clear browser cache
- Check browser console for errors

### OpenWeather Errors

**"Invalid API key"**
- Wait 10-15 minutes after creating key
- Check key is copied correctly
- Ensure no extra spaces

**"API call limit exceeded"**
- Free tier: 1,000 calls/day
- Upgrade plan or wait 24 hours

---

## Production Setup

### Stripe
1. Complete business verification
2. Switch to live keys (starts with `sk_live_`)
3. Update webhook URL to production domain
4. Test with small real transaction

### Mapbox
1. Create production token
2. Restrict token to your domain
3. Monitor usage in dashboard

### OpenWeather
1. Consider paid plan for production
2. Monitor API usage
3. Implement caching to reduce calls

---

## Security Best Practices

### ✅ DO
- Keep secret keys in `.env` file
- Add `.env` to `.gitignore`
- Use different keys for dev/production
- Rotate keys periodically
- Monitor API usage

### ❌ DON'T
- Commit keys to Git
- Share keys publicly
- Use production keys in development
- Hardcode keys in source code
- Expose secret keys to frontend

---

## Cost Summary

| Service | Free Tier | Paid Plans |
|---------|-----------|------------|
| **Stripe** | Unlimited testing | 2.9% + R2 per transaction |
| **Mapbox** | 50k loads + 100k requests/month | From $5/month |
| **OpenWeather** | 1,000 calls/day | From $40/month |

**Total for development:** FREE ✅

**Estimated production cost (1000 users):**
- Stripe: ~R2,900/month (assuming R100 avg transaction)
- Mapbox: FREE (within limits)
- OpenWeather: FREE or $40/month
- **Total: ~R2,900-3,600/month**

---

## Need Help?

### Stripe
- Docs: https://stripe.com/docs
- Support: https://support.stripe.com/

### Mapbox
- Docs: https://docs.mapbox.com/
- Support: https://support.mapbox.com/

### OpenWeather
- Docs: https://openweathermap.org/api
- FAQ: https://openweathermap.org/faq

---

## Quick Test Script

Save this as `test-apis.sh`:

```bash
#!/bin/bash

echo "Testing APIs..."

echo "\n1. Testing Weather API..."
curl -s "http://localhost:5000/api/weather?lat=-26.2041&lon=28.0473" | head -n 5

echo "\n2. Testing Directions API..."
curl -s "http://localhost:5000/api/directions?from=28.0473,-26.2041&to=28.1881,-25.7479" | head -n 5

echo "\n3. Testing Health Check..."
curl -s "http://localhost:5000/api/health"

echo "\n\nAll tests complete!"
```

Run with: `bash test-apis.sh`

---

✅ **Once you have all 3 API keys, your platform will have full functionality!**

**Next:** See `COMPLETE_IMPLEMENTATION.md` for usage examples.
