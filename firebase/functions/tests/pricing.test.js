import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateOrderTotals, applyCoupon } from '../src/pricing.js';
import { verifyRazorpaySignature } from '../src/payments.js';

const products = [
  { id: 'idli', price: 120 },
  { id: 'chutney', price: 60 },
];

test('calculateOrderTotals returns subtotal and total', () => {
  const result = calculateOrderTotals({
    items: [
      { productId: 'idli', quantity: 2 },
      { productId: 'chutney', quantity: 1 },
    ],
    products,
    coupon: { type: 'flat', value: 50 },
  });

  assert.equal(result.subtotal, 300);
  assert.equal(result.discount, 50);
  assert.equal(result.total, 250);
});

test('applyCoupon caps percentage discounts', () => {
  const result = applyCoupon(1000, { type: 'percent', value: 20, maxDiscount: 150 });
  assert.equal(result.discount, 150);
  assert.equal(result.total, 850);
});

test('verifyRazorpaySignature validates signature', () => {
  const secret = 'test_secret';
  const orderId = 'order_123';
  const paymentId = 'pay_456';
  const signature = '6c343620f1910da483982cf25b9dc33d709afdd25930f08964ef60b65aefa831';

  const valid = verifyRazorpaySignature({ orderId, paymentId, signature, secret });
  assert.equal(valid, true);
});
