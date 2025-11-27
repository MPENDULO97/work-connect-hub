# 🇿🇦 PayFast Implementation Complete!

## ✅ Stripe Replaced with PayFast

PayFast is a South African payment gateway that's perfect for local businesses. All payment functionality has been migrated from Stripe to PayFast.

---

## 🔑 Get PayFast Credentials

### 1. Sign Up for PayFast

**Sandbox (Testing):**
1. Go to: https://www.payfast.co.za/
2. Click "Sign Up" → "Sandbox Account"
3. Complete registration

**Live (Production):**
1. Go to: https://www.payfast.co.za/
2. Click "Sign Up" → "Merchant Account"
3. Complete business verification

### 2. Get Your Credentials

1. Login to PayFast dashboard
2. Go to "Settings" → "Integration"
3. Copy your credentials:
   - **Merchant ID**
   - **Merchant Key**
   - **Passphrase** (create one if not set)

### 3. Update .env

```env
# PayFast Configuration
PAYFAST_MERCHANT_ID="10000100"
PAYFAST_MERCHANT_KEY="46f0cd694581a"
PAYFAST_PASSPHRASE="your_secure_passphrase_here"
PAYFAST_MODE="sandbox"  # or "live" for production
```

**Sandbox Test Credentials:**
- Merchant ID: `10000100`
- Merchant Key: `46f0cd694581a`
- These work for testing without signup!

---

## 💳 How PayFast Works

### Payment Flow

1. **Create Payment**
   - Backend generates PayFast payment form data
   - Returns payment URL and signed data

2. **Redirect to PayFast**
   - Frontend redirects user to PayFast payment page
   - User completes payment on PayFast

3. **Payment Notification (ITN)**
   - PayFast sends instant notification to your server
   - Server verifies signature and updates payment status

4. **Return to Site**
   - User redirected back to your site
   - Show success/cancel message

---

## 🔧 API Changes

### Old (Stripe)
```bash
POST /api/payments/create-intent
POST /api/payments/capture
POST /api/payments/connect-account
POST /api/payments/webhook
```

### New (PayFast)
```bash
POST /api/payments/create-payment
POST /api/payments/confirm
POST /api/payments/setup-payout
POST /api/payments/payfast-notify
```

---

## 📡 New API Endpoints

### 1. Create Payment

```bash
POST /api/payments/create-payment
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "jobId": "job_id_here",
  "paymentMethod": "card"  # or "cash"
}
```

**Response:**
```json
{
  "paymentUrl": "https://sandbox.payfast.co.za/eng/process",
  "paymentData": {
    "merchant_id": "10000100",
    "merchant_key": "46f0cd694581a",
    "amount": "350.00",
    "item_name": "Job: Fix leaking tap",
    "signature": "generated_signature",
    ...
  },
  "paymentId": "JOB_123_1234567890",
  "amount": 35000,
  "feeAmount": 3500
}
```

### 2. Confirm Payment

```bash
POST /api/payments/confirm
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "jobId": "job_id_here",
  "confirmationCode": "123456"
}
```

### 3. Setup Worker Payout

```bash
POST /api/payments/setup-payout
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "bankName": "FNB",
  "accountNumber": "62123456789",
  "accountType": "Cheque",
  "branchCode": "250655"
}
```

### 4. PayFast ITN (Webhook)

```bash
POST /api/payments/payfast-notify
Content-Type: application/x-www-form-urlencoded

# PayFast sends this automatically
# No authentication needed - verified by signature
```

---

## 💻 Frontend Integration

### Create Payment Form

```typescript
// Create payment
const response = await fetch('/api/payments/create-payment', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    jobId: job._id,
    paymentMethod: 'card'
  })
});

const { paymentUrl, paymentData } = await response.json();

// Create form and submit to PayFast
const form = document.createElement('form');
form.method = 'POST';
form.action = paymentUrl;

Object.keys(paymentData).forEach(key => {
  const input = document.createElement('input');
  input.type = 'hidden';
  input.name = key;
  input.value = paymentData[key];
  form.appendChild(input);
});

document.body.appendChild(form);
form.submit();
```

### React Component Example

```typescript
import { useState } from 'react';
import { Button } from '@/components/ui/button';

function PaymentButton({ jobId }: { jobId: string }) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/payments/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authService.getToken()}`
        },
        body: JSON.stringify({
          jobId,
          paymentMethod: 'card'
        })
      });

      const { paymentUrl, paymentData } = await response.json();

      // Create and submit form
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = paymentUrl;

      Object.entries(paymentData).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = String(value);
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handlePayment} disabled={loading}>
      {loading ? 'Processing...' : 'Pay with PayFast'}
    </Button>
  );
}
```

---

## 🧪 Testing

### Test Cards (Sandbox)

PayFast sandbox accepts any card details for testing:
- **Card Number:** Any valid format (e.g., 4111 1111 1111 1111)
- **CVV:** Any 3 digits
- **Expiry:** Any future date

### Test Payment Flow

```bash
# 1. Create job
curl -X POST http://localhost:5000/api/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Test Job",
    "description": "Testing PayFast",
    "category": "Plumbing",
    "price": 100
  }'

# 2. Accept job (as worker)
curl -X POST http://localhost:5000/api/jobs/JOB_ID/accept \
  -H "Authorization: Bearer WORKER_TOKEN"

# 3. Create payment
curl -X POST http://localhost:5000/api/payments/create-payment \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer POSTER_TOKEN" \
  -d '{
    "jobId": "JOB_ID",
    "paymentMethod": "card"
  }'

# 4. Use returned paymentUrl and paymentData to redirect user
# PayFast will send ITN to /api/payments/payfast-notify

# 5. After payment, confirm job completion
curl -X POST http://localhost:5000/api/payments/confirm \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer POSTER_TOKEN" \
  -d '{
    "jobId": "JOB_ID",
    "confirmationCode": "123456"
  }'
```

---

## 🔐 Security Features

### Signature Verification
- All PayFast requests are signed with MD5 hash
- Server verifies signature before processing
- Prevents tampering and fraud

### ITN Validation
- PayFast sends instant transaction notifications
- Server validates signature and payment status
- Updates database only after verification

### Passphrase
- Additional security layer
- Set in PayFast dashboard and .env
- Used in signature generation

---

## 💰 Fees & Pricing

### PayFast Fees
- **Transaction Fee:** 4.5% + R2 per transaction
- **Monthly Fee:** R0 (no monthly fees)
- **Setup Fee:** R0

### Platform Fees (Your App)
- **First 30 days:** FREE
- **After 30 days:** 10% platform fee
- Calculated automatically

### Example Calculation
```
Job Price: R350
PayFast Fee: R350 × 4.5% + R2 = R17.75
Platform Fee: R350 × 10% = R35 (after free trial)
Worker Receives: R350 - R17.75 - R35 = R297.25
```

---

## 🚀 Production Deployment

### 1. Switch to Live Mode

Update `.env`:
```env
PAYFAST_MODE="live"
PAYFAST_MERCHANT_ID="your_live_merchant_id"
PAYFAST_MERCHANT_KEY="your_live_merchant_key"
PAYFAST_PASSPHRASE="your_live_passphrase"
```

### 2. Update Notify URL

In PayFast dashboard:
1. Go to Settings → Integration
2. Set Notify URL: `https://yourdomain.com/api/payments/payfast-notify`
3. Enable ITN

### 3. Test Live Payments

- Start with small test transactions
- Verify ITN notifications work
- Check payment confirmations

### 4. Bank Account Setup

For worker payouts:
- Collect bank details via `/api/payments/setup-payout`
- Verify accounts manually
- Process payouts via PayFast dashboard or API

---

## 📊 Database Changes

### User Model
```javascript
{
  // Removed: stripeAccountId, stripeCustomerId
  // Added:
  payoutDetails: {
    bankName: String,
    accountNumber: String,
    accountType: String,
    branchCode: String,
    verified: Boolean
  },
  feeDue: Number,
  accountLocked: Boolean,
  freeTrialEndsAt: Date
}
```

### Transaction Model
```javascript
{
  // Removed: stripePaymentIntentId, stripeChargeId
  // Added:
  payfastPaymentId: String,
  payfastTransactionId: String,
  paymentMethod: 'card' | 'cash',
  status: 'pending' | 'authorized' | 'captured' | 'refunded' | 'failed'
}
```

---

## 🆘 Troubleshooting

### "Invalid signature" error
- Check passphrase matches PayFast dashboard
- Ensure no extra spaces in .env
- Verify merchant ID and key are correct

### ITN not received
- Check notify URL is publicly accessible
- Verify URL in PayFast dashboard
- Check server logs for incoming requests

### Payment not updating
- Check ITN handler logs
- Verify signature validation
- Ensure database connection is stable

### Sandbox not working
- Use test credentials: ID `10000100`, Key `46f0cd694581a`
- Any card details work in sandbox
- Check mode is set to "sandbox"

---

## 📚 Resources

- **PayFast Docs:** https://developers.payfast.co.za/
- **Integration Guide:** https://developers.payfast.co.za/docs#step_1_the_payment_request
- **ITN Guide:** https://developers.payfast.co.za/docs#instant_transaction_notification
- **Sandbox:** https://sandbox.payfast.co.za/
- **Support:** support@payfast.co.za

---

## ✅ Migration Checklist

- [x] Removed Stripe package
- [x] Created PayFast config
- [x] Updated payment controller
- [x] Updated payment routes
- [x] Updated User model
- [x] Updated Transaction model
- [x] Updated .env file
- [x] Created ITN handler
- [x] Added signature verification
- [ ] Test sandbox payments
- [ ] Update frontend components
- [ ] Test ITN notifications
- [ ] Setup live account
- [ ] Deploy to production

---

🎉 **PayFast integration complete!** Your platform now uses a South African payment gateway.

**Next:** Test the payment flow with sandbox credentials!
