import React, { useMemo, useState, useEffect } from 'react';
import {
  ADMIN_SECTIONS,
  APARTMENTS,
  COUPONS,
  DELIVERY_SLOTS,
  FAQ_ITEMS,
  HOME_HIGHLIGHTS,
  INTEGRATIONS,
  MOCK_ORDERS,
  PRODUCTS,
  ROUTES,
  SUBSCRIPTIONS,
} from './constants';
import type { CartItem, Coupon, DeliveryMode, Product } from './types';

const currency = (amount: number) => `₹${amount.toFixed(0)}`;

const defaultCart: CartItem[] = [];

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<'customer' | 'admin'>('customer');
  const [cartItems, setCartItems] = useState<CartItem[]>(defaultCart);
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>('delivery');
  const [selectedSlot, setSelectedSlot] = useState(DELIVERY_SLOTS[0].id);
  const [apartment, setApartment] = useState(APARTMENTS[0]);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('freshgrind_cart');
    if (stored) {
      setCartItems(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('freshgrind_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const cartById = useMemo(() => {
    return cartItems.reduce<Record<string, CartItem>>((acc, item) => {
      acc[item.productId] = item;
      return acc;
    }, {});
  }, [cartItems]);

  const cartSubtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      const product = PRODUCTS.find((p) => p.id === item.productId);
      return product ? sum + product.price * item.quantity : sum;
    }, 0);
  }, [cartItems]);

  const discount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.type === 'percent') {
      return Math.min(cartSubtotal * (appliedCoupon.value / 100), appliedCoupon.maxDiscount || Infinity);
    }
    return appliedCoupon.value;
  }, [appliedCoupon, cartSubtotal]);

  const total = Math.max(cartSubtotal - discount, 0);

  const updateCart = (product: Product, delta: number) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (!existing && delta < 0) return prev;
      const nextQty = (existing?.quantity || 0) + delta;
      if (nextQty <= 0) {
        return prev.filter((item) => item.productId !== product.id);
      }
      if (existing) {
        return prev.map((item) => (item.productId === product.id ? { ...item, quantity: nextQty } : item));
      }
      return [...prev, { productId: product.id, quantity: nextQty }];
    });
  };

  const handleReorder = () => {
    setCartItems([
      { productId: 'idli-dosa-1kg', quantity: 1 },
      { productId: 'coconut-chutney-250', quantity: 2 },
    ]);
  };

  const applyCoupon = () => {
    const match = COUPONS.find((coupon) => coupon.code.toLowerCase() === couponCode.trim().toLowerCase());
    setAppliedCoupon(match || null);
  };

  const activeSlot = DELIVERY_SLOTS.find((slot) => slot.id === selectedSlot);

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <p className="eyebrow">FreshGrind</p>
          <h1>Fresh idli & dosa batters, delivered before breakfast.</h1>
          <p className="subtitle">Near Bharatiya City • Nikoo Homes • 30-second ordering</p>
        </div>
        <div className="switcher">
          <button
            className={activeView === 'customer' ? 'btn primary' : 'btn ghost'}
            onClick={() => setActiveView('customer')}
          >
            Customer App
          </button>
          <button
            className={activeView === 'admin' ? 'btn primary' : 'btn ghost'}
            onClick={() => setActiveView('admin')}
          >
            Admin Panel
          </button>
        </div>
      </header>

      {activeView === 'customer' ? (
        <main className="container">
          <section className="card hero">
            <div>
              <h2>Onboarding</h2>
              <p className="muted">
                Fast phone OTP onboarding with apartment details for accurate routing.
              </p>
              <div className="grid two">
                <label>
                  Name
                  <input placeholder="e.g., Nisha Rao" />
                </label>
                <label>
                  Phone (+91)
                  <input placeholder="98765 43210" />
                </label>
                <label>
                  Apartment
                  <select value={apartment} onChange={(event) => setApartment(event.target.value)}>
                    {APARTMENTS.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Tower / Block
                  <input placeholder="Tower C" />
                </label>
                <label>
                  Flat number
                  <input placeholder="C-1204" />
                </label>
                <label>
                  Preferred slot
                  <select value={selectedSlot} onChange={(event) => setSelectedSlot(event.target.value)}>
                    {DELIVERY_SLOTS.map((slot) => (
                      <option key={slot.id} value={slot.id}>
                        {slot.label} · {slot.window}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
            <div className="status-panel">
              <h3>Today’s availability</h3>
              <ul>
                {HOME_HIGHLIGHTS.map((item) => (
                  <li key={item.title}>
                    <span>{item.title}</span>
                    <strong>{item.detail}</strong>
                  </li>
                ))}
              </ul>
              <button className="btn primary" onClick={handleReorder}>
                Reorder last basket
              </button>
              <button className="btn outline">Start a subscription</button>
            </div>
          </section>

          <section className="card">
            <div className="section-title">
              <h2>Fresh catalog</h2>
              <p className="muted">Batters, chutneys, and add-ons made at 4 AM.</p>
            </div>
            <div className="grid three">
              {PRODUCTS.map((product) => (
                <article key={product.id} className="product-card">
                  <div className="product-header">
                    <div>
                      <p className="eyebrow">{product.category}</p>
                      <h3>{product.name}</h3>
                      <p className="muted">{product.description}</p>
                    </div>
                    <div className="price">{currency(product.price)}</div>
                  </div>
                  <div className="pill-group">
                    <span className="pill">{product.unit}</span>
                    <span className="pill">Shelf life: {product.shelfLife}</span>
                    {product.spiceLevel && <span className="pill">Spice: {product.spiceLevel}</span>}
                  </div>
                  <p className="meta">Ingredients: {product.ingredients}</p>
                  <p className="meta">Storage: {product.storage}</p>
                  <p className="meta">Allergens: {product.allergens}</p>
                  <div className="product-actions">
                    <button className="btn ghost" onClick={() => updateCart(product, -1)}>
                      −
                    </button>
                    <span className="quantity">{cartById[product.id]?.quantity || 0}</span>
                    <button className="btn ghost" onClick={() => updateCart(product, 1)}>
                      +
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="card">
            <div className="section-title">
              <h2>Cart & payment</h2>
              <p className="muted">Offline-friendly with local caching and server-side validation.</p>
            </div>
            <div className="grid two">
              <div>
                <div className="toggle-group">
                  <button
                    className={deliveryMode === 'delivery' ? 'btn primary' : 'btn ghost'}
                    onClick={() => setDeliveryMode('delivery')}
                  >
                    Delivery
                  </button>
                  <button
                    className={deliveryMode === 'pickup' ? 'btn primary' : 'btn ghost'}
                    onClick={() => setDeliveryMode('pickup')}
                  >
                    Pickup
                  </button>
                </div>
                <div className="cart-list">
                  {cartItems.length === 0 && <p className="muted">Your cart is empty.</p>}
                  {cartItems.map((item) => {
                    const product = PRODUCTS.find((p) => p.id === item.productId);
                    if (!product) return null;
                    return (
                      <div className="cart-item" key={item.productId}>
                        <div>
                          <strong>{product.name}</strong>
                          <p className="muted">{item.quantity} × {currency(product.price)}</p>
                        </div>
                        <div className="cart-actions">
                          <button className="btn ghost" onClick={() => updateCart(product, -1)}>−</button>
                          <button className="btn ghost" onClick={() => updateCart(product, 1)}>+</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="summary">
                <h3>Delivery slot</h3>
                <select value={selectedSlot} onChange={(event) => setSelectedSlot(event.target.value)}>
                  {DELIVERY_SLOTS.map((slot) => (
                    <option key={slot.id} value={slot.id}>
                      {slot.label} · {slot.window}
                    </option>
                  ))}
                </select>
                <p className="muted">{activeSlot?.note}</p>
                <h3>Apply coupon</h3>
                <div className="inline">
                  <input
                    value={couponCode}
                    onChange={(event) => setCouponCode(event.target.value)}
                    placeholder="FRESH50"
                  />
                  <button className="btn outline" onClick={applyCoupon}>
                    Apply
                  </button>
                </div>
                {appliedCoupon ? (
                  <p className="success">Applied {appliedCoupon.code}: {appliedCoupon.description}</p>
                ) : (
                  <p className="muted">Available: {COUPONS.map((c) => c.code).join(', ')}</p>
                )}
                <div className="summary-lines">
                  <div><span>Subtotal</span><span>{currency(cartSubtotal)}</span></div>
                  <div><span>Discount</span><span>-{currency(discount)}</span></div>
                  <div className="total"><span>Total</span><span>{currency(total)}</span></div>
                </div>
                <button className="btn primary">Pay with Razorpay</button>
                <button className="btn ghost">Cash on delivery (if enabled)</button>
                <button className="btn outline">Download invoice PDF</button>
              </div>
            </div>
          </section>

          <section className="card">
            <div className="section-title">
              <h2>Order tracking</h2>
              <p className="muted">Push notifications fire on every state change.</p>
            </div>
            <div className="timeline">
              {['Placed', 'Confirmed', 'Prepared', 'Out for Delivery', 'Delivered'].map((step, index) => (
                <div key={step} className={`timeline-step ${index <= 2 ? 'active' : ''}`}>
                  <span className="dot" />
                  <div>
                    <strong>{step}</strong>
                    <p className="muted">{index <= 2 ? 'In progress' : 'Pending'}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="card">
            <div className="section-title">
              <h2>Subscriptions</h2>
              <p className="muted">Weekly or monthly plans with pause/skip controls.</p>
            </div>
            <div className="grid two">
              {SUBSCRIPTIONS.map((plan) => (
                <div key={plan.id} className="subscription-card">
                  <h3>{plan.title}</h3>
                  <p className="muted">{plan.description}</p>
                  <div className="pill-group">
                    <span className="pill">{plan.frequency}</span>
                    <span className="pill">{plan.slot}</span>
                  </div>
                  <div className="inline">
                    <button className="btn outline">Pause</button>
                    <button className="btn ghost">Skip next</button>
                    <button className="btn primary">Edit plan</button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="card">
            <div className="section-title">
              <h2>Support & ratings</h2>
              <p className="muted">One-tap WhatsApp and simple feedback prompts.</p>
            </div>
            <div className="grid two">
              <div>
                <a className="btn primary" href="https://wa.me/919900112233?text=Hi%20FreshGrind%2C%20I%20need%20help%20with%20order%20FG-1024" target="_blank" rel="noreferrer">
                  WhatsApp FreshGrind
                </a>
                <div className="faq">
                  {FAQ_ITEMS.map((item) => (
                    <details key={item.title}>
                      <summary>{item.title}</summary>
                      <p>{item.content}</p>
                    </details>
                  ))}
                </div>
              </div>
              <div className="rating">
                <h3>Rate your delivery</h3>
                <div className="stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} className="star">{star}</button>
                  ))}
                </div>
                <textarea placeholder="Optional feedback" rows={4} />
                <button className="btn outline">Submit feedback</button>
              </div>
            </div>
          </section>

          <section className="card">
            <div className="section-title">
              <h2>Integrations</h2>
              <p className="muted">Deep links for WhatsApp, Instagram, Swiggy, and Blinkit.</p>
            </div>
            <div className="grid three">
              {INTEGRATIONS.map((integration) => (
                <div key={integration.title} className="integration-card">
                  <h3>{integration.title}</h3>
                  <p className="muted">{integration.description}</p>
                  <button className="btn outline">{integration.cta}</button>
                </div>
              ))}
            </div>
          </section>
        </main>
      ) : (
        <main className="container">
          <section className="card">
            <div className="section-title">
              <h2>Admin operations</h2>
              <p className="muted">Manage products, orders, subscriptions, and communications.</p>
            </div>
            <div className="grid three">
              {ADMIN_SECTIONS.map((section) => (
                <div key={section.title} className="integration-card">
                  <h3>{section.title}</h3>
                  <p className="muted">{section.description}</p>
                  <button className="btn outline">Open module</button>
                </div>
              ))}
            </div>
          </section>

          <section className="card">
            <div className="section-title">
              <h2>Orders view</h2>
              <p className="muted">Filter by date, status, apartment, and slot.</p>
            </div>
            <div className="table">
              <div className="table-row header">
                <span>Order</span>
                <span>Customer</span>
                <span>Apartment</span>
                <span>Slot</span>
                <span>Status</span>
              </div>
              {MOCK_ORDERS.map((order) => (
                <div key={order.id} className="table-row">
                  <span>{order.id}</span>
                  <span>{order.customer}</span>
                  <span>{order.apartment}</span>
                  <span>{order.slot}</span>
                  <span className="status-chip">{order.status}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="card">
            <div className="section-title">
              <h2>Delivery routes</h2>
              <p className="muted">Grouped by apartment, tower, and slot with printable manifests.</p>
            </div>
            <div className="grid two">
              {ROUTES.map((route) => (
                <div key={route.id} className="subscription-card">
                  <h3>{route.apartment}</h3>
                  <p className="muted">{route.slot}</p>
                  <ul>
                    {route.stops.map((stop) => (
                      <li key={stop}>{stop}</li>
                    ))}
                  </ul>
                  <button className="btn outline">Print checklist</button>
                </div>
              ))}
            </div>
          </section>
        </main>
      )}
    </div>
  );
};

export default App;
