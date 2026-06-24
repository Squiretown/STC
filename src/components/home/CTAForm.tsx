import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Target, ArrowLeftRight, Sparkles, Lock, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const steps = [
  { icon: Target,          title: 'Clarify goals',   desc: 'We align on the outcomes that matter.' },
  { icon: ArrowLeftRight,  title: 'Map the path',    desc: 'You get a clear plan and next steps.' },
  { icon: Sparkles,        title: 'Build & deliver', desc: 'We build, iterate, and ship real results.' },
];

const GOAL_OPTIONS = [
  { value: '', label: 'Select a goal' },
  { value: 'Automate manual workflows',    label: 'Automate manual workflows' },
  { value: 'Build custom software',        label: 'Build custom software' },
  { value: 'Integrate AI into operations', label: 'Integrate AI into operations' },
  { value: 'Unify data & reporting',       label: 'Unify data & reporting' },
  { value: 'Improve CRM & operations',     label: 'Improve CRM & operations' },
  { value: 'Not sure yet — let\'s talk',   label: "Not sure yet — let's talk" },
];

const SMS_CONSENT_TEXT =
  'I agree to receive SMS/text messages from Squiretown Consulting, LLC. ' +
  'Message types include appointment confirmations, appointment reminders, follow-up messages, and customer care responses. ' +
  'Message frequency varies. Message and data rates may apply. ' +
  'Reply HELP for help. Reply STOP to cancel at any time. ' +
  'Consent is not a condition of purchase or service. ' +
  'See our SMS Terms (squiretown.co/sms-terms) and Privacy Policy (squiretown.co/privacy) for details.';

interface FieldErrors { name?: string; email?: string; phone?: string; }

const CTAForm: React.FC = () => {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', company: '', goal: '', smsConsent: false,
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validate = (): FieldErrors => {
    const e: FieldErrors = {};
    if (!form.name.trim()) e.name = 'Please enter your name.';
    if (!form.email.trim()) {
      e.email = 'Please enter a valid email.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = 'Please enter a valid email.';
    }
    if (form.smsConsent && !form.phone.trim()) e.phone = 'Phone is required for SMS opt-in.';
    return e;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, type } = e.target;
    const value = type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FieldErrors]) setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSubmitting(true);
    setSubmitError(null);
    try {
      // goal maps to `service` column (phone column exists)
      // sms_consent / sms_consent_at / sms_consent_text exist
      const { error } = await supabase.from('leads').insert([{
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        company: form.company.trim() || null,
        service: form.goal || null,       // goal → service column
        message: form.goal || 'Contact form submission',
        sms_consent: form.smsConsent,
        sms_consent_at: form.smsConsent ? new Date().toISOString() : null,
        sms_consent_text: form.smsConsent ? SMS_CONSENT_TEXT : null,
      }]);

      if (error) throw error;
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = (field?: string) =>
    `w-full font-sans text-[14px] text-navy-900 px-[13px] py-3 rounded-input border bg-paper outline-none transition-all duration-150 focus:border-blue-600 focus:bg-white focus:shadow-[0_0_0_3px_rgba(37,99,235,0.10)] ${
      field ? 'border-red-500' : 'border-line'
    }`;

  return (
    <section
      id="contact"
      style={{ background: 'linear-gradient(180deg,#0d1426,#0a0f1f)', color: '#fff' }}
      aria-labelledby="cta-heading"
    >
      <div className="w-full max-w-[1200px] mx-auto px-7">
        <div
          className="grid gap-14 py-[76px] items-start"
          style={{ gridTemplateColumns: '1fr 1.05fr' }}
        >
          {/* Left copy */}
          <div>
            <p
              className="text-[12px] font-semibold tracking-[0.14em] uppercase mb-3.5"
              style={{ color: '#7aa2ff' }}
            >
              Let's build together
            </p>
            <h2
              id="cta-heading"
              className="font-display font-extrabold leading-[1.06] tracking-tight"
              style={{ fontSize: 'clamp(30px,3.6vw,42px)' }}
            >
              Ready to build smarter systems?
            </h2>
            <p className="text-[16px] mt-4 max-w-[420px] leading-relaxed" style={{ color: '#cbd5e1' }}>
              Tell us about your goals and we'll map a plan to streamline, automate, and scale your business.
            </p>

            <div className="mt-[30px] flex flex-col gap-[18px]">
              {steps.map(step => {
                const Icon = step.icon;
                return (
                  <div key={step.title} className="flex gap-3.5 items-start">
                    <div
                      className="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(37,99,235,0.16)', color: '#7aa2ff' }}
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </div>
                    <div>
                      <h5 className="font-display font-bold text-[15px]">{step.title}</h5>
                      <p className="text-[13px] mt-0.5" style={{ color: '#94a3b8' }}>{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right form card */}
          <div
            className="bg-white rounded-[16px] p-7"
            style={{
              color: '#0a0f1f',
              boxShadow: '0 40px 80px -40px rgba(0,0,0,0.5)',
            }}
          >
            {submitted ? (
              <div className="text-center py-8">
                <div
                  className="w-[52px] h-[52px] rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: 'rgba(37,99,235,0.10)', color: '#2563eb' }}
                >
                  <CheckCircle className="h-7 w-7" />
                </div>
                <h3 className="font-display font-bold text-[19px] text-navy-900">Thanks — we've got it.</h3>
                <p className="text-[14px] text-ink-600 mt-2">
                  We'll review your goals and reach out within one business day.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <h3 className="font-display font-bold text-[18px] mb-1">Start a Conversation</h3>
                <p className="text-[13px] text-ink-600 mb-5">We usually reply within one business day.</p>

                {submitError && (
                  <div className="bg-red-50 border border-red-200 rounded-input p-3 mb-4 text-[13px] text-red-700">
                    {submitError}
                  </div>
                )}

                {/* Name */}
                <div className="mb-[15px]">
                  <label htmlFor="cta-name" className="block text-[13px] font-semibold mb-1.5">
                    Full name <span className="text-blue-600">*</span>
                  </label>
                  <input
                    id="cta-name"
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    autoComplete="name"
                    aria-required="true"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'err-name' : undefined}
                    className={inputClass(errors.name)}
                  />
                  {errors.name && <p id="err-name" className="text-[12px] text-red-600 mt-1" role="alert">{errors.name}</p>}
                </div>

                {/* Email + Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-[15px]">
                  <div>
                    <label htmlFor="cta-email" className="block text-[13px] font-semibold mb-1.5">
                      Work email <span className="text-blue-600">*</span>
                    </label>
                    <input
                      id="cta-email"
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@company.com"
                      autoComplete="email"
                      aria-required="true"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? 'err-email' : undefined}
                      className={inputClass(errors.email)}
                    />
                    {errors.email && <p id="err-email" className="text-[12px] text-red-600 mt-1" role="alert">{errors.email}</p>}
                  </div>
                  <div>
                    <label htmlFor="cta-phone" className="block text-[13px] font-semibold mb-1.5">
                      Phone{' '}
                      {form.smsConsent
                        ? <span className="text-blue-600">*</span>
                        : <span className="font-normal text-ink-500">(optional)</span>
                      }
                    </label>
                    <input
                      id="cta-phone"
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="(631) 555-0123"
                      autoComplete="tel"
                      aria-invalid={!!errors.phone}
                      aria-describedby={errors.phone ? 'err-phone' : undefined}
                      className={inputClass(errors.phone)}
                    />
                    {errors.phone && <p id="err-phone" className="text-[12px] text-red-600 mt-1" role="alert">{errors.phone}</p>}
                  </div>
                </div>

                {/* Company */}
                <div className="mb-[15px]">
                  <label htmlFor="cta-company" className="block text-[13px] font-semibold mb-1.5">Company</label>
                  <input
                    id="cta-company"
                    type="text"
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    placeholder="Your company"
                    autoComplete="organization"
                    className={inputClass()}
                  />
                </div>

                {/* Goal */}
                <div className="mb-[15px]">
                  <label htmlFor="cta-goal" className="block text-[13px] font-semibold mb-1.5">
                    What are you looking to achieve?
                  </label>
                  <select
                    id="cta-goal"
                    name="goal"
                    value={form.goal}
                    onChange={handleChange}
                    className={inputClass()}
                  >
                    {GOAL_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>

                {/* SMS Consent */}
                <div
                  className="rounded-input p-4 mb-4"
                  style={{ background: '#f7f9fc', border: '1px solid #e6ebf2' }}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="cta-sms"
                      name="smsConsent"
                      checked={form.smsConsent}
                      onChange={handleChange}
                      className="h-4 w-4 mt-0.5 flex-shrink-0 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <label htmlFor="cta-sms" className="text-[12px] text-ink-600 leading-relaxed cursor-pointer">
                      <span className="font-semibold">I agree to receive SMS/text messages from Squiretown Consulting, LLC.</span>{' '}
                      Message types include{' '}
                      <span className="font-semibold">appointment confirmations, reminders, follow-ups, and customer care.</span>{' '}
                      Message frequency varies. Data rates may apply. Reply{' '}
                      <span className="font-semibold">HELP</span> for help.{' '}
                      Reply <span className="font-semibold">STOP</span> to cancel.{' '}
                      <em>Consent is not a condition of service.</em>{' '}
                      See{' '}
                      <Link to="/sms-terms" className="text-blue-600 hover:text-blue-800 underline">SMS Terms</Link>{' '}
                      and{' '}
                      <Link to="/privacy" className="text-blue-600 hover:text-blue-800 underline">Privacy Policy</Link>.
                    </label>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 font-sans font-semibold text-[15px] text-white py-3 rounded-input disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
                  style={{ background: '#2563eb', boxShadow: '0 8px 24px -10px rgba(37,99,235,0.45)' }}
                >
                  {submitting ? 'Sending...' : 'Start a Conversation →'}
                </button>

                <p className="flex items-center gap-1.5 text-[12px] text-ink-500 mt-3.5">
                  <Lock className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
                  Your information is secure and never shared.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTAForm;
