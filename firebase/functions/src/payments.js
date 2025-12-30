import crypto from 'crypto';

export const verifyRazorpaySignature = ({ orderId, paymentId, signature, secret }) => {
  const payload = `${orderId}|${paymentId}`;
  const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  return expected === signature;
};
