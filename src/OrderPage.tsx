import React, { useEffect, useRef, useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import './OrderPage.css';
import whatsappIcon from './images/whatsapp-icon.svg';
import { VARIETIES } from './varieties';

// Apps Script Web App URL. Set REACT_APP_ORDER_ENDPOINT in a .env file.
const ORDER_ENDPOINT = process.env.REACT_APP_ORDER_ENDPOINT || '';

// Shared-secret token sent with each order; must match the Apps Script's
// ORDER_TOKEN script property. Set REACT_APP_ORDER_TOKEN in a .env file.
const ORDER_TOKEN = process.env.REACT_APP_ORDER_TOKEN || '';

// Cloudflare Turnstile site key. Set REACT_APP_TURNSTILE_SITE_KEY in a .env
// file. When empty, the CAPTCHA step is skipped.
const TURNSTILE_SITE_KEY = process.env.REACT_APP_TURNSTILE_SITE_KEY || '';
const TURNSTILE_SRC =
  'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

type Status = 'idle' | 'submitting' | 'success' | 'error';

interface OrderForm {
  name: string;
  phone: string;
  email: string;
  variety: string;
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
  email: '',
  variety: VARIETIES[0].name,
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
  const [captchaToken, setCaptchaToken] = useState('');
  const captchaRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  // Load the Turnstile script and render the widget once.
  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) {
      return;
    }

    const renderWidget = () => {
      const turnstile = (window as any).turnstile;
      if (!turnstile || !captchaRef.current || widgetIdRef.current !== null) {
        return;
      }
      widgetIdRef.current = turnstile.render(captchaRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        callback: (token: string) => setCaptchaToken(token),
        'expired-callback': () => setCaptchaToken(''),
        'error-callback': () => setCaptchaToken(''),
      });
    };

    if ((window as any).turnstile) {
      renderWidget();
      return;
    }

    let script = document.querySelector<HTMLScriptElement>(
      `script[src="${TURNSTILE_SRC}"]`
    );
    if (!script) {
      script = document.createElement('script');
      script.src = TURNSTILE_SRC;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
    script.addEventListener('load', renderWidget);

    return () => {
      script?.removeEventListener('load', renderWidget);
      const turnstile = (window as any).turnstile;
      if (turnstile && widgetIdRef.current !== null) {
        turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, []);

  // Turnstile tokens are single-use — clear and re-issue after each attempt.
  const resetCaptcha = () => {
    setCaptchaToken('');
    const turnstile = (window as any).turnstile;
    if (turnstile && widgetIdRef.current !== null) {
      turnstile.reset(widgetIdRef.current);
    }
  };

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

    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (form.fulfilment === 'Delivery' && !form.address.trim()) {
      setStatus('error');
      setErrorMessage('Please enter a delivery address.');
      return;
    }

    if (TURNSTILE_SITE_KEY && !captchaToken) {
      setStatus('error');
      setErrorMessage('Please complete the "I am human" verification.');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    // Price per kg comes from the selected variety in varieties.ts.
    const selectedVariety = VARIETIES.find((v) => v.name === form.variety);
    const pricePerKg = selectedVariety ? selectedVariety.price : '';

    try {
      const response = await fetch(ORDER_ENDPOINT, {
        method: 'POST',
        // text/plain avoids a CORS preflight against the Apps Script endpoint.
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          ...form,
          pricePerKg,
          token: ORDER_TOKEN,
          captchaToken,
        }),
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
    } finally {
      // The token was consumed by this attempt; get a fresh one either way.
      resetCaptcha();
    }
  };

  const phoneInvalid =
    form.phone.trim() !== '' && form.phone.replace(/\D/g, '').length !== 10;

  return (
    <div className="order-page">
      <Header />
      <main className="order-content">
        <h1>Order Mangoes</h1>

        <section className="varieties-section">
          <h2>Our Mango Varieties</h2>
          <p className="varieties-intro">
            Mangoes are from Zaheerabad area and are naturally ripened with hay
            and gliricidia leaves. Prices are per kg for the 2026 season.
          </p>
          <div className="varieties-table-wrap">
            <table className="varieties-table">
              <thead>
                <tr>
                  <th scope="col">Mango</th>
                  <th scope="col">Price</th>
                  <th scope="col" className="variety-description-col">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody>
                {VARIETIES.map((variety) => (
                  <tr key={variety.name}>
                    <td className="variety-cell">
                      <img
                        className="variety-thumb"
                        src={`${process.env.PUBLIC_URL}/varieties/${variety.image}`}
                        alt={variety.name}
                      />
                      <span className="variety-name">{variety.name}</span>
                    </td>
                    <td className="variety-price">
                      ₹{variety.price}
                      <span className="price-unit">per kg</span>
                    </td>
                    <td className="variety-description variety-description-col">
                      {variety.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

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
                We have received your request and will update you over an
                email or WhatsApp to confirm the details.
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

              <div className="form-row">
                <label htmlFor="email">Email (optional)</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="So we can email you order updates"
                />
              </div>

              <div className="form-row">
                <label htmlFor="variety">Mango variety *</label>
                <select
                  id="variety"
                  name="variety"
                  value={form.variety}
                  onChange={handleChange}
                  required
                >
                  {VARIETIES.map((variety) => (
                    <option key={variety.name} value={variety.name}>
                      {variety.name} — ₹{variety.price}/kg
                    </option>
                  ))}
                </select>
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

              {TURNSTILE_SITE_KEY && (
                <div className="form-row">
                  <div ref={captchaRef} className="turnstile-widget" />
                </div>
              )}

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
