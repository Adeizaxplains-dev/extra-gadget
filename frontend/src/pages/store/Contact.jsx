import React, { useState } from 'react';
import {
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
} from 'lucide-react';

import { useStoreInfo } from '../../hooks/useStoreInfo.js';
import { buildWhatsAppLink } from '../../utils/whatsapp.js';
import { PageSpinner } from '../../components/ui/Spinner.jsx';
import { STORE_CONFIG } from '../../config/store.config.js';
import brandImage from '../../assets/brand/adr.jpeg';

const faqs = [
  {
    question: 'Are your brand-new gadgets original and authentic?',
    answer:
      'Yes. All our brand-new gadgets are 100% original and authentic, factory-sealed, and sourced directly from trusted manufacturers and authorized distributors.',
  },
  {
    question: 'How can I confirm a product is available?',
    answer:
      'Send us the product name or model through WhatsApp. Our team will help confirm its availability before you place your order.',
  },
  {
    question: 'Can I order online and have my item delivered?',
    answer:
      'Yes. You can place an order through our website. Delivery arrangements and applicable charges depend on your location and order.',
  },
  {
    question: 'Do you deliver outside Lagos?',
    answer:
      'Contact us with your delivery location and the item you wish to purchase. We will confirm whether delivery is available and provide the details.',
  },
  {
    question: 'Can I visit your physical store?',
    answer:
      'Yes. You can visit us at Suites 21, No. 12 Medical Road, opposite Sterling Bank, Computer Village, Ikeja, Lagos State.',
  },
  {
    question: 'Which payment methods do you accept?',
    answer:
      'Available payment methods are shown during checkout or confirmed by our sales team. Please verify payment instructions with Ex-tra-Gadgets before making a transfer.',
  },
  {
    question: 'Do your products come with a warranty?',
    answer:
      'Warranty coverage depends on the product and its manufacturer or distributor. Contact us with the product model to confirm the applicable warranty terms.',
  },
  {
    question: 'Can I return or exchange a product?',
    answer:
      'Return and exchange eligibility depends on the item and the circumstances of the request. Contact us with your order details so our team can explain the applicable process.',
  },
  {
    question: 'How can I follow up on my order?',
    answer:
      'Send us your order number and the phone number or email used when placing the order. Our team will help you check its status.',
  },
  {
    question: 'What if I receive a damaged or incorrect item?',
    answer:
      'Contact us as soon as possible with your order details and clear photos of the item and packaging. Our team will guide you through the next steps under the applicable order and return policy.',
  },
];

const inputClass =
  'mt-2 w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-sm text-charcoal outline-none transition placeholder:text-stone-400 focus:border-red-600 focus:ring-2 focus:ring-red-100';

export function Contact() {
  const { store, loading } = useStoreInfo();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    enquiryType: 'Product enquiry',
    orderNumber: '',
    message: '',
  });

  if (loading) {
    return <PageSpinner />;
  }

  const storeName = store?.name || 'Ex-tra-Gadgets';
  const whatsappNumber =
    store?.whatsapp?.number || store?.whatsappNumber;

  const contactPhone = store?.contact?.phone;
  const contactEmail = store?.contact?.email;
  const locations = STORE_CONFIG.locations || [];
  const deliveryCoverage = STORE_CONFIG.delivery?.coverage;

  const updateField = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!whatsappNumber) {
      window.alert(
        'WhatsApp contact is not configured yet. Please contact us by phone.',
      );
      return;
    }

    const message = [
      `Hello ${storeName}, I have an enquiry from your website.`,
      '',
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      form.phone ? `Phone: ${form.phone}` : null,
      `Enquiry type: ${form.enquiryType}`,
      form.orderNumber ? `Order number: ${form.orderNumber}` : null,
      '',
      'Message:',
      form.message,
    ]
      .filter(Boolean)
      .join('\n');

    const whatsappHref = buildWhatsAppLink(whatsappNumber, message);

    window.open(whatsappHref, '_blank', 'noopener,noreferrer');
  };

  const whatsappHref = whatsappNumber
    ? buildWhatsAppLink(
        whatsappNumber,
        `Hello ${storeName}, I'd like to get in touch.`,
      )
    : '#contact-form';

  return (
    <main className="bg-stone-50">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#171717] text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-red-950/70 via-transparent to-black/30" />

        <div className="container-page relative grid items-center gap-8 py-12 sm:py-16 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-red-200">
              <MessageCircle className="h-4 w-4" />
              Customer support
            </p>

            <h1 className="max-w-2xl font-display text-4xl font-bold leading-tight sm:text-5xl">
              We’re here to help you shop with confidence.
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-7 text-white/75 sm:text-base">
              Questions about a product, order, delivery, payment, or
              warranty? Send us a message and our team will help you find the
              right answer.
            </p>

            <a
              href={whatsappHref}
              target={whatsappNumber ? '_blank' : undefined}
              rel={whatsappNumber ? 'noreferrer' : undefined}
              className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#25D366] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1fb85a]"
            >
              <MessageCircle className="h-5 w-5" />
              Chat with us on WhatsApp
            </a>
          </div>

          <div className="mx-auto w-full max-w-md rounded-2xl bg-white p-4 shadow-2xl sm:p-6">
            <img
              src={brandImage}
              alt={`${storeName} — Extra value for money`}
              className="w-full rounded-xl object-contain"
            />

            <p className="mt-4 text-center text-sm font-medium text-stone-600">
              Extra value for money
            </p>
          </div>
        </div>
      </section>

      {/* Contact details */}
      <section className="container-page py-10 sm:py-14">
        <div className="mb-7 max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-widest text-red-700">
            Get in touch
          </p>

          <h2 className="mt-2 font-display text-2xl font-bold text-charcoal sm:text-3xl">
            Contact our team
          </h2>

          <p className="mt-3 text-sm leading-6 text-charcoal/70">
            Choose the contact method that works best for you. For the
            quickest response, send us a WhatsApp message.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ContactCard
            icon={<Phone className="h-5 w-5" />}
            title="Call us"
            content={contactPhone || 'Contact us on WhatsApp'}
          />

          <ContactCard
            icon={<Mail className="h-5 w-5" />}
            title="Email"
            content={contactEmail || 'Email details unavailable'}
          />

          <ContactCard
            icon={<MapPin className="h-5 w-5" />}
            title="Visit our store"
            content={
              locations.join(', ') || 'Suites 21, No. 12 Medical Road, opposite Sterling Bank, Computer Village, Ikeja, Lagos State, Nigeria.'
            }
          />

          <ContactCard
            icon={<Clock className="h-5 w-5" />}
            title="Delivery"
            content={
              deliveryCoverage || 'Contact us to confirm delivery'
            }
          />
        </div>
      </section>

      {/* Contact form */}
      <section id="contact-form" className="container-page pb-12 sm:pb-16">
        <div className="grid gap-8 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12 lg:p-10">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-red-700">
              Send an enquiry
            </p>

            <h2 className="mt-2 font-display text-2xl font-bold text-charcoal sm:text-3xl">
              How can we help?
            </h2>

            <p className="mt-4 text-sm leading-7 text-charcoal/70">
              Complete the form and we’ll open WhatsApp with your message
              prepared. Review it there and tap Send to submit your enquiry.
            </p>

            <div className="mt-6 flex gap-3 rounded-xl bg-red-50 p-4">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-red-700" />

              <p className="text-sm leading-6 text-charcoal/80">
                Your details will be included in the WhatsApp message so our
                team can respond to your enquiry.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Full name" required>
                <input
                  name="name"
                  value={form.name}
                  onChange={updateField}
                  required
                  autoComplete="name"
                  placeholder="Your full name"
                  className={inputClass}
                />
              </FormField>

              <FormField label="Email address" required>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={updateField}
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  className={inputClass}
                />
              </FormField>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Phone number">
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={updateField}
                  autoComplete="tel"
                  placeholder="Your phone number"
                  className={inputClass}
                />
              </FormField>

              <FormField label="Enquiry type" required>
                <select
                  name="enquiryType"
                  value={form.enquiryType}
                  onChange={updateField}
                  required
                  className={inputClass}
                >
                  <option>Product enquiry</option>
                  <option>Order or delivery</option>
                  <option>Payment</option>
                  <option>Warranty</option>
                  <option>Return or exchange</option>
                  <option>Other</option>
                </select>
              </FormField>
            </div>

            <FormField label="Order number (optional)">
              <input
                name="orderNumber"
                value={form.orderNumber}
                onChange={updateField}
                placeholder="Enter your order number, if applicable"
                className={inputClass}
              />
            </FormField>

            <FormField label="Your message" required>
              <textarea
                name="message"
                value={form.message}
                onChange={updateField}
                required
                rows={5}
                placeholder="Tell us how we can help..."
                className={`${inputClass} resize-y`}
              />
            </FormField>

            <button
              type="submit"
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1fb85a] focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2 sm:w-auto"
            >
              <MessageCircle className="h-5 w-5" />
              Continue to WhatsApp
            </button>

            <p className="text-xs leading-5 text-charcoal/60">
              WhatsApp will open with your message ready to send. Your enquiry
              is submitted only when you tap Send in WhatsApp.
            </p>
          </form>
        </div>
      </section>

      {/* Authenticity statement */}
      <section className="container-page pb-12 sm:pb-16">
        <div className="flex gap-4 rounded-2xl border border-red-100 bg-red-50 p-5 sm:p-7">
          <ShieldCheck className="h-7 w-7 shrink-0 text-red-700" />

          <div>
            <h2 className="font-display text-xl font-bold text-charcoal">
              Shop with confidence
            </h2>

            <p className="mt-2 text-sm leading-7 text-charcoal/80">
              All our brand-new gadgets are 100% original and authentic. They
              are factory-sealed and sourced directly from trusted
              manufacturers and authorized distributors.
            </p>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="container-page pb-16 sm:pb-20">
        <div className="mx-auto max-w-3xl">
          <div className="mb-7 text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-red-700">
              Frequently asked questions
            </p>

            <h2 className="mt-2 font-display text-2xl font-bold text-charcoal sm:text-3xl">
              Helpful answers before you shop
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <details
                key={faq.question}
                className="group rounded-xl border border-stone-200 bg-white p-5 shadow-sm"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-charcoal marker:hidden">
                  <span>
                    <span className="mr-3 text-red-700">
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    {faq.question}
                  </span>

                  <span className="text-xl text-red-700 transition group-open:rotate-45">
                    +
                  </span>
                </summary>

                <p className="mt-4 pl-9 text-sm leading-7 text-charcoal/70">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function FormField({ label, required, children }) {
  return (
    <label className="block text-sm font-medium text-charcoal">
      {label}
      {required && <span className="ml-1 text-red-700">*</span>}
      {children}
    </label>
  );
}

function ContactCard({ icon, title, content }) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-red-50 text-red-700">
        {icon}
      </div>

      <h3 className="font-semibold text-charcoal">{title}</h3>

      <p className="mt-2 break-words text-sm leading-6 text-charcoal/70">
        {content}
      </p>
    </div>
  );
}