import { config } from '../config.js';

export class Timer {
  constructor() {
    this.timerElement = document.getElementById('promoTimer');
    this.statusElement = document.getElementById('timerStatus');
    this.startDate = new Date(config.promo.start);
    this.endDate = new Date(config.promo.end);
    
    this.elements = {
      days: this.timerElement.querySelector('[data-timer="days"]'),
      hours: this.timerElement.querySelector('[data-timer="hours"]'),
      minutes: this.timerElement.querySelector('[data-timer="minutes"]'),
      seconds: this.timerElement.querySelector('[data-timer="seconds"]')
    };

    this.init();
  }

  init() {
    this.updateTimer();
    this.intervalId = setInterval(() => this.updateTimer(), 1000);
  }

  updateTimer() {
    const now = new Date();
    
    // Check if promo hasn't started yet
    if (now < this.startDate) {
      this.displayMessage('Акция скоро начнется');
      this.disableButtons();
      return;
    }

    // Check if promo has ended
    if (now > this.endDate) {
      this.displayEnded();
      this.disableButtons();
      clearInterval(this.intervalId);
      return;
    }

    // Calculate time remaining
    const timeRemaining = this.endDate - now;
    const time = this.calculateTime(timeRemaining);

    // Update display
    this.elements.days.textContent = this.padZero(time.days);
    this.elements.hours.textContent = this.padZero(time.hours);
    this.elements.minutes.textContent = this.padZero(time.minutes);
    this.elements.seconds.textContent = this.padZero(time.seconds);

    this.statusElement.textContent = '';
    this.statusElement.classList.remove('timer__status--ended');
  }

  calculateTime(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    return {
      days: days,
      hours: hours % 24,
      minutes: minutes % 60,
      seconds: seconds % 60
    };
  }

  padZero(num) {
    return num.toString().padStart(2, '0');
  }

  displayEnded() {
    this.elements.days.textContent = '00';
    this.elements.hours.textContent = '00';
    this.elements.minutes.textContent = '00';
    this.elements.seconds.textContent = '00';
    
    this.statusElement.textContent = 'Акция завершена';
    this.statusElement.classList.add('timer__status--ended');
  }

  displayMessage(message) {
    this.elements.days.textContent = '00';
    this.elements.hours.textContent = '00';
    this.elements.minutes.textContent = '00';
    this.elements.seconds.textContent = '00';
    
    this.statusElement.textContent = message;
  }

  disableButtons() {
    const buttons = document.querySelectorAll('[data-modal="appointment"], #getCouponBtn');
    buttons.forEach(btn => {
      btn.disabled = true;
      btn.classList.add('btn--disabled');
    });
  }

  isPromoActive() {
    const now = new Date();
    return now >= this.startDate && now <= this.endDate;
  }
}
