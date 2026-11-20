import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as orderService from '../../services/orderService.js';
import { Select } from '../../components/ui/Select.jsx';
import { Textarea } from '../../components/ui/Textarea.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { PageSpinner } from '../../components/ui/Spinner.jsx';
import { ErrorState } from '../../components/ui/ErrorState.jsx';
import { PaymentStatusBadge, OrderStatusBadge } from '../../components/ui/StatusBadge.jsx';
import { formatCurrency } from '../../utils/currency.js';
const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('');
  const [fulfilmentStatus, setFulfilmentStatus] = useState('');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  const [reviewReason, setReviewReason] = useState('');

  const load = () =>
    orderService
      .getOrder(id)
      .then((data) => {
        setOrder(data);
        setStatus(data.orderStatus);
        setFulfilmentStatus(data.fulfilmentStatus || 'awaiting_payment');
      })
      .catch((err) => setError(err.message));

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await orderService.updateOrderStatus(id, { orderStatus: status, fulfilmentStatus, note: note || undefined });
      setNote('');
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (error) return <ErrorState message={error} />;
  if (!order) return <PageSpinner />;

  return (
    <div className="max-w-3xl">
      <button onClick={() => navigate('/admin/orders')} className="text-sm text-emerald hover:underline">← Back to orders</button>

      <div className="mt-3 flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-charcoal">{order.orderNumber}</h1>
        <div className="flex gap-2">
          <PaymentStatusBadge status={order.paymentStatus} />
          <OrderStatusBadge status={order.orderStatus} />
        </div>
      </div>

      {order.paymentMethod === 'bank_transfer' && order.paymentStatus === 'pending' && <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-5">
        <h2 className="font-semibold">Bank transfer verification</h2><p className="mt-1 text-sm">Reference supplied: {order.transferReference || 'Not supplied'}</p>
        <Textarea rows={2} value={reviewReason} onChange={(e) => setReviewReason(e.target.value)} placeholder="Reason if rejecting the transfer" />
        <div className="mt-3 flex flex-wrap gap-3"><Button disabled={reviewing} onClick={async()=>{setReviewing(true);try{await orderService.reviewBankTransfer(id,{action:'confirm'});await load();}catch(e){setError(e.message);}finally{setReviewing(false);}}}>{reviewing?'Processing…':'Confirm payment received'}</Button><Button variant="outline" disabled={reviewing} onClick={async()=>{setReviewing(true);try{await orderService.reviewBankTransfer(id,{action:'reject',reason:reviewReason});await load();}catch(e){setError(e.message);}finally{setReviewing(false);}}}>Reject transfer</Button></div>
        <p className="mt-2 text-xs text-muted">Confirm only after checking the actual bank statement. Confirmation deducts stock and triggers the configured order confirmation automation.</p>
      </div>}

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl bg-white p-5 shadow-card">
          <h2 className="text-sm font-semibold text-charcoal">Customer</h2>
          <p className="mt-2 text-sm text-charcoal/80">{order.delivery.fullName}</p>
          <p className="text-sm text-charcoal/80">{order.delivery.phone}</p>
          {order.delivery.email && <p className="text-sm text-charcoal/80">{order.delivery.email}</p>}
        </div>
        <div className="rounded-xl bg-white p-5 shadow-card">
          <h2 className="text-sm font-semibold text-charcoal">{order.fulfilmentMethod === 'pickup' ? 'Pickup' : 'Delivery'}</h2>
          {order.fulfilmentMethod === 'pickup' ? <><p className="mt-2 text-sm">{order.pickup?.locationName}</p><p className="text-sm">{order.pickup?.address}</p></> : <><p className="mt-2 text-sm text-charcoal/80">{order.delivery.address}</p><p className="text-sm text-charcoal/80">{order.delivery.city}, {order.delivery.state}</p></>}
          {order.delivery.note && <p className="mt-1 text-sm text-muted">Note: {order.delivery.note}</p>}
        </div>
      </div>

      <div className="mt-6 rounded-xl bg-white p-5 shadow-card">
        <h2 className="text-sm font-semibold text-charcoal">Items</h2>
        <div className="mt-3 space-y-2">
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="text-charcoal/80">{item.name} {item.size ? `(${item.size})` : ''} × {item.quantity}</span>
              <span className="font-medium text-charcoal">{formatCurrency(item.unitPrice * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex justify-between border-t border-charcoal/10 pt-3 text-sm font-semibold text-charcoal">
          <span>Total</span>
          <span>{formatCurrency(order.total)}</span>
        </div>
      </div>

      <form onSubmit={handleUpdate} className="mt-6 rounded-xl bg-white p-5 shadow-card">
        <h2 className="text-sm font-semibold text-charcoal">Update order</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <Select label="Order status" value={status} onChange={(e) => setStatus(e.target.value)}>
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </Select>
        </div>
        <div className="mt-4">
          <Select label={order.fulfilmentMethod === 'pickup' ? 'Pickup status' : 'Delivery status'} value={fulfilmentStatus} onChange={(e) => setFulfilmentStatus(e.target.value)} disabled={order.paymentStatus !== 'paid'}>
            <option value="awaiting_payment">Awaiting payment</option><option value="processing">Processing</option>{order.fulfilmentMethod === 'pickup' ? <><option value="ready_for_pickup">Ready for pickup</option><option value="completed">Collected</option></> : <><option value="dispatched">Dispatched</option><option value="completed">Delivered</option></>}
          </Select>
        </div>
        <div className="mt-4">
          <Textarea label="Internal note (optional)" rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Visible to staff only" />
        </div>
        <Button type="submit" className="mt-4" disabled={saving}>
          {saving ? 'Saving…' : 'Save changes'}
        </Button>

        {order.internalNotes?.length > 0 && (
          <div className="mt-5 border-t border-charcoal/10 pt-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">Notes</p>
            <ul className="mt-2 space-y-2">
              {order.internalNotes.map((n, i) => (
                <li key={i} className="text-sm text-charcoal/80">{n.note}</li>
              ))}
            </ul>
          </div>
        )}
      </form>
    </div>
  );
}
