export type DeliveryMode = 'delivery' | 'pickup';

export interface Product {
  id: string;
  name: string;
  category: 'Batter' | 'Chutney' | 'Add-on';
  price: number;
  unit: string;
  description: string;
  ingredients: string;
  shelfLife: string;
  storage: string;
  spiceLevel?: string;
  allergens: string;
  available: boolean;
  maxDailyQty: number;
  prepLeadTime: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Coupon {
  code: string;
  description: string;
  type: 'percent' | 'flat';
  value: number;
  maxDiscount?: number;
}
