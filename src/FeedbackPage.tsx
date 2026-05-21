import React, { useEffect, useRef, useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import './OrderPage.css';

const ORDER_ENDPOINT = process.env.REACT_APP_ORDER_ENDPOINT || '';
const ORDER_TOKEN = process.env.REACT_APP_ORDER_TOKEN || '';
const TURNSTILE_SITE_KEY = process.env.REACT_APP_TURNSTILE_SITE_KEY || '';
const TURNSTILE_SRC =
  'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

type Status = 'idle' | 'submitting' | 'success' | 'error';
type YesNoMaybe = '' | 'Yes' | 'No' | 'Cannot Say';
type YesNo = '' | 'Yes' | 'No';

interface FeedbackForm {
  phone: string;
  noticedDifference: YesNoMaybe;
  sweeter: YesNoMaybe;
  wouldBuyUnripe: YesNo;
  suggestions: string;
  website: string;
}

const initialForm: FeedbackForm = {
  phone: '',
  noticedDifference: '',
  sweeter: '',
  wouldBuyUnripe: '',
  suggestions: '',
  website: '',
};

const FeedbackPage: React.FC = () => {
  const [form, setForm] = useState<FeedbackForm>(initialForm);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
  const captchaRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

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

  const resetCaptcha = () => {
    setCaptchaToken('');
    const turnstile = (window as any).turnstile;
    if (turnstile && widgetIdRef.current !== null) {
      turnstile.reset(widgetIdRef.current);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.website) {
      setStatus('success');
      return;
    }

    if (!ORDER_ENDPOINT) {
      setStatus('error');
      setErrorMessage(
        'Feedback is not configured yet. Please contact us on WhatsApp instead.'
      );
      return;
    }

    if (form.phone.replace(/\D/g, '').length !== 10) {
      setStatus('error');
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!form.noticedDifference || !form.sweeter || !form.wouldBuyUnripe) {
      setStatus('error');
      setErrorMessage('Please answer all the questions before submitting.');
      return;
    }

    if (TURNSTILE_SITE_KEY && !captchaToken) {
      setStatus('error');
      setErrorMessage('Please complete the "I am human" verification.');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    try {
      const response = await fetch(ORDER_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          ...form,
          kind: 'feedback',
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
        'Something went wrong submitting your feedback. Please try again or contact us on WhatsApp.'
      );
    } finally {
      resetCaptcha();
    }
  };

  const phoneInvalid =
    form.phone.trim() !== '' && form.phone.replace(/\D/g, '').length !== 10;

  return (
    <div className="order-page">
      <Header />
      <main className="order-content">
        <h1>Share your feedback</h1>

        <div className="order-section">
          <p className="varieties-intro">
            Your feedback helps us grow better mangoes and serve you better.
            Thanks for taking a minute to share it.
          </p>

          {status === 'success' ? (
            <div className="order-feedback success">
              <h3>Thank you for your feedback!</h3>
              <p>We really appreciate you taking the time to share it.</p>
              <button
                type="button"
                className="order-link-button"
                onClick={() => setStatus('idle')}
              >
                Submit another response
              </button>
            </div>
          ) : (
            <form className="order-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <label htmlFor="phone">Mobile *</label>
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
                <label>
                  Did you notice the difference between chemical vs naturally
                  ripened mangoes? *
                </label>
                <div className="radio-group">
                  {(['Yes', 'No', 'Cannot Say'] as const).map((opt) => (
                    <label key={opt} className="radio-option">
                      <input
                        type="radio"
                        name="noticedDifference"
                        value={opt}
                        checked={form.noticedDifference === opt}
                        onChange={handleChange}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-row">
                <label>
                  Was it sweeter than the mangoes you had earlier? *
                </label>
                <div className="radio-group">
                  {(['Yes', 'No', 'Cannot Say'] as const).map((opt) => (
                    <label key={opt} className="radio-option">
                      <input
                        type="radio"
                        name="sweeter"
                        value={opt}
                        checked={form.sweeter === opt}
                        onChange={handleChange}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-row">
                <label>
                  Would you like to buy mangoes which are only 80% ripened, so
                  that you can ripen them at home? *
                </label>
                <div className="radio-group">
                  {(['Yes', 'No'] as const).map((opt) => (
                    <label key={opt} className="radio-option">
                      <input
                        type="radio"
                        name="wouldBuyUnripe"
                        value={opt}
                        checked={form.wouldBuyUnripe === opt}
                        onChange={handleChange}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-row">
                <label htmlFor="suggestions">
                  What else would you have liked in this experience
                  (ordering, purchasing, eating) of engaging with us?
                </label>
                <textarea
                  id="suggestions"
                  name="suggestions"
                  rows={4}
                  value={form.suggestions}
                  onChange={handleChange}
                  placeholder="Your suggestions..."
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
                {status === 'submitting' ? 'Submitting...' : 'Submit feedback'}
              </button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FeedbackPage;
