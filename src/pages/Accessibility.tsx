import React from 'react';
import { CheckCircle, Mail } from 'lucide-react';

const Accessibility: React.FC = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
            Accessibility Statement
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Squiretown Consulting is committed to ensuring digital accessibility for people with disabilities.
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 mb-8">
            <div className="flex items-start">
              <CheckCircle className="h-8 w-8 text-blue-600 mr-4 mt-1 flex-shrink-0" aria-hidden="true" focusable="false" />
              <div>
                <h2 className="text-2xl font-semibold text-blue-800 mb-4">Our Commitment</h2>
                <p className="text-blue-700 leading-relaxed">
                  We are committed to making our website accessible to all users, including those with disabilities. 
                  We believe that everyone should have equal access to information and functionality.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Accessibility Standards</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                We strive to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards. 
                These guidelines help make web content more accessible to people with a wide range of disabilities, including:
              </p>
              <ul className="space-y-2 text-slate-600 list-none">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" aria-hidden="true" focusable="false" />
                  Visual impairments and blindness
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" aria-hidden="true" focusable="false" />
                  Hearing impairments and deafness
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" aria-hidden="true" focusable="false" />
                  Motor impairments and mobility limitations
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" aria-hidden="true" focusable="false" />
                  Cognitive and learning disabilities
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Accessibility Features</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Our website includes the following accessibility features:
              </p>
              <ul className="space-y-2 text-slate-600 list-none">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" aria-hidden="true" focusable="false" />
                  Clear and consistent navigation structure
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" aria-hidden="true" focusable="false" />
                  Descriptive headings and page titles
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" aria-hidden="true" focusable="false" />
                  Alternative text for images and graphics
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" aria-hidden="true" focusable="false" />
                  Sufficient color contrast for text readability
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" aria-hidden="true" focusable="false" />
                  Keyboard navigation support
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" aria-hidden="true" focusable="false" />
                  Screen reader compatibility
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" aria-hidden="true" focusable="false" />
                  Proper form labels and error messages
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" aria-hidden="true" focusable="false" />
                  Skip navigation links
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Assistive Technology Support</h2>
              <p className="text-slate-600 leading-relaxed">
                Our website is designed to work with assistive technologies, including:
              </p>
              <ul className="mt-4 space-y-2 text-slate-600 list-none">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" aria-hidden="true" focusable="false" />
                  Screen readers (NVDA, JAWS, VoiceOver, TalkBack)
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" aria-hidden="true" focusable="false" />
                  Voice recognition software
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" aria-hidden="true" focusable="false" />
                  Keyboard-only navigation
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" aria-hidden="true" focusable="false" />
                  Browser zoom functionality up to 200%
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Ongoing Improvements</h2>
              <p className="text-slate-600 leading-relaxed">
                We continuously work to improve the accessibility of our website. Our efforts include:
              </p>
              <ul className="mt-4 space-y-2 text-slate-600 list-none">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" aria-hidden="true" focusable="false" />
                  Regular accessibility audits and testing
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" aria-hidden="true" focusable="false" />
                  Staff training on accessibility best practices
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" aria-hidden="true" focusable="false" />
                  Incorporating accessibility considerations in all new development
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" aria-hidden="true" focusable="false" />
                  User feedback integration for continuous improvement
                </li>
              </ul>
            </section>

            <section className="bg-slate-50 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Feedback and Contact</h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                We welcome your feedback on the accessibility of our website. If you encounter any barriers 
                or have suggestions for improvement, please don't hesitate to contact us:
              </p>
              
              <div className="flex items-start space-x-4">
                <Mail className="h-6 w-6 text-blue-600 mt-1" aria-hidden="true" focusable="false" />
                <div>
                  <h3 className="font-semibold text-slate-800 mb-2">Email</h3>
                  <p className="text-slate-600 mb-2">
                    <a 
                      href="mailto:accessibility@squiretown.co" 
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      accessibility@squiretown.co
                    </a>
                  </p>
                  <p className="text-sm text-slate-500">
                    We typically respond to accessibility feedback within 2 business days.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Third-Party Content</h2>
              <p className="text-slate-600 leading-relaxed">
                While we strive to ensure the accessibility of content we create and control, some third-party 
                content or embedded services may not be fully accessible. We work with our partners to improve 
                accessibility where possible and provide alternative access methods when needed.
              </p>
            </section>

            <div className="text-center pt-8 border-t border-slate-200">
              <p className="text-slate-500 text-sm">
                This accessibility statement was last updated on {new Date().toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Accessibility;