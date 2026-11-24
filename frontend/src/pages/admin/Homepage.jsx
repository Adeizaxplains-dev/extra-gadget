
import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Eye,
  EyeOff,
  ImagePlus,
  Layout,
  LoaderCircle,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  Upload,
  X,
} from 'lucide-react';

import * as homepageService from '../../services/homepageService.js';
import * as categoryService from '../../services/categoryService.js';
import { api } from '../../services/api.js';

import { Button } from '../../components/ui/Button.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { PageSpinner } from '../../components/ui/Spinner.jsx';
import { ErrorState } from '../../components/ui/ErrorState.jsx';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const SECTION_TYPES = [
  { type: 'trustStrip', label: 'Trust strip', description: 'Store benefits and customer assurances.' },
  { type: 'categoryGrid', label: 'Category grid', description: 'Visual links to your store categories.' },
  { type: 'featuredProducts', label: 'Featured products', description: 'Highlight selected featured products.' },
  { type: 'promoBanner', label: 'Promotional banner', description: 'Display a promotional banner.' },
  { type: 'bestSellers', label: 'Best sellers', description: 'Show popular products.' },
  { type: 'productCollection', label: 'Product collection', description: 'Display a configured product collection.' },
  { type: 'brandAbout', label: 'Brand introduction', description: 'Tell customers about your store.' },
];

const emptyBanner = () => ({
  headline: '',
  supportingText: '',
  imageUrl: '',
  mobileImageUrl: '',
  imageAlt: '',
  cta: {
    label: 'Shop Now',
    destinationType: 'page',
    destinationUrl: '/shop',
  },
  isActive: true,
  startsAt: '',
  endsAt: '',
});

const emptySection = (type, order) => ({
  type,
  title: '',
  subtitle: '',
  isActive: true,
  order,
  categoryIds: [],
  bannerId: null,
  collectionKey: '',
});

function toDateInput(value) {
  if (!value) return '';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return '';

  const local = new Date(
    date.getTime() - date.getTimezoneOffset() * 60000
  );

  return local.toISOString().slice(0, 16);
}

function toISOStringOrNull(value) {
  if (!value) return null;

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function normalizeBanner(banner = {}) {
  return {
    ...emptyBanner(),
    ...banner,
    cta: {
      ...emptyBanner().cta,
      ...(banner.cta || {}),
    },
    startsAt: toDateInput(banner.startsAt),
    endsAt: toDateInput(banner.endsAt),
  };
}

function normalizeSection(section, index) {
  return {
    ...emptySection(section.type, index),
    ...section,
    categoryIds: (section.categoryIds || []).map((id) =>
      String(id?._id || id)
    ),
    bannerId: section.bannerId
      ? String(section.bannerId._id || section.bannerId)
      : null,
  };
}

function prepareBanner(banner) {
  return {
    headline: banner.headline.trim(),
    supportingText: banner.supportingText.trim(),
    imageUrl: banner.imageUrl.trim(),
    mobileImageUrl: banner.mobileImageUrl.trim(),
    imageAlt: banner.imageAlt.trim(),
    cta: {
      label: banner.cta.label.trim(),
      destinationType: banner.cta.destinationType,
      destinationUrl: banner.cta.destinationUrl.trim(),
    },
    isActive: Boolean(banner.isActive),
    startsAt: toISOStringOrNull(banner.startsAt),
    endsAt: toISOStringOrNull(banner.endsAt),
  };
}

function prepareSection(section, index) {
  return {
    type: section.type,
    title: section.title.trim(),
    subtitle: section.subtitle.trim(),
    isActive: Boolean(section.isActive),
    order: index,
    categoryIds:
      section.type === 'categoryGrid' ? section.categoryIds : [],
    bannerId:
      section.type === 'promoBanner' ? section.bannerId || null : null,
    collectionKey:
      section.type === 'productCollection'
        ? section.collectionKey.trim()
        : '',
  };
}

async function uploadImage(file) {
  if (!file) throw new Error('Please select an image.');

  if (!file.type.startsWith('image/')) {
    throw new Error('Please select a valid image file.');
  }

  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error('Image must be 5MB or smaller.');
  }

  const dataUri = await new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Unable to read image.'));

    reader.readAsDataURL(file);
  });

  const response = await api.post('/products/admin/upload-image', {
    dataUri,
  });

  const url = response.data?.url;

  if (!url) {
    throw new Error('The image upload did not return an image URL.');
  }

  return url;
}

function Field({ label, hint, children }) {
  return (
    <div className="min-w-0">
      <label className="mb-1.5 block text-sm font-medium text-charcoal">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1.5 text-xs text-muted">{hint}</p>}
    </div>
  );
}

function TextInput({ value, onChange, placeholder, type = 'text', maxLength }) {
  return (
    <input
      type={type}
      value={value ?? ''}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
      className="w-full rounded-lg border border-charcoal/15 bg-white px-3 py-2.5 text-sm text-charcoal outline-none transition placeholder:text-muted/60 focus:border-primary focus:ring-2 focus:ring-primary/10"
    />
  );
}

function TextArea({ value, onChange, placeholder, rows = 3, maxLength }) {
  return (
    <textarea
      value={value ?? ''}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      rows={rows}
      maxLength={maxLength}
      className="w-full resize-y rounded-lg border border-charcoal/15 bg-white px-3 py-2.5 text-sm text-charcoal outline-none transition placeholder:text-muted/60 focus:border-primary focus:ring-2 focus:ring-primary/10"
    />
  );
}

function SelectInput({ value, onChange, options }) {
  return (
    <select
      value={value ?? ''}
      onChange={(event) => onChange(event.target.value)}
      className="w-full rounded-lg border border-charcoal/15 bg-white px-3 py-2.5 text-sm text-charcoal outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

function ImageUploader({ label, value, onChange, uploading, onUpload, hint }) {
  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) return;

    await onUpload(file);
  };

  return (
    <div>
      <p className="mb-2 text-sm font-medium text-charcoal">{label}</p>

      <div className="overflow-hidden rounded-xl border border-dashed border-charcoal/20 bg-surface">
        {value ? (
          <div className="relative">
            <img
              src={value}
              alt={label}
              className="h-44 w-full object-cover"
            />

            <div className="absolute right-2 top-2 flex gap-2">
              <label className="flex h-9 cursor-pointer items-center gap-1.5 rounded-lg bg-white px-3 text-xs font-medium text-charcoal shadow">
                {uploading ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                {uploading ? 'Uploading' : 'Replace'}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploading}
                  onChange={handleFile}
                />
              </label>

              <button
                type="button"
                onClick={() => onChange('')}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-terracotta shadow"
                aria-label={`Remove ${label}`}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          <label className="flex min-h-44 cursor-pointer flex-col items-center justify-center px-4 text-center transition hover:bg-charcoal/[0.03]">
            {uploading ? (
              <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
            ) : (
              <ImagePlus className="h-8 w-8 text-muted" />
            )}

            <span className="mt-3 text-sm font-medium text-charcoal">
              {uploading ? 'Uploading image...' : 'Choose an image'}
            </span>

            <span className="mt-1 text-xs text-muted">
              JPG, PNG or WebP · Maximum 5MB
            </span>

            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={handleFile}
            />
          </label>
        )}
      </div>

      {hint && <p className="mt-2 text-xs text-muted">{hint}</p>}
    </div>
  );
}

function StatusToggle({ checked, onChange, label = 'Visible on storefront' }) {
  return (
    <label className="flex cursor-pointer items-center gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition ${
          checked ? 'bg-emerald' : 'bg-charcoal/20'
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
            checked ? 'left-6' : 'left-1'
          }`}
        />
      </button>
      <span className="text-sm text-charcoal">{label}</span>
    </label>
  );
}

export function Homepage() {
  const [content, setContent] = useState(null);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [uploading, setUploading] = useState({});
  const [activeTab, setActiveTab] = useState('hero');

  const load = async () => {
    setError('');

    try {
      const [homepageData, categoryData] = await Promise.all([
        homepageService.getHomepageContentForAdmin(),
        categoryService.listCategories(),
      ]);

      setContent({
        hero: homepageData.hero
          ? normalizeBanner(homepageData.hero)
          : emptyBanner(),
        banners: (homepageData.banners || []).map(normalizeBanner),
        sections: (homepageData.sections || [])
          .map(normalizeSection)
          .sort((a, b) => a.order - b.order),
      });

      setCategories(categoryData || []);
    } catch (err) {
      setError(err?.message || 'Unable to load homepage configuration.');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const activeCategories = useMemo(
    () => categories.filter((category) => category.status === 'active'),
    [categories]
  );

  const savedBanners = useMemo(
    () => content?.banners.filter((banner) => banner._id) || [],
    [content]
  );

  const updateHero = (field, value) => {
    setContent((current) => ({
      ...current,
      hero: { ...current.hero, [field]: value },
    }));
  };

  const updateHeroCta = (field, value) => {
    setContent((current) => ({
      ...current,
      hero: {
        ...current.hero,
        cta: { ...current.hero.cta, [field]: value },
      },
    }));
  };

  const updateBanner = (index, field, value) => {
    setContent((current) => ({
      ...current,
      banners: current.banners.map((banner, i) =>
        i === index ? { ...banner, [field]: value } : banner
      ),
    }));
  };

  const updateBannerCta = (index, field, value) => {
    setContent((current) => ({
      ...current,
      banners: current.banners.map((banner, i) =>
        i === index
          ? {
              ...banner,
              cta: { ...banner.cta, [field]: value },
            }
          : banner
      ),
    }));
  };

  const updateSection = (index, field, value) => {
    setContent((current) => ({
      ...current,
      sections: current.sections.map((section, i) =>
        i === index ? { ...section, [field]: value } : section
      ),
    }));
  };

  const handleUpload = async (key, file, callback) => {
    setError('');

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file.');
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setError('Image must be 5MB or smaller.');
      return;
    }

    setUploading((current) => ({ ...current, [key]: true }));

    try {
      const url = await uploadImage(file);
      callback(url);
      setNotice('Image uploaded successfully.');
    } catch (err) {
      setError(err?.message || 'Unable to upload image.');
    } finally {
      setUploading((current) => ({ ...current, [key]: false }));
    }
  };

  const addBanner = () => {
    setContent((current) => ({
      ...current,
      banners: [...current.banners, emptyBanner()],
    }));
  };

  const removeBanner = (index) => {
    const banner = content.banners[index];

    if (banner._id) {
      const linked = content.sections.some(
        (section) => section.bannerId === String(banner._id)
      );

      if (linked) {
        setError('This banner is linked to a promotional section. Unlink it before deleting.');
        return;
      }
    }

    if (!window.confirm('Remove this promotional banner?')) return;

    setContent((current) => ({
      ...current,
      banners: current.banners.filter((_, i) => i !== index),
    }));
  };

  const addSection = (type) => {
    setContent((current) => ({
      ...current,
      sections: [
        ...current.sections,
        emptySection(type, current.sections.length),
      ],
    }));
  };

  const removeSection = (index) => {
    if (!window.confirm('Remove this homepage section?')) return;

    setContent((current) => ({
      ...current,
      sections: current.sections
        .filter((_, i) => i !== index)
        .map((section, i) => ({ ...section, order: i })),
    }));
  };

  const moveSection = (index, direction) => {
    const target = index + direction;

    if (target < 0 || target >= content.sections.length) return;

    setContent((current) => {
      const sections = [...current.sections];

      [sections[index], sections[target]] = [
        sections[target],
        sections[index],
      ];

      return {
        ...current,
        sections: sections.map((section, i) => ({
          ...section,
          order: i,
        })),
      };
    });
  };

  const toggleCategory = (sectionIndex, categoryId) => {
    const section = content.sections[sectionIndex];
    const selected = section.categoryIds || [];

    updateSection(
      sectionIndex,
      'categoryIds',
      selected.includes(categoryId)
        ? selected.filter((id) => id !== categoryId)
        : [...selected, categoryId]
    );
  };

  const handleSave = async () => {
    setError('');
    setNotice('');

    if (content.hero.headline.trim() && !content.hero.imageUrl.trim()) {
      setError('Please upload a desktop image for the hero banner.');
      setActiveTab('hero');
      return;
    }

    if (
      content.hero.imageUrl.trim() &&
      !content.hero.headline.trim()
    ) {
      setError('The hero headline is required when a hero image is configured.');
      setActiveTab('hero');
      return;
    }

    for (let i = 0; i < content.banners.length; i += 1) {
      const banner = content.banners[i];

      if (!banner.headline.trim() || !banner.imageUrl.trim()) {
        setError(`Promotional banner ${i + 1} needs a headline and image.`);
        setActiveTab('banners');
        return;
      }

      if (
        banner.startsAt &&
        banner.endsAt &&
        new Date(banner.startsAt) >= new Date(banner.endsAt)
      ) {
        setError(`Promotional banner ${i + 1} has an invalid schedule.`);
        setActiveTab('banners');
        return;
      }
    }

    for (const section of content.sections) {
  if (
    section.type === 'productCollection' &&
    section.isActive &&
    !section.collectionKey.trim()
  ) {
    setError(
      'Enter a collection key for every active product collection.'
    );
    setActiveTab('sections');
    return;
  }
}
    setSaving(true);

    try {
      const payload = {
        hero: content.hero.headline.trim()
          ? prepareBanner(content.hero)
          : null,
        banners: content.banners.map(prepareBanner),
        sections: content.sections.map(prepareSection),
      };

      await homepageService.saveHomepageContent(payload);

      setNotice('Homepage configuration saved successfully.');

      await load();
    } catch (err) {
      setError(err?.message || 'Unable to save homepage configuration.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    const confirmed = window.confirm(
      'Restore the default homepage configuration? Your current hero, banners and section settings will be replaced.'
    );

    if (!confirmed) return;

    setResetting(true);
    setError('');
    setNotice('');

    try {
      await homepageService.resetHomepageContent();
      await load();
      setNotice('Homepage configuration restored to defaults.');
    } catch (err) {
      setError(err?.message || 'Unable to reset homepage configuration.');
    } finally {
      setResetting(false);
    }
  };

  if (!content) {
    return error ? (
      <div className="p-6">
        <ErrorState message={error} />
        <Button className="mt-4" onClick={load}>
          Try again
        </Button>
      </div>
    ) : (
      <PageSpinner />
    );
  }

  const tabs = [
    { id: 'hero', label: 'Hero banner' },
    { id: 'banners', label: 'Promotional banners' },
    { id: 'sections', label: 'Homepage sections' },
  ];

  return (
    <div className="mx-auto max-w-6xl pb-16">
      {/* Header */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            <Layout className="h-4 w-4" />
            Storefront management
          </div>

          <h1 className="font-display text-2xl font-semibold text-charcoal sm:text-3xl">
            Homepage editor
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            Control the banners, promotional content and sections customers
            see when they visit your store.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={handleReset}
            disabled={resetting || saving}
          >
            <RefreshCw className={`h-4 w-4 ${resetting ? 'animate-spin' : ''}`} />
            {resetting ? 'Resetting...' : 'Reset'}
          </Button>

          <Button
            type="button"
            onClick={handleSave}
            disabled={saving || resetting}
          >
            {saving ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {saving ? 'Saving...' : 'Save changes'}
          </Button>
        </div>
      </div>

      {/* Feedback */}
      {error && (
        <div className="mt-5">
          <ErrorState message={error} />
        </div>
      )}

      {notice && (
        <div className="mt-5 rounded-xl border border-emerald/20 bg-emerald/5 px-4 py-3 text-sm text-emerald">
          {notice}
        </div>
      )}

      {/* Navigation */}
      <div className="mt-8 flex gap-2 overflow-x-auto border-b border-charcoal/10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`shrink-0 border-b-2 px-4 py-3 text-sm font-medium transition ${
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted hover:text-charcoal'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Hero */}
      {activeTab === 'hero' && (
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="space-y-6">
            <div className="rounded-2xl border border-charcoal/10 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5">
                <h2 className="font-display text-lg font-semibold text-charcoal">
                  Hero content
                </h2>
                <p className="mt-1 text-sm text-muted">
                  This is the main promotional area customers see first.
                </p>
              </div>

              <div className="space-y-5">
                <Field label="Headline">
                  <TextInput
                    value={content.hero.headline}
                    onChange={(value) => updateHero('headline', value)}
                    placeholder="Premium Gadgets, Sourced Globally."
                    maxLength={120}
                  />
                </Field>

                <Field label="Supporting text">
                  <TextArea
                    value={content.hero.supportingText}
                    onChange={(value) => updateHero('supportingText', value)}
                    placeholder="Introduce your products and your store..."
                    maxLength={240}
                  />
                </Field>

                <Field label="Image alternative text">
                  <TextInput
                    value={content.hero.imageAlt}
                    onChange={(value) => updateHero('imageAlt', value)}
                    placeholder="Describe the hero image"
                    maxLength={180}
                  />
                </Field>

                <div className="grid gap-4 sm:grid-cols-2">
                  <ImageUploader
                    label="Desktop hero image"
                    value={content.hero.imageUrl}
                    uploading={uploading.heroDesktop}
                    onChange={(value) => updateHero('imageUrl', value)}
                    onUpload={(file) =>
                      handleUpload('heroDesktop', file, (url) =>
                        updateHero('imageUrl', url)
                      )
                    }
                    hint="Recommended landscape image."
                  />

                  <ImageUploader
                    label="Mobile hero image"
                    value={content.hero.mobileImageUrl}
                    uploading={uploading.heroMobile}
                    onChange={(value) => updateHero('mobileImageUrl', value)}
                    onUpload={(file) =>
                      handleUpload('heroMobile', file, (url) =>
                        updateHero('mobileImageUrl', url)
                      )
                    }
                    hint="Optional image optimized for mobile."
                  />
                </div>

                <div className="border-t border-charcoal/10 pt-5">
                  <h3 className="mb-4 text-sm font-semibold text-charcoal">
                    Call to action
                  </h3>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Button label">
                      <TextInput
                        value={content.hero.cta.label}
                        onChange={(value) => updateHeroCta('label', value)}
                        placeholder="Shop Now"
                        maxLength={50}
                      />
                    </Field>

                    <Field label="Destination type">
                      <SelectInput
                        value={content.hero.cta.destinationType}
                        onChange={(value) =>
                          updateHeroCta('destinationType', value)
                        }
                        options={[
                          { value: 'page', label: 'Store page' },
                          { value: 'category', label: 'Category' },
                          { value: 'product', label: 'Product' },
                          { value: 'external', label: 'External website' },
                        ]}
                      />
                    </Field>

                    <div className="sm:col-span-2">
                      <Field
                        label="Destination URL"
                        hint="Examples: /shop, /shop?category=phones, or https://example.com"
                      >
                        <TextInput
                          value={content.hero.cta.destinationUrl}
                          onChange={(value) =>
                            updateHeroCta('destinationUrl', value)
                          }
                          placeholder="/shop"
                        />
                      </Field>
                    </div>
                  </div>
                </div>

                <StatusToggle
                  checked={content.hero.isActive}
                  onChange={(value) => updateHero('isActive', value)}
                  label="Enable hero banner"
                />

                <div className="grid gap-4 border-t border-charcoal/10 pt-5 sm:grid-cols-2">
                  <Field label="Start date (optional)">
                    <TextInput
                      type="datetime-local"
                      value={content.hero.startsAt}
                      onChange={(value) => updateHero('startsAt', value)}
                    />
                  </Field>

                  <Field label="End date (optional)">
                    <TextInput
                      type="datetime-local"
                      value={content.hero.endsAt}
                      onChange={(value) => updateHero('endsAt', value)}
                    />
                  </Field>
                </div>
              </div>
            </div>
          </div>

          {/* Hero preview */}
          <aside className="h-fit rounded-2xl border border-charcoal/10 bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Eye className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-charcoal">
                Hero preview
              </h3>
            </div>

            <div className="overflow-hidden rounded-xl bg-charcoal">
              {content.hero.imageUrl ? (
                <img
                  src={content.hero.imageUrl}
                  alt={content.hero.imageAlt || 'Hero preview'}
                  className="aspect-[4/3] w-full object-cover"
                />
              ) : (
                <div className="flex aspect-[4/3] flex-col items-center justify-center text-white/60">
                  <ImagePlus className="h-9 w-9" />
                  <p className="mt-2 text-xs">Your hero image appears here</p>
                </div>
              )}
            </div>

            <h3 className="mt-4 font-display text-lg font-semibold text-charcoal">
              {content.hero.headline || 'Your headline'}
            </h3>

            <p className="mt-2 text-sm leading-6 text-muted">
              {content.hero.supportingText || 'Your supporting text will appear here.'}
            </p>

            <div className="mt-4 inline-flex rounded-lg bg-primary px-4 py-2.5 text-xs font-semibold text-white">
              {content.hero.cta.label || 'Shop Now'}
            </div>

            <div className="mt-4">
              <Badge variant={content.hero.isActive ? 'success' : 'neutral'}>
                {content.hero.isActive ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
          </aside>
        </div>
      )}

      {/* Promotional banners */}
      {activeTab === 'banners' && (
        <div className="mt-6">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-lg font-semibold text-charcoal">
                Promotional banners
              </h2>
              <p className="mt-1 text-sm text-muted">
                Create campaign graphics and link them to promotional sections.
              </p>
            </div>

            <Button type="button" onClick={addBanner}>
              <Plus className="h-4 w-4" />
              Add banner
            </Button>
          </div>

          {content.banners.length === 0 && (
            <div className="rounded-2xl border border-dashed border-charcoal/20 bg-white p-12 text-center">
              <ImagePlus className="mx-auto h-10 w-10 text-muted" />
              <h3 className="mt-4 font-semibold text-charcoal">
                No promotional banners yet
              </h3>
              <p className="mt-1 text-sm text-muted">
                Add your first banner to start creating promotional campaigns.
              </p>
            </div>
          )}

          <div className="space-y-5">
            {content.banners.map((banner, index) => (
              <div
                key={banner._id || `new-banner-${index}`}
                className="rounded-2xl border border-charcoal/10 bg-white p-5 shadow-sm sm:p-6"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface text-sm font-semibold text-charcoal">
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    <div>
                      <h3 className="text-sm font-semibold text-charcoal">
                        {banner.headline || `Promotional banner ${index + 1}`}
                      </h3>
                      <p className="text-xs text-muted">
                        {banner._id ? 'Saved banner' : 'New banner'}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeBanner(index)}
                    className="rounded-lg p-2 text-muted transition hover:bg-terracotta/10 hover:text-terracotta"
                    aria-label="Remove banner"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
                  <div className="space-y-4">
                    <Field label="Headline">
                      <TextInput
                        value={banner.headline}
                        onChange={(value) =>
                          updateBanner(index, 'headline', value)
                        }
                        placeholder="Your promotional headline"
                        maxLength={120}
                      />
                    </Field>

                    <Field label="Supporting text">
                      <TextArea
                        value={banner.supportingText}
                        onChange={(value) =>
                          updateBanner(index, 'supportingText', value)
                        }
                        placeholder="Explain your promotion..."
                        maxLength={240}
                      />
                    </Field>

                    <Field label="Image alternative text">
                      <TextInput
                        value={banner.imageAlt}
                        onChange={(value) =>
                          updateBanner(index, 'imageAlt', value)
                        }
                        placeholder="Describe the banner"
                        maxLength={180}
                      />
                    </Field>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Button label">
                        <TextInput
                          value={banner.cta.label}
                          onChange={(value) =>
                            updateBannerCta(index, 'label', value)
                          }
                          maxLength={50}
                        />
                      </Field>

                      <Field label="Destination type">
                        <SelectInput
                          value={banner.cta.destinationType}
                          onChange={(value) =>
                            updateBannerCta(index, 'destinationType', value)
                          }
                          options={[
                            { value: 'page', label: 'Store page' },
                            { value: 'category', label: 'Category' },
                            { value: 'product', label: 'Product' },
                            { value: 'external', label: 'External website' },
                          ]}
                        />
                      </Field>
                    </div>

                    <Field label="Destination URL">
                      <TextInput
                        value={banner.cta.destinationUrl}
                        onChange={(value) =>
                          updateBannerCta(index, 'destinationUrl', value)
                        }
                        placeholder="/shop"
                      />
                    </Field>

                    <StatusToggle
                      checked={banner.isActive}
                      onChange={(value) =>
                        updateBanner(index, 'isActive', value)
                      }
                    />

                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Start date">
                        <TextInput
                          type="datetime-local"
                          value={banner.startsAt}
                          onChange={(value) =>
                            updateBanner(index, 'startsAt', value)
                          }
                        />
                      </Field>

                      <Field label="End date">
                        <TextInput
                          type="datetime-local"
                          value={banner.endsAt}
                          onChange={(value) =>
                            updateBanner(index, 'endsAt', value)
                          }
                        />
                      </Field>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <ImageUploader
                      label="Desktop image"
                      value={banner.imageUrl}
                      uploading={uploading[`banner-${index}-desktop`]}
                      onChange={(value) =>
                        updateBanner(index, 'imageUrl', value)
                      }
                      onUpload={(file) =>
                        handleUpload(
                          `banner-${index}-desktop`,
                          file,
                          (url) => updateBanner(index, 'imageUrl', url)
                        )
                      }
                    />

                    <ImageUploader
                      label="Mobile image"
                      value={banner.mobileImageUrl}
                      uploading={uploading[`banner-${index}-mobile`]}
                      onChange={(value) =>
                        updateBanner(index, 'mobileImageUrl', value)
                      }
                      onUpload={(file) =>
                        handleUpload(
                          `banner-${index}-mobile`,
                          file,
                          (url) =>
                            updateBanner(index, 'mobileImageUrl', url)
                        )
                      }
                      hint="Optional."
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Homepage sections */}
      {activeTab === 'sections' && (
        <div className="mt-6 grid gap-6 lg:grid-cols-[300px_1fr]">
          <aside className="h-fit rounded-2xl border border-charcoal/10 bg-white p-5 shadow-sm">
            <h2 className="font-display text-lg font-semibold text-charcoal">
              Add a section
            </h2>

            <p className="mt-1 text-sm text-muted">
              Choose the content type you want to add.
            </p>

            <div className="mt-5 space-y-2">
              {SECTION_TYPES.map((item) => (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => addSection(item.type)}
                  className="flex w-full items-start gap-3 rounded-xl border border-charcoal/10 p-3 text-left transition hover:border-primary/40 hover:bg-primary/[0.03]"
                >
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface text-primary">
                    <Plus className="h-4 w-4" />
                  </span>

                  <span>
                    <span className="block text-sm font-semibold text-charcoal">
                      {item.label}
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-muted">
                      {item.description}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </aside>

          <div>
            <div className="mb-4">
              <h2 className="font-display text-lg font-semibold text-charcoal">
                Homepage layout
              </h2>
              <p className="mt-1 text-sm text-muted">
                Change section visibility and order. The first section appears first.
              </p>
            </div>

            {content.sections.length === 0 && (
              <div className="rounded-2xl border border-dashed border-charcoal/20 bg-white p-10 text-center">
                <Layout className="mx-auto h-9 w-9 text-muted" />
                <p className="mt-3 text-sm font-medium text-charcoal">
                  No sections configured
                </p>
                <p className="mt-1 text-xs text-muted">
                  Add a section from the left panel.
                </p>
              </div>
            )}

            <div className="space-y-4">
              {content.sections.map((section, index) => {
                const definition = SECTION_TYPES.find(
                  (item) => item.type === section.type
                );

                return (
                  <div
                    key={`${section.type}-${index}`}
                    className="rounded-2xl border border-charcoal/10 bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface text-sm font-semibold text-charcoal">
                        {index + 1}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-semibold text-charcoal">
                          {definition?.label || section.type}
                        </h3>
                        <p className="mt-1 text-xs text-muted">
                          {definition?.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => moveSection(index, -1)}
                          disabled={index === 0}
                          className="rounded-lg p-2 text-muted hover:bg-surface disabled:opacity-30"
                          aria-label="Move section up"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => moveSection(index, 1)}
                          disabled={index === content.sections.length - 1}
                          className="rounded-lg p-2 text-muted hover:bg-surface disabled:opacity-30"
                          aria-label="Move section down"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => removeSection(index)}
                          className="rounded-lg p-2 text-muted hover:bg-terracotta/10 hover:text-terracotta"
                          aria-label="Delete section"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-5 space-y-4 border-t border-charcoal/10 pt-5">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Section title">
                          <TextInput
                            value={section.title}
                            onChange={(value) =>
                              updateSection(index, 'title', value)
                            }
                            placeholder="Section heading"
                            maxLength={120}
                          />
                        </Field>

                        <Field label="Subtitle">
                          <TextInput
                            value={section.subtitle}
                            onChange={(value) =>
                              updateSection(index, 'subtitle', value)
                            }
                            placeholder="Optional supporting text"
                            maxLength={240}
                          />
                        </Field>
                      </div>

                      {section.type === 'categoryGrid' && (
                        <div>
                          <p className="mb-3 text-sm font-medium text-charcoal">
                            Select categories
                          </p>

                          {activeCategories.length === 0 ? (
                            <p className="text-sm text-muted">
                              No active categories available.
                            </p>
                          ) : (
                            <div className="grid gap-2 sm:grid-cols-2">
                              {activeCategories.map((category) => {
                                const checked = section.categoryIds.includes(
                                  String(category._id)
                                );

                                return (
                                  <label
                                    key={category._id}
                                    className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition ${
                                      checked
                                        ? 'border-primary bg-primary/[0.04]'
                                        : 'border-charcoal/10 hover:bg-surface'
                                    }`}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={checked}
                                      onChange={() =>
                                        toggleCategory(
                                          index,
                                          String(category._id)
                                        )
                                      }
                                      className="h-4 w-4 accent-primary"
                                    />

                                    {category.imageUrl ? (
                                      <img
                                        src={category.imageUrl}
                                        alt=""
                                        className="h-10 w-10 rounded-lg object-cover"
                                      />
                                    ) : (
                                      <span className="h-10 w-10 rounded-lg bg-surface" />
                                    )}

                                    <span className="text-sm font-medium text-charcoal">
                                      {category.name}
                                    </span>
                                  </label>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}

                      {section.type === 'promoBanner' && (
  <Field
    label="Linked promotional banner"
    hint={
      savedBanners.length > 0
        ? 'Select a saved banner to display in this section.'
        : 'Save a promotional banner first. You can link it here afterward.'
    }
  >
    <SelectInput
      value={section.bannerId || ''}
      onChange={(value) =>
        updateSection(index, 'bannerId', value || null)
      }
      options={[
        {
          value: '',
          label:
            savedBanners.length > 0
              ? 'Select a saved banner'
              : 'No saved banners yet',
        },
        ...savedBanners.map((banner) => ({
          value: String(banner._id),
          label: banner.headline || 'Untitled banner',
        })),
      ]}
    />
  </Field>
)}


                      {section.type === 'productCollection' && (
                        <Field
                          label="Collection key"
                          hint="This key must be understood by your storefront product-collection resolver."
                        >
                          <TextInput
                            value={section.collectionKey}
                            onChange={(value) =>
                              updateSection(index, 'collectionKey', value)
                            }
                            placeholder="e.g. gaming-accessories"
                            maxLength={80}
                          />
                        </Field>
                      )}

                      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-charcoal/10 pt-4">
                        <StatusToggle
                          checked={section.isActive}
                          onChange={(value) =>
                            updateSection(index, 'isActive', value)
                          }
                        />

                        <Badge variant={section.isActive ? 'success' : 'neutral'}>
                          {section.isActive ? 'Visible' : 'Hidden'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Bottom save action */}
      <div className="mt-8 flex flex-col justify-between gap-4 rounded-2xl border border-charcoal/10 bg-white p-5 shadow-sm sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold text-charcoal">
            Ready to publish your changes?
          </p>
          <p className="mt-1 text-xs text-muted">
            Save your configuration to update the homepage settings.
          </p>
        </div>

        <Button onClick={handleSave} disabled={saving || resetting}>
          <Save className="h-4 w-4" />
          {saving ? 'Saving...' : 'Save homepage'}
        </Button>
      </div>
    </div>
  );
}
