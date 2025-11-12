// Share utility functions

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      // Use modern Clipboard API
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        textArea.remove();
        return true;
      } catch (err) {
        textArea.remove();
        return false;
      }
    }
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
};

/**
 * Get share URL for poll
 */
export const getPollShareUrl = (pollId) => {
  const baseUrl = import.meta.env.PROD 
    ? 'https://kasa031.github.io/SiD' 
    : window.location.origin;
  return `${baseUrl}/poll/${pollId}`;
};

/**
 * Share poll via Web Share API (mobile)
 */
export const sharePoll = async (pollId, pollTitle) => {
  const shareUrl = getPollShareUrl(pollId);
  const shareText = `Sjekk ut denne poll: ${pollTitle}`;

  // Check if Web Share API is available (mobile browsers)
  if (navigator.share) {
    try {
      await navigator.share({
        title: pollTitle,
        text: shareText,
        url: shareUrl,
      });
      return true;
    } catch (err) {
      // User cancelled or error occurred
      if (err.name !== 'AbortError') {
        console.error('Share failed:', err);
      }
      return false;
    }
  }
  return false;
};

/**
 * Copy poll link to clipboard
 */
export const copyPollLink = async (pollId, pollTitle) => {
  const shareUrl = getPollShareUrl(pollId);
  const success = await copyToClipboard(shareUrl);
  
  if (success) {
    window.showToast?.('Lenke kopiert til utklippstavle!', 'success');
    return true;
  } else {
    window.showToast?.('Kunne ikke kopiere lenke. Prøv manuelt.', 'error');
    return false;
  }
};

/**
 * Share poll (tries Web Share API first, falls back to clipboard)
 */
export const sharePollWithFallback = async (pollId, pollTitle) => {
  // Try Web Share API first (mobile)
  const shared = await sharePoll(pollId, pollTitle);
  
  if (!shared) {
    // Fallback to clipboard copy
    await copyPollLink(pollId, pollTitle);
  }
};

