# Ex-tra Gadgets — Stage 1 implementation notes

## Included
- Admin-configurable bank transfer details and transfer instructions.
- Admin-configurable delivery enablement, delivery fee, free-delivery threshold and instructions.
- Admin-configurable pickup enablement, location name, address, contact phone, hours and instructions.
- Checkout fulfilment selection (delivery or pickup) and bank-transfer-only Stage 1 payment selection.
- Orders snapshot fulfilment method and pickup location details at the time of order.
- Customer can submit a bank transfer reference from the order confirmation page.
- Admin-only bank-transfer confirmation/rejection action. Confirmation reuses the existing atomic paid-order flow: inventory deduction, customer revenue stats, payment follow-up cancellation and paid-order automation event.
- Separate fulfilment status field for processing, ready for pickup, dispatched and completed.
- Paystack remains in the existing codebase for Stage 2, but is disabled by default and is not offered in Stage 1 checkout.

## Required admin setup before launch
1. Open Admin → Store Settings.
2. Enter bank name, account name and account number (account type and instructions optional).
3. Enable bank transfer only after all three required bank details are saved.
4. Set delivery enabled/disabled, delivery fee and free-delivery threshold.
5. Set pickup enabled/disabled and complete the pickup location details if pickup is offered.
6. Save settings and place a real low-value test order before public launch.

## WhatsApp confirmation requirements
Payment confirmation creates the existing `order_confirmation` WhatsApp automation after the payment is confirmed. Actual delivery requires valid Meta WhatsApp Business API credentials (`WHATSAPP_ACCESS_TOKEN` and `WHATSAPP_PHONE_NUMBER_ID` in the backend environment), the automation processor running, and the relevant automation settings enabled. Check the automation record status (`sent` or `failed`) before telling a customer that a message was delivered.

## Important deployment/testing notes
- No credentials or bank account details have been inserted into source code.
- Existing MongoDB data is compatible through Mongoose defaults for new fields; confirm the deployed store settings and enable/configure bank transfer in Admin before checkout is opened.
- MongoDB transactions are used by the existing paid-order inventory workflow. Production MongoDB must support transactions (Atlas replica set or equivalent).
- The frontend production build could not be completed in this environment because dependency installation did not finish before timeout. Changed backend JavaScript passed `node --check`; changed JSX files passed TypeScript parser syntax checks. Full integration, browser checkout, WhatsApp delivery and live payment verification remain untested.
