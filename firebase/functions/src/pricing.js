export const calculateLineItems = (items, products) => {
  return items.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) {
      throw new Error(`Unknown product: ${item.productId}`);
    }
    return {
      ...item,
      price: product.price,
      total: product.price * item.quantity,
    };
  });
};

export const applyCoupon = (subtotal, coupon) => {
  if (!coupon) return { discount: 0, total: subtotal };
  const discount =
    coupon.type === 'percent'
      ? Math.min(subtotal * (coupon.value / 100), coupon.maxDiscount ?? Infinity)
      : coupon.value;
  return {
    discount,
    total: Math.max(subtotal - discount, 0),
  };
};

export const calculateOrderTotals = ({ items, products, coupon }) => {
  const lineItems = calculateLineItems(items, products);
  const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0);
  const { discount, total } = applyCoupon(subtotal, coupon);
  return { lineItems, subtotal, discount, total };
};
