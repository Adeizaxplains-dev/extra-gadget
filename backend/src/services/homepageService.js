import mongoose from 'mongoose';

import { HomepageContent } from '../models/HomepageContent.js';
import { Category } from '../models/Category.js';
import { AppError } from '../utils/AppError.js';
import { getDefaultStoreId } from './storeContext.js';

const DEFAULT_SECTIONS = [
  { type: 'trustStrip', order: 0, isActive: true },
  { type: 'categoryGrid', order: 1, isActive: true },
  { type: 'featuredProducts', order: 2, isActive: true },
  { type: 'promoBanner', order: 3, isActive: true },
  { type: 'bestSellers', order: 4, isActive: true },
  { type: 'brandAbout', order: 5, isActive: true },
];

function isValidObjectId(value) {
  return mongoose.Types.ObjectId.isValid(value);
}

function isCurrentlyScheduled(item, now = new Date()) {
  if (!item.isActive) return false;
  if (item.startsAt && new Date(item.startsAt) > now) return false;
  if (item.endsAt && new Date(item.endsAt) <= now) return false;
  return true;
}

async function getStoreId() {
  return getDefaultStoreId();
}

async function validateCategoryIds(storeId, sections = []) {
  const ids = [
    ...new Set(
      sections.flatMap((section) => section.categoryIds || []).map(String)
    ),
  ];

  if (ids.length === 0) return;

  if (!ids.every(isValidObjectId)) {
    throw AppError.badRequest('One or more category IDs are invalid');
  }

  const categories = await Category.find({
    storeId,
    _id: { $in: ids },
  })
    .select('_id')
    .lean();

  if (categories.length !== ids.length) {
    throw AppError.badRequest(
      'One or more categories do not belong to this store'
    );
  }
}

export async function getHomepageContent() {
  const storeId = await getStoreId();

  let content = await HomepageContent.findOne({ storeId }).lean();

  if (!content) {
    return {
      hero: null,
      banners: [],
      sections: DEFAULT_SECTIONS,
    };
  }

  const now = new Date();

  const activeBanners = (content.banners || []).filter((banner) =>
    isCurrentlyScheduled(banner, now)
  );

  return {
    ...content,
    hero:
      content.hero && isCurrentlyScheduled(content.hero, now)
        ? content.hero
        : null,
    banners: activeBanners,
    sections: (content.sections || [])
      .filter((section) => section.isActive)
      .sort((a, b) => a.order - b.order),
  };
}

export async function getHomepageContentForAdmin() {
  const storeId = await getStoreId();

  const content = await HomepageContent.findOne({ storeId }).lean();

  if (content) return content;

  return {
    storeId,
    hero: null,
    banners: [],
    sections: DEFAULT_SECTIONS,
  };
}

export async function saveHomepageContent(payload) {
  const storeId = await getStoreId();

  await validateCategoryIds(storeId, payload.sections || []);

  const content = await HomepageContent.findOneAndUpdate(
    { storeId },
    {
      $set: {
        ...(payload.hero !== undefined && { hero: payload.hero }),
        ...(payload.banners !== undefined && { banners: payload.banners }),
        ...(payload.sections !== undefined && {
          sections: payload.sections,
        }),
      },
      $setOnInsert: { storeId },
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    }
  );

  return content;
}

export async function resetHomepageContent() {
  const storeId = await getStoreId();

  const content = await HomepageContent.findOneAndUpdate(
    { storeId },
    {
      $set: {
        hero: null,
        banners: [],
        sections: DEFAULT_SECTIONS,
      },
      $setOnInsert: { storeId },
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    }
  );

  return content;
}