
import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Globe2,
  MessageCircle,
  Recycle,
  ShieldCheck,
  Sparkles,
  Truck,
  Wallet,
} from 'lucide-react';

import * as productService from '../../services/productService.js';
import * as categoryService from '../../services/categoryService.js';
import * as homepageService from '../../services/homepageService.js';

import { ProductGrid } from '../../components/product/ProductGrid.jsx';
import { CategoryIcon } from '../../components/product/CategoryIcon.jsx';
import { DemoProductCard } from '../../components/product/DemoProductCard.jsx';
import { PageSpinner } from '../../components/ui/Spinner.jsx';
import { Button } from '../../components/ui/Button.jsx';

import { useStoreInfo } from '../../hooks/useStoreInfo.js';
import { buildWhatsAppLink } from '../../utils/whatsapp.js';
import { formatCurrency } from '../../utils/currency.js';

import { STORE_CONFIG } from '../../config/store.config.js';
import { HOMEPAGE_CATEGORIES } from '../../config/categories.config.js';
import { DEMO_PRODUCTS, DEMO_DEALS } from '../../config/demo-products.js';

function getProductImage(product) {
  return product?.images?.[0]?.url || product?.images?.[0] || '';
}

function isValidBanner(banner) {
  return Boolean(banner?.headline && banner?.imageUrl);
}

function isInternalDestination(url) {
  return typeof url === 'string' && url.startsWith('/');
}

function getDestination(banner) {
  const destination = banner?.cta?.destinationUrl || '/shop';

  if (
    banner?.cta?.destinationType === 'external' &&
    !/^https?:\/\//i.test(destination)
  ) {
    return '/shop';
  }

  return destination;
}

function getConfiguredCategories(categories, section) {
  const selectedIds = section?.categoryIds || [];

  if (!selectedIds.length) return categories || [];

  return selectedIds
    .map((id) =>
      (categories || []).find(
        (category) => String(category._id) === String(id)
      )
    )
    .filter(Boolean);
}

function getBannerForSection(homepage, section) {
  return (homepage?.banners || []).find(
    (banner) =>
      String(banner._id) === String(section.bannerId) &&
      isValidBanner(banner)
  );
}

/**
 * Large editorial product showcase.
 * Uses actual featured products from the store API.
 */
function HeroShowcase({ products }) {
  const slides = useMemo(
    () => (products || []).filter((product) => getProductImage(product)),
    [products]
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (slides.length < 2 || isPaused) return undefined;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) return undefined;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [slides.length, isPaused]);

  useEffect(() => {
    if (activeIndex >= slides.length) setActiveIndex(0);
  }, [activeIndex, slides.length]);

  if (!slides.length) return null;

  const product = slides[activeIndex];
  const image = getProductImage(product);
  const price = product.salePrice ?? product.basePrice;
  const productKey = product._id || product.id || product.slug || activeIndex;

  const previousSlide = () => {
    setActiveIndex((current) =>
      current === 0 ? slides.length - 1 : current - 1
    );
  };

  const nextSlide = () => {
    setActiveIndex((current) => (current + 1) % slides.length);
  };

  return (
    <div
      className="hero-showcase"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsPaused(false);
        }
      }}
      aria-label="Featured products"
    >
      <div className="hero-showcase-topline">
        <span className="hero-showcase-label">
          <span className="hero-live-dot" />
          FEATURED COLLECTION
        </span>

        <span className="hero-showcase-count" aria-live="polite">
          {String(activeIndex + 1).padStart(2, '0')} /{' '}
          {String(slides.length).padStart(2, '0')}
        </span>
      </div>

      <div className="hero-showcase-image">
        <Link
          to={`/product/${product.slug}`}
          aria-label={`View ${product.name}`}
          className="hero-showcase-image-link"
        >
          <img
            key={productKey}
            src={image}
            alt={product.name}
            className="hero-showcase-img"
          />
        </Link>

        <div className="hero-image-overlay" aria-hidden="true" />
        <span className="hero-image-tag">EX-TRA GADGETS</span>

        {slides.length > 1 && (
          <div className="hero-showcase-controls">
            <button
              type="button"
              onClick={previousSlide}
              aria-label="Previous featured product"
              className="hero-control-button"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next featured product"
              className="hero-control-button"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      <div className="hero-showcase-details">
        <div className="min-w-0">
          <p className="hero-product-eyebrow">DISCOVER YOUR NEXT DEVICE</p>

          <Link
            to={`/product/${product.slug}`}
            className="hero-product-name"
          >
            {product.name}
          </Link>

          {price != null && (
            <p className="hero-product-price">
              {formatCurrency(price, 'NGN')}
            </p>
          )}
        </div>

        <Link
          to={`/product/${product.slug}`}
          className="hero-product-link"
        >
          View Product
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {slides.length > 1 && (
        <div className="hero-showcase-pagination">
          <div className="hero-pagination-dots">
            {slides.map((item, index) => (
              <button
                key={item._id || item.id || item.slug || index}
                type="button"
                aria-label={`Show featured product ${index + 1}`}
                aria-current={index === activeIndex ? 'true' : undefined}
                onClick={() => setActiveIndex(index)}
                className={`hero-pagination-dot ${
                  index === activeIndex ? 'active' : ''
                }`}
              />
            ))}
          </div>

          <span>Explore our selection</span>
        </div>
      )}
    </div>
  );
}

/**
 * Configured hero content.
 * The administrator controls the message and image.
 * The existing product showcase remains alongside it.
 */
function ConfiguredHero({ banner, fallback, whatsappHref, storeName }) {
  const activeBanner = isValidBanner(banner) ? banner : null;

  const headline = activeBanner?.headline;
  const supportingText = activeBanner?.supportingText;
  const imageUrl = activeBanner?.imageUrl;
  const mobileImageUrl = activeBanner?.mobileImageUrl;
  const destination = getDestination(activeBanner);

  const title = headline || 'Premium Gadgets,';
  const description =
    supportingText ||
    'Explore phones, laptops, tablets, audio devices, power solutions and more — carefully selected for your everyday technology needs and delivered across Nigeria.';

  const ctaLabel = activeBanner?.cta?.label || 'Explore Collection';

  return (
    <section className="hero-premium">
      <div className="hero-premium-glow" aria-hidden="true" />

      <div className="container-page hero-premium-container">
        <div className="hero-premium-copy">
          <div className="hero-brand-kicker">
            <Globe2 className="h-4 w-4" />
            <span>{STORE_CONFIG.sourcing.join(' · ')}</span>
          </div>

          <h1 className="hero-premium-heading">
            {title}
          </h1>

          <p className="hero-premium-description">
            {description}
          </p>

          <div className="hero-premium-actions">
            {activeBanner?.cta?.destinationType === 'external' ? (
              <Button
                as="a"
                href={destination}
                target="_blank"
                rel="noopener noreferrer"
                size="lg"
                variant="primary"
              >
                {ctaLabel}
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                as={Link}
                to={destination}
                size="lg"
                variant="primary"
              >
                {ctaLabel}
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}

            <Button
              as="a"
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              size="lg"
              variant="whatsapp"
            >
              <MessageCircle className="h-4 w-4" />
              Chat on WhatsApp
            </Button>
          </div>

          <div className="hero-premium-assurance">
            <span>
              <ShieldCheck className="h-4 w-4" />
              Quality-conscious selection
            </span>

            <span>
              <Truck className="h-4 w-4" />
              Nationwide delivery
            </span>
          </div>

          <div className="hero-premium-location">
            <span className="hero-location-line" />
            <span>{STORE_CONFIG.delivery.coverage}</span>
          </div>
        </div>

        <div className="hero-premium-visual">
          {imageUrl ? (
            <Link
              to={isInternalDestination(destination) ? destination : '/shop'}
              className="block h-full overflow-hidden rounded-2xl"
              aria-label={banner?.imageAlt || headline || 'Featured collection'}
            >
              <picture className="block h-full">
                {mobileImageUrl && (
                  <source
                    media="(max-width: 639px)"
                    srcSet={mobileImageUrl}
                  />
                )}
                <img
                  src={imageUrl}
                  alt={banner?.imageAlt || headline || 'Featured collection'}
                  className="h-full w-full rounded-2xl object-cover"
                />
              </picture>
            </Link>
          ) : fallback}
        </div>
      </div>
    </section>
  );
}

function CategorySection({ categories, section }) {
  const visibleCategories = getConfiguredCategories(categories, section);

  if (!visibleCategories.length) return null;

  return (
    <section className="container-page py-14">
      <h2 className="font-display text-2xl font-bold text-charcoal">
        {section?.title || 'Shop by Category'}
      </h2>

      {section?.subtitle && (
        <p className="mt-2 text-sm text-muted">{section.subtitle}</p>
      )}

      {!section?.subtitle && (
        <p className="mt-2 text-sm text-muted">
          Find exactly what you're looking for.
        </p>
      )}

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {visibleCategories.map((category) => {
          const fallback = HOMEPAGE_CATEGORIES.find(
            (item) => item.slug === category.slug
          );

          return (
            <Link
              key={category._id || category.slug}
              to={`/shop?category=${encodeURIComponent(category.slug)}`}
              className="group overflow-hidden rounded-xl border border-border bg-surface transition hover:border-primary/40 hover:shadow-card"
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-black">
                {category.imageUrl ? (
                  <img
                    src={category.imageUrl}
                    alt={category.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-white">
                    <CategoryIcon
                      icon={fallback?.icon || 'package'}
                      className="h-10 w-10"
                    />
                  </div>
                )}
              </div>

              <div className="p-5">
                <p className="text-sm font-semibold text-charcoal">
                  {category.name}
                </p>

                <p className="mt-1 text-xs text-muted">
                  {category.description ||
                    fallback?.blurb ||
                    'Explore our latest gadgets'}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function TrustStrip() {
  return (
    <section className="border-b border-border bg-white">
      <div className="container-page grid grid-cols-2 gap-6 py-8 sm:grid-cols-4">
        <div className="flex flex-col items-start gap-2">
          <Globe2 className="h-5 w-5 text-primary" />
          <p className="text-xs font-semibold text-charcoal">Global Sourcing</p>
          <p className="text-xs text-muted">
            {STORE_CONFIG.sourcing.join(' • ')}
          </p>
        </div>

        <div className="flex flex-col items-start gap-2">
          <Truck className="h-5 w-5 text-primary" />
          <p className="text-xs font-semibold text-charcoal">
            Nationwide Delivery
          </p>
          <p className="text-xs text-muted">Delivered across Nigeria</p>
        </div>

        <div className="flex flex-col items-start gap-2">
          <Recycle className="h-5 w-5 text-primary" />
          <p className="text-xs font-semibold text-charcoal">
            Trade-In Available
          </p>
          <p className="text-xs text-muted">Swap your device and upgrade</p>
        </div>

        <div className="flex flex-col items-start gap-2">
          <Wallet className="h-5 w-5 text-primary" />
          <p className="text-xs font-semibold text-charcoal">
            Flexible Options
          </p>
          <p className="text-xs text-muted">
            {STORE_CONFIG.payments.map((payment) => payment.label).join(' • ')}
          </p>
        </div>
      </div>
    </section>
  );
}

function PromoBanner({ banner }) {
  if (!isValidBanner(banner)) return null;

  const destination = getDestination(banner);
  const external =
    banner?.cta?.destinationType === 'external' &&
    /^https?:\/\//i.test(destination);

  const content = (
    <div className="relative overflow-hidden rounded-2xl bg-black">
      <picture>
        {banner.mobileImageUrl && (
          <source
            media="(max-width: 639px)"
            srcSet={banner.mobileImageUrl}
          />
        )}
        <img
          src={banner.imageUrl}
          alt={banner.imageAlt || banner.headline}
          loading="lazy"
          className="h-64 w-full object-cover sm:h-80"
        />
      </picture>

      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

      <div className="absolute inset-y-0 left-0 flex max-w-2xl flex-col justify-center p-6 text-white sm:p-10">
        <h2 className="font-display text-2xl font-bold sm:text-4xl">
          {banner.headline}
        </h2>

        {banner.supportingText && (
          <p className="mt-3 max-w-lg text-sm text-white/85 sm:text-base">
            {banner.supportingText}
          </p>
        )}

        {banner.cta?.label && (
          <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold">
            {banner.cta.label}
            <ArrowRight className="h-4 w-4" />
          </span>
        )}
      </div>
    </div>
  );

  return (
    <section className="container-page py-8">
      {external ? (
        <a href={destination} target="_blank" rel="noopener noreferrer">
          {content}
        </a>
      ) : (
        <Link to={destination}>{content}</Link>
      )}
    </section>
  );
}

function ProductSection({
  title,
  subtitle,
  products,
  loaded,
  emptyMessage,
  showDemo = false,
  demoProducts = [],
  whatsappNumber,
}) {
  return (
    <section className="container-page py-10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-charcoal">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-2 text-sm text-muted">{subtitle}</p>
          )}
        </div>

        <Link
          to="/shop"
          className="shrink-0 text-sm font-medium text-primary hover:underline"
        >
          View all
        </Link>
      </div>

      <div className="mt-6">
        {!loaded ? (
          <PageSpinner />
        ) : showDemo && demoProducts.length ? (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {demoProducts.map((product) => (
                <DemoProductCard
                  key={product.id}
                  product={product}
                  whatsappNumber={whatsappNumber}
                />
              ))}
            </div>

            <p className="mt-4 text-xs text-muted">
              Showing sample gadgets for illustration. Contact us on WhatsApp
              for current availability and prices.
            </p>
          </>
        ) : (
          <ProductGrid
            products={products}
            emptyMessage={emptyMessage}
          />
        )}
      </div>
    </section>
  );
}

function PowerSolutions() {
  return (
    <section className="container-page py-14">
      <div className="grid items-center gap-8 rounded-2xl bg-black p-8 text-white sm:grid-cols-[1fr_auto] sm:p-12">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Stay Powered
          </p>

          <h2 className="mt-3 font-display text-2xl font-bold sm:text-3xl">
            Power banks, inverters &amp; solar — never run out of charge.
          </h2>

          <p className="mt-3 max-w-lg text-sm text-white/70">
            Reliable backup power for home, work and on the go — from
            fast-charging power banks to full inverter and solar setups.
          </p>

          <Button
            as={Link}
            to="/shop?category=power"
            size="md"
            variant="primary"
            className="mt-6"
          >
            Shop Power Solutions
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="hidden gap-3 sm:flex">
          {['battery', 'zap', 'sun'].map((icon) => (
            <div
              key={icon}
              className="flex h-20 w-20 items-center justify-center rounded-xl bg-white/10 text-white"
            >
              <CategoryIcon icon={icon} className="h-8 w-8" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TradeIn({ whatsappNumber, storeName }) {
  const href = whatsappNumber
    ? buildWhatsAppLink(
        whatsappNumber,
        `Hello ${storeName}, I'd like to start a trade-in.`
      )
    : '#';

  return (
    <section className="container-page py-8">
      <div className="grid items-center gap-8 rounded-2xl border border-border bg-white p-8 sm:grid-cols-[auto_1fr] sm:p-12">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface text-primary">
          <Recycle className="h-8 w-8" />
        </div>

        <div>
          <h2 className="font-display text-2xl font-bold text-charcoal">
            Upgrade Without Starting From Scratch.
          </h2>

          <p className="mt-3 max-w-lg text-sm text-muted">
            Have an old device? Trade it in and put its value toward your next
            upgrade.
          </p>

          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center justify-center rounded-md border border-primary px-5 py-3 text-sm font-medium text-primary transition hover:bg-primary hover:text-white"
          >
            Start a Trade-In
          </a>
        </div>
      </div>
    </section>
  );
}

function GlobalSourcing() {
  return (
    <section id="sourcing" className="bg-surface py-14">
      <div className="container-page text-center">
        <h2 className="font-display text-2xl font-bold text-charcoal sm:text-3xl">
          Sourced Around the World. Delivered to You.
        </h2>

        <p className="mx-auto mt-3 max-w-xl text-sm text-muted">
          We procure gadgets from trusted channels abroad so you get authentic
          products, then deliver them nationwide across Nigeria.
        </p>

        <div className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
          {STORE_CONFIG.sourcing.map((country) => (
            <div key={country} className="flex flex-col items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black text-white">
                <Globe2 className="h-6 w-6" />
              </div>

              <p className="text-sm font-semibold text-charcoal">{country}</p>

              <ArrowRight className="h-4 w-4 rotate-90 text-primary" />

              <p className="text-xs text-muted">Nigeria</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyShopWithUs() {
  return (
    <section className="bg-white py-14">
      <div className="container-page grid gap-8 sm:grid-cols-3">
        <div>
          <ShieldCheck className="h-6 w-6 text-primary" />
          <h3 className="mt-3 font-display text-lg font-semibold text-charcoal">
            Quality, always
          </h3>
          <p className="mt-2 text-sm text-muted">
            Every gadget is checked before it reaches you — not just sold
            as-is.
          </p>
        </div>

        <div>
          <MessageCircle className="h-6 w-6 text-primary" />
          <h3 className="mt-3 font-display text-lg font-semibold text-charcoal">
            Personal service
          </h3>
          <p className="mt-2 text-sm text-muted">
            Chat with us directly on WhatsApp for specs, pricing or advice.
          </p>
        </div>

        <div>
          <Truck className="h-6 w-6 text-primary" />
          <h3 className="mt-3 font-display text-lg font-semibold text-charcoal">
            Delivered with care
          </h3>
          <p className="mt-2 text-sm text-muted">
            Nationwide delivery, carefully packaged for every order.
          </p>
        </div>
      </div>
    </section>
  );
}

function WhatsAppBanner({ whatsappHref }) {
  return (
    <section className="container-page pb-16">
      <div className="flex flex-col items-center justify-between gap-6 rounded-2xl bg-primary p-8 text-center text-white sm:flex-row sm:text-left sm:p-10">
        <div>
          <h2 className="font-display text-xl font-bold sm:text-2xl">
            Not sure what you need?
          </h2>
          <p className="mt-1 text-sm text-white/85">
            Chat with us on WhatsApp — we'll help you find the right gadget.
          </p>
        </div>

        <Button
          as="a"
          href={whatsappHref}
          target="_blank"
          rel="noreferrer"
          size="lg"
          variant="secondary"
          className="shrink-0"
        >
          <MessageCircle className="h-4 w-4" />
          Chat on WhatsApp
        </Button>
      </div>
    </section>
  );
}

export function Home() {
  const [featured, setFeatured] = useState(null);
  const [newArrivals, setNewArrivals] = useState(null);
  const [categories, setCategories] = useState(null);
  const [homepage, setHomepage] = useState(null);
  const [homepageLoaded, setHomepageLoaded] = useState(false);

  const { store } = useStoreInfo();

  useEffect(() => {
    let mounted = true;

    productService
      .listProducts({ featured: 'true', limit: 12 })
      .then((data) => {
        if (mounted) setFeatured(data.items || []);
      })
      .catch(() => {
        if (mounted) setFeatured([]);
      });

    productService
      .listProducts({ newArrival: 'true', limit: 8 })
      .then((data) => {
        if (mounted) setNewArrivals(data.items || []);
      })
      .catch(() => {
        if (mounted) setNewArrivals([]);
      });

    categoryService
      .listCategories()
      .then((data) => {
        if (mounted) setCategories(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (mounted) setCategories([]);
      });

    homepageService
      .getHomepageContent()
      .then((data) => {
        if (mounted) setHomepage(data);
      })
      .catch((error) => {
        console.error('Failed to load homepage configuration:', error);
        if (mounted) setHomepage(null);
      })
      .finally(() => {
        if (mounted) setHomepageLoaded(true);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const whatsappNumber = store?.whatsapp?.number || store?.whatsappNumber;
  const storeName = store?.name || STORE_CONFIG.brand.name;

  const whatsappHref = whatsappNumber
    ? buildWhatsAppLink(
        whatsappNumber,
        `Hello ${storeName}, I'd like to know more about your gadgets.`
      )
    : '#';

  const realDeals = useMemo(() => {
    const pool = [...(featured || []), ...(newArrivals || [])];
    const uniqueProducts = new Map();

    pool.forEach((product) => {
      const id = product._id || product.id || product.slug;
      if (id) uniqueProducts.set(String(id), product);
    });

    return [...uniqueProducts.values()]
      .filter(
        (product) =>
          product.salePrice != null &&
          product.basePrice != null &&
          Number(product.salePrice) < Number(product.basePrice)
      )
      .slice(0, 8);
  }, [featured, newArrivals]);

  const dataLoaded = featured !== null && newArrivals !== null;
  const showDemoTrending = dataLoaded && featured.length === 0;
  const showDemoDeals = dataLoaded && realDeals.length === 0;

  const configuredSections = useMemo(() => {
    if (!homepageLoaded || !homepage) return [];

    return (homepage.sections || [])
      .filter((section) => section.isActive)
      .sort((a, b) => a.order - b.order);
  }, [homepage, homepageLoaded]);

  const activeHero = homepage?.hero?.isActive ? homepage.hero : null;

  const activeBanners = homepage?.banners || [];

  const renderConfiguredSection = (section, index) => {
    switch (section.type) {
      case 'trustStrip':
        return <TrustStrip key={`${section.type}-${index}`} />;

      case 'categoryGrid':
        return (
          <CategorySection
            key={`${section.type}-${index}`}
            categories={categories}
            section={section}
          />
        );

      case 'featuredProducts':
        return (
          <ProductSection
            key={`${section.type}-${index}`}
            title={section.title || 'Trending Now'}
            subtitle={section.subtitle}
            products={featured || []}
            loaded={dataLoaded}
            emptyMessage="Featured products will appear here soon."
            showDemo={showDemoTrending}
            demoProducts={DEMO_PRODUCTS}
            whatsappNumber={whatsappNumber}
          />
        );

      case 'promoBanner': {
        const banner = getBannerForSection(homepage, section);
        return banner ? (
          <PromoBanner
            key={`${section.type}-${index}`}
            banner={banner}
          />
        ) : null;
      }

      case 'bestSellers':
        // Best-seller ranking requires a confirmed backend sorting/query
        // contract. Do not label ordinary featured products as best sellers.
        return null;

      case 'productCollection':
        // Collection rendering requires a confirmed collectionKey resolver.
        // Do not silently show unrelated products for an unknown collection.
        return null;

      case 'brandAbout':
        return (
          <section key={`${section.type}-${index}`} className="bg-white py-14">
            <div className="container-page">
              {section.title && (
                <h2 className="font-display text-2xl font-bold text-charcoal">
                  {section.title}
                </h2>
              )}
              {section.subtitle && (
                <p className="mt-3 max-w-2xl text-sm text-muted">
                  {section.subtitle}
                </p>
              )}
              <div className="mt-8">
                <WhyShopWithUs />
              </div>
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  const heroFallback = featured && featured.length > 0 ? (
    <HeroShowcase products={featured} />
  ) : (
    <div className="hero-showcase-empty">
      <div className="hero-empty-icon">
        <Sparkles className="h-10 w-10" />
      </div>
      <p>Discover the Ex-tra collection</p>
      <span>Featured products will appear here when available.</span>
      <Link to="/shop">
        Explore the shop
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );

  return (
    <div>
      {/* Configured hero */}
      <ConfiguredHero
        banner={activeHero}
        fallback={heroFallback}
        whatsappHref={whatsappHref}
        storeName={storeName}
      />

      {/* Configured sections */}
      {configuredSections.length > 0 ? (
        configuredSections.map(renderConfiguredSection)
      ) : (
        <>
          <TrustStrip />

          <CategorySection
            categories={categories}
            section={null}
          />

          <ProductSection
            title="Trending Now"
            products={featured || []}
            loaded={dataLoaded}
            emptyMessage="Featured products will appear here soon."
            showDemo={showDemoTrending}
            demoProducts={DEMO_PRODUCTS}
            whatsappNumber={whatsappNumber}
          />

          <PromoBanner banner={activeBanners.find(isValidBanner)} />
        </>
      )}

      {/* Today's Deals remains a genuine-sale section. */}
      <section className="bg-surface py-10">
        <div className="container-page">
          <h2 className="font-display text-2xl font-bold text-charcoal">
            Today's Deals
          </h2>

          <div className="mt-6">
            {!dataLoaded ? (
              <PageSpinner />
            ) : showDemoDeals ? (
              <>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {DEMO_DEALS.map((product) => (
                    <DemoProductCard
                      key={product.id}
                      product={product}
                      whatsappNumber={whatsappNumber}
                    />
                  ))}
                </div>

                <p className="mt-4 text-xs text-muted">
                  Sample pricing for illustration — ask on WhatsApp for
                  current offers.
                </p>
              </>
            ) : (
              <ProductGrid
                products={realDeals}
                emptyMessage="No active deals right now — check back soon."
              />
            )}
          </div>
        </div>
      </section>

      {/* Existing business sections are preserved. */}
      <PowerSolutions />

      <TradeIn
        whatsappNumber={whatsappNumber}
        storeName={storeName}
      />

      <GlobalSourcing />

      <WhyShopWithUs />

      <WhatsAppBanner whatsappHref={whatsappHref} />
    </div>
  );
}
