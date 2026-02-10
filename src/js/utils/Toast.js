export class Toast {
  static show(message, type = 'info', duration = 5000) {
    const container = document.getElementById('toastContainer');
    
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    
    const icon = this.getIcon(type);
    
    toast.innerHTML = `
      <div class="toast__icon">${icon}</div>
      <div class="toast__message">${message}</div>
      <button class="toast__close" aria-label="Закрыть">&times;</button>
    `;
    
    container.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
      toast.classList.add('toast--show');
    }, 10);
    
    // Close button
    const closeBtn = toast.querySelector('.toast__close');
    closeBtn.addEventListener('click', () => {
      this.remove(toast);
    });
    
    // Auto remove
    if (duration > 0) {
      setTimeout(() => {
        this.remove(toast);
      }, duration);
    }
  }

  static remove(toast) {
    toast.classList.remove('toast--show');
    
    setTimeout(() => {
      toast.remove();
    }, 300);
  }

  static getIcon(type) {
    const icons = {
      success: '✓',
      error: '✕',
      info: 'ℹ',
      warning: '⚠'
    };
    
    return icons[type] || icons.info;
  }
}
