
/**
 * EX-TRA GADGETS — STORE CONFIGURATION
 * ---------------------------------------------------------------------------
 * Central configuration for business identity, contact information,
 * product categories, delivery, pickup, payment display and social links.
 *
 * The backend /store endpoint remains the source of truth once configured.
 * API values override these defaults through hooks/useStoreInfo.js.
 *
 * Admin-configurable settings such as bank account details, delivery fees,
 * pickup instructions and payment availability should be managed through
 * the backend Admin Settings — not hardcoded here.
 */

import logo from '../assets/brand/logo.jpeg';

export const STORE_CONFIG = {
  brand: {
    name: 'Ex-tra Gadgets',
    shortName: 'Ex-tra Gadgets',
    logo,
    favicon: '/favicon.png',
    tagline: 'Your Trusted Gadget Plug.',
    description:
      'Shop smartphones, laptops, tablets, accessories, smartwatches, audio devices, gaming gadgets and power solutions at Ex-tra Gadgets. Nationwide delivery and physical pickup available.',
  },

  contact: {
    whatsappNumber: '2348132095189',
    phone: '07032501109',
    alternatePhone: '08132095189',
    email: 'ExTraGadgets23@gmail.com',
  },

  address: {
    street:
      'Suite 21, No. 12 Medical Road, Opposite Sterling Bank',
    city: 'Computer Village, Ikeja',
    state: 'Lagos State',
    country: 'Nigeria',
    full:
      'Suite 21, No. 12 Medical Road, Opposite Sterling Bank, Computer Village, Ikeja, Lagos State, Nigeria.',
  },

  locations: [
    'Computer Village, Ikeja, Lagos',
  ],
 
  sourcing: ['USA', 'Canada', 'UK', 'Dubai'],
  productCategories: [
    'Phones',
    'Laptops',
    'Tablets',
    'Accessories',
    'Smartwatches',
    'Audio',
    'Gaming',
    'Power Solutions',
  ],

  delivery: {
    coverage: 'Nationwide delivery across Nigeria',
    feeNote:
      'Delivery fees are calculated at checkout based on the store delivery settings.',
    pickupAvailable: true,
    pickupNote:
      'Customers can also choose physical pickup at our Computer Village store.',
  },

  warranty: {
    brandNew: '1 month warranty',
    preOwned: '1 week warranty',
    conditions: [
      'UK Used',
      'US Used',
      'Refurbished',
    ],
  },

  payments: [
    { id: 'bank-transfer', label: 'Bank Transfer' },
  ],

  social: {
    instagram: 'https://www.instagram.com/ExtraGadgets23',
    facebook: 'https://www.facebook.com/ExtraGadgets23',
    tiktok: 'https://www.tiktok.com/@ExtraGadgets23',
    twitter: 'https://x.com/ExtraGadgets23',
  },

  currency: 'NGN',
};
