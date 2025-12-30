# FreshGrind MVP

A production-ready MVP blueprint for a fresh idli/dosa batter and chutney business near Bharatiya City, Bangalore. This repo ships a responsive React prototype for customer + admin flows, Firebase backend scaffolding (rules, Cloud Functions, seed script), and detailed setup/build instructions.

## Architecture overview (1-page)
FreshGrind uses a Firebase-first architecture with an Android-first client and a web admin panel:

- **Mobile app (Expo + React Native)** handles OTP login, catalog browsing, cart, subscriptions, and order tracking.
- **Admin panel (web)** manages products, inventory, orders, subscriptions, delivery routes, and broadcast notifications.
- **Firebase Auth** provides phone OTP login (+91).
- **Firestore** stores users, products, orders, subscriptions, coupons, settings, and audit logs.
- **Cloud Functions** validate totals, verify Razorpay payments, advance order workflow, and send push notifications.
- **FCM** delivers status updates and reminder pushes.
- **Razorpay** processes UPI/cards/wallet payments, plus optional COD toggle.

The UI in this repository is a responsive, mobile-first prototype for rapid iteration while the Firebase backend is production-ready for API logic and data security.

## Step-by-step build plan
1. **Project setup**: initialize Expo app, admin web app, and Firebase project.
2. **Auth & onboarding**: configure phone OTP, onboarding profile collection, and Firestore user documents.
3. **Catalog & cart**: implement product listing, inventory availability, offline cart cache.
4. **Checkout & payments**: integrate Razorpay, server-side price validation, and receipts.
5. **Orders & tracking**: order status timeline, admin updates, and FCM push notifications.
6. **Subscriptions**: scheduling, pause/resume, skip, and billing options.
7. **Admin panel**: CRUD for products, orders, coupons, customer management, delivery routes.
8. **Observability**: Cloud Function logging, audit logs, and admin dashboards.
9. **QA & release**: unit tests for pricing/coupons/payment verification, EAS Android build.

## Project structure
```
.
├── App.tsx                      # Responsive customer/admin UI prototype
├── App.css                      # Calm premium theme styles
├── constants.ts                 # Product catalog, slots, coupons, admin mock data
├── types.ts                     # Shared TypeScript types
├── firebase/
│   ├── firestore.rules          # Secure Firestore rules
│   ├── seed.js                  # Sample data seeding script
│   └── functions/
│       ├── src/
│       │   ├── index.js          # Cloud Function entry points
│       │   ├── pricing.js        # Pricing + coupon logic
│       │   └── payments.js       # Razorpay signature verification
│       └── tests/
│           └── pricing.test.js   # Unit tests
└── index.tsx                    # React entry point
```

## Key files
- **`App.tsx`**: Customer app and admin panel UI, cart logic, subscription controls.
- **`firebase/functions/src/pricing.js`**: Server-side totals and coupon enforcement.
- **`firebase/functions/src/payments.js`**: Razorpay HMAC signature verification.
- **`firebase/firestore.rules`**: Least-privilege access controls.

## Setup & local dev
### Prerequisites
- Node.js 18+
- Firebase CLI (optional for functions/rules deployment)

### Install & run the UI prototype
```bash
npm install
npm run dev
```

### Run unit tests
```bash
npm test
```

## Environment variables
Create `.env.local` for Vite/Expo and use the following variables in production:
```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
FCM_SERVER_KEY=...
```

## Deployment
- **Firebase Hosting** for admin panel and any marketing pages.
- **Firebase Functions** for backend workflows (payments, notifications).
- **Firestore rules** can be deployed with `firebase deploy --only firestore:rules`.

## Android build (Expo EAS)
1. Install Expo CLI and EAS:
   ```bash
   npm install -g expo-cli eas-cli
   ```
2. Initialize Expo app (if not already created):
   ```bash
   npx create-expo-app freshgrind-mobile --template
   ```
3. Configure `app.json` with Android package and Firebase config.
4. Run EAS build:
   ```bash
   eas build -p android --profile preview
   ```

## Notes
- Cloud Functions enforce totals server-side to prevent client tampering.
- Cart state is cached locally for offline-friendly ordering.
- Admin toggles can enable/disable COD and inventory availability.
