import { Router } from 'express';
import * as controller from '../controllers/homepageController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { saveHomepageContentSchema } from '../validators/homepageValidators.js';

const router = Router();

// Public storefront
router.get('/', controller.getHomepageContent);

// Admin homepage editor
router.get(
  '/admin',
  protect,
  authorize('admin'),
  controller.getHomepageContentForAdmin
);

router.put(
  '/',
  protect,
  authorize('admin'),
  validate(saveHomepageContentSchema),
  controller.saveHomepageContent
);

router.post(
  '/reset',
  protect,
  authorize('admin'),
  controller.resetHomepageContent
);

export default router;