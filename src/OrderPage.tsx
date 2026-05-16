import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import './OrderPage.css';
import whatsappIcon from './images/whatsapp-icon.svg';

// Apps Script Web App URL. Set REACT_APP_ORDER_ENDPOINT in a .env file.
const ORDER_ENDPOINT = process.env.REACT_APP_ORDER_ENDPOINT || '';

// Comma-separated 2026 price values from REACT_APP_PRICE_2026 (first value is
// the price per kg).
const PRICE_2026 = (process.env.REACT_APP_PRICE_2026 || '')
  .split(',')
  .map((v) => v.trim())
  .filter(Boolean);
const PRICE_PER_KG = PRICE_2026[0] || '';

type Status = 'idle' | 'submitting' | 'success' | 'error';

interface OrderForm {
  name: string;
  phone: string;
  packSize: string;
  quantity: string;
  fulfilment: 'Pickup' | 'Delivery';
  address: string;
  locationLink: string;
  notes: string;
  // Honeypot field — should stay empty for real users.
  website: string;
}

const initialForm: OrderForm = {
  name: '',
  phone: '',
  packSize: '5 kg',
  quantity: '1',
  fulfilment: 'Delivery',
  address: '',
  locationLink: '',
  notes: '',
  website: '',
};

const OrderPage: React.FC = () => {
  const [form, setForm] = useState<OrderForm>(initialForm);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot: silently treat bot submissions as success.
    if (form.website) {
      setStatus('success');
      return;
    }

    if (!ORDER_ENDPOINT) {
      setStatus('error');
      setErrorMessage(
        'Ordering is not configured yet. Please contact us on WhatsApp instead.'
      );
      return;
    }

    if (form.phone.replace(/\D/g, '').length !== 10) {
      setStatus('error');
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (form.fulfilment === 'Delivery' && !form.address.trim()) {
      setStatus('error');
      setErrorMessage('Please enter a delivery address.');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    try {
      const response = await fetch(ORDER_ENDPOINT, {
        method: 'POST',
        // text/plain avoids a CORS preflight against the Apps Script endpoint.
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ ...form, pricePerKg: PRICE_PER_KG }),
      });

      const result = await response.json();
      if (result.result === 'success') {
        setStatus('success');
        setForm(initialForm);
      } else {
        throw new Error(result.message || 'Submission failed');
      }
    } catch (err) {
      setStatus('error');
      setErrorMessage(
        'Something went wrong submitting your order. Please try again or contact us on WhatsApp.'
      );
    }
  };

  const phoneInvalid =
    form.phone.trim() !== '' && form.phone.replace(/\D/g, '').length !== 10;

  return (
    <div className="order-page">
      <Header />
      <main className="order-content">
        <h1>Order Mangoes</h1>

        {PRICE_PER_KG && (
          <div className="price-section">
            <h2>2026 Price</h2>
            <p className="price-amount">
              ₹{PRICE_PER_KG} <span className="price-unit">per kg</span>
            </p>
          </div>
        )}

        <div className="order-section">
          <div className="order-method">
            <img src={whatsappIcon} alt="WhatsApp" className="whatsapp-icon" />
            <p>
              Prefer to chat? Message us on WhatsApp at:
              <a href="https://wa.me/919346502175" className="phone-number">
                {' '}
                +91 9346502175
              </a>
            </p>
          </div>

          {status === 'success' ? (
            <div className="order-feedback success">
              <h3>Thank you for your order!</h3>
              <p>
                We have received your request and will reach out on WhatsApp to
                confirm the details.
              </p>
              <button
                type="button"
                className="order-link-button"
                onClick={() => setStatus('idle')}
              >
                Place another order
              </button>
            </div>
          ) : (
            <form className="order-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <label htmlFor="name">Name *</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-row">
                <label htmlFor="phone">Phone (WhatsApp) *</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  aria-invalid={phoneInvalid}
                  required
                />
                {phoneInvalid && (
                  <span className="field-error">
                    Please enter a valid 10-digit mobile number.
                  </span>
                )}
              </div>

              <div className="form-grid">
                <div className="form-row">
                  <label htmlFor="packSize">Pack size *</label>
                  <select
                    id="packSize"
                    name="packSize"
                    value={form.packSize}
                    onChange={handleChange}
                    required
                  >
                    <option value="3 kg">3 kg</option>
                    <option value="5 kg">5 kg</option>
                    <option value="10 kg">10 kg</option>
                  </select>
                </div>

                <div className="form-row">
                  <label htmlFor="quantity">Number of packs *</label>
                  <input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min="1"
                    value={form.quantity}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <label>Fulfilment *</label>
                <div className="radio-group">
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="fulfilment"
                      value="Delivery"
                      checked={form.fulfilment === 'Delivery'}
                      onChange={handleChange}
                    />
                    Delivery (Local Parcel)
                  </label>
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="fulfilment"
                      value="Pickup"
                      checked={form.fulfilment === 'Pickup'}
                      onChange={handleChange}
                    />
                    Pickup (Kundanbagh, Begumpet)
                  </label>
                </div>
              </div>

              {form.fulfilment === 'Delivery' && (
                <>
                  <div className="form-row">
                    <label htmlFor="address">Delivery address *</label>
                    <textarea
                      id="address"
                      name="address"
                      rows={3}
                      value={form.address}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-row">
                    <label htmlFor="locationLink">
                      Location link (optional)
                    </label>
                    <input
                      id="locationLink"
                      name="locationLink"
                      type="url"
                      value={form.locationLink}
                      onChange={handleChange}
                      placeholder="Google Maps link to your location"
                    />
                  </div>
                </>
              )}

              <div className="form-row">
                <label htmlFor="notes">Notes (optional)</label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={2}
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Can I pick up at a specific time..."
                />
              </div>

              {/* Honeypot field — hidden from real users. */}
              <input
                type="text"
                name="website"
                value={form.website}
                onChange={handleChange}
                className="honeypot"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />

              {status === 'error' && (
                <p className="order-feedback error">{errorMessage}</p>
              )}

              <button
                type="submit"
                className="order-submit"
                disabled={status === 'submitting'}
              >
                {status === 'submitting' ? 'Submitting...' : 'Submit order'}
              </button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderPage;
