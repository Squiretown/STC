import React from 'react';
import { FileText, Mail } from 'lucide-react';

const TermsOfService: React.FC = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
            Terms of Service
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            The ground rules for using our website and working with us, written in plain English.
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 mb-8">
            <div className="flex items-start">
              <FileText className="h-8 w-8 text-blue-600 mr-4 mt-1 flex-shrink-0" aria-hidden="true" focusable="false" />
              <div>
                <h2 className="text-2xl font-semibold text-blue-800 mb-4">Welcome</h2>
                <p className="text-blue-700 leading-relaxed">
                  By using the Squiretown Consulting, LLC website or engaging our services, you
                  agree to the terms below. We've done our best to keep things short and clear.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">What We Do</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Squiretown Consulting provides business consulting services, including brand and
                marketing strategy, AI technology consulting, business funding advisory, and real
                estate title services. Our work is business consulting in nature.
              </p>
              <p className="text-slate-600 leading-relaxed">
                We are not attorneys, accountants, or licensed financial advisors. Nothing on this
                website or in our consulting engagements should be taken as legal advice, tax
                advice, investment advice, or financial planning advice. If you need advice in
                those areas, please consult a qualified professional.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Using This Website</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                You're welcome to browse our site, read our content, and contact us. In exchange,
                please don't:
              </p>
              <ul className="space-y-2 text-slate-600 list-disc list-inside">
                <li>Attempt to disrupt or damage the site</li>
                <li>Use automated tools to scrape or harvest content</li>
                <li>Submit false or misleading information through our forms</li>
                <li>Use the site for any unlawful purpose</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Intellectual Property</h2>
              <p className="text-slate-600 leading-relaxed">
                The content on this website, including text, graphics, logos, and images, is
                owned by Squiretown Consulting, LLC or used with permission. You're welcome to
                view and share the content for personal or informational purposes, but please
                don't copy, republish, or use it commercially without our written permission.
                The Squiretown Consulting name and logo are our trademarks.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Limitation of Liability</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                We work hard to provide accurate information and quality consulting services, but
                we can't guarantee specific outcomes. Business results depend on many factors
                outside our control.
              </p>
              <p className="text-slate-600 leading-relaxed">
                To the fullest extent allowed by law, Squiretown Consulting, LLC is not liable
                for any indirect, incidental, or consequential damages arising from your use of
                this website or our services. If you rely on information from our site or
                consulting engagements, you do so at your own discretion.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Right to Refuse Service</h2>
              <p className="text-slate-600 leading-relaxed">
                We reserve the right to refuse service, decline projects, or end engagements at
                our discretion. We're committed to working with clients whose goals and values
                align with ours.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Governing Law</h2>
              <p className="text-slate-600 leading-relaxed">
                These terms are governed by the laws of the State of New York, without regard to
                its conflict of law rules. Any disputes will be resolved in the state or federal
                courts located in New York.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Changes to These Terms</h2>
              <p className="text-slate-600 leading-relaxed">
                We may update these terms from time to time. When we do, we'll update the "Last
                Updated" date below. Continued use of the site after changes means you accept
                the updated terms.
              </p>
            </section>

            <section className="bg-slate-50 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Questions?</h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                If anything here is unclear, or if you have questions about our services, we're
                happy to help.
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
                </div>
              </div>
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

export default TermsOfService;
