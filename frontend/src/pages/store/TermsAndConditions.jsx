import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  ShieldCheck,
  ShoppingBag,
  CreditCard,
  Truck,
  PackageCheck,
  UserCheck,
  Scale,
  Headphones,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Globe,
  LockKeyhole,
} from 'lucide-react';

const termsSections = [
  {
    number: '01',
    title: 'About Ex-tra-Gadgets',
    icon: ShoppingBag,
    description:
      'Ex-tra-Gadgets is a gadget and electronics retailer offering products such as phones, laptops, accessories, and other electronic devices. We aim to provide customers with quality products, accurate information, and reliable customer support.',
    items: [
      'We aim to provide a reliable and convenient shopping experience.',
      'For questions about our products, orders, or policies, please contact us through our official customer support channels.',
    ],
  },
  {
    number: '02',
    title: 'Use of Our Website',
    icon: Globe,
    description:
      'You agree to use this website only for lawful purposes and in a way that does not interfere with the rights of other customers or the operation of our store.',
    items: [
      'Provide accurate and complete information when placing an order.',
      'Do not attempt to gain unauthorized access to our website, systems, or customer information.',
      'Do not use our website for fraudulent, unlawful, or deceptive activities.',
      'Do not interfere with the security, performance, or proper operation of the website.',
      'Do not copy or commercially exploit our website content without permission.',
    ],
    notice:
      'We reserve the right to restrict access where we reasonably believe these terms have been violated.',
  },
  {
    number: '03',
    title: 'Product Information and Availability',
    icon: PackageCheck,
    description:
      'We make reasonable efforts to ensure that product descriptions, images, specifications, prices, and availability information displayed on our website are accurate.',
    items: [
      'Product images may differ slightly from the actual item due to lighting, photography, display settings, or manufacturer updates.',
      'Product specifications and features may change where manufacturers introduce updates or revisions.',
      'Product availability may change without prior notice.',
      'Some products may have different configurations, storage capacities, colours, or accessories.',
      'Customers are encouraged to review product descriptions and specifications carefully before placing an order.',
    ],
    notice:
      'If you need clarification about a product, please contact us before completing your purchase.',
  },
  {
    number: '04',
    title: 'Prices and Promotions',
    icon: CreditCard,
    description:
      'We make reasonable efforts to ensure that the prices displayed on our website are accurate and reflect the current selling price of each product.',
    items: [
      'Prices may occasionally contain genuine errors.',
      'If a product is listed at an incorrect price, we reserve the right to review the order and contact the customer before proceeding.',
      'Promotional offers, discounts, and special prices may be subject to additional conditions, availability, and validity periods.',
      'Unless otherwise stated, promotions cannot be combined with other offers.',
    ],
    notice:
      'We reserve the right to correct pricing errors or discontinue promotions where necessary.',
  },
  {
    number: '05',
    title: 'Orders and Order Confirmation',
    icon: ShoppingBag,
    description:
      'When you place an order through our website, you are submitting a request to purchase the selected products. An order acknowledgement does not necessarily mean that the order has been fully accepted or dispatched.',
    items: [
      'Orders may be subject to verification of product availability, payment status, delivery information, and other relevant details.',
      'Orders may be declined or cancelled if a product is unavailable, payment cannot be verified, information is incomplete, fraud is suspected, or a genuine pricing or product information error has occurred.',
      'Customers are responsible for reviewing their order details before submitting a purchase.',
    ],
    notice:
      'Where an order is cancelled after payment has been received, any applicable refund will be handled in accordance with our Warranty, Return & Refund Policy.',
  },
  {
    number: '06',
    title: 'Payment',
    icon: CreditCard,
    description:
      'Customers are responsible for providing accurate payment information and completing payment through the methods made available by Ex-tra-Gadgets.',
    items: [
      'An order may not be processed until the required payment has been confirmed.',
      'Where payment confirmation is required, customers should follow the instructions provided during checkout or by our customer support team.',
      'Customers must not submit false payment confirmations, altered receipts, or misleading transaction information.',
      'If you experience a payment issue, please contact our support team with your order details and relevant transaction information.',
    ],
  },
  {
    number: '07',
    title: 'Delivery and Collection',
    icon: Truck,
    description:
      'Delivery or collection arrangements will be communicated during the order process or through our customer support team.',
    items: [
      'Customers are responsible for providing accurate contact details and delivery information.',
      'Please ensure that someone is available to receive the order at the agreed delivery location or collection point.',
      'Delivery arrangements may be affected by product availability, location, courier operations, or circumstances beyond our reasonable control.',
      'Contact us as soon as possible if you need to change your delivery or collection details.',
    ],
    notice:
      'Any applicable delivery charges, delivery options, and estimated timelines will be communicated separately.',
  },
  {
    number: '08',
    title: 'Inspection Upon Delivery',
    icon: PackageCheck,
    description:
      'Customers are encouraged to inspect their products at the point of purchase, collection, or delivery.',
    items: [
      'Check that the product supplied matches your order.',
      'Check that the product and its packaging are in acceptable condition.',
      'Where possible, check that the product powers on and functions at handover.',
      'Confirm that the relevant accessories and items are included.',
      'Report eligible product issues within the applicable return window.',
    ],
    notice:
      'Please refer to our Warranty, Return & Refund Policy for the conditions and process that apply to product issues.',
  },
  {
    number: '09',
    title: 'Warranty, Returns, Exchanges, and Refunds',
    icon: ShieldCheck,
    description:
      'Warranty coverage, return eligibility, exchange conditions, and refund procedures are governed by our separate Warranty, Return & Refund Policy.',
    items: [
      'Warranty coverage may vary depending on the product category, manufacturer, and warranty period stated at purchase.',
      'Returns and refunds are subject to the conditions, inspection requirements, and time limits stated in the applicable policy.',
      'Customers should review the Warranty, Return & Refund Policy before making a purchase.',
    ],
    notice:
      'Nothing in these Terms & Conditions is intended to remove any rights that customers may have under applicable law.',
  },
  {
    number: '10',
    title: 'Customer Responsibilities',
    icon: UserCheck,
    description:
      'Customers are responsible for taking reasonable steps to ensure a smooth shopping and after-sales experience.',
    items: [
      'Provide accurate information when placing an order.',
      'Review product descriptions and specifications before purchasing.',
      'Keep your order confirmation and proof of purchase.',
      'Use products in accordance with the manufacturer’s instructions.',
      'Take reasonable care of products and accessories after delivery.',
      'Contact us promptly if you experience an issue with an order.',
    ],
    notice:
      'Please retain original packaging, manuals, accessories, and other supplied items where possible, particularly if a warranty claim or return may be required.',
  },
  {
    number: '11',
    title: 'Intellectual Property',
    icon: LockKeyhole,
    description:
      'Unless otherwise stated, the content on this website, including text, graphics, logos, designs, photographs, and website materials, belongs to Ex-tra-Gadgets or is used with permission.',
    items: [
      'You may view and use the website for personal shopping purposes.',
      'You may not reproduce, distribute, modify, publish, or commercially use website content without prior written permission, except where permitted by applicable law.',
      'Product names, logos, and trademarks belonging to manufacturers or other third parties remain the property of their respective owners.',
    ],
  },
  {
    number: '12',
    title: 'Third-Party Services and Links',
    icon: Globe,
    description:
      'Our website may contain links to third-party websites or use third-party services to support functions such as payments, communication, or delivery.',
    items: [
      'Third-party services may operate under their own terms and privacy policies.',
      'Ex-tra-Gadgets is not responsible for the content, policies, or operation of independent third-party websites.',
      'Customers should review the relevant terms and privacy policies before using third-party services.',
    ],
  },
  {
    number: '13',
    title: 'Limitation of Liability',
    icon: AlertCircle,
    description:
      'We make reasonable efforts to keep our website accurate, secure, and available. However, we do not guarantee that the website will always operate without interruptions, errors, or technical issues.',
    items: [
      'Temporary website interruptions or technical failures.',
      'Incorrect information supplied by a customer.',
      'Unauthorized access resulting from a customer’s failure to protect their account or personal information.',
      'Delays or interruptions caused by circumstances beyond our reasonable control.',
    ],
    notice:
      'To the extent permitted by applicable law, Ex-tra-Gadgets will not be responsible for losses arising from the circumstances listed above. Nothing in these terms excludes or limits any liability that cannot lawfully be excluded or limited.',
  },
  {
    number: '14',
    title: 'Privacy and Personal Information',
    icon: LockKeyhole,
    description:
      'We may collect and use customer information where necessary to process orders, provide customer support, communicate about purchases, and operate our store.',
    items: [
      'We aim to handle personal information responsibly and in accordance with applicable data protection requirements.',
      'Customers should refer to our Privacy Policy for more information about how personal information is collected, used, and protected.',
    ],
  },
  {
    number: '15',
    title: 'Changes to These Terms',
    icon: FileText,
    description:
      'Ex-tra-Gadgets may update these Terms & Conditions from time to time to reflect changes in our business operations, website features, or applicable requirements.',
    items: [
      'Any revised version will be published on this page.',
      'The updated terms will apply from the date they are published, subject to applicable law.',
      'Customers are encouraged to review this page periodically.',
    ],
  },
  {
    number: '16',
    title: 'Governing Law',
    icon: Scale,
    description:
      'These Terms & Conditions are intended to be interpreted in accordance with the laws applicable to the operation of Ex-tra-Gadgets in Nigeria.',
    items: [
      'Any dispute arising from the use of our website or the purchase of products will be handled in accordance with applicable law.',
    ],
  },
];

function TermsSection({ section }) {
  const Icon = section.icon;

  return (
    <section
      id={`terms-${section.number}`}
      className="scroll-mt-24 rounded-2xl border border-[#E8DDDF] bg-white p-6 shadow-sm transition-shadow hover:shadow-md sm:p-8"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FFF1F2] text-[#C8102E]">
          <Icon className="h-6 w-6" />
        </div>

        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#938789]">
            Section {section.number}
          </p>

          <h2 className="mt-1 text-xl font-bold tracking-tight text-[#231719] sm:text-2xl">
            {section.title}
          </h2>

          <p className="mt-3 text-sm leading-7 text-[#5F5556] sm:text-base">
            {section.description}
          </p>
        </div>
      </div>

      {section.items?.length > 0 && (
        <ul className="mt-6 space-y-3 border-t border-[#F1E8E9] pt-6">
          {section.items.map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 text-sm leading-6 text-[#5F5556] sm:text-base"
            >
              <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[#C8102E]" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}

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

export function TermsAndConditions() {
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
            Terms & Conditions
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
              <FileText className="h-4 w-4 text-[#FF4B5E]" />
              Store policies & customer information
            </div>

            <h1 className="mt-6 text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              Terms &
              <span className="block text-[#FF4B5E]">
                Conditions
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/75 sm:text-base sm:leading-8">
              Welcome to Ex-tra-Gadgets. These terms explain the
              conditions that apply when you access our website,
              browse products, place an order, or purchase from our
              store. Please read them carefully before making a
              purchase.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#terms-01"
                className="inline-flex items-center gap-2 rounded-xl bg-[#C8102E] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#A50D25]"
              >
                Read the terms
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
                <p className="text-sm font-semibold">Clear store policies</p>
                <p className="text-xs text-white/55">
                  Know what to expect
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <ShoppingBag className="h-5 w-5 shrink-0 text-[#FF4B5E]" />
              <div>
                <p className="text-sm font-semibold">Shopping information</p>
                <p className="text-xs text-white/55">
                  Orders, products & payments
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <LockKeyhole className="h-5 w-5 shrink-0 text-[#FF4B5E]" />
              <div>
                <p className="text-sm font-semibold">Customer responsibilities</p>
                <p className="text-xs text-white/55">
                  Your purchase and account
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Introductory notice */}
        <div className="mt-8 flex items-start gap-3 rounded-2xl border border-[#F5D5DA] bg-[#FFF1F2] p-5">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#C8102E]" />
          <p className="text-sm leading-6 text-[#721021]">
            By using our website or placing an order, you agree to
            these Terms & Conditions. If you do not agree with any
            part of these terms, please do not use our website or
            proceed with a purchase.
          </p>
        </div>

        {/* Terms sections */}
        <div className="mt-8 space-y-6">
          {termsSections.map((section) => (
            <TermsSection key={section.number} section={section} />
          ))}
        </div>

        {/* Contact card */}
        <section className="mt-8 rounded-3xl border border-[#E8DDDF] bg-white p-6 shadow-sm sm:p-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FFF1F2] text-[#C8102E]">
                <Headphones className="h-6 w-6" />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#938789]">
                  Customer support
                </p>

                <h2 className="mt-1 text-xl font-bold text-[#231719] sm:text-2xl">
                  Have questions about these terms?
                </h2>

                <p className="mt-3 max-w-xl text-sm leading-6 text-[#5F5556]">
                  Contact Ex-tra-Gadgets for assistance with our
                  website, your order, or any of our store policies.
                  Please include your order number and relevant
                  details when contacting us about a purchase.
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

        {/* Footer note */}
        <p className="mt-8 text-center text-xs leading-5 text-[#756A6B]">
          Ex-tra-Gadgets reserves the right to update these Terms &
          Conditions. Any revised version will be published on this
          page.
        </p>
      </div>
    </main>
  );
}