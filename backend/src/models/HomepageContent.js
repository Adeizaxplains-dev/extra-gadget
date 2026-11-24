import mongoose from 'mongoose';

const { Schema } = mongoose;

const callToActionSchema = new Schema(
  {
    label: {
      type: String,
      default: 'Shop Now',
      trim: true,
      maxlength: 50,
    },

    destinationType: {
      type: String,
      enum: ['category', 'product', 'page', 'external'],
      default: 'page',
    },

    destinationUrl: {
      type: String,
      default: '/shop',
      trim: true,
      maxlength: 2048,
    },
  },
  { _id: false }
);

const bannerSchema = new Schema(
  {
    headline: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },

    supportingText: {
      type: String,
      default: '',
      trim: true,
      maxlength: 240,
    },

    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },

    mobileImageUrl: {
      type: String,
      default: '',
      trim: true,
    },

    imageAlt: {
      type: String,
      default: '',
      trim: true,
      maxlength: 180,
    },

    cta: {
      type: callToActionSchema,
      default: () => ({}),
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    startsAt: {
      type: Date,
      default: null,
    },

    endsAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const homepageSectionSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
      enum: [
        'trustStrip',
        'categoryGrid',
        'featuredProducts',
        'promoBanner',
        'bestSellers',
        'productCollection',
        'brandAbout',
      ],
    },

    title: {
      type: String,
      default: '',
      trim: true,
      maxlength: 120,
    },

    subtitle: {
      type: String,
      default: '',
      trim: true,
      maxlength: 240,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    order: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    /*
     * Used by categoryGrid sections.
     * References existing categories; does not duplicate their names,
     * slugs, or image URLs.
     */
    categoryIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Category',
      },
    ],

    /*
     * Used by promoBanner sections.
     * Embedded banner IDs allow a section to point to one banner.
     */
    bannerId: {
      type: Schema.Types.ObjectId,
      default: null,
    },

    /*
     * Used by productCollection sections.
     * The product collection itself is resolved by the storefront.
     */
    collectionKey: {
      type: String,
      default: '',
      trim: true,
      maxlength: 80,
    },
  },
  { timestamps: true }
);

const homepageContentSchema = new Schema(
  {
    storeId: {
      type: Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
      index: true,
    },

    hero: {
      type: bannerSchema,
      default: null,
    },

    banners: {
      type: [bannerSchema],
      default: [],
    },

    sections: {
      type: [homepageSectionSchema],
      default: [],
    },
  },
  { timestamps: true }
);

/*
 * One homepage configuration document per store.
 */
homepageContentSchema.index({ storeId: 1 }, { unique: true });

export const HomepageContent = mongoose.model(
  'HomepageContent',
  homepageContentSchema
);