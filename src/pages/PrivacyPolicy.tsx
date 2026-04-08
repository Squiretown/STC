import React from 'react';
import { Shield, Mail } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
            Privacy Policy
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Your privacy matters. Here's a plain-language explanation of what we collect and how we use it.
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 mb-8">
            <div className="flex items-start">
              <Shield className="h-8 w-8 text-blue-600 mr-4 mt-1 flex-shrink-0" aria-hidden="true" focusable="false" />
              <div>
                <h2 className="text-2xl font-semibold text-blue-800 mb-4">Our Commitment</h2>
                <p className="text-blue-700 leading-relaxed">
                  Squiretown Consulting, LLC, based in Hampton Bays, NY, respects your privacy.
                  We only collect the information we need to respond to your inquiries, and we
                  never sell your data to anyone.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Information We Collect</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                We only collect information you voluntarily provide through our contact form. That includes:
              </p>
              <ul className="space-y-2 text-slate-600 list-disc list-inside">
                <li>Your name</li>
                <li>Your email address</li>
                <li>Your phone number</li>
                <li>The message you send us</li>
              </ul>
              <p className="text-slate-600 leading-relaxed mt-4">
                We don't use tracking cookies to build advertising profiles, and we don't collect
                personal information from visitors who simply browse the site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">How We Use Your Information</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                The information you submit through our contact form is used for one purpose:
                responding to you. That might include answering your question, scheduling a call,
                or following up about a project. We won't add you to a marketing list without
                your permission.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Where Your Data Is Stored</h2>
              <p className="text-slate-600 leading-relaxed">
                Contact form submissions are stored in Supabase, a secure cloud database service.
                Access to this data is restricted to authorized Squiretown Consulting staff, and
                the connection is encrypted in transit.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">We Don't Sell Your Data</h2>
              <p className="text-slate-600 leading-relaxed">
                We do not sell, rent, or trade your personal information to third parties. Period.
                The only time we would share your information is if we are legally required to do
                so, such as in response to a valid subpoena, court order, or other lawful request.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Your Rights</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                You have the right to know what information we hold about you, and you can ask us
                to delete it at any time. If you'd like us to remove your information from our
                records, just send an email to the address below and we'll take care of it.
              </p>
            </section>

            <section className="bg-slate-50 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Contact Us About Privacy</h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                Questions about this policy, or want your data deleted? Reach out to us directly:
              </p>

              <div className="flex items-start space-x-4">
                <Mail className="h-6 w-6 text-blue-600 mt-1" aria-hidden="true" focusable="false" />
                <div>
                  <h3 className="font-semibold text-slate-800 mb-2">Email</h3>
                  <p className="text-slate-600 mb-2">
                    <a
                      href="mailto:info@squiretown.co"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      info@squiretown.co
                    </a>
                  </p>
                  <p className="text-sm text-slate-500">
                    We respond to privacy requests within 5 business days.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Changes to This Policy</h2>
              <p className="text-slate-600 leading-relaxed">
                If we make meaningful changes to this policy, we'll update the "Last Updated"
                date below and post the new version on this page. Continued use of the site after
                changes means you accept the updated policy.
              </p>
            </section>

            <div className="text-center pt-8 border-t border-slate-200">
              <p className="text-slate-500 text-sm">
                Last Updated: April 8, 2025
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrivacyPolicy;
