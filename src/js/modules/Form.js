import { Toast } from '../utils/Toast.js';
import { Validator } from '../utils/Validator.js';

export class Form {
  constructor(formId, modal) {
    this.form = document.getElementById(formId);
    this.modal = modal;
    this.validator = new Validator();
    
    this.init();
  }

  init() {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    
    // Phone mask
    const phoneInput = this.form.querySelector('#phone');
    phoneInput.addEventListener('input', (e) => this.formatPhone(e));
    
    // Real-time validation
    const inputs = this.form.querySelectorAll('.form__input');
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearError(input));
    });
  }

  async handleSubmit(e) {
    e.preventDefault();
    
    // Clear all errors
    this.clearAllErrors();
    
    // Validate all fields
    const formData = new FormData(this.form);
    const data = Object.fromEntries(formData);
    
    let isValid = true;
    
    // Validate lastName
    if (!this.validator.isRequired(data.lastName)) {
      this.showError('lastName', 'Фамилия обязательна для заполнения');
      isValid = false;
    } else if (!this.validator.isName(data.lastName)) {
      this.showError('lastName', 'Фамилия может содержать только буквы');
      isValid = false;
    }
    
    // Validate firstName
    if (!this.validator.isRequired(data.firstName)) {
      this.showError('firstName', 'Имя обязательно для заполнения');
      isValid = false;
    } else if (!this.validator.isName(data.firstName)) {
      this.showError('firstName', 'Имя может содержать только буквы');
      isValid = false;
    }
    
    // Validate middleName (optional)
    if (data.middleName && !this.validator.isName(data.middleName)) {
      this.showError('middleName', 'Отчество может содержать только буквы');
      isValid = false;
    }
    
    // Validate phone
    if (!this.validator.isRequired(data.phone)) {
      this.showError('phone', 'Телефон обязателен для заполнения');
      isValid = false;
    } else if (!this.validator.isPhone(data.phone)) {
      this.showError('phone', 'Введите корректный номер телефона');
      isValid = false;
    }
    
    // Validate email
    if (!this.validator.isRequired(data.email)) {
      this.showError('email', 'Email обязателен для заполнения');
      isValid = false;
    } else if (!this.validator.isEmail(data.email)) {
      this.showError('email', 'Введите корректный email');
      isValid = false;
    }
    
    if (!isValid) {
      return;
    }
    
    // Simulate sending
    await this.submitForm(data);
  }

  async submitForm(data) {
    try {
      // Show loading state
      const submitBtn = this.form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Отправка...';
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save to localStorage
      const submissions = JSON.parse(localStorage.getItem('appointments') || '[]');
      submissions.push({
        ...data,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('appointments', JSON.stringify(submissions));
      
      // Success
      Toast.show('Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.', 'success');
      this.form.reset();
      this.modal.close();
      
      // Restore button
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    } catch (error) {
      Toast.show('Произошла ошибка при отправке заявки', 'error');
      console.error('Form submission error:', error);
    }
  }

  validateField(input) {
    const value = input.value.trim();
    const name = input.name;
    
    this.clearError(name);
    
    if (input.required && !this.validator.isRequired(value)) {
      this.showError(name, 'Это поле обязательно для заполнения');
      return false;
    }
    
    if (name === 'email' && value && !this.validator.isEmail(value)) {
      this.showError(name, 'Введите корректный email');
      return false;
    }
    
    if (name === 'phone' && value && !this.validator.isPhone(value)) {
      this.showError(name, 'Введите корректный номер телефона');
      return false;
    }
    
    if ((name === 'firstName' || name === 'lastName' || name === 'middleName') && value && !this.validator.isName(value)) {
      this.showError(name, 'Поле может содержать только буквы');
      return false;
    }
    
    return true;
  }

  showError(fieldName, message) {
    const input = this.form.querySelector(`[name="${fieldName}"]`);
    const formGroup = input.closest('.form__group');
    const errorElement = formGroup.querySelector('.form__error');
    
    input.classList.add('form__input--error');
    errorElement.textContent = message;
    errorElement.classList.add('form__error--visible');
  }

  clearError(fieldNameOrInput) {
    let input;
    if (typeof fieldNameOrInput === 'string') {
      input = this.form.querySelector(`[name="${fieldNameOrInput}"]`);
    } else {
      input = fieldNameOrInput;
    }
    
    const formGroup = input.closest('.form__group');
    const errorElement = formGroup.querySelector('.form__error');
    
    input.classList.remove('form__input--error');
    errorElement.textContent = '';
    errorElement.classList.remove('form__error--visible');
  }

  clearAllErrors() {
    const inputs = this.form.querySelectorAll('.form__input');
    inputs.forEach(input => this.clearError(input));
  }

  formatPhone(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length > 0) {
      if (value[0] === '8') {
        value = '7' + value.slice(1);
      }
      
      let formatted = '+7';
      
      if (value.length > 1) {
        formatted += ' (' + value.substring(1, 4);
      }
      if (value.length >= 5) {
        formatted += ') ' + value.substring(4, 7);
      }
      if (value.length >= 8) {
        formatted += '-' + value.substring(7, 9);
      }
      if (value.length >= 10) {
        formatted += '-' + value.substring(9, 11);
      }
      
      e.target.value = formatted;
    }
  }
}
