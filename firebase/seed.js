import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const app = initializeApp({
  credential: applicationDefault(),
});

const db = getFirestore(app);

const seed = async () => {
  const products = [
    {
      id: 'idli-dosa-1kg',
      name: 'Idli/Dosa Batter',
      price: 120,
      unit: '1 kg',
      category: 'Batter',
      available: true,
      maxDailyQty: 80,
      prepLeadTime: '4 hours',
    },
    {
      id: 'coconut-chutney-250',
      name: 'Coconut Chutney',
      price: 55,
      unit: '250 g',
      category: 'Chutney',
      available: true,
      maxDailyQty: 120,
      prepLeadTime: '2 hours',
    },
  ];

  const batch = db.batch();
  products.forEach((product) => {
    const ref = db.collection('products').doc(product.id);
    batch.set(ref, product, { merge: true });
  });

  batch.set(db.collection('settings').doc('delivery'), {
    slots: [
      { id: 'slot-1', label: '6:30 - 8:30 AM' },
      { id: 'slot-2', label: '8:30 - 10:30 AM' },
    ],
    whatsapp: '+919900112233',
    instagramUrl: 'https://instagram.com/freshgrindbatter',
  });

  await batch.commit();
  console.log('Seed complete');
};

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
