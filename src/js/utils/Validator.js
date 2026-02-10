export class Validator {
  isRequired(value) {
    return value !== null && value !== undefined && value.trim() !== '';
  }

  isEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  isPhone(phone) {
    // Remove all non-digits
    const digits = phone.replace(/\D/g, '');
    // Check if it's a valid Russian phone number (11 digits starting with 7)
    return digits.length === 11 && digits[0] === '7';
  }

  isName(name) {
    // Only letters (Cyrillic and Latin), spaces, and hyphens
    const regex = /^[а-яА-ЯёЁa-zA-Z\s-]+$/;
    return regex.test(name);
  }

  minLength(value, min) {
    return value.length >= min;
  }

  maxLength(value, max) {
    return value.length <= max;
  }
}
