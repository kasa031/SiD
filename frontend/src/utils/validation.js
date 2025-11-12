// Validation utilities
export const validateUsername = (username) => {
  if (!username || username.trim().length === 0) {
    return 'Brukernavn er påkrevd';
  }
  if (username.length < 3) {
    return 'Brukernavn må være minst 3 tegn';
  }
  if (username.length > 50) {
    return 'Brukernavn kan ikke være lengre enn 50 tegn';
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return 'Brukernavn kan kun inneholde bokstaver, tall og underscore';
  }
  return null;
};

export const validatePassword = (password) => {
  if (!password || password.length === 0) {
    return 'Passord er påkrevd';
  }
  if (password.length < 6) {
    return 'Passord må være minst 6 tegn';
  }
  return null;
};

export const validateEmail = (email) => {
  if (!email || email.trim().length === 0) {
    return null; // Email is optional
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Ugyldig e-postadresse';
  }
  return null;
};

export const validatePollTitle = (title) => {
  if (!title || title.trim().length === 0) {
    return 'Tittel er påkrevd';
  }
  if (title.length < 3) {
    return 'Tittel må være minst 3 tegn';
  }
  if (title.length > 255) {
    return 'Tittel kan ikke være lengre enn 255 tegn';
  }
  return null;
};

export const validateComment = (comment) => {
  if (!comment || comment.trim().length === 0) {
    return 'Kommentar kan ikke være tom';
  }
  if (comment.length > 1000) {
    return 'Kommentar kan ikke være lengre enn 1000 tegn';
  }
  return null;
};

export const validatePollDescription = (description) => {
  if (description && description.length > 2000) {
    return 'Beskrivelse kan ikke være lengre enn 2000 tegn';
  }
  return null;
};

export const validatePollOption = (option) => {
  if (!option || option.trim().length === 0) {
    return 'Alternativ kan ikke være tomt';
  }
  if (option.length > 255) {
    return 'Alternativ kan ikke være lengre enn 255 tegn';
  }
  return null;
};

export const validateLocationName = (locationName) => {
  if (locationName && locationName.length > 100) {
    return 'Stedsnavn kan ikke være lengre enn 100 tegn';
  }
  return null;
};

export const validatePoliticianName = (name) => {
  if (!name || name.trim().length === 0) {
    return 'Politikernavn er påkrevd';
  }
  if (name.length < 2) {
    return 'Politikernavn må være minst 2 tegn';
  }
  if (name.length > 100) {
    return 'Politikernavn kan ikke være lengre enn 100 tegn';
  }
  return null;
};

