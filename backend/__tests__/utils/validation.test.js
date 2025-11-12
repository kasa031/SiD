import {
  validateUsername,
  validatePassword,
  validateEmail,
  validatePollTitle,
  validateLocationName,
  sanitizeString,
} from '../../src/utils/validation.js';

describe('Validation Utils', () => {
  describe('validateUsername', () => {
    it('skal godta gyldig brukernavn', () => {
      expect(validateUsername('testuser')).toBeNull();
      expect(validateUsername('user123')).toBeNull();
      expect(validateUsername('user_name')).toBeNull();
    });

    it('skal avvise for kort brukernavn', () => {
      expect(validateUsername('ab')).toContain('minst 3');
      expect(validateUsername('a')).toContain('minst 3');
    });

    it('skal avvise for langt brukernavn', () => {
      expect(validateUsername('a'.repeat(21))).toContain('maks 20');
    });

    it('skal avvise ugyldige tegn', () => {
      expect(validateUsername('user@name')).toContain('kun bokstaver');
      expect(validateUsername('user name')).toContain('kun bokstaver');
    });
  });

  describe('validatePassword', () => {
    it('skal godta gyldig passord', () => {
      expect(validatePassword('password123')).toBeNull();
      expect(validatePassword('P@ssw0rd')).toBeNull();
    });

    it('skal avvise for kort passord', () => {
      expect(validatePassword('12345')).toContain('minst 6');
      expect(validatePassword('pass')).toContain('minst 6');
    });
  });

  describe('validateEmail', () => {
    it('skal godta gyldig e-post', () => {
      expect(validateEmail('test@example.com')).toBeNull();
      expect(validateEmail('user.name@domain.co.uk')).toBeNull();
    });

    it('skal avvise ugyldig e-post', () => {
      expect(validateEmail('invalid-email')).toContain('gyldig');
      expect(validateEmail('test@')).toContain('gyldig');
      expect(validateEmail('@example.com')).toContain('gyldig');
    });

    it('skal godta null/undefined e-post', () => {
      expect(validateEmail(null)).toBeNull();
      expect(validateEmail(undefined)).toBeNull();
      expect(validateEmail('')).toBeNull();
    });
  });

  describe('validatePollTitle', () => {
    it('skal godta gyldig tittel', () => {
      expect(validatePollTitle('Hva synes du om dette?')).toBeNull();
      expect(validatePollTitle('Test poll')).toBeNull();
    });

    it('skal avvise for kort tittel', () => {
      expect(validatePollTitle('ab')).toContain('minst 3');
    });

    it('skal avvise for lang tittel', () => {
      expect(validatePollTitle('a'.repeat(201))).toContain('maks 200');
    });
  });

  describe('validateLocationName', () => {
    it('skal godta gyldig lokasjonsnavn', () => {
      expect(validateLocationName('Oslo')).toBeNull();
      expect(validateLocationName('Bergen')).toBeNull();
    });

    it('skal avvise for langt navn', () => {
      expect(validateLocationName('a'.repeat(101))).toContain('maks 100');
    });
  });

  describe('sanitizeString', () => {
    it('skal fjerne HTML tags', () => {
      expect(sanitizeString('<script>alert("xss")</script>')).toBe('alert("xss")');
      expect(sanitizeString('<div>test</div>')).toBe('test');
    });

    it('skal trimme whitespace', () => {
      expect(sanitizeString('  test  ')).toBe('test');
    });

    it('skal håndtere null/undefined', () => {
      expect(sanitizeString(null)).toBe('');
      expect(sanitizeString(undefined)).toBe('');
    });
  });
});

