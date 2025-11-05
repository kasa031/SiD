// Input validation utilities

export const validateUsername = (username) => {
  if (!username || typeof username !== 'string') {
    return 'Brukernavn må være en tekst';
  }
  
  const trimmed = username.trim();
  
  if (trimmed.length < 3) {
    return 'Brukernavn må være minst 3 tegn';
  }
  
  if (trimmed.length > 50) {
    return 'Brukernavn kan ikke være lengre enn 50 tegn';
  }
  
  // Only allow alphanumeric and underscore
  if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) {
    return 'Brukernavn kan kun inneholde bokstaver, tall og underscore';
  }
  
  return null;
};

export const validatePassword = (password) => {
  if (!password || typeof password !== 'string') {
    return 'Passord må være en tekst';
  }
  
  if (password.length < 8) {
    return 'Passord må være minst 8 tegn';
  }
  
  if (password.length > 128) {
    return 'Passord kan ikke være lengre enn 128 tegn';
  }
  
  // Check for at least one number and one letter
  if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(password)) {
    return 'Passord må inneholde minst én bokstav og ett tall';
  }
  
  return null;
};

export const validateEmail = (email) => {
  if (!email || email.trim().length === 0) {
    return null; // Email is optional
  }
  
  if (typeof email !== 'string') {
    return 'E-post må være en tekst';
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return 'Ugyldig e-postadresse';
  }
  
  if (email.length > 255) {
    return 'E-post kan ikke være lengre enn 255 tegn';
  }
  
  return null;
};

export const validatePollTitle = (title) => {
  if (!title || typeof title !== 'string') {
    return 'Tittel må være en tekst';
  }
  
  const trimmed = title.trim();
  
  if (trimmed.length < 3) {
    return 'Tittel må være minst 3 tegn';
  }
  
  if (trimmed.length > 255) {
    return 'Tittel kan ikke være lengre enn 255 tegn';
  }
  
  return null;
};

export const validateComment = (comment) => {
  if (!comment || typeof comment !== 'string') {
    return 'Kommentar må være en tekst';
  }
  
  const trimmed = comment.trim();
  
  if (trimmed.length === 0) {
    return 'Kommentar kan ikke være tom';
  }
  
  if (trimmed.length > 2000) {
    return 'Kommentar kan ikke være lengre enn 2000 tegn';
  }
  
  return null;
};

export const validateLocationName = (locationName) => {
  if (!locationName || typeof locationName !== 'string') {
    return 'Bynavn må være en tekst';
  }
  
  const trimmed = locationName.trim();
  
  if (trimmed.length < 2) {
    return 'Bynavn må være minst 2 tegn';
  }
  
  if (trimmed.length > 100) {
    return 'Bynavn kan ikke være lengre enn 100 tegn';
  }
  
  // Only allow letters, spaces, and hyphens
  if (!/^[a-zA-ZæøåÆØÅ\s-]+$/.test(trimmed)) {
    return 'Bynavn kan kun inneholde bokstaver, mellomrom og bindestrek';
  }
  
  return null;
};

export const sanitizeString = (str) => {
  if (typeof str !== 'string') {
    return '';
  }
  
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .trim();
};

