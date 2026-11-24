import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronDown,
  ShieldCheck,
  PackageCheck,
  Truck,
  MapPin,
  CreditCard,
  RotateCcw,
  MessageCircle,
  Headphones,
  CheckCircle2,
  ArrowRight,
  CircleHelp,
} from 'lucide-react';

const faqs = [
  {
    number: '01',
    question: 'Are your brand-new gadgets original and authentic?',
    answer:
      'Ex-tra-Gadgets is committed to offering genuine gadgets and quality electronics. We aim to provide accurate product descriptions and specifications so you can shop with confidence. If you would like additional information about a particular product, its brand, or its warranty coverage, please contact our team before placing your order.',
  },
  {
    number: '02',
    question: 'How can I confirm a product is available?',
    answer:
      'Browse our online shop to view the products currently listed. Product availability may change as orders are placed. If you need to confirm the availability, colour, storage capacity, or configuration of a particular gadget, contact our team with the product name or link before making payment.',
  },
  {
    number: '03',
    question: 'Can I order online and have my item delivered?',
    answer:
      'Yes, you can browse products and place an order through our website. Available delivery or collection arrangements will be communicated during the order process or by our customer support team. Please provide accurate contact and delivery details when placing your order.',
  },
  {
    number: '04',
    question: 'Do you deliver outside Lagos?',
    answer:
      'Delivery availability may depend on your location and the product ordered. If you are ordering from outside Lagos, please contact us with your delivery location before completing your purchase. Our team can help confirm whether delivery can be arranged and explain the applicable charges and estimated timeline.',
  },
  {
    number: '05',
    question: 'Can I visit your physical store?',
    answer:
      'You can contact our team to confirm our current store address, opening hours, and product availability before visiting. We recommend confirming that the gadget you want is available so you can avoid an unnecessary trip.',
  },
  {
    number: '06',
    question: 'Which payment methods do you accept?',
    answer:
      'The payment methods currently available will be shown during checkout or communicated by our customer support team. Please follow the official payment instructions provided for your order. If you have questions about a payment or need help confirming a transaction, contact us with your order details.',
  },
  {
    number: '07',
    question: 'Do your products come with a warranty?',
    answer:
      'Warranty coverage depends on the product category and the warranty stated at the time of purchase. The applicable warranty period and coverage should be confirmed on the product listing or your purchase receipt. Keep your proof of purchase, as it is required when making a warranty claim. Please read our Warranty, Return & Refund Policy for full details.',
    link: {
      label: 'Read our Warranty, Return & Refund Policy',
      to: '/warranty-returns-refunds',
    },
  },
  {
    number: '08',
    question: 'Can I return or exchange a product?',
    answer:
      'Eligible return requests must be reported within 24 hours of purchase or delivery. The product must meet the conditions in our return policy and may need to be inspected by our technical team before approval. Approved returns may be eligible for an exchange or refund, depending on the circumstances. Please review our full policy before making a purchase.',
    link: {
      label: 'View our Return & Refund Policy',
      to: '/warranty-returns-refunds',
    },
  },
  {
    number: '09',
    question: 'How can I follow up on my order?',
    answer:
      'You can contact our customer support team with your order number, the name used when placing the order, and your purchase details. We will use the information provided to help you check the status of your order and assist with any questions about delivery or collection.',
  },
  {
    number: '10',
    question: 'What if I receive a damaged or incorrect item?',
    answer:
      'Please contact us as soon as possible and report the issue within the applicable return window. Keep the product, packaging, accessories, and proof of purchase available for inspection. Our team will review the details and explain the next steps in line with our Warranty, Return & Refund Policy.',
    link: {
      label: 'Review our Warranty, Return & Refund Policy',
      to: '/warranty-returns-refunds',
    },
  },
];

function FAQItem({ faq, isOpen, onToggle }) {
  return (
    <article
      className={`overflow-hidden rounded-2xl border bg-white transition-all duration-200 ${
        isOpen
          ? 'border-[#C8102E]/30 shadow-md'
          : 'border-[#E8DDDF] shadow-sm hover:border-[#C8102E]/20 hover:shadow-md'
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center gap-4 px-5 py-5 text-left sm:px-7"
      >
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold transition-colors ${
            isOpen
              ? 'bg-[#C8102E] text-white'
              : 'bg-[#FFF1F2] text-[#C8102E]'
          }`}
        >
          {faq.number}
        </span>

        <span className="flex-1 text-sm font-semibold leading-6 text-[#231719] sm:text-base">
          {faq.question}
        </span>

        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all ${
            isOpen
              ? 'rotate-180 bg-[#FFF1F2] text-[#C8102E]'
              : 'bg-[#F8F7F7] text-[#756A6B]'
          }`}
        >
          <ChevronDown className="h-5 w-5" />
        </span>
      </button>

      {isOpen && (
        <div className="px-5 pb-6 sm:px-7 sm:pb-7">
          <div className="ml-14 border-t border-[#F1E8E9] pt-5">
            <p className="text-sm leading-7 text-[#5F5556] sm:text-base">
              {faq.answer}
            </p>

            {faq.link && (
              <Link
                to={faq.link.to}
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#C8102E] transition hover:text-[#A50D25]"
              >
                {faq.link.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      )}
    </article>
  );
}

export function FAQs() {
  const [openItems, setOpenItems] = useState([0]);

  const toggleFAQ = (index) => {
    setOpenItems((current) =>
      current.includes(index)
        ? current.filter((item) => item !== index)
        : [...current, index]
    );
  };

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
            Frequently Asked Questions
          </span>
        </nav>

        {/* Hero header */}
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
              <CircleHelp className="h-4 w-4 text-[#FF4B5E]" />
              Customer information
            </div>

            <h1 className="mt-6 text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              Frequently Asked
              <span className="block text-[#FF4B5E]">
                Questions
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/75 sm:text-base sm:leading-8">
              Everything you need to know about shopping with
              Ex-tra-Gadgets. Find helpful information about our
              products, orders, payments, delivery, and after-sales
              support.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#faq-list"
                className="inline-flex items-center gap-2 rounded-xl bg-[#C8102E] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#A50D25]"
              >
                Explore FAQs
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

          {/* Highlights */}
          <div className="mt-10 grid gap-4 border-t border-white/10 pt-6 sm:grid-cols-3">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 shrink-0 text-[#FF4B5E]" />
              <div>
                <p className="text-sm font-semibold">Product information</p>
                <p className="text-xs text-white/55">
                  Shop with confidence
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Truck className="h-5 w-5 shrink-0 text-[#FF4B5E]" />
              <div>
                <p className="text-sm font-semibold">Orders & delivery</p>
                <p className="text-xs text-white/55">
                  Get help with your order
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <RotateCcw className="h-5 w-5 shrink-0 text-[#FF4B5E]" />
              <div>
                <p className="text-sm font-semibold">After-sales support</p>
                <p className="text-xs text-white/55">
                  Warranty & returns
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Intro notice */}
        <div className="mt-8 flex items-start gap-3 rounded-2xl border border-[#F5D5DA] bg-[#FFF1F2] p-5">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#C8102E]" />

          <p className="text-sm leading-6 text-[#721021]">
            Have a question about a specific product or order?
            Browse the answers below, or contact our team for
            assistance.
          </p>
        </div>

        {/* FAQ list */}
        <section id="faq-list" className="mt-10 scroll-mt-8">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#C8102E]">
                Help centre
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#231719] sm:text-3xl">
                How can we help you?
              </h2>
            </div>

            <p className="text-sm text-[#756A6B]">
              {faqs.length} frequently asked questions
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <FAQItem
                key={faq.number}
                faq={faq}
                isOpen={openItems.includes(index)}
                onToggle={() => toggleFAQ(index)}
              />
            ))}
          </div>
        </section>

        {/* Contact card */}
        <section className="mt-10 rounded-3xl border border-[#E8DDDF] bg-white p-6 shadow-sm sm:p-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FFF1F2] text-[#C8102E]">
                <MessageCircle className="h-6 w-6" />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#938789]">
                  Need more help?
                </p>

                <h2 className="mt-1 text-xl font-bold text-[#231719] sm:text-2xl">
                  We are happy to assist
                </h2>

                <p className="mt-3 max-w-xl text-sm leading-6 text-[#5F5556]">
                  If you cannot find the answer you need, reach out
                  to our customer support team. Please include your
                  order number if your question is about a purchase.
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

        <p className="mt-8 text-center text-xs leading-5 text-[#756A6B]">
          Ex-tra-Gadgets — Extra value for money.
        </p>
      </div>
    </main>
  );
}