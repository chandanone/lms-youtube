import Razorpay from 'razorpay';
import crypto from 'crypto';

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  throw new Error('Missing Razorpay credentials in environment variables');
}

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export const verifyPaymentSignature = (
  orderId: string,
  paymentId: string,
  signature: string
): boolean => {
  try {
    const text = `${orderId}|${paymentId}`;
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(text)
      .digest('hex');
    
    return generated_signature === signature;
  } catch (error) {
    console.error('Payment verification error:', error);
    return false;
  }
};

export const verifyWebhookSignature = (
  webhookBody: string,
  webhookSignature: string
): boolean => {
  try {
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(webhookBody)
      .digest('hex');
    
    return expectedSignature === webhookSignature;
  } catch (error) {
    console.error('Webhook verification error:', error);
    return false;
  }
};
