import { Toast } from '../utils/Toast.js';

export class Quiz {
  constructor(quizId, modal) {
    this.quiz = document.getElementById(quizId);
    this.modal = modal;
    this.currentQuestion = 1;
    this.totalQuestions = 3;
    this.answers = {};
    
    this.questions = this.quiz.querySelectorAll('.quiz__question');
    this.prevBtn = document.getElementById('quizPrevBtn');
    this.nextBtn = document.getElementById('quizNextBtn');
    this.submitBtn = document.getElementById('quizSubmitBtn');
    this.progressFill = this.quiz.querySelector('.quiz__progress-fill');
    this.currentQuestionEl = document.getElementById('currentQuestion');
    
    this.onComplete = null;
    
    this.init();
  }

  init() {
    this.attachEvents();
  }

  attachEvents() {
    // Navigation buttons
    this.prevBtn.addEventListener('click', () => this.prevQuestion());
    this.nextBtn.addEventListener('click', () => this.nextQuestion());
    this.submitBtn.addEventListener('click', () => this.submit());
    
    // Radio buttons
    const radioButtons = this.quiz.querySelectorAll('input[type="radio"]');
    radioButtons.forEach(radio => {
      radio.addEventListener('change', (e) => {
        const questionNum = e.target.name.replace('q', '');
        this.answers[questionNum] = e.target.value;
        this.updateNavigationButtons();
      });
    });
  }

  reset() {
    this.currentQuestion = 1;
    this.answers = {};
    
    // Reset radio buttons
    const radioButtons = this.quiz.querySelectorAll('input[type="radio"]');
    radioButtons.forEach(radio => {
      radio.checked = false;
    });
    
    // Show first question
    this.showQuestion(1);
    this.updateProgress();
    this.updateNavigationButtons();
  }

  showQuestion(num) {
    this.questions.forEach(question => {
      question.classList.remove('active');
    });
    
    const targetQuestion = this.quiz.querySelector(`[data-question="${num}"]`);
    if (targetQuestion) {
      targetQuestion.classList.add('active');
    }
  }

  nextQuestion() {
    if (this.currentQuestion < this.totalQuestions) {
      this.currentQuestion++;
      this.showQuestion(this.currentQuestion);
      this.updateProgress();
      this.updateNavigationButtons();
    }
  }

  prevQuestion() {
    if (this.currentQuestion > 1) {
      this.currentQuestion--;
      this.showQuestion(this.currentQuestion);
      this.updateProgress();
      this.updateNavigationButtons();
    }
  }

  updateProgress() {
    const progress = (this.currentQuestion / this.totalQuestions) * 100;
    this.progressFill.style.width = `${progress}%`;
    this.currentQuestionEl.textContent = this.currentQuestion;
  }

  updateNavigationButtons() {
    // Prev button
    this.prevBtn.disabled = this.currentQuestion === 1;
    
    // Check if current question is answered
    const isCurrentAnswered = this.answers[this.currentQuestion] !== undefined;
    
    // Next/Submit buttons
    if (this.currentQuestion === this.totalQuestions) {
      this.nextBtn.style.display = 'none';
      this.submitBtn.style.display = 'block';
      this.submitBtn.disabled = !isCurrentAnswered;
    } else {
      this.nextBtn.style.display = 'block';
      this.submitBtn.style.display = 'none';
      this.nextBtn.disabled = !isCurrentAnswered;
    }
  }

  submit() {
    // Check if all questions are answered
    if (Object.keys(this.answers).length !== this.totalQuestions) {
      Toast.show('Пожалуйста, ответьте на все вопросы', 'error');
      return;
    }
    
    // Call completion callback
    if (this.onComplete) {
      this.onComplete(this.answers);
    }
  }

  open() {
    this.reset();
    this.modal.open();
  }
}
