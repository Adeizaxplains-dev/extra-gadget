
import { z } from 'zod';

const objectIdSchema = z
  .string()
  .regex(/^[a-f\d]{24}$/i, 'Must be a valid ID');

const dateSchema = z
  .union([z.string().datetime(), z.date()])
  .nullable()
  .optional();

const destinationSchema = z.object({
  label: z.string().trim().min(1).max(50).optional(),

  destinationType: z
    .enum(['category', 'product', 'page', 'external'])
    .optional(),

  destinationUrl: z
    .string()
    .trim()
    .min(1, 'Destination is required')
    .max(2048)
    .optional(),
});

// Keep the base object separate so partial updates work correctly.
const bannerObjectSchema = z.object({
  headline: z
    .string()
    .trim()
    .min(1, 'Headline is required')
    .max(120),

  supportingText: z.string().trim().max(240).optional(),

  imageUrl: z
    .string()
    .trim()
    .min(1, 'Banner image is required'),

  mobileImageUrl: z.string().trim().optional(),

  imageAlt: z.string().trim().max(180).optional(),

  cta: destinationSchema.optional(),

  isActive: z.boolean().optional(),

  startsAt: dateSchema,

  endsAt: dateSchema,
});

// Shared date validation for both create and update operations.
const validateBannerDates = (banner, ctx) => {
  if (banner.startsAt && banner.endsAt) {
    const start = new Date(banner.startsAt).getTime();
    const end = new Date(banner.endsAt).getTime();

    if (start >= end) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['endsAt'],
        message: 'End date must be after the start date',
      });
    }
  }
};

// Full banner validation.
const bannerSchema = bannerObjectSchema.superRefine(
  validateBannerDates
);

// Partial banner validation.
// Apply partial() BEFORE superRefine().
const updateBannerSchema = bannerObjectSchema
  .partial()
  .superRefine(validateBannerDates);

const sectionSchema = z.object({
  type: z.enum([
    'trustStrip',
    'categoryGrid',
    'featuredProducts',
    'promoBanner',
    'bestSellers',
    'productCollection',
    'brandAbout',
  ]),

  title: z.string().trim().max(120).optional(),

  subtitle: z.string().trim().max(240).optional(),

  isActive: z.boolean().optional(),

  order: z.number().int().min(0),

  categoryIds: z.array(objectIdSchema).optional(),

  bannerId: objectIdSchema.nullable().optional(),

  collectionKey: z.string().trim().max(80).optional(),
});

// Homepage content validation.
export const createHomepageContentSchema = z.object({
  hero: bannerSchema.nullable().optional(),

  banners: z.array(bannerSchema).optional(),

  sections: z.array(sectionSchema).optional(),
});

// Partial homepage content update.
export const updateHomepageContentSchema =
  createHomepageContentSchema.partial();

// Individual banner validation.
export const createHomepageBannerSchema = bannerSchema;

export const updateHomepageBannerSchema = updateBannerSchema;

// Individual section validation.
export const createHomepageSectionSchema = sectionSchema;

export const updateHomepageSectionSchema =
  sectionSchema.partial();

// Used by homepageRoutes.js for PUT /homepage.
export const saveHomepageContentSchema =
  createHomepageContentSchema;
