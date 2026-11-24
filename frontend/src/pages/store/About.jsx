import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  Globe2,
  Headphones,
  MapPin,
  PackageCheck,
  RefreshCw,
  ShieldCheck,
  ShoppingBag,
  Truck,
  CreditCard,
  Zap,
} from 'lucide-react';

import { useStoreInfo } from '../../hooks/useStoreInfo.js';
import { STORE_CONFIG } from '../../config/store.config.js';

export function About() {
  const { store } = useStoreInfo();

  const name = store?.name || STORE_CONFIG.brand.name;
  const description = STORE_CONFIG.brand.description;
  const sourcingLocations = STORE_CONFIG.sourcing.join(', ');
  const storeLocations = STORE_CONFIG.locations.join(', ');
  const deliveryCoverage = STORE_CONFIG.delivery.coverage;
  const deliveryFeeNote = STORE_CONFIG.delivery.feeNote;
  const paymentMethods = STORE_CONFIG.payments
    .map((payment) => payment.label)
    .join(', ');

  const services = [
    {
      icon: BadgeCheck,
      title: 'Quality-focused sourcing',
      text: 'We aim to help customers make informed choices by providing product information and support before purchase.',
    },
    {
      icon: ShoppingBag,
      title: 'Gadgets for everyday life',
      text: 'Explore smartphones, laptops, audio devices, power solutions, and other electronics for work, study, and personal use.',
    },
    {
      icon: Truck,
      title: 'Delivery and collection',
      text: 'We help customers understand the available delivery or collection arrangements for their orders.',
    },
    {
      icon: Headphones,
      title: 'Customer support',
      text: 'Our team is available to assist with product enquiries, availability checks, and questions about your order.',
    },
  ];

  return (
    <main className="min-h-screen bg-[#F8F7F7] pb-16">
      <div className="container-page">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 py-5 text-sm text-[#756A6B]"
        >
          <Link to="/" className="transition hover:text-[#C8102E]">
            Home
          </Link>

          <span aria-hidden="true">/</span>

          <span className="font-medium text-[#231719]">
            About Us
          </span>
        </nav>

        {/* Hero */}
        <header className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-[#2B1012] via-[#1D1717] to-[#171717] px-6 py-12 text-white shadow-xl sm:px-10 sm:py-16 lg:px-14">
          <div
            aria-hidden="true"
            className="absolute -right-20 -top-24 -z-10 h-80 w-80 rounded-full bg-[#C8102E]/20 blur-3xl"
          />

          <div
            aria-hidden="true"
            className="absolute -bottom-32 left-1/3 -z-10 h-72 w-72 rounded-full bg-[#8F0B20]/20 blur-3xl"
          />

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/80">
              <ShoppingBag className="h-4 w-4 text-[#FF4B5E]" />
              About {name}
            </div>

            <h1 className="mt-6 text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              Technology for
              <span className="block text-[#FF4B5E]">
                everyday life.
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/75 sm:text-base sm:leading-8">
              {description ||
                `${name} helps customers discover gadgets and electronics for work, study, communication, and everyday living.`}
            </p>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
              From choosing the right device to getting assistance with
              an order, we aim to make your shopping experience clear,
              convenient, and dependable.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 rounded-xl bg-[#C8102E] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#A50D25]"
              >
                Explore our shop
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:border-[#C8102E] hover:bg-[#C8102E]/10"
              >
                Contact us
                <Headphones className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="mt-10 grid gap-4 border-t border-white/10 pt-6 sm:grid-cols-3">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 shrink-0 text-[#FF4B5E]" />
              <div>
                <p className="text-sm font-semibold">Customer-focused</p>
                <p className="text-xs text-white/55">
                  Support before and after purchase
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Globe2 className="h-5 w-5 shrink-0 text-[#FF4B5E]" />
              <div>
                <p className="text-sm font-semibold">Globally sourced</p>
                <p className="text-xs text-white/55">
                  Gadgets from multiple sourcing locations
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <PackageCheck className="h-5 w-5 shrink-0 text-[#FF4B5E]" />
              <div>
                <p className="text-sm font-semibold">Product guidance</p>
                <p className="text-xs text-white/55">
                  Help with products and availability
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Brand introduction */}
        <section className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div className="rounded-3xl border border-[#E8DDDF] bg-white p-6 shadow-sm sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#C8102E]">
              Who we are
            </p>

            <h2 className="mt-3 text-2xl font-bold tracking-tight text-[#231719] sm:text-3xl">
              Your destination for gadgets and electronics
            </h2>

            <div className="mt-5 space-y-4 text-sm leading-7 text-[#5F5556] sm:text-base">
              <p>
                {name} is a gadget and electronics retailer serving
                customers looking for devices that support their
                everyday needs. Our product range includes
                smartphones, laptops, audio devices, power banks,
                solar and inverter solutions, and other electronics.
              </p>

              <p>
                We source products from {sourcingLocations} and aim
                to make it easier for customers to find suitable
                gadgets without having to navigate the buying
                process alone.
              </p>

              <p>
                Whether you are choosing a new smartphone, upgrading
                your laptop, or exploring a power solution, we
                encourage you to review product details and contact
                us whenever you need further information.
              </p>
            </div>
          </div>

          {/* Store information */}
          <aside className="rounded-3xl border border-[#E8DDDF] bg-white p-6 shadow-sm sm:p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFF1F2] text-[#C8102E]">
              <MapPin className="h-6 w-6" />
            </div>

            <h2 className="mt-5 text-xl font-bold text-[#231719]">
              Where we operate
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#5F5556]">
              We are based in {storeLocations}. Our delivery
              coverage is {deliveryCoverage.toLowerCase()}.
            </p>

            <div className="mt-5 border-t border-[#F1E8E9] pt-5">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#938789]">
                Delivery information
              </p>

              <p className="mt-2 text-sm leading-6 text-[#5F5556]">
                {deliveryFeeNote}
              </p>
            </div>

            <Link
              to="/contact"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#C8102E] transition hover:text-[#A50D25]"
            >
              Ask about delivery
              <ArrowRight className="h-4 w-4" />
            </Link>
          </aside>
        </section>

        {/* What we offer */}
        <section className="mt-12">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#C8102E]">
              What we offer
            </p>

            <h2 className="mt-3 text-2xl font-bold tracking-tight text-[#231719] sm:text-3xl">
              A more informed way to shop for gadgets
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#5F5556] sm:text-base">
              We focus on helping customers understand their options,
              check product availability, and get the information
              they need throughout the buying process.
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {services.map((service) => {
              const Icon = service.icon;

              return (
                <article
                  key={service.title}
                  className="rounded-2xl border border-[#E8DDDF] bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF1F2] text-[#C8102E]">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="mt-4 text-lg font-bold text-[#231719]">
                    {service.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[#5F5556]">
                    {service.text}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        {/* Trade-in and payment information */}
        <section className="mt-12 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-[#E8DDDF] bg-white p-6 shadow-sm sm:p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFF1F2] text-[#C8102E]">
              <RefreshCw className="h-6 w-6" />
            </div>

            <h2 className="mt-5 text-xl font-bold text-[#231719]">
              Trade-ins and upgrades
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#5F5556]">
              We also support trade-ins, allowing customers to
              explore upgrading from an existing device. If you are
              interested in trading in your old gadget, contact our
              team to confirm eligibility, assessment requirements,
              and the value that may be applied toward an upgrade.
            </p>

            <p className="mt-3 text-sm leading-7 text-[#5F5556]">
              Trade-in availability and valuation depend on the
              device and the applicable assessment.
            </p>
          </div>

          <div className="rounded-3xl border border-[#E8DDDF] bg-white p-6 shadow-sm sm:p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFF1F2] text-[#C8102E]">
              <CreditCard className="h-6 w-6" />
            </div>

            <h2 className="mt-5 text-xl font-bold text-[#231719]">
              Payment options
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#5F5556]">
              We accept {paymentMethods}. Available payment
              instructions and any applicable requirements will be
              provided during checkout or by our customer support
              team.
            </p>

            <p className="mt-3 text-sm leading-7 text-[#5F5556]">
              Please use the official payment details provided for
              your order and keep your proof of payment for
              reference.
            </p>
          </div>
        </section>

        {/* Delivery details */}
        <section
          id="delivery"
          className="mt-12 scroll-mt-24 overflow-hidden rounded-3xl bg-[#231719] p-6 text-white sm:p-10"
        >
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <div className="flex items-center gap-2 text-[#FF4B5E]">
                <Truck className="h-5 w-5" />
                <p className="text-xs font-bold uppercase tracking-[0.18em]">
                  Delivery
                </p>
              </div>

              <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                Getting your order to you
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
                {deliveryCoverage}. {deliveryFeeNote} Delivery
                availability, charges, and estimated timelines may
                depend on your location and order. Please contact us
                to confirm the arrangements for your purchase.
              </p>
            </div>

            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#C8102E] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#A50D25]"
            >
              Enquire about delivery
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="mt-10 rounded-3xl border border-[#E8DDDF] bg-white p-6 shadow-sm sm:p-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#C8102E]">
                Let’s help you find the right gadget
              </p>

              <h2 className="mt-3 text-2xl font-bold tracking-tight text-[#231719] sm:text-3xl">
                Ready to explore our products?
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-7 text-[#5F5556]">
                Browse our collection or contact our team if you need
                help with a product, availability, or your order.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/shop"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#C8102E] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#A50D25]"
              >
                Shop now
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E8DDDF] px-5 py-3 text-sm font-semibold text-[#231719] transition hover:border-[#C8102E] hover:text-[#C8102E]"
              >
                Contact us
              </Link>
            </div>
          </div>
        </section>

        <p className="mt-8 text-center text-xs leading-5 text-[#756A6B]">
          {name} — Extra value for money.
        </p>
      </div>
    </main>
  );
}