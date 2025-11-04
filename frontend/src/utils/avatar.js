// Utility function for avatar URLs
export const getAvatarUrl = (profilePictureUrl) => {
  if (profilePictureUrl) {
    return profilePictureUrl;
  }
  
  // Return a placeholder avatar using a data URI or external service
  // Using a simple SVG placeholder
  return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNTAiIGZpbGw9IiM2NjY2NjYiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjM1IiByPSIxNSIgZmlsbD0iI2ZmZmZmZiIvPjxwYXRoIGQ9Ik0yMCA3NUMxNSA4MCAyMCA4NSAzMCA4NUg3MEM4MCA4NSA4NSA4MCA4MCA3NUM3NSA2MCA1MCA1MCA1MCA1MEg1MEM1MCA1MCAyNSA2MCAyMCA3NVoiIGZpbGw9IiNmZmZmZmYiLz48L3N2Zz4=';
};

