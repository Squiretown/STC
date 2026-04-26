import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Mail } from 'lucide-react';

const SmsTerms: React.FC = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
            SMS Terms &amp; Program Details
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Everything you need to know about our text messaging program, how to opt in, and how to stop messages at any time.
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 mb-8">
            <div className="flex items-start">
              <MessageSquare className="h-8 w-8 text-blue-600 mr-4 mt-1 flex-shrink-0" aria-hidden="true" focusable="false" />
              <div>
                <h2 className="text-2xl font-semibold text-blue-800 mb-4">Program Overview</h2>
                <p className="text-blue-700 leading-relaxed">
                  Squiretown Consulting, LLC operates an opt-in SMS messaging program solely for
                  the purpose of communicating with clients and prospective clients who have
                  expressly requested contact. To start a conversation, visit{' '}
                  <Link to="/contact" className="text-blue-800 underline hover:text-blue-600">
                    squiretown.co/contact
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">How to Opt In</h2>
              <p className="text-slate-600 leading-relaxed">
                SMS/text message consent is collected through the contact form on our website.
                The consent checkbox is <strong>unchecked by default</strong> — you must
                affirmatively check it to opt in. Pre-checked boxes are never used. By checking
                the box and submitting the form, you provide written consent to receive SMS/text
                messages as described below.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Message Types and Purposes</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                When you opt in, you may receive the following types of SMS/text messages from
                Squiretown Consulting, LLC:
              </p>
              <ul className="space-y-2 text-slate-600 list-disc list-inside">
                <li>Appointment confirmations</li>
                <li>Appointment reminders</li>
                <li>Follow-up messages related to your inquiry</li>
                <li>Customer care responses</li>
              </ul>
              <p className="text-slate-600 leading-relaxed mt-4">
                <strong>We do not send marketing, promotional, or advertising text messages.</strong>{' '}
                All messages are transactional or service-related and directly tied to your
                engagement with Squiretown Consulting, LLC.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Message Frequency</h2>
              <p className="text-slate-600 leading-relaxed">
                Message frequency varies based on your level of engagement with our team.
                Typically, you will receive fewer than 5 messages per inquiry. We will never
                send unsolicited messages.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Message and Data Rates</h2>
              <p className="text-slate-600 leading-relaxed">
                Standard message and data rates may apply depending on your mobile carrier plan.
                Squiretown Consulting, LLC does not charge any additional fee for SMS messages.
                Contact your mobile carrier for details about your plan's messaging rates.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">How to Get Help</h2>
              <p className="text-slate-600 leading-relaxed">
                At any time, you may reply <strong>HELP</strong> to any SMS/text message you
                receive from us to get assistance. You may also contact us directly by email at{' '}
                <a
                  href="mailto:info@squiretown.co"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  info@squiretown.co
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">How to Cancel</h2>
              <p className="text-slate-600 leading-relaxed">
                You may opt out of SMS/text messages at any time by replying{' '}
                <strong>STOP</strong> to any message you receive from us. After sending STOP,
                you will receive one final confirmation message acknowledging your opt-out, and
                no further messages will be sent to your number.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Consent Is Not Required</h2>
              <p className="text-slate-600 leading-relaxed">
                Opting in to SMS/text messages is entirely voluntary.{' '}
                <strong>
                  Consent to receive SMS/text messages is not a condition of purchasing any
                  product or service from Squiretown Consulting, LLC.
                </strong>{' '}
                You may contact us by email or phone without opting in to text messages.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Supported Carriers</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Our SMS program is supported by major U.S. carriers including but not limited to:
              </p>
              <ul className="space-y-2 text-slate-600 list-disc list-inside">
                <li>AT&amp;T</li>
                <li>Verizon</li>
                <li>T-Mobile</li>
                <li>US Cellular</li>
                <li>Other regional and national carriers</li>
              </ul>
              <p className="text-slate-600 leading-relaxed mt-4">
                Carriers are not liable for delayed or undelivered messages. Message delivery
                is subject to effective transmission from your carrier.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Privacy</h2>
              <p className="text-slate-600 leading-relaxed">
                Your phone number and SMS consent record are stored securely and are never
                sold, rented, or shared with third parties for marketing purposes. For complete
                details on how we handle your personal information, please review our{' '}
                <Link to="/privacy" className="text-blue-600 hover:text-blue-800 underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </section>

            <section className="bg-slate-50 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Questions</h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                If you have any questions about our SMS program or these terms, please contact
                us directly:
              </p>
              <div className="flex items-start space-x-4">
                <Mail className="h-6 w-6 text-blue-600 mt-1" aria-hidden="true" focusable="false" />
                <div>
                  <h3 className="font-semibold text-slate-800 mb-2">Email</h3>
                  <a
                    href="mailto:info@squiretown.co"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    info@squiretown.co
                  </a>
                  <p className="text-sm text-slate-500 mt-1">
                    We respond to all inquiries within 2 business days.
                  </p>
                </div>
              </div>
            </section>

            <div className="text-center pt-8 border-t border-slate-200">
              <p className="text-slate-500 text-sm">
                Last Updated: April 26, 2026
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SmsTerms;
