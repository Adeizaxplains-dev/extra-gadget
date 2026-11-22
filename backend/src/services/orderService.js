import mongoose from 'mongoose';
import { Order } from '../models/Order.js';
import { Cart } from '../models/Cart.js';
import { AppError } from '../utils/AppError.js';
import { generateOrderNumber } from '../utils/orderNumber.js';

import {
  findOrCreateCustomer,
  recordPaidOrder,
} from './customerService.js';

import {
  createPaymentFollowUpAutomation,
  cancelPaymentFollowUps,
} from './automationService.js';

import { getDefaultStoreId } from './storeContext.js';
import { Store } from '../models/Store.js';

import {
  orderEvents,
  ORDER_EVENTS,
} from '../events/orderEvents.js';

import { logger } from '../utils/logger.js';
import { decrementStockForItems } from './inventoryService.js';
import { Customer } from '../models/Customer.js';
import { recordEvent } from './eventService.js';

/**
 * Creates an order from the customer's active cart.
 *
 * SECURITY:
 * - The order is associated with the customer's sessionId.
 * - Payment is NOT considered successful here.
 * - Stock is NOT deducted here.
 *
 * Stock is deducted only after Paystack independently verifies
 * the payment.
 */
export async function createOrderFromCart(sessionId, payload) {
  if (!sessionId) {
    throw AppError.badRequest('Session ID is required');
  }

  const storeId = await getDefaultStoreId();

  const cart = await Cart.findOne({
    storeId,
    sessionId,
    status: 'active',
  });

  if (!cart || cart.items.length === 0) {
    throw AppError.badRequest('Your cart is empty');
  }

  if (!payload?.customer?.name || !payload?.customer?.phone) {
    throw AppError.badRequest('Customer name and phone are required');
  }

  const store = await Store.findById(storeId);

  if (!store) {
    throw AppError.notFound('Store not found');
  }

  const fulfilmentMethod = payload.fulfilmentMethod || 'delivery';
  const paymentMethod = payload.paymentMethod || 'bank_transfer';

  if (
    fulfilmentMethod === 'delivery' &&
    (
      !store.deliverySettings?.enabled ||
      !payload?.delivery?.address ||
      !payload?.delivery?.state ||
      !payload?.delivery?.city
    )
  ) {
    throw AppError.badRequest(
      'Delivery is unavailable or delivery address is incomplete'
    );
  }

  if (
    fulfilmentMethod === 'pickup' &&
    (
      !store.pickupSettings?.enabled ||
      !store.pickupSettings?.address
    )
  ) {
    throw AppError.badRequest(
      'Store pickup is not currently available'
    );
  }

  let bankAccountSnapshot;

  if (paymentMethod === 'bank_transfer') {
    if (!store.paymentSettings?.bankTransfer) {
      throw AppError.badRequest(
        'Bank transfer is not currently available'
      );
    }

    const bankAccounts = Array.isArray(
      store.paymentSettings?.bankAccounts
    )
      ? store.paymentSettings.bankAccounts
      : [];

    let selectedBankAccount;

    if (bankAccounts.length > 0) {
      // Multiple-account setup: require the customer to select
      // an active account with complete bank details.
      const activeAccounts = bankAccounts.filter(
        (account) =>
          account.active !== false &&
          account.bankName &&
          account.accountName &&
          account.accountNumber
      );

      if (activeAccounts.length === 0) {
        throw AppError.badRequest(
          'Bank transfer is not currently available'
        );
      }

      const bankAccountId = String(
        payload.bankAccountId || ''
      ).trim();

      if (!bankAccountId) {
        throw AppError.badRequest(
          'Please select a bank account for your transfer'
        );
      }

      selectedBankAccount = activeAccounts.find(
        (account) => String(account._id) === bankAccountId
      );

      if (!selectedBankAccount) {
        throw AppError.badRequest(
          'The selected bank account is unavailable'
        );
      }
    } else {
      // Backward compatibility: use the existing single account
      // when the store has not configured bankAccounts.
      selectedBankAccount = store.paymentSettings?.bankDetails;

      if (
        !selectedBankAccount?.bankName ||
        !selectedBankAccount?.accountName ||
        !selectedBankAccount?.accountNumber
      ) {
        throw AppError.badRequest(
          'Bank transfer is not currently available'
        );
      }
    }

    // Save the selected account's details with this order.
    // Later edits to the store's settings won't change this order.
    bankAccountSnapshot = {
      accountId: selectedBankAccount._id
        ? String(selectedBankAccount._id)
        : undefined,
      bankName: selectedBankAccount.bankName,
      accountName: selectedBankAccount.accountName,
      accountNumber: selectedBankAccount.accountNumber,
      accountType: selectedBankAccount.accountType || '',
      instructions: selectedBankAccount.instructions || '',
    };
  }

  if (
    paymentMethod === 'paystack' &&
    !store.paymentSettings?.paystackEnabled
  ) {
    throw AppError.badRequest(
      'Online card payment is not currently available'
    );
  }

  if (paymentMethod === 'cash_on_delivery') {
    throw AppError.badRequest(
      'Cash on delivery is not part of the current checkout release'
    );
  }

  const customer = await findOrCreateCustomer({
    name: payload.customer.name,
    phone: payload.customer.phone,
    email: payload.customer.email,
    address:
      fulfilmentMethod === 'delivery'
        ? {
            line: payload.delivery.address,
            city: payload.delivery.city,
            state: payload.delivery.state,
          }
        : undefined,
    source: payload.source,
    campaign: payload.campaign,
  });

  cart.customerId = customer._id;
  cart.lastActivityAt = new Date();

  const subtotal = cart.getSubtotal();

  // Delivery fee comes from the store's configured settings.
  const configuredFee =
    fulfilmentMethod === 'delivery'
      ? store?.deliverySettings?.deliveryFee || 0
      : 0;

  const freeThreshold = store?.deliverySettings?.freeDeliveryThreshold;

  const deliveryFee =
    freeThreshold != null && subtotal >= freeThreshold
      ? 0
      : configuredFee;

  const total = subtotal + deliveryFee;

  let orderNumber = generateOrderNumber();

  // Handle rare order-number collisions.
  for (let attempt = 0; attempt < 3; attempt += 1) {
    // eslint-disable-next-line no-await-in-loop
    const exists = await Order.exists({ orderNumber });

    if (!exists) {
      break;
    }

    orderNumber = generateOrderNumber();
  }

  const order = await Order.create({
    storeId,
    orderNumber,
    customerId: customer._id,

    // Used later to authorize customer access to this order.
    sessionId,

    items: cart.items.map((item) => ({
      productId: item.productId,
      variantId: item.variantId,
      name: item.name,
      image: item.image,
      color: item.color,
      size: item.size,
      unitPrice: item.unitPrice,
      quantity: item.quantity,
    })),

    subtotal,
    deliveryFee,
    total,

    paymentMethod,
    transferReference: String(payload.transferReference || '').trim(),

    // New: account selected by the customer.
    bankAccount: bankAccountSnapshot,

    fulfilmentMethod,
    fulfilmentStatus: 'awaiting_payment',

    pickup:
      fulfilmentMethod === 'pickup'
        ? {
            locationName: store.pickupSettings.locationName,
            address: store.pickupSettings.address,
            phone: store.pickupSettings.phone,
            openingHours: store.pickupSettings.openingHours,
            instructions: store.pickupSettings.instructions,
          }
        : undefined,

    paymentStatus: 'pending',
    orderStatus: 'pending',

    delivery: {
      fullName: payload.customer.name,
      phone: payload.customer.phone,
      email: payload.customer.email || '',
      address:
        fulfilmentMethod === 'delivery'
          ? payload.delivery.address
          : '',
      state:
        fulfilmentMethod === 'delivery'
          ? payload.delivery.state
          : '',
      city:
        fulfilmentMethod === 'delivery'
          ? payload.delivery.city
          : '',
      note: payload.delivery?.note || '',
    },

    source: payload.source || '',
    campaign: payload.campaign || '',
  });

  cart.status = 'converted';
  await cart.save();

  /*
   * Payment follow-up.
   * The automation processor must check paymentStatus before sending.
   */
  await createPaymentFollowUpAutomation({
    order,
    customer,
    scheduledFor: new Date(Date.now() + 15 * 60 * 1000),
  });

  return order;
}

  
/**
 * Gets an order by MongoDB ID.
 *
 * SECURITY:
 * If sessionId is supplied, the order must belong to that session.
 *
 * Admin/server-side calls can omit sessionId.
 */
export async function getOrderById(id, sessionId = null) {
  const filter = {
    _id: id,
  };

  if (sessionId) {
    filter.sessionId = sessionId;
  }

  const order = await Order.findOne(filter).populate(
    'customerId',
    'name phone email'
  );

  if (!order) {
    throw AppError.notFound('Order not found');
  }

  return order;
}

/**
 * Gets an order by public order number.
 *
 * This should be used carefully because an order number alone
 * should not be considered customer authentication.
 */
export async function getOrderByNumber(orderNumber) {
  const order = await Order.findOne({
    orderNumber,
  }).populate('customerId', 'name phone email');

  if (!order) {
    throw AppError.notFound('Order not found');
  }

  return order;
}

/**
 * Marks an order as PAID after an authorized payment verification.
 * Paystack calls this only after provider verification; manual bank
 * transfer calls it only from the authenticated admin confirmation route.
 *
 * SECURITY / CONSISTENCY:
 *
 * 1. Re-reads order inside MongoDB transaction.
 * 2. Checks whether order was already paid.
 * 3. Deducts inventory atomically.
 * 4. Marks order as paid only after stock succeeds.
 * 5. Performs CRM/automation work only after transaction commits.
 * 6. Records payment_successful/order_completed only here.
 *
 * This function is safe when called by:
 * - customer redirect verification
 * - Paystack webhook
 *
 * Both may arrive for the same transaction.
 */
export async function markOrderPaid(orderId, { source = 'paystack', actorUserId = null } = {}) {
  const session = await mongoose.startSession();

  try {
    let paidOrder = null;
    let paymentWasAlreadyProcessed = false;

    await session.withTransaction(async () => {
      /*
       * IMPORTANT:
       * Always re-read inside transaction.
       *
       * This prevents webhook + redirect from both
       * processing an unpaid order simultaneously.
       */
      const order = await Order.findById(orderId).session(session);

      if (!order) {
        throw AppError.notFound('Order not found');
      }

      /*
       * Idempotency.
       *
       * If another request already processed the payment,
       * do nothing again.
       */
      if (order.paymentStatus === 'paid') {
        paidOrder = order;
        paymentWasAlreadyProcessed = true;
        return;
      }

      /*
       * Never allow an order that was already refunded/cancelled
       * into the normal payment path.
       */
      if (
        order.paymentStatus === 'refunded' ||
        order.orderStatus === 'cancelled'
      ) {
        throw AppError.conflict(
          'This order can no longer be marked as paid'
        );
      }

      /*
       * Deduct ALL inventory inside the same transaction.
       */
      await decrementStockForItems(order.items, session);

      /*
       * Only after inventory succeeds do we mark payment as paid.
       */
      order.statusHistory.push({
        field: 'paymentStatus',
        from: order.paymentStatus,
        to: 'paid',
      });

      order.paymentStatus = 'paid';
      order.orderStatus = 'processing';
      order.fulfilmentStatus = 'processing';
      if (actorUserId) order.statusHistory[order.statusHistory.length - 1].changedBy = actorUserId;

      await order.save({ session });

      paidOrder = order;
    });

    /*
     * Duplicate webhook/redirect.
     *
     * Do not repeat side effects.
     */
    if (paymentWasAlreadyProcessed) {
      logger.info('Order payment already processed', {
        orderId: paidOrder._id.toString(),
        orderNumber: paidOrder.orderNumber,
      });

      return paidOrder;
    }

    /*
     * Transaction successfully committed.
     */

    await cancelPaymentFollowUps(paidOrder._id);

    /*
     * CRM revenue recording.
     */
    await recordPaidOrder(
      paidOrder.customerId,
      paidOrder.total
    );

    /*
     * IMPORTANT:
     *
     * These are backend-authoritative funnel events.
     *
     * Do NOT depend on a frontend event to say that payment
     * succeeded. This event is recorded only after Paystack
     * verification AND successful database processing.
     */
    await recordEvent({
      type: 'payment_successful',
      sessionId: paidOrder.sessionId,
      customerId: paidOrder.customerId,
      metadata: {
        orderId: paidOrder._id.toString(),
        orderNumber: paidOrder.orderNumber,
      },
      source: paidOrder.source,
      campaign: paidOrder.campaign,
    });

    await recordEvent({
      type: 'order_completed',
      sessionId: paidOrder.sessionId,
      customerId: paidOrder.customerId,
      metadata: {
        orderId: paidOrder._id.toString(),
        orderNumber: paidOrder.orderNumber,
      },
      source: paidOrder.source,
      campaign: paidOrder.campaign,
    });

    /*
     * Load customer for lifecycle automations.
     */
    const customer = await Customer.findById(
      paidOrder.customerId
    );

    /*
     * Emit PAID event only after:
     *
     * - verified payment
     * - inventory deduction
     * - order update
     * - transaction commit
     */
    orderEvents.emit(
      ORDER_EVENTS.PAID,
      {
        order: paidOrder,
        customer,
      }
    );

    logger.info('Order marked paid', { source,
      orderId: paidOrder._id.toString(),
      orderNumber: paidOrder.orderNumber,
    });

    return paidOrder;
  } finally {
    await session.endSession();
  }
}

/**
 * Marks an order payment as failed.
 *
 * IMPORTANT:
 * Never change a paid order back to failed.
 */
export async function submitTransferReference(orderId, sessionId, transferReference) {
  const order = await Order.findOne({ _id: orderId, sessionId });
  if (!order) throw AppError.notFound('Order not found');
  if (order.paymentMethod !== 'bank_transfer' || order.paymentStatus !== 'pending') throw AppError.conflict('Transfer reference can only be added to a pending bank transfer order');
  order.transferReference = String(transferReference).trim();
  await order.save();
  return order;
}

export async function reviewBankTransfer(orderId, { action, reason }, actorUserId) {
  const order = await Order.findOne({ _id: orderId, storeId: await getDefaultStoreId() });
  if (!order) throw AppError.notFound('Order not found');
  if (order.paymentMethod !== 'bank_transfer') throw AppError.badRequest('This order is not a bank transfer order');
  if (order.paymentStatus === 'paid') throw AppError.conflict('This order has already been paid');
  if (order.orderStatus === 'cancelled') throw AppError.conflict('Cancelled orders cannot be confirmed');
  if (action === 'confirm') return markOrderPaid(orderId, { source: 'manual_bank_transfer', actorUserId });
  order.paymentStatus = 'failed';
  order.paymentRejectionReason = String(reason || 'Transfer could not be verified').trim();
  order.statusHistory.push({ field: 'paymentStatus', from: 'pending', to: 'failed', changedBy: actorUserId });
  await order.save();
  return order;
}

export async function markOrderPaymentFailed(orderId) {
  const order = await Order.findById(orderId);

  if (!order) {
    throw AppError.notFound('Order not found');
  }

  /*
   * A successful payment always wins over a late failed
   * verification/webhook.
   */
  if (order.paymentStatus === 'paid') {
    return order;
  }

  if (order.paymentStatus === 'refunded') {
    return order;
  }

  if (order.paymentStatus !== 'failed') {
    order.statusHistory.push({
      field: 'paymentStatus',
      from: order.paymentStatus,
      to: 'failed',
    });

    order.paymentStatus = 'failed';

    await order.save();
  }

  return order;
}

/**
 * Updates the operational status of an order.
 *
 * Payment status and order status remain separate.
 */
export async function updateOrderStatus(
  id,
  { orderStatus, fulfilmentStatus, note },
  actorUserId
) {
  const order = await Order.findById(id);

  if (!order) {
    throw AppError.notFound('Order not found');
  }

  if (orderStatus && orderStatus !== 'pending' && orderStatus !== 'cancelled' && order.paymentStatus !== 'paid') throw AppError.conflict('An unpaid order cannot be fulfilled');

  const statusChanged =
    orderStatus &&
    orderStatus !== order.orderStatus;

  if (statusChanged) {
    /*
     * Do not allow invalid manual transitions.
     *
     * The Mongoose enum also protects this, but explicit
     * validation gives a clearer error.
     */
    const allowedStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

    if (!allowedStatuses.includes(orderStatus)) {
      throw AppError.badRequest(
        `Invalid order status: ${orderStatus}`
      );
    }

    /*
     * A cancelled order cannot be moved back into processing
     * accidentally through the admin interface.
     */
    if (
      order.orderStatus === 'cancelled' &&
      orderStatus !== 'cancelled'
    ) {
      throw AppError.conflict(
        'A cancelled order cannot be reopened'
      );
    }

    order.statusHistory.push({
      field: 'orderStatus',
      from: order.orderStatus,
      to: orderStatus,
      changedBy: actorUserId,
    });

    order.orderStatus = orderStatus;
  }

  if (fulfilmentStatus && fulfilmentStatus !== order.fulfilmentStatus) {
    const allowedFulfilment = ['awaiting_payment', 'processing', 'ready_for_pickup', 'dispatched', 'completed'];
    if (!allowedFulfilment.includes(fulfilmentStatus)) throw AppError.badRequest('Invalid fulfilment status');
    if (order.paymentStatus !== 'paid') throw AppError.conflict('Fulfilment cannot progress before payment is confirmed');
    if (order.fulfilmentMethod === 'delivery' && fulfilmentStatus === 'ready_for_pickup') throw AppError.badRequest('Pickup status cannot be used for delivery orders');
    if (order.fulfilmentMethod === 'pickup' && fulfilmentStatus === 'dispatched') throw AppError.badRequest('Dispatch status cannot be used for pickup orders');
    order.statusHistory.push({ field: 'fulfilmentStatus', from: order.fulfilmentStatus, to: fulfilmentStatus, changedBy: actorUserId });
    order.fulfilmentStatus = fulfilmentStatus;
  }

  if (note?.trim()) {
    order.internalNotes.push({
      note: note.trim(),
      authorId: actorUserId,
    });
  }

  /*
   * Save first.
   *
   * Events are emitted only after the database contains
   * the new state.
   */
  await order.save();

  if (statusChanged) {
    orderEvents.emit(
      ORDER_EVENTS.STATUS_CHANGED,
      { order }
    );

    if (
      orderStatus === 'shipped' ||
      orderStatus === 'delivered'
    ) {
      const customer = await Customer.findById(
        order.customerId
      );

      if (orderStatus === 'shipped') {
        orderEvents.emit(
          ORDER_EVENTS.SHIPPED,
          {
            order,
            customer,
          }
        );
      }

      if (orderStatus === 'delivered') {
        orderEvents.emit(
          ORDER_EVENTS.DELIVERED,
          {
            order,
            customer,
          }
        );
      }
    }
  }

  return order;
}

/**
 * Lists orders for admin.
 */
export async function listOrders(query = {}) {
  const storeId = await getDefaultStoreId();

  const filter = {
    storeId,
  };

  if (query.paymentStatus) {
    filter.paymentStatus = query.paymentStatus;
  }

  if (query.orderStatus) {
    filter.orderStatus = query.orderStatus;
  }

  if (query.search) {
    /*
     * Escape regex characters so an admin search cannot
     * accidentally become an expensive/overly broad regex.
     */
    const escapedSearch = String(query.search).replace(
      /[.*+?^${}()|[\]\\]/g,
      '\\$&'
    );

    filter.$or = [
      {
        orderNumber: {
          $regex: escapedSearch,
          $options: 'i',
        },
      },
      {
        'delivery.phone': {
          $regex: escapedSearch,
          $options: 'i',
        },
      },
    ];
  }

  const page = Math.max(
    Number(query.page) || 1,
    1
  );

  const limit = Math.min(
    Math.max(Number(query.limit) || 20, 1),
    100
  );

  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('customerId', 'name phone'),

    Order.countDocuments(filter),
  ]);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}