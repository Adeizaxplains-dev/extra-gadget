import { catchAsync } from '../utils/catchAsync.js';
import { sendSuccess } from '../utils/apiResponse.js';
import * as homepageService from '../services/homepageService.js';

// Public storefront homepage content
export const getHomepageContent = catchAsync(async (req, res) => {
  const content = await homepageService.getHomepageContent();

  sendSuccess(res, { data: content });
});

// Admin: view all configured homepage content
export const getHomepageContentForAdmin = catchAsync(async (req, res) => {
  const content = await homepageService.getHomepageContentForAdmin();

  sendSuccess(res, { data: content });
});

// Admin: create or update homepage configuration
export const saveHomepageContent = catchAsync(async (req, res) => {
  const content = await homepageService.saveHomepageContent(req.body);

  sendSuccess(res, {
    data: content,
    message: 'Homepage content saved',
  });
});

// Admin: restore the default homepage configuration
export const resetHomepageContent = catchAsync(async (req, res) => {
  const content = await homepageService.resetHomepageContent();

  sendSuccess(res, {
    data: content,
    message: 'Homepage content reset',
  });
});