// Google Analytics utility
// Bruk environment variable VITE_GA_MEASUREMENT_ID for å aktivere analytics
// I produksjon: Sett VITE_GA_MEASUREMENT_ID i GitHub Secrets eller build environment

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

// Initialize Google Analytics
export const initAnalytics = () => {
  if (!GA_MEASUREMENT_ID || import.meta.env.DEV) {
    // Ikke last analytics i development eller hvis ID ikke er satt
    console.log('Google Analytics ikke aktivert (development mode eller manglende ID)');
    return;
  }

  // Load Google Analytics script
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script1);

  // Initialize gtag
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID, {
    page_path: window.location.pathname,
  });

  console.log('Google Analytics initialisert');
};

// Track page views
export const trackPageView = (path) => {
  if (!GA_MEASUREMENT_ID || !window.gtag || import.meta.env.DEV) {
    return;
  }

  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: path,
  });
};

// Track events
export const trackEvent = (eventName, eventParams = {}) => {
  if (!GA_MEASUREMENT_ID || !window.gtag || import.meta.env.DEV) {
    return;
  }

  window.gtag('event', eventName, eventParams);
};

// Track poll creation
export const trackPollCreation = (pollId, category) => {
  trackEvent('poll_created', {
    poll_id: pollId,
    category: category,
  });
};

// Track vote
export const trackVote = (pollId, optionId) => {
  trackEvent('vote_cast', {
    poll_id: pollId,
    option_id: optionId,
  });
};

// Track comment
export const trackComment = (pollId) => {
  trackEvent('comment_added', {
    poll_id: pollId,
  });
};

// Track user registration
export const trackRegistration = () => {
  trackEvent('user_registered');
};

// Track user login
export const trackLogin = () => {
  trackEvent('user_logged_in');
};

