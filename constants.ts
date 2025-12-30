import type { Coupon, Product } from './types';

export const APARTMENTS = [
  'Nikoo Homes 1',
  'Nikoo Homes 2',
  'Nikoo Homes 4',
  'Nikoo Homes 5',
  'Leela Residences',
  'Bharatiya City Towers',
];

export const DELIVERY_SLOTS = [
  { id: 'slot-1', label: 'Morning Slot A', window: '6:30 - 8:30 AM', note: 'Best for breakfast prep.' },
  { id: 'slot-2', label: 'Morning Slot B', window: '8:30 - 10:30 AM', note: 'Late breakfast or brunch.' },
];

export const PRODUCTS: Product[] = [
  {
    id: 'idli-dosa-1kg',
    name: 'Idli/Dosa Batter',
    category: 'Batter',
    price: 120,
    unit: '1 kg pouch',
    description: 'Slow-fermented with premium rice and urad dal.',
    ingredients: 'Idli rice, urad dal, fenugreek, filtered water',
    shelfLife: '3 days chilled',
    storage: 'Refrigerate immediately after delivery.',
    allergens: 'Contains urad dal (legume).',
    available: true,
    maxDailyQty: 80,
    prepLeadTime: '4 hours',
  },
  {
    id: 'ragi-batter-1kg',
    name: 'Ragi Batter',
    category: 'Batter',
    price: 140,
    unit: '1 kg pouch',
    description: 'High-fibre ragi blend for soft idlis.',
    ingredients: 'Ragi, idli rice, urad dal, fenugreek',
    shelfLife: '3 days chilled',
    storage: 'Keep in coldest fridge shelf.',
    allergens: 'Contains urad dal (legume).',
    available: true,
    maxDailyQty: 50,
    prepLeadTime: '5 hours',
  },
  {
    id: 'millet-batter-1kg',
    name: 'Millet Batter',
    category: 'Batter',
    price: 160,
    unit: '1 kg pouch',
    description: 'Foxtail + little millet for nutty dosas.',
    ingredients: 'Foxtail millet, little millet, urad dal',
    shelfLife: '2 days chilled',
    storage: 'Refrigerate and use within 48 hrs.',
    allergens: 'Contains urad dal (legume).',
    available: true,
    maxDailyQty: 40,
    prepLeadTime: '5 hours',
  },
  {
    id: 'coconut-chutney-250',
    name: 'Coconut Chutney',
    category: 'Chutney',
    price: 55,
    unit: '250 g cup',
    description: 'Classic coconut with roasted dal and curry leaves.',
    ingredients: 'Coconut, roasted chana, green chilli, curry leaves',
    shelfLife: '2 days chilled',
    storage: 'Keep chilled and stir before serving.',
    spiceLevel: 'Mild',
    allergens: 'Contains coconut and roasted chana.',
    available: true,
    maxDailyQty: 120,
    prepLeadTime: '2 hours',
  },
  {
    id: 'tomato-chutney-250',
    name: 'Tomato Onion Chutney',
    category: 'Chutney',
    price: 60,
    unit: '250 g cup',
    description: 'Tangy, slow-cooked tomato-onion blend.',
    ingredients: 'Tomato, onion, garlic, chilli, tamarind',
    shelfLife: '2 days chilled',
    storage: 'Refrigerate and finish quickly.',
    spiceLevel: 'Medium',
    allergens: 'Contains garlic and onion.',
    available: true,
    maxDailyQty: 120,
    prepLeadTime: '2 hours',
  },
  {
    id: 'pudina-chutney-250',
    name: 'Pudina Chutney',
    category: 'Chutney',
    price: 60,
    unit: '250 g cup',
    description: 'Fresh mint and coriander with a zing.',
    ingredients: 'Mint, coriander, coconut, green chilli',
    shelfLife: '2 days chilled',
    storage: 'Store chilled. Shake before serving.',
    spiceLevel: 'Medium',
    allergens: 'Contains coconut.',
    available: true,
    maxDailyQty: 100,
    prepLeadTime: '2 hours',
  },
];

export const COUPONS: Coupon[] = [
  { code: 'FRESH50', description: '₹50 off on your first order.', type: 'flat', value: 50 },
  { code: 'SUB10', description: '10% off monthly subscriptions.', type: 'percent', value: 10, maxDiscount: 120 },
];

export const HOME_HIGHLIGHTS = [
  { title: 'Batter freshness', detail: 'Made at 4:00 AM' },
  { title: 'Next slot', detail: '6:30 - 8:30 AM' },
  { title: 'New', detail: 'Millet batter launched' },
];

export const SUBSCRIPTIONS = [
  {
    id: 'sub-1',
    title: 'Idli/Dosa Batter 1kg',
    description: 'Every Mon/Wed/Fri morning. Auto reminder the night before.',
    frequency: 'Weekly',
    slot: '6:30 - 8:30 AM',
  },
  {
    id: 'sub-2',
    title: '2kg Family Sunday Pack',
    description: 'Every Sunday with coconut chutney. Pause anytime.',
    frequency: 'Monthly',
    slot: '8:30 - 10:30 AM',
  },
];

export const FAQ_ITEMS = [
  { title: 'Fermentation tips', content: 'Keep batter at room temp for 30 mins before cooking for best rise.' },
  { title: 'Storage', content: 'Always refrigerate immediately. Use within shelf life for best taste.' },
  { title: 'How to use', content: 'Add salt just before cooking and stir gently.' },
];

export const INTEGRATIONS = [
  { title: 'Order via WhatsApp', description: 'Fallback if app access is limited.', cta: 'Open WhatsApp' },
  { title: 'Instagram', description: 'Latest fresh batch updates.', cta: 'View feed' },
  { title: 'Swiggy / Blinkit', description: 'Coming soon in your neighborhood.', cta: 'Coming soon' },
];

export const ADMIN_SECTIONS = [
  { title: 'Products & inventory', description: 'CRUD products, max daily qty, and availability.' },
  { title: 'Subscriptions', description: 'Pause, skip, and modify schedules.' },
  { title: 'Coupons & promos', description: 'First order discounts and referrals.' },
  { title: 'Customers', description: 'Contact info, history, wallet balances.' },
  { title: 'Broadcast notifications', description: 'Send batch alerts and new launch updates.' },
  { title: 'Settings', description: 'Slots, WhatsApp, and Swiggy/Blinkit links.' },
];

export const MOCK_ORDERS = [
  { id: 'FG-1024', customer: 'Anika Rao', apartment: 'Nikoo Homes 4', slot: '6:30 - 8:30 AM', status: 'Prepared' },
  { id: 'FG-1025', customer: 'Rohit Menon', apartment: 'Nikoo Homes 1', slot: '6:30 - 8:30 AM', status: 'Confirmed' },
  { id: 'FG-1026', customer: 'Sneha Iyer', apartment: 'Leela Residences', slot: '8:30 - 10:30 AM', status: 'Out for Delivery' },
];

export const ROUTES = [
  { id: 'route-1', apartment: 'Nikoo Homes 4', slot: '6:30 - 8:30 AM', stops: ['Tower A 603', 'Tower B 1204', 'Tower C 904'] },
  { id: 'route-2', apartment: 'Leela Residences', slot: '8:30 - 10:30 AM', stops: ['Tower 1 1903', 'Tower 2 604'] },
];
