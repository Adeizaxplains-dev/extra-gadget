import { Router } from 'express';
import * as controller from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createOrderSchema, updateOrderStatusSchema, confirmPaymentSchema, transferReferenceSchema } from '../validators/orderValidators.js';

const router = Router();

router.post('/', validate(createOrderSchema), controller.createOrder);
router.patch('/:id/transfer-reference', validate(transferReferenceSchema), controller.submitTransferReference);
router.get('/admin', protect, authorize('admin', 'staff'), controller.listOrdersAdmin);
router.patch('/:id/payment-review', protect, authorize('admin'), validate(confirmPaymentSchema), controller.reviewBankTransfer);
router.patch('/:id/status', protect, authorize('admin', 'staff'), validate(updateOrderStatusSchema), controller.updateOrderStatus);
router.get('/:id', controller.getOrder);

export default router;
