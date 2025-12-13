// Enhanced form validation and submission
class LeadFormHandler {
  constructor(formId) {
    this.form = document.getElementById(formId);
    if (!this.form) return;
    
    this.init();
  }
  
  init() {
    this.form.addEventListener('submit', this.handleSubmit.bind(this));
    this.setupValidation();
  }
  
  setupValidation() {
    const emailInput = this.form.querySelector('input[type="email"]');
    if (emailInput) {
      emailInput.addEventListener('blur', this.validateEmail.bind(this));
    }
  }
  
  validateEmail(e) {
    const email = e.target.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (email && !emailRegex.test(email)) {
      e.target.setCustomValidity('Please enter a valid email address');
      e.target.reportValidity();
    } else {
      e.target.setCustomValidity('');
    }
  }
  
  async handleSubmit(e) {
    e.preventDefault();
    
    if (!this.form.checkValidity()) {
      this.form.reportValidity();
      return;
    }
    
    const formData = new FormData(this.form);
    const data = Object.fromEntries(formData);
    
    // Add metadata
    data.timestamp = new Date().toISOString();
    data.pageUrl = window.location.href;
    data.referrer = document.referrer;
    
    try {
      // Use provided Firebase endpoint or fallback to local API
      const endpoint = 'https://your-project.firebaseio.com/leads.json'; // Replace with actual
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        this.showSuccess();
        this.form.reset();
        this.trackConversion(data);
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      console.error('Submission error:', error);
      this.showError();
    }
  }
  
  showSuccess() {
    // Implementation for success message
  }
  
  showError() {
    // Implementation for error message
  }
  
  trackConversion(data) {
    // Google Analytics conversion tracking
    if (typeof gtag !== 'undefined') {
      gtag('event', 'conversion', {
        'send_to': 'AW-XXXXXXXXX/YYYYYYYYYYYY',
        'value': 1.0,
        'currency': 'USD',
        'transaction_id': data.email + '_' + Date.now()
      });
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new LeadFormHandler('lead-form');
});