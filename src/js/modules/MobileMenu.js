export class MobileMenu {
  constructor() {
    this.burger = document.querySelector('.header__burger');
    this.nav = document.querySelector('.header__nav');
    this.header = document.querySelector('.header');
    this.isOpen = false;
    
    this.init();
  }

  init() {
    this.burger.addEventListener('click', () => this.toggle());
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (this.isOpen && !this.header.contains(e.target)) {
        this.close();
      }
    });
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    this.burger.classList.add('header__burger--active');
    this.nav.classList.add('header__nav--active');
    document.body.style.overflow = 'hidden';
    this.isOpen = true;
  }

  close() {
    this.burger.classList.remove('header__burger--active');
    this.nav.classList.remove('header__nav--active');
    document.body.style.overflow = '';
    this.isOpen = false;
  }
}
