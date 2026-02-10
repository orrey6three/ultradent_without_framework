import { config } from '../config.js';
import { Toast } from '../utils/Toast.js';

export class Coupons {
  constructor(quiz, quizModal) {
    this.quiz = quiz;
    this.quizModal = quizModal;
    this.countElement = document.getElementById('couponsCount');
    this.getCouponBtn = document.getElementById('getCouponBtn');
    
    this.storageKey = 'coupons_remaining';
    this.userCouponKey = 'user_has_coupon';
    
    this.init();
  }

  init() {
    // Initialize coupons count from localStorage or config
    const savedCount = localStorage.getItem(this.storageKey);
    if (savedCount === null) {
      this.remainingCoupons = config.coupons.total;
      this.saveCouponsCount();
    } else {
      this.remainingCoupons = parseInt(savedCount, 10);
    }
    
    this.updateDisplay();
    this.checkUserCoupon();
    
    // Setup quiz completion handler
    this.quiz.onComplete = (answers) => this.handleQuizComplete(answers);
    
    // Setup get coupon button
    this.getCouponBtn.addEventListener('click', () => this.openQuiz());
  }

  openQuiz() {
    // Check if user already has coupon
    if (this.hasUserCoupon()) {
      Toast.show('Вы уже получили купон', 'info');
      return;
    }
    
    // Check if coupons are available
    if (this.remainingCoupons <= 0) {
      Toast.show('К сожалению, все купоны разобраны', 'error');
      return;
    }
    
    this.quiz.open();
  }

  handleQuizComplete(answers) {
    // Save quiz answers
    const quizData = {
      answers: answers,
      timestamp: new Date().toISOString()
    };
    
    const submissions = JSON.parse(localStorage.getItem('quiz_submissions') || '[]');
    submissions.push(quizData);
    localStorage.setItem('quiz_submissions', JSON.stringify(submissions));
    
    // Decrease coupons count
    this.remainingCoupons--;
    this.saveCouponsCount();
    
    // Mark user as having coupon
    this.markUserHasCoupon();
    
    // Update display
    this.updateDisplay();
    
    // Close quiz modal
    this.quizModal.close();
    
    // Show success message
    Toast.show('Поздравляем! Вы получили купон на скидку 20%', 'success');
    
    // Disable button
    this.disableButton();
  }

  saveCouponsCount() {
    localStorage.setItem(this.storageKey, this.remainingCoupons.toString());
  }

  updateDisplay() {
    this.countElement.textContent = this.remainingCoupons;
    
    // Highlight when running low
    if (this.remainingCoupons <= 5 && this.remainingCoupons > 0) {
      this.countElement.classList.add('coupons__count--low');
    } else if (this.remainingCoupons === 0) {
      this.countElement.classList.add('coupons__count--empty');
    } else {
      this.countElement.classList.remove('coupons__count--low', 'coupons__count--empty');
    }
  }

  hasUserCoupon() {
    return localStorage.getItem(this.userCouponKey) === 'true';
  }

  markUserHasCoupon() {
    localStorage.setItem(this.userCouponKey, 'true');
  }

  checkUserCoupon() {
    if (this.hasUserCoupon()) {
      this.disableButton();
    }
  }

  disableButton() {
    this.getCouponBtn.disabled = true;
    this.getCouponBtn.textContent = 'Купон получен';
    this.getCouponBtn.classList.add('btn--disabled');
  }
}
