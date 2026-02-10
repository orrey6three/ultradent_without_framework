import '../styles/main.scss';
import { Timer } from './modules/Timer.js';
import { Modal } from './modules/Modal.js';
import { Form } from './modules/Form.js';
import { Slider } from './modules/Slider.js';
import { Quiz } from './modules/Quiz.js';
import { Coupons } from './modules/Coupons.js';
import { Toast } from './utils/Toast.js';
import { MobileMenu } from './modules/MobileMenu.js';

class App {
  constructor() {
    this.init();
  }

  init() {
    // Initialize timer
    this.timer = new Timer();

    // Initialize modals
    this.appointmentModal = new Modal('appointmentModal');
    this.quizModal = new Modal('quizModal');

    // Initialize appointment form
    this.appointmentForm = new Form('appointmentForm', this.appointmentModal);

    // Initialize quiz
    this.quiz = new Quiz('quiz', this.quizModal);

    // Initialize coupons
    this.coupons = new Coupons(this.quiz, this.quizModal);

    // Initialize reviews slider
    this.initReviewsSlider();

    // Initialize mobile menu
    this.mobileMenu = new MobileMenu();

    // Setup modal triggers
    this.setupModalTriggers();

    // Smooth scroll
    this.initSmoothScroll();
  }

  setupModalTriggers() {
    const appointmentBtns = document.querySelectorAll('[data-modal="appointment"]');
    appointmentBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.appointmentModal.open();
      });
    });
  }

  async initReviewsSlider() {
    try {
      const response = await fetch('https://raw.githubusercontent.com/axelwarn2/frontend-test-data/refs/heads/main/reviews.json');
      const reviews = await response.json();
      
      const sliderTrack = document.querySelector('.slider__track');
      
      reviews.forEach(review => {
        const slide = document.createElement('div');
        slide.className = 'slider__slide';
        slide.innerHTML = `
          <div class="review-card">
            <div class="review-card__header">
              <div class="review-card__avatar">
                ${review.name.charAt(0)}
              </div>
              <div class="review-card__info">
                <h3 class="review-card__name">${review.name}</h3>
                <div class="review-card__rating">
                  ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}
                </div>
              </div>
            </div>
            <p class="review-card__text">${review.text}</p>
            <span class="review-card__date">${this.formatDate(review.date)}</span>
          </div>
        `;
        sliderTrack.appendChild(slide);
      });

      this.slider = new Slider('reviewsSlider');
    } catch (error) {
      console.error('Error loading reviews:', error);
      Toast.show('Ошибка загрузки отзывов', 'error');
    }
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('ru-RU', options);
  }

  initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          // Close mobile menu if open
          if (this.mobileMenu) {
            this.mobileMenu.close();
          }
        }
      });
    });
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new App();
});
