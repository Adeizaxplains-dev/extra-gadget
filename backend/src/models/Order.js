import mongoose from 'mongoose';

// Order items are snapshotted subdocuments — name/price/image are copied
// at order-creation time so later product edits (or deletion) never rewrite
// order history. Only productId/variantId are kept as live references.
const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    variantId: { type: mongoose.Schema.Types.ObjectId, default: null },
    name: { type: String, required: true },
    image: { type: String, default: '' },
    color: { type: String, default: '' },
    size: { type: String, default: '' },
    unitPrice: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true, index: true },
    orderNumber: { type: String, required: true, unique: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true, index: true },

    sessionId: {
  type: String,
  required: true,
  index: true,
},
    items: [orderItemSchema],
    subtotal: { type: Number, required: true },
    deliveryFee: { type: Number, default: 0 },
    total: { type: Number, required: true },

    // Kept conceptually separate per architecture decision: a paid order
    // can still be "processing"; these must never be merged into one field.
    paymentMethod: { type: String, enum: ['bank_transfer', 'paystack', 'cash_on_delivery'], default: 'bank_transfer' },
    transferReference: { type: String, default: '' },
    paymentRejectionReason: { type: String, default: '' },
    fulfilmentMethod: { type: String, enum: ['delivery', 'pickup'], default: 'delivery' },
    pickup: { locationName: { type: String, default: '' }, address: { type: String, default: '' }, phone: { type: String, default: '' }, openingHours: { type: String, default: '' }, instructions: { type: String, default: '' } },
    fulfilmentStatus: { type: String, enum: ['awaiting_payment', 'processing', 'ready_for_pickup', 'dispatched', 'completed'], default: 'awaiting_payment' },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
      index: true,
    },
    orderStatus: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
      index: true,
    },

    delivery: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, default: '' },
      address: { type: String, default: '' },
      state: { type: String, default: '' },
      city: { type: String, default: '' },
      note: { type: String, default: '' },
    },

    source: { type: String, default: '' },
    campaign: { type: String, default: '' },

    internalNotes: [
      {
        note: String,
        authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        createdAt: { type: Date, default: Date.now },
      },
    ],

    statusHistory: [
      {
        field: { type: String, enum: ['paymentStatus', 'orderStatus', 'fulfilmentStatus'] },
        from: String,
        to: String,
        changedAt: { type: Date, default: Date.now },
        changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
      },
    ],
  },
  { timestamps: true }
);

export const Order = mongoose.model('Order', orderSchema);
