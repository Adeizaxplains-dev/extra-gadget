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

/**
 * Large editorial product showcase for the homepage hero.
 * Uses only real featured products returned by the store API.
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

export function Home() {
  const [featured, setFeatured] = useState(null);
  const [newArrivals, setNewArrivals] = useState(null);
  const [categories, setCategories] = useState(null);
  const { store } = useStoreInfo();

  useEffect(() => {
    productService
      .listProducts({ featured: 'true', limit: 12 })
      .then((d) => setFeatured(d.items))
      .catch(() => setFeatured([]));

    productService
      .listProducts({ newArrival: 'true', limit: 8 })
      .then((d) => setNewArrivals(d.items))
      .catch(() => setNewArrivals([]));

    categoryService
      .listCategories()
      .then((data) => setCategories(data))
      .catch(() => setCategories([]));
  }, []);

  const whatsappNumber = store?.whatsapp?.number || store?.whatsappNumber;

  const whatsappHref = whatsappNumber
    ? buildWhatsAppLink(
        whatsappNumber,
        `Hello ${store?.name || STORE_CONFIG.brand.name}, I'd like to know more about your gadgets.`
      )
    : '#';

  // "Today's Deals" = real products actually on sale.
  // We never invent a discount — only products where the backend
  // has set a genuine salePrice lower than basePrice are shown here.
  const realDeals = useMemo(() => {
    const pool = [...(featured || []), ...(newArrivals || [])];

    return pool
      .filter(
        (p) =>
          p.salePrice != null &&
          p.salePrice < p.basePrice
      )
      .slice(0, 8);
  }, [featured, newArrivals]);

  const dataLoaded = featured !== null;
  const showDemoTrending = dataLoaded && featured.length === 0;
  const showDemoDeals = dataLoaded && realDeals.length === 0;

  return (
    <div>
      {/* =========================================================
          PREMIUM HERO — EX-TRA GADGETS
      ========================================================== */}
      <section className="hero-premium">
        <div className="hero-premium-glow" aria-hidden="true" />

        <div className="container-page hero-premium-container">
          {/* Brand message */}
          <div className="hero-premium-copy">
            <div className="hero-brand-kicker">
              <Globe2 className="h-4 w-4" />
              <span>{STORE_CONFIG.sourcing.join(' · ')}</span>
            </div>

            <h1 className="hero-premium-heading">
              Premium Gadgets,
              <span>Sourced Globally.</span>
              <span className="hero-heading-accent">
                Delivered Nationwide.
              </span>
            </h1>

            <p className="hero-premium-description">
              Explore phones, laptops, tablets, audio devices, power solutions
              and more — carefully selected for your everyday technology needs
              and delivered across Nigeria.
            </p>

            <div className="hero-premium-actions">
              <Button
                as={Link}
                to="/shop"
                size="lg"
                variant="primary"
              >
                Explore Collection
                <ArrowRight className="h-4 w-4" />
              </Button>

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

          {/* Large featured product slider */}
          <div className="hero-premium-visual">
            {featured && featured.length > 0 ? (
              <HeroShowcase products={featured} />
            ) : (
              <div className="hero-showcase-empty">
                <div className="hero-empty-icon">
                  <Sparkles className="h-10 w-10" />
                </div>

                <p>Discover the Ex-tra collection</p>
                <span>
                  Featured products will appear here when available.
                </span>

                <Link to="/shop">
                  Explore the shop
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =========================================================
          TRUST / VALUE STRIP
      ========================================================== */}
      <section className="border-b border-border bg-white">
        <div className="container-page grid grid-cols-2 gap-6 py-8 sm:grid-cols-4">

          <div className="flex flex-col items-start gap-2">
            <Globe2 className="h-5 w-5 text-primary" />

            <p className="text-xs font-semibold text-charcoal">
              Global Sourcing
            </p>

            <p className="text-xs text-muted">
              {STORE_CONFIG.sourcing.join(' • ')}
            </p>
          </div>

          <div className="flex flex-col items-start gap-2">
            <Truck className="h-5 w-5 text-primary" />

            <p className="text-xs font-semibold text-charcoal">
              Nationwide Delivery
            </p>

            <p className="text-xs text-muted">
              Delivered across Nigeria
            </p>
          </div>

          <div className="flex flex-col items-start gap-2">
            <Recycle className="h-5 w-5 text-primary" />

            <p className="text-xs font-semibold text-charcoal">
              Trade-In Available
            </p>

            <p className="text-xs text-muted">
              Swap your device and upgrade
            </p>
          </div>

          <div className="flex flex-col items-start gap-2">
            <Wallet className="h-5 w-5 text-primary" />

            <p className="text-xs font-semibold text-charcoal">
              Flexible Options
            </p>

            <p className="text-xs text-muted">
              {STORE_CONFIG.payments.map((p) => p.label).join(' • ')}
            </p>
          </div>

        </div>
      </section>

      {/* =========================================================
          SHOP BY CATEGORY
      ========================================================== */}
      <section className="container-page py-14">
        <h2 className="font-display text-2xl font-bold text-charcoal">
          Shop by Category
        </h2>

        <p className="mt-2 text-sm text-muted">
          Find exactly what you're looking for.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {(categories || []).map((c) => {
            const fallback = HOMEPAGE_CATEGORIES.find(
              (item) => item.slug === c.slug
            );

            return (
              <Link
                key={c._id || c.slug}
                to={`/shop?category=${encodeURIComponent(c.slug)}`}
                className="group overflow-hidden rounded-xl border border-border bg-surface transition hover:border-primary/40 hover:shadow-card"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-black">
                  {c.imageUrl ? (
                    <img
                      src={c.imageUrl}
                      alt={c.name}
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
                    {c.name}
                  </p>

                  <p className="mt-1 text-xs text-muted">
                    {c.description ||
                      fallback?.blurb ||
                      'Explore our latest gadgets'}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* =========================================================
          TRENDING NOW
      ========================================================== */}
      <section className="container-page py-8">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold text-charcoal">
            Trending Now
          </h2>

          <Link
            to="/shop?featured=true"
            className="text-sm font-medium text-primary hover:underline"
          >
            View all
          </Link>
        </div>

        <div className="mt-6">
          {!dataLoaded ? (
            <PageSpinner />
          ) : showDemoTrending ? (
            <>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {DEMO_PRODUCTS.map((p) => (
                  <DemoProductCard
                    key={p.id}
                    product={p}
                    whatsappNumber={whatsappNumber}
                  />
                ))}
              </div>

              <p className="mt-4 text-xs text-muted">
                Showing sample gadgets while the live catalogue is being
                set up — tap any item to ask about it on WhatsApp.
              </p>
            </>
          ) : (
            <ProductGrid
              products={featured}
              emptyMessage="Featured products will appear here soon."
            />
          )}
        </div>
      </section>

      {/* =========================================================
          TODAY'S DEALS
      ========================================================== */}
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
                  {DEMO_DEALS.map((p) => (
                    <DemoProductCard
                      key={p.id}
                      product={p}
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

      {/* =========================================================
          POWER SOLUTIONS
      ========================================================== */}
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
                <CategoryIcon
                  icon={icon}
                  className="h-8 w-8"
                />
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================
          TRADE-IN / SWAP
      ========================================================== */}
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
              Have an old device? Trade it in and put its value toward
              your next upgrade.
            </p>

            <Button
              as="a"
              href={buildWhatsAppLink(
                whatsappNumber,
                `Hello ${store?.name || STORE_CONFIG.brand.name}, I'd like to start a trade-in.`
              )}
              target="_blank"
              rel="noreferrer"
              size="md"
              variant="outline"
              className="mt-6"
            >
              Start a Trade-In
            </Button>
          </div>

        </div>
      </section>

      {/* =========================================================
          GLOBAL SOURCING
      ========================================================== */}
      <section
        id="sourcing"
        className="bg-surface py-14"
      >
        <div className="container-page text-center">

          <h2 className="font-display text-2xl font-bold text-charcoal sm:text-3xl">
            Sourced Around the World. Delivered to You.
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm text-muted">
            We procure gadgets from trusted channels abroad so you get
            authentic products, then deliver them nationwide across Nigeria.
          </p>

          <div className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
            {STORE_CONFIG.sourcing.map((country) => (
              <div
                key={country}
                className="flex flex-col items-center gap-3"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black text-white">
                  <Globe2 className="h-6 w-6" />
                </div>

                <p className="text-sm font-semibold text-charcoal">
                  {country}
                </p>

                <ArrowRight className="h-4 w-4 rotate-90 text-primary" />

                <p className="text-xs text-muted">
                  Nigeria
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================
          WHY SHOP WITH US
      ========================================================== */}
      <section className="bg-white py-14">
        <div className="container-page grid gap-8 sm:grid-cols-3">

          <div>
            <ShieldCheck className="h-6 w-6 text-primary" />

            <h3 className="mt-3 font-display text-lg font-semibold text-charcoal">
              Quality, always
            </h3>

            <p className="mt-2 text-sm text-muted">
              Every gadget is checked before it reaches you — not just
              sold as-is.
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

      {/* =========================================================
          WHATSAPP CTA BANNER
      ========================================================== */}
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
    </div>
  );
}