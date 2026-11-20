import { z } from 'zod';

export const createOrderSchema = z.object({
  sessionId: z.string().min(1, 'Session is required'),
  customer: z.object({ name: z.string().min(1), phone: z.string().min(7), email: z.string().email().optional().or(z.literal('')) }),
  fulfilmentMethod: z.enum(['delivery', 'pickup']).default('delivery'),
  paymentMethod: z.enum(['bank_transfer', 'paystack', 'cash_on_delivery']).default('bank_transfer'),
  transferReference: z.string().max(120).optional(),
  delivery: z.object({ address: z.string().optional(), state: z.string().optional(), city: z.string().optional(), note: z.string().optional() }).optional(),
  source: z.string().optional(), campaign: z.string().optional(),
});

export const transferReferenceSchema = z.object({ sessionId: z.string().min(1), transferReference: z.string().min(2).max(120) });

export const confirmPaymentSchema = z.object({ action: z.enum(['confirm', 'reject']), reason: z.string().max(500).optional() });

export const updateOrderStatusSchema = z.object({
  orderStatus: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']).optional(),
  fulfilmentStatus: z.enum(['awaiting_payment', 'processing', 'ready_for_pickup', 'dispatched', 'completed']).optional(),
  note: z.string().optional(),
});
