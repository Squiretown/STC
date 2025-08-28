import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, Zap, Cog, Database, CheckCircle, ArrowRight, Workflow, Brain } from 'lucide-react';
import ContactForm from '../components/ContactForm';

const AITechnology: React.FC = () => {
  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-cyan-900 to-blue-800 text-white py-24">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-8">
              <Bot className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-8">
              AI Technology Stack Building & Automation
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-4xl mx-auto">
              Harness the power of artificial intelligence to transform your business operations, 
              enhance decision-making, and drive innovation.
            </p>
            <Link
              to="/contact"
              className="bg-white text-blue-900 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-all duration-200 inline-flex items-center group"
            >
              Start Your AI Journey
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-800 mb-6">AI Solutions & Automation Services</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              From custom AI development to workflow automation, we create intelligent solutions 
              that streamline operations and unlock new possibilities for your business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Brain className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Custom AI Solutions</h3>
              <p className="text-slate-600">Develop tailored AI applications that solve your specific business challenges.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-cyan-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Workflow className="h-8 w-8 text-cyan-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Workflow Automation</h3>
              <p className="text-slate-600">Automate repetitive processes to increase efficiency and reduce costs.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Cog className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">System Integration</h3>
              <p className="text-slate-600">Seamlessly integrate AI tools with your existing business systems.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Database className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Data Analytics</h3>
              <p className="text-slate-600">Transform raw data into actionable insights with AI-powered analytics.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Services */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="lg:pr-12">
              <img
                src="https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg"
                alt="AI technology development"
                className="rounded-2xl shadow-lg w-full"
              />
            </div>

            <div>
              <h2 className="text-4xl font-bold text-slate-800 mb-8">Comprehensive AI Implementation</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">AI Strategy & Consulting</h3>
                    <p className="text-slate-600">
                      Develop comprehensive AI strategies aligned with your business objectives and identify 
                      the most impactful use cases for implementation.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">Machine Learning Models</h3>
                    <p className="text-slate-600">
                      Build and train custom machine learning models for predictive analytics, classification, 
                      and pattern recognition specific to your industry.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">Process Automation</h3>
                    <p className="text-slate-600">
                      Implement intelligent automation solutions that streamline workflows, reduce manual tasks, 
                      and improve operational efficiency across your organization.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">AI Tool Integration</h3>
                    <p className="text-slate-600">
                      Seamlessly integrate cutting-edge AI tools and platforms into your existing technology 
                      stack for enhanced productivity and capabilities.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-800 mb-6">Technologies We Work With</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              We leverage the latest AI technologies and platforms to deliver cutting-edge solutions 
              that drive real business value.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {[
              'OpenAI GPT',
              'TensorFlow',
              'PyTorch',
              'Langchain',
              'Hugging Face',
              'Azure AI',
              'AWS ML',
              'Google AI',
              'Anthropic',
              'Pinecone',
              'Weaviate',
              'MongoDB'
            ].map((tech) => (
              <div key={tech} className="text-center">
                <div className="bg-slate-100 rounded-xl p-6 hover:bg-blue-50 transition-colors duration-200">
                  <p className="font-semibold text-slate-700">{tech}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-800 mb-6">Our AI Implementation Process</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              We follow a structured approach to ensure successful AI implementation that delivers 
              measurable results for your business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Assessment</h3>
              <p className="text-slate-600">
                Analyze your current processes and identify AI opportunities.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Design</h3>
              <p className="text-slate-600">
                Create AI solution architecture and development roadmap.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Development</h3>
              <p className="text-slate-600">
                Build and train AI models tailored to your specific needs.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                4
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Integration</h3>
              <p className="text-slate-600">
                Deploy and integrate AI solutions into your existing systems.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                5
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Optimization</h3>
              <p className="text-slate-600">
                Monitor performance and continuously improve AI systems.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ContactForm 
            title="Ready to Embrace AI Innovation?"
            subtitle="Let's discuss how AI can transform your business operations and drive growth."
          />
        </div>
      </section>
    </div>
  );
};

export default AITechnology;