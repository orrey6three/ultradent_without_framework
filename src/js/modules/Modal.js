export class Modal {
  constructor(modalId) {
    this.modal = document.getElementById(modalId);
    this.overlay = this.modal.querySelector('.modal__overlay');
    this.closeBtn = this.modal.querySelector('.modal__close');
    
    this.init();
  }

  init() {
    this.closeBtn.addEventListener('click', () => this.close());
    this.overlay.addEventListener('click', () => this.close());
    
    // Close on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen()) {
        this.close();
      }
    });
  }

  open() {
    this.modal.classList.add('modal--active');
    document.body.style.overflow = 'hidden';
    
    // Animation
    setTimeout(() => {
      this.modal.querySelector('.modal__container').classList.add('modal__container--show');
    }, 10);
  }

  close() {
    this.modal.querySelector('.modal__container').classList.remove('modal__container--show');
    
    setTimeout(() => {
      this.modal.classList.remove('modal--active');
      document.body.style.overflow = '';
    }, 300);
  }

  isOpen() {
    return this.modal.classList.contains('modal--active');
  }
}
