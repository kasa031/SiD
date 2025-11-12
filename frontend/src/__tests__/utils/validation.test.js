import { describe, it, expect } from 'vitest';
import {
  validateUsername,
  validatePassword,
  validateEmail,
  validatePollTitle,
  validateComment,
  validatePollOption,
  validateLocationName,
  validatePoliticianName,
} from '../../utils/validation.js';

describe('Validation Utils', () => {
  describe('validateUsername', () => {
    it('skal godta gyldig brukernavn', () => {
      expect(validateUsername('testuser')).toBeNull();
      expect(validateUsername('user123')).toBeNull();
      expect(validateUsername('user_name')).toBeNull();
    });

    it('skal avvise tomt brukernavn', () => {
      expect(validateUsername('')).toContain('påkrevd');
      expect(validateUsername('   ')).toContain('påkrevd');
    });

    it('skal avvise for kort brukernavn', () => {
      expect(validateUsername('ab')).toContain('minst 3');
      expect(validateUsername('a')).toContain('minst 3');
    });

    it('skal avvise for langt brukernavn', () => {
      expect(validateUsername('a'.repeat(51))).toContain('lengre enn 50');
    });

    it('skal avvise ugyldige tegn', () => {
      expect(validateUsername('user@name')).toContain('kun inneholde');
      expect(validateUsername('user name')).toContain('kun inneholde');
    });
  });

  describe('validatePassword', () => {
    it('skal godta gyldig passord', () => {
      expect(validatePassword('password123')).toBeNull();
      expect(validatePassword('P@ssw0rd')).toBeNull();
    });

    it('skal avvise tomt passord', () => {
      expect(validatePassword('')).toContain('påkrevd');
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

    it('skal godta tom e-post (valgfritt)', () => {
      expect(validateEmail('')).toBeNull();
      expect(validateEmail(null)).toBeNull();
    });

    it('skal avvise ugyldig e-post', () => {
      expect(validateEmail('invalid-email')).toContain('Ugyldig');
      expect(validateEmail('test@')).toContain('Ugyldig');
      expect(validateEmail('@example.com')).toContain('Ugyldig');
    });
  });

  describe('validatePollTitle', () => {
    it('skal godta gyldig tittel', () => {
      expect(validatePollTitle('Hva synes du om dette?')).toBeNull();
      expect(validatePollTitle('Test poll')).toBeNull();
    });

    it('skal avvise tom tittel', () => {
      expect(validatePollTitle('')).toContain('påkrevd');
    });

    it('skal avvise for kort tittel', () => {
      expect(validatePollTitle('ab')).toContain('minst 3');
    });

    it('skal avvise for lang tittel', () => {
      expect(validatePollTitle('a'.repeat(256))).toContain('lengre enn 255');
    });
  });

  describe('validateComment', () => {
    it('skal godta gyldig kommentar', () => {
      expect(validateComment('Dette er en kommentar')).toBeNull();
    });

    it('skal avvise tom kommentar', () => {
      expect(validateComment('')).toContain('kan ikke være tom');
      expect(validateComment('   ')).toContain('kan ikke være tom');
    });

    it('skal avvise for lang kommentar', () => {
      expect(validateComment('a'.repeat(1001))).toContain('lengre enn 1000');
    });
  });

  describe('validatePollOption', () => {
    it('skal godta gyldig alternativ', () => {
      expect(validatePollOption('Alternativ 1')).toBeNull();
    });

    it('skal avvise tomt alternativ', () => {
      expect(validatePollOption('')).toContain('kan ikke være tomt');
    });

    it('skal avvise for langt alternativ', () => {
      expect(validatePollOption('a'.repeat(256))).toContain('lengre enn 255');
    });
  });

  describe('validateLocationName', () => {
    it('skal godta gyldig stedsnavn', () => {
      expect(validateLocationName('Oslo')).toBeNull();
      expect(validateLocationName('Bergen')).toBeNull();
    });

    it('skal godta tomt stedsnavn (valgfritt)', () => {
      expect(validateLocationName('')).toBeNull();
      expect(validateLocationName(null)).toBeNull();
    });

    it('skal avvise for langt navn', () => {
      expect(validateLocationName('a'.repeat(101))).toContain('lengre enn 100');
    });
  });

  describe('validatePoliticianName', () => {
    it('skal godta gyldig politikernavn', () => {
      expect(validatePoliticianName('Ola Nordmann')).toBeNull();
    });

    it('skal avvise tomt navn', () => {
      expect(validatePoliticianName('')).toContain('påkrevd');
    });

    it('skal avvise for kort navn', () => {
      expect(validatePoliticianName('A')).toContain('minst 2');
    });

    it('skal avvise for langt navn', () => {
      expect(validatePoliticianName('a'.repeat(101))).toContain('lengre enn 100');
    });
  });
});

