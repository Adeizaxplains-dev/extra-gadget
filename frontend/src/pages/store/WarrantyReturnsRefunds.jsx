import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  RotateCcw,
  Wallet,
  RefreshCw,
  PackageCheck,
  AlertCircle,
  CheckCircle2,
  Clock3,
  Headphones,
  ArrowRight,
  FileText,
} from 'lucide-react';

const policySections = [
  {
    number: '01',
    title: 'Warranty Policy',
    description:
      'Our gadgets are covered by a limited warranty, subject to the product category and the warranty stated at the time of purchase.',
    icon: ShieldCheck,
    subsections: [
      {
        title: 'What is covered',
        items: [
          'Manufacturer defects.',
          'Software malfunctions under normal use.',
        ],
      },
      {
        title: 'What is not covered',
        items: [
          'Physical or accidental damage, including drops, cracks, water damage, and burns.',
          'Damage caused by power surges, misuse, or unauthorized repairs.',
          'Accessories such as chargers, cables, and earphones, unless stated otherwise.',
          'Normal wear and tear.',
        ],
      },
      {
        title: 'Warranty duration',
        items: [
          'Warranty periods vary by product and will be stated at purchase or on your product receipt.',
          'Proof of purchase is required for warranty claims.',
        ],
      },
    ],
  },
  {
    number: '02',
    title: 'Return Policy',
    description:
      'We accept eligible return requests within 24 hours of purchase or delivery, subject to inspection and verification.',
    icon: RotateCcw,
    subsections: [
      {
        title: 'Eligible return requests',
        items: [
          'The product received is defective.',
          'The wrong product was supplied.',
          'The product does not power on at the point of sale or delivery.',
        ],
      },
      {
        title: 'Return conditions',
        items: [
          'The product must be unused and in its original condition.',
          'Original packaging, manuals, and accessories must be intact.',
          'Our technical team must inspect and verify the item before a return is approved.',
        ],
      },
    ],
    notice:
      'Return requests must be reported within 24 hours of purchase or delivery. Requests received after this period may not be accepted under this policy.',
  },
  {
    number: '03',
    title: 'Refund Policy',
    description:
      'Refunds are considered when an eligible product issue has been verified and cannot be resolved through repair or replacement.',
    icon: Wallet,
    subsections: [
      {
        title: 'Refund eligibility',
        items: [
          'A replacement is unavailable.',
          'The defect is confirmed and cannot be repaired.',
          'The issue was reported within the applicable return window.',
        ],
      },
      {
        title: 'Refund method and timing',
        items: [
          'Approved refunds will be processed through the original payment method or as store credit, as applicable.',
          'Refund processing takes an estimated 3–7 working days after approval.',
          'Cash refunds are not guaranteed and are subject to management approval.',
        ],
      },
    ],
  },
  {
    number: '04',
    title: 'Exchange Policy',
    description:
      'Where a return is approved, customers may request an exchange for the same product or another product of equal value.',
    icon: RefreshCw,
    subsections: [
      {
        title: 'Exchange conditions',
        items: [
          'The exchange must be approved following product inspection.',
          'Any price difference for a higher-value replacement must be paid by the customer.',
          'Any applicable difference for a lower-value replacement will be handled by our team.',
        ],
      },
    ],
  },
  {
    number: '05',
    title: 'Items Not Eligible for Return or Refund',
    description:
      'The following items or circumstances are excluded from return or refund consideration under this policy:',
    icon: PackageCheck,
    subsections: [
      {
        title: 'Exclusions',
        items: [
          'Clearance or discounted items.',
          'Products damaged through user negligence.',
          'Software, downloaded applications, or activated licenses.',
          'Gadgets with tampered or removed seals.',
        ],
      },
    ],
  },
  {
    number: '06',
    title: 'Customer Responsibility',
    description:
      'We encourage every customer to take a few simple steps to protect their purchase and help us resolve any product concerns.',
    icon: CheckCircle2,
    subsections: [
      {
        title: 'Before and after purchase',
        items: [
          'Inspect products at the point of purchase or delivery.',
          'Test your gadget before leaving the store, where possible.',
          'Follow the product usage and care instructions.',
          'Keep your receipt and original packaging for warranty or return requests.',
        ],
      },
    ],
  },
];

function PolicySection({ section }) {
  const Icon = section.icon;

  return (
    <section
      id={`policy-${section.number}`}
      className="scroll-mt-24 rounded-2xl border border-[#E8DDDF] bg-white p-6 shadow-sm transition-shadow hover:shadow-md sm:p-8"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FFF1F2] text-[#C8102E]">
          <Icon className="h-6 w-6" />
        </div>

        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#938789]">
            Policy {section.number}
          </p>

          <h2 className="mt-1 text-xl font-bold tracking-tight text-[#231719] sm:text-2xl">
            {section.title}
          </h2>

          <p className="mt-3 text-sm leading-7 text-[#5F5556] sm:text-base">
            {section.description}
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-6 border-t border-[#F1E8E9] pt-6">
        {section.subsections.map((subsection) => (
          <div key={subsection.title}>
            <h3 className="font-semibold text-[#231719]">
              {subsection.title}
            </h3>

            <ul className="mt-3 space-y-3">
              {subsection.items.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-sm leading-6 text-[#5F5556] sm:text-base"
                >
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[#C8102E]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {section.notice && (
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-[#F2D1D6] bg-[#FFF1F2] p-4">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#C8102E]" />
          <p className="text-sm leading-6 text-[#721021]">
            {section.notice}
          </p>
        </div>
      )}
    </section>
  );
}

export function WarrantyReturnsRefunds() {
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
            Warranty, Returns & Refunds
          </span>
        </nav>

        {/* Hero card */}
        <header className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-[#2B1012] via-[#1D1717] to-[#171717] px-6 py-10 text-white shadow-xl sm:px-10 sm:py-14 lg:px-14">
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
              <ShieldCheck className="h-4 w-4 text-[#FF4B5E]" />
              Customer care & protection
            </div>

            <h1 className="mt-6 text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              Warranty, Return
              <span className="block text-[#FF4B5E]">
                & Refund Policy
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/75 sm:text-base sm:leading-8">
              At Ex-tra-Gadgets, we want you to shop with confidence.
              This policy explains our warranty coverage, return
              requirements, refund process, and how to get help with
              a product issue.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#policy-01"
                className="inline-flex items-center gap-2 rounded-xl bg-[#C8102E] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#A50D25]"
              >
                Read the policy
                <ArrowRight className="h-4 w-4" />
              </a>

              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:border-[#C8102E] hover:bg-[#C8102E]/10"
              >
                Contact support
                <Headphones className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Policy highlights */}
          <div className="mt-10 grid gap-4 border-t border-white/10 pt-6 sm:grid-cols-3">
            <div className="flex items-center gap-3">
              <Clock3 className="h-5 w-5 shrink-0 text-[#FF4B5E]" />

              <div>
                <p className="text-sm font-semibold">24-hour</p>
                <p className="text-xs text-white/55">
                  Return request window
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 shrink-0 text-[#FF4B5E]" />

              <div>
                <p className="text-sm font-semibold">Limited warranty</p>
                <p className="text-xs text-white/55">
                  Product-dependent coverage
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Wallet className="h-5 w-5 shrink-0 text-[#FF4B5E]" />

              <div>
                <p className="text-sm font-semibold">3–7 working days</p>
                <p className="text-xs text-white/55">
                  Estimated refund processing
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Introductory notice */}
        <div className="mt-8 flex items-start gap-3 rounded-2xl border border-[#F5D5DA] bg-[#FFF1F2] p-5">
          <FileText className="mt-0.5 h-5 w-5 shrink-0 text-[#C8102E]" />

          <p className="text-sm leading-6 text-[#721021]">
            Please review this policy before making a purchase. Keep
            your proof of purchase and original packaging, and report
            any eligible product issue within the stated return window.
          </p>
        </div>

        {/* Policy sections */}
        <div className="mt-8 space-y-6">
          {policySections.map((section) => (
            <PolicySection key={section.number} section={section} />
          ))}
        </div>

        {/* Contact support card */}
        <section className="mt-8 rounded-3xl border border-[#E8DDDF] bg-white p-6 shadow-sm sm:p-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FFF1F2] text-[#C8102E]">
                <Headphones className="h-6 w-6" />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#938789]">
                  We are here to help
                </p>

                <h2 className="mt-1 text-xl font-bold text-[#231719] sm:text-2xl">
                  Need help with a purchase?
                </h2>

                <p className="mt-3 max-w-xl text-sm leading-6 text-[#5F5556]">
                  Contact Ex-tra-Gadgets for assistance with warranty
                  claims, return requests, exchanges, or refunds.
                  Please have your order details and proof of purchase
                  ready.
                </p>
              </div>
            </div>

            <Link
              to="/contact"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#C8102E] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#A50D25]"
            >
              Contact Us
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* Policy update note */}
        <p className="mt-8 text-center text-xs leading-5 text-[#756A6B]">
          Ex-tra-Gadgets reserves the right to update this policy.
          Any revised version will be published on this page.
        </p>
      </div>
    </main>
  );
}