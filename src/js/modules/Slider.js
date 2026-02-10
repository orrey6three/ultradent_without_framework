export class Slider {
  constructor(sliderId) {
    this.slider = document.getElementById(sliderId);
    this.track = this.slider.querySelector('.slider__track');
    this.slides = [];
    this.currentIndex = 0;
    this.slidesPerView = 1;
    this.gap = 20;
    
    this.prevBtn = this.slider.querySelector('.slider__btn--prev');
    this.nextBtn = this.slider.querySelector('.slider__btn--next');
    this.paginationContainer = document.getElementById('sliderPagination');
    
    // Wait for slides to be added
    setTimeout(() => {
      this.slides = Array.from(this.track.querySelectorAll('.slider__slide'));
      if (this.slides.length > 0) {
        this.init();
      }
    }, 100);
  }

  init() {
    this.calculateSlidesPerView();
    this.createPagination();
    this.updateSlider();
    this.attachEvents();
    
    // Handle resize
    window.addEventListener('resize', () => {
      this.calculateSlidesPerView();
      this.updateSlider();
    });
  }

  calculateSlidesPerView() {
    const width = window.innerWidth;
    
    if (width >= 1200) {
      this.slidesPerView = 3;
    } else if (width >= 768) {
      this.slidesPerView = 2;
    } else {
      this.slidesPerView = 1;
    }
  }

  attachEvents() {
    this.prevBtn.addEventListener('click', () => this.prev());
    this.nextBtn.addEventListener('click', () => this.next());
    
    // Touch events for mobile
    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    this.track.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
    });

    this.track.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      currentX = e.touches[0].clientX;
    });

    this.track.addEventListener('touchend', () => {
      if (!isDragging) return;
      
      const diff = startX - currentX;
      
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          this.next();
        } else {
          this.prev();
        }
      }
      
      isDragging = false;
    });

    // Mouse events for desktop
    let isMouseDown = false;
    let startMouseX = 0;

    this.track.addEventListener('mousedown', (e) => {
      startMouseX = e.clientX;
      isMouseDown = true;
      this.track.style.cursor = 'grabbing';
    });

    this.track.addEventListener('mousemove', (e) => {
      if (!isMouseDown) return;
      currentX = e.clientX;
    });

    this.track.addEventListener('mouseup', () => {
      if (!isMouseDown) return;
      
      const diff = startMouseX - currentX;
      
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          this.next();
        } else {
          this.prev();
        }
      }
      
      isMouseDown = false;
      this.track.style.cursor = 'grab';
    });

    this.track.addEventListener('mouseleave', () => {
      if (isMouseDown) {
        isMouseDown = false;
        this.track.style.cursor = 'grab';
      }
    });
  }

  createPagination() {
    this.paginationContainer.innerHTML = '';
    const maxIndex = Math.ceil(this.slides.length / this.slidesPerView);
    
    for (let i = 0; i < maxIndex; i++) {
      const dot = document.createElement('button');
      dot.className = 'slider__dot';
      dot.setAttribute('aria-label', `Слайд ${i + 1}`);
      
      if (i === 0) {
        dot.classList.add('slider__dot--active');
      }
      
      dot.addEventListener('click', () => {
        this.currentIndex = i * this.slidesPerView;
        this.updateSlider();
      });
      
      this.paginationContainer.appendChild(dot);
    }
  }

  updateSlider() {
    const slideWidth = this.slider.offsetWidth / this.slidesPerView;
    const offset = -(this.currentIndex * (slideWidth + this.gap / this.slidesPerView));
    
    this.track.style.transform = `translateX(${offset}px)`;
    
    // Update slides width
    this.slides.forEach(slide => {
      slide.style.width = `calc(${100 / this.slidesPerView}% - ${this.gap * (this.slidesPerView - 1) / this.slidesPerView}px)`;
      slide.style.marginRight = `${this.gap}px`;
    });
    
    // Update buttons state
    this.updateButtons();
    
    // Update pagination
    this.updatePagination();
  }

  updateButtons() {
    const maxIndex = this.slides.length - this.slidesPerView;
    
    this.prevBtn.disabled = this.currentIndex === 0;
    this.nextBtn.disabled = this.currentIndex >= maxIndex;
    
    this.prevBtn.classList.toggle('slider__btn--disabled', this.currentIndex === 0);
    this.nextBtn.classList.toggle('slider__btn--disabled', this.currentIndex >= maxIndex);
  }

  updatePagination() {
    const dots = this.paginationContainer.querySelectorAll('.slider__dot');
    const activeIndex = Math.floor(this.currentIndex / this.slidesPerView);
    
    dots.forEach((dot, index) => {
      dot.classList.toggle('slider__dot--active', index === activeIndex);
    });
  }

  next() {
    const maxIndex = this.slides.length - this.slidesPerView;
    
    if (this.currentIndex < maxIndex) {
      this.currentIndex++;
      this.updateSlider();
    }
  }

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateSlider();
    }
  }

  goToSlide(index) {
    this.currentIndex = index;
    this.updateSlider();
  }
}
