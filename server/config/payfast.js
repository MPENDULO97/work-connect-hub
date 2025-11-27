import crypto from 'crypto';

const config = {
  merchantId: process.env.PAYFAST_MERCHANT_ID || '10000100',
  merchantKey: process.env.PAYFAST_MERCHANT_KEY || '46f0cd694581a',
  passphrase: process.env.PAYFAST_PASSPHRASE || '',
  mode: process.env.PAYFAST_MODE || 'sandbox',
  sandboxUrl: 'https://sandbox.payfast.co.za/eng/process',
  liveUrl: 'https://www.payfast.co.za/eng/process'
};

// Generate signature for PayFast
export const generateSignature = (data, passPhrase = null) => {
  // Create parameter string
  let pfOutput = '';
  for (let key in data) {
    if (data.hasOwnProperty(key)) {
      if (data[key] !== '') {
        pfOutput += `${key}=${encodeURIComponent(data[key].toString().trim()).replace(/%20/g, '+')}&`;
      }
    }
  }

  // Remove last ampersand
  let getString = pfOutput.slice(0, -1);
  
  if (passPhrase !== null) {
    getString += `&passphrase=${encodeURIComponent(passPhrase.trim()).replace(/%20/g, '+')}`;
  }

  return crypto.createHash('md5').update(getString).digest('hex');
};

// Verify PayFast signature
export const verifySignature = (data, signature, passPhrase = null) => {
  const tempData = { ...data };
  delete tempData.signature;
  
  const generatedSignature = generateSignature(tempData, passPhrase);
  return generatedSignature === signature;
};

// Get PayFast URL based on mode
export const getPayFastUrl = () => {
  return config.mode === 'live' ? config.liveUrl : config.sandboxUrl;
};

export default config;
