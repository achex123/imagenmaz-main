import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
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

          <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
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
            At Imagen.ma, we respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you use our service.
          </p>

          <h2>Information We Collect</h2>
          <p>
            <strong>Images and Text Prompts:</strong> When you use our AI image editing or generation services, we temporarily process the images you upload and the text prompts you provide to deliver the requested service.
          </p>
          <p>
            <strong>Usage Data:</strong> We collect basic analytics data, such as the number of edits or images generated, which is stored locally in your browser using localStorage.
          </p>

          <h2>How We Use Google Gemini API</h2>
          <p>
            Our service leverages Google's Gemini API to power our AI image editing and generation features. When you use these features:
          </p>
          <ul>
            <li>Your requests are sent directly to Google's Gemini API from your browser</li>
            <li>We do not store your images or prompts on any server</li>
            <li>Your API key, if provided, is used solely to authenticate requests to Google's services</li>
          </ul>

          <h2>Data Security</h2>
          <p>
            Imagen.ma is designed with a client-side architecture, meaning:
          </p>
          <ul>
            <li>Your images are processed directly in your browser</li>
            <li>We do not maintain a central database of user content</li>
            <li>Your data is not shared with third parties except as necessary to provide the service (i.e., Google Gemini API)</li>
          </ul>

          <h2>Cookies and Local Storage</h2>
          <p>
            We use browser local storage to:
          </p>
          <ul>
            <li>Remember your usage statistics (number of edits/generations)</li>
            <li>Improve your user experience by maintaining session state</li>
          </ul>

          <h2>Your Rights</h2>
          <p>
            You have the right to:
          </p>
          <ul>
            <li>Access and clear the data stored in your browser's local storage</li>
            <li>Use our service without providing personally identifiable information</li>
          </ul>

          <h2>Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at privacy@imagen.ma.
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

export default PrivacyPolicy;
