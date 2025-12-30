import { calculateOrderTotals } from './pricing.js';
import { verifyRazorpaySignature } from './payments.js';

export const createOrder = async ({ items, products, coupon }) => {
  const totals = calculateOrderTotals({ items, products, coupon });
  return {
    status: 'confirmed',
    totals,
  };
};

export const verifyPayment = ({ orderId, paymentId, signature, secret }) => {
  const isValid = verifyRazorpaySignature({ orderId, paymentId, signature, secret });
  if (!isValid) {
    throw new Error('Invalid payment signature');
  }
  return { status: 'paid' };
};
