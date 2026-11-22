import React, { useEffect, useMemo, useState } from 'react';
import { Input } from '../ui/Input.jsx';
import { Textarea } from '../ui/Textarea.jsx';
import { Button } from '../ui/Button.jsx';

const NIGERIAN_STATES = [
  'Abia',
  'Adamawa',
  'Akwa Ibom',
  'Anambra',
  'Bauchi',
  'Bayelsa',
  'Benue',
  'Borno',
  'Cross River',
  'Delta',
  'Ebonyi',
  'Edo',
  'Ekiti',
  'Enugu',
  'Gombe',
  'Imo',
  'Jigawa',
  'Kaduna',
  'Kano',
  'Katsina',
  'Kebbi',
  'Kogi',
  'Kwara',
  'Lagos',
  'Nasarawa',
  'Niger',
  'Ogun',
  'Ondo',
  'Osun',
  'Oyo',
  'Plateau',
  'Rivers',
  'Sokoto',
  'Taraba',
  'Yobe',
  'Zamfara',
  'FCT (Abuja)',

];

function getAccountId(account) {
return String(account?._id || account?.id || '');
}

function hasCompleteBankDetails(account) {
return Boolean(
account?.bankName?.trim() &&
account?.accountName?.trim() &&
account?.accountNumber?.trim()
);
}

export function CheckoutForm({ onSubmit, submitting, store }) {
const configuredAccounts = Array.isArray(
store?.paymentSettings?.bankAccounts
)
? store.paymentSettings.bankAccounts
: [];

// Match the backend: when bankAccounts are configured, use those.
// Otherwise, support the legacy single bankDetails account.
const bankAccounts = useMemo(() => {
if (configuredAccounts.length > 0) {
return configuredAccounts.filter(
(account) =>
account?.active !== false && hasCompleteBankDetails(account)
);
}

const legacyAccount = store?.paymentSettings?.bankDetails;

return hasCompleteBankDetails(legacyAccount)
? [legacyAccount]
: [];
}, [configuredAccounts, store?.paymentSettings?.bankDetails]);

const hasMultipleAccountSetup = configuredAccounts.length > 0;

const [selectedBankAccountId, setSelectedBankAccountId] = useState('');

const [form, setForm] = useState({
name: '',
phone: '',
email: '',
address: '',
state: '',
city: '',
note: '',
fulfilmentMethod:
store?.pickupSettings?.enabled &&
!store?.deliverySettings?.enabled
? 'pickup'
: 'delivery',
paymentMethod: 'bank_transfer',
transferReference: '',
});

const [errors, setErrors] = useState({});

useEffect(() => {
const selectedAccountStillAvailable = bankAccounts.some(
(account) => getAccountId(account) === selectedBankAccountId
);

if (!selectedAccountStillAvailable) {
setSelectedBankAccountId(
hasMultipleAccountSetup ? getAccountId(bankAccounts[0]) : ''
);
}
}, [
bankAccounts,
hasMultipleAccountSetup,
selectedBankAccountId,
]);

const update = (field) => (e) => {
setForm((current) => ({
...current,
[field]: e.target.value,
}));
};

const paymentMethods =
store?.paymentSettings?.bankTransfer && bankAccounts.length > 0
? [['bank_transfer', 'Bank transfer']]
: [];

const validate = () => {
const next = {};

if (!form.name.trim()) {
next.name = 'Full name is required';
}

if (!form.phone.trim() || form.phone.trim().length < 7) {
next.phone = 'A valid phone number is required';
}

if (form.fulfilmentMethod === 'delivery') {
if (!form.address.trim()) {
next.address = 'Delivery address is required';
}

if (!form.state) {
next.state = 'Please select a state';
}

if (!form.city.trim()) {
next.city = 'City is required';
}
}

if (
form.paymentMethod === 'bank_transfer' &&
hasMultipleAccountSetup &&
!bankAccounts.some(
(account) => getAccountId(account) === selectedBankAccountId
)
) {
next.bankAccountId = 'Please select a bank account for your transfer';
}

setErrors(next);
return Object.keys(next).length === 0;
};

const handleSubmit = (e) => {
e.preventDefault();

if (!validate()) return;

onSubmit({
...form,
...(form.paymentMethod === 'bank_transfer' &&
hasMultipleAccountSetup
? { bankAccountId: selectedBankAccountId }
: {}),
});
};

return (
<form onSubmit={handleSubmit} className="space-y-5">
<div className="grid gap-4 sm:grid-cols-2">
<Input
label="Full name"
value={form.name}
onChange={update('name')}
error={errors.name}
/>

<Input
label="Phone number"
value={form.phone}
onChange={update('phone')}
error={errors.phone}
/>
</div>

<Input
label="Email (optional)"
type="email"
value={form.email}
onChange={update('email')}
/>

{store?.deliverySettings?.enabled &&
store?.pickupSettings?.enabled && (
<div>
<p className="mb-2 text-sm font-semibold">
How would you like to receive your order?
</p>

<div className="flex flex-wrap gap-4">
{[
['delivery', 'Delivery'],
['pickup', 'Store pickup'],
].map(([value, label]) => (
<label
                  key={value}
                  className="flex items-center gap-2 text-sm"
                >
<input
type="radio"
name="fulfilment"
checked={form.fulfilmentMethod === value}
onChange={() =>
setForm((current) => ({
...current,
fulfilmentMethod: value,
}))
}
/>
{label}
</label>
))}
</div>
</div>
)}

{form.fulfilmentMethod === 'delivery' && (
<>
<Input
label="Delivery address"
value={form.address}
onChange={update('address')}
error={errors.address}
placeholder="Street, house number, landmark"
/>

<div className="grid gap-4 sm:grid-cols-2">
<div>
<label className="mb-1.5 block text-sm font-medium">
State
</label>

<select
value={form.state}
onChange={update('state')}
className="w-full rounded-xl border border-charcoal/15 bg-white px-4 py-2.5 text-sm"
>
<option value="">Select state</option>
{NIGERIAN_STATES.map((state) => (
<option key={state} value={state}>
{state}
</option>
))}
</select>

{errors.state && (
<p className="mt-1 text-xs text-red-600">
{errors.state}
</p>
)}
</div>

<Input
label="City"
value={form.city}
onChange={update('city')}
error={errors.city}
/>
</div>

<Textarea
label="Delivery note (optional)"
rows={2}
value={form.note}
onChange={update('note')}
/>
</>
)}

{form.fulfilmentMethod === 'pickup' && (
<div className="rounded-xl bg-gray-50 p-4 text-sm">
<p className="font-semibold">
{store?.pickupSettings?.locationName || 'Pickup location'}
</p>
<p>{store?.pickupSettings?.address}</p>
{store?.pickupSettings?.openingHours && (
<p className="mt-1">
Hours: {store.pickupSettings.openingHours}
</p>
)}
</div>
)}

<div>
<p className="mb-2 text-sm font-semibold">Payment method</p>

{paymentMethods.length > 0 ? (
paymentMethods.map(([value, label]) => (
<label
              key={value}
              className="mb-2 flex items-center gap-2 text-sm"
            >
<input
type="radio"
name="payment"
checked={form.paymentMethod === value}
onChange={() =>
setForm((current) => ({
...current,
paymentMethod: value,
}))
}
/>
{label}
</label>
))
) : (
<p className="text-sm text-red-600">
No payment method is currently available. Please contact the
store.
</p>
)}
</div>

{form.paymentMethod === 'bank_transfer' &&
hasMultipleAccountSetup && (
<div>
<label className="mb-1.5 block text-sm font-medium">
Select bank account
</label>

<select
value={selectedBankAccountId}
onChange={(e) => {
setSelectedBankAccountId(e.target.value);
setErrors((current) => ({
...current,
bankAccountId: '',
}));
}}
className="w-full rounded-xl border border-charcoal/15 bg-white px-4 py-2.5 text-sm"
>
<option value="">Select account for transfer</option>

{bankAccounts.map((account, index) => {
const accountId = getAccountId(account);

return (
<option key={accountId || index} value={accountId}>
{account.bankName} — {account.accountName} (
{account.accountNumber})
</option>
);
})}
</select>

{errors.bankAccountId && (
<p className="mt-1 text-xs text-red-600">
{errors.bankAccountId}
</p>
)}
</div>
)}

{form.paymentMethod === 'bank_transfer' && (
<Input
label="Transfer reference (optional — you may provide it after placing the order)"
value={form.transferReference}
onChange={update('transferReference')}
/>
)}

<Button
type="submit"
size="lg"
className="w-full"
disabled={submitting || paymentMethods.length === 0}
>
{submitting ? 'Placing your order…' : 'Place order'}
</Button>
</form>
);
}