import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const TermsOfUse = () => {
  return (
    <div className="min-h-screen flex flex-col items-center py-6 sm:py-12 px-4 sm:px-6 lg:px-8 font-sans bg-gradient-to-b from-blue-50/50 to-white">
      <div className="max-w-3xl w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link 
            to="/" 
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors mb-6"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Home
          </Link>

          <h1 className="text-3xl font-bold mb-2">Terms of Use</h1>
          <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="prose max-w-none"
        >
          <p>
            Welcome to Imagen.ma. By accessing or using our service, you agree to be bound by these Terms of Use.
          </p>

          <h2>Service Description</h2>
          <p>
            Imagen.ma provides AI-powered image editing and generation services. Our platform uses Google's Gemini API to process your requests directly from your browser.
          </p>

          <h2>User Responsibilities</h2>
          <p>
            When using Imagen.ma, you agree to:
          </p>
          <ul>
            <li>Only upload content that you have the right to use</li>
            <li>Not use our service for creating illegal, harmful, or inappropriate content</li>
            <li>Not attempt to reverse-engineer our service or bypass any security measures</li>
            <li>Not use the service to infringe on any third-party intellectual property rights</li>
          </ul>

          <h2>API Usage</h2>
          <p>
            Our service connects directly to Google's Gemini API from your browser. By using Imagen.ma, you also agree to:
          </p>
          <ul>
            <li>Google's own terms of service for their Gemini API</li>
            <li>Use API keys responsibly and in accordance with Google's usage policies</li>
            <li>Not exceed reasonable usage limits of the service</li>
          </ul>

          <h2>Intellectual Property</h2>
          <p>
            <strong>Your Content:</strong> You retain all rights to the images you upload. We do not claim ownership of your content.
          </p>
          <p>
            <strong>Generated Content:</strong> The ownership of AI-generated images may be subject to Google's Gemini API terms. We encourage you to review Google's policies regarding AI-generated content.
          </p>
          <p>
            <strong>Our Service:</strong> The Imagen.ma platform, including its design, code, and features, is protected by copyright and other intellectual property laws.
          </p>

          <h2>Limitation of Liability</h2>
          <p>
            Imagen.ma is provided "as is" without warranties of any kind. We do not guarantee that:
          </p>
          <ul>
            <li>The service will meet your specific requirements</li>
            <li>The service will be uninterrupted, timely, or error-free</li>
            <li>Results from using the service will be accurate or reliable</li>
          </ul>
          <p>
            We are not liable for any damages arising from your use of, or inability to use, our service.
          </p>

          <h2>Service Modifications</h2>
          <p>
            We reserve the right to:
          </p>
          <ul>
            <li>Modify or discontinue any part of our service at any time</li>
            <li>Update these Terms of Use without prior notice</li>
          </ul>

          <h2>Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Imagen.ma operates, without regard to its conflict of law provisions.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at terms@imagen.ma.
          </p>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 text-center text-xs text-gray-500"
        >
          <p>© {new Date().getFullYear()} Imagen.ma - AI Image Generation & Editing</p>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsOfUse;
