import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from '@/pages/LandingPage';
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';
import TextToImage from '@/pages/TextToImage';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import TermsOfUse from '@/pages/TermsOfUse';
import ToastConfig from '@/components/ToastConfig';

const App = () => (
  <Router>
    <ToastConfig position="top-left" duration={1500} />
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/editor" element={<Index />} />
      <Route path="/text-to-image" element={<TextToImage />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsOfUse />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Router>
);

export default App;
