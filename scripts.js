// ===== DOM READY =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 HighPerf Landing Page Loaded');
    
    // Initialize all components
    initMobileMenu();
    initLeadForm();
    initThemeToggle();
    initSmoothScroll();
    initPerformanceMonitoring();
    initLazyLoading();
});

// ===== MOBILE MENU =====
function initMobileMenu() {
    const menuButton = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (!menuButton || !mobileMenu) return;
    
    menuButton.addEventListener('click', function() {
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        
        // Toggle menu state
        this.setAttribute('aria-expanded', !isExpanded);
        mobileMenu.setAttribute('aria-hidden', isExpanded);
        
        // Toggle menu visibility
        if (isExpanded) {
            mobileMenu.style.maxHeight = '0';
        } else {
            mobileMenu.style.maxHeight = mobileMenu.scrollHeight + 'px';
        }
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = isExpanded ? '' : 'hidden';
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!menuButton.contains(event.target) && !mobileMenu.contains(event.target)) {
            closeMobileMenu();
        }
    });
    
    // Close menu on Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeMobileMenu();
        }
    });
    
    // Close menu when clicking a link
    mobileMenu.addEventListener('click', function(event) {
        if (event.target.tagName === 'A') {
            closeMobileMenu();
        }
    });
    
    function closeMobileMenu() {
        menuButton.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
        mobileMenu.style.maxHeight = '0';
        document.body.style.overflow = '';
    }
}

// ===== LEAD FORM SUBMISSION =====
function initLeadForm() {
    const form = document.getElementById('lead-form');
    const submitBtn = document.getElementById('submit-btn');
    const spinner = document.getElementById('spinner');
    const formMessage = document.getElementById('form-message');
    
    if (!form) return;
    
    // Form validation
    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        // Validate form
        if (!validateForm()) {
            return;
        }
        
        // Show loading state
        setFormLoading(true);
        
        try {
            // Prepare form data
            const formData = getFormData();
            
            // Send to Firebase or your API endpoint
            const response = await submitForm(formData);
            
            // Show success message
            showFormMessage('Thank you! We\'ll be in touch soon.', 'success');
            
            // Reset form
            form.reset();
            
            // Track conversion
            trackConversion(formData);
            
        } catch (error) {
            console.error('Form submission error:', error);
            showFormMessage('Something went wrong. Please try again or contact us directly.', 'error');
        } finally {
            // Hide loading state
            setFormLoading(false);
        }
    });
    
    // Real-time validation
    form.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
    });
    
    function validateForm() {
        let isValid = true;
        
        // Check required fields
        const requiredFields = form.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });
        
        // Check email format
        const emailField = form.querySelector('input[type="email"]');
        if (emailField && emailField.value) {
            if (!validateEmail(emailField.value)) {
                showFieldError(emailField, 'Please enter a valid email address');
                isValid = false;
            }
        }
        
        return isValid;
    }
    
    function validateField(field) {
        const value = field.value.trim();
        
        // Clear previous error
        clearFieldError(field);
        
        // Check required
        if (field.hasAttribute('required') && !value) {
            showFieldError(field, 'This field is required');
            return false;
        }
        
        // Check email format
        if (field.type === 'email' && value) {
            if (!validateEmail(value)) {
                showFieldError(field, 'Please enter a valid email address');
                return false;
            }
        }
        
        return true;
    }
    
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function showFieldError(field, message) {
        // Create error element
        let errorElement = field.parentElement.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            field.parentElement.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        errorElement.style.color = '#EF4444';
        errorElement.style.fontSize = '0.875rem';
        errorElement.style.marginTop = '0.25rem';
        
        // Add error style to field
        field.style.borderColor = '#EF4444';
    }
    
    function clearFieldError(field) {
        const errorElement = field.parentElement.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
        field.style.borderColor = '';
    }
    
    function getFormData() {
        return {
            name: form.querySelector('#name').value.trim(),
            email: form.querySelector('#email').value.trim(),
            company: form.querySelector('#company').value.trim(),
            message: form.querySelector('#message').value.trim(),
            consent: form.querySelector('#consent').checked,
            timestamp: new Date().toISOString(),
            pageUrl: window.location.href,
            referrer: document.referrer,
            userAgent: navigator.userAgent
        };
    }
    
    async function submitForm(data) {
        // Firebase REST API endpoint (replace with your actual URL)
        const FIREBASE_URL = 'https://your-project.firebaseio.com/leads.json';
        
        // For demo purposes, simulate API call
        console.log('Submitting form data:', data);
        
        // Uncomment to use real Firebase
        /*
        const response = await fetch(FIREBASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
        */
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Return simulated response
        return { success: true, id: 'simulated_' + Date.now() };
    }
    
    function setFormLoading(isLoading) {
        if (!submitBtn || !spinner) return;
        
        if (isLoading) {
            submitBtn.disabled = true;
            submitBtn.querySelector('.btn-text').textContent = 'Submitting...';
            spinner.style.display = 'inline-block';
        } else {
            submitBtn.disabled = false;
            submitBtn.querySelector('.btn-text').textContent = 'Get Early Access';
            spinner.style.display = 'none';
        }
    }
    
    function showFormMessage(message, type) {
        if (!formMessage) return;
        
        formMessage.textContent = message;
        formMessage.className = 'form-message ' + type;
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            formMessage.textContent = '';
            formMessage.className = 'form-message';
        }, 5000);
    }
    
    function trackConversion(data) {
        // Google Analytics conversion tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', 'conversion', {
                'send_to': 'AW-XXXXXXXXX/YYYYYYYYYYYY',
                'value': 1.0,
                'currency': 'USD',
                'transaction_id': data.email + '_' + Date.now()
            });
        }
        
        // Log conversion for debugging
        console.log('Conversion tracked:', data.email);
    }
}

// ===== THEME TOGGLE =====
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle?.querySelector('.theme-icon');
    const themeText = themeToggle?.querySelector('.theme-text');
    
    if (!themeToggle) return;
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.classList.add('dark-theme');
        updateThemeToggle(true);
    }
    
    // Toggle theme
    themeToggle.addEventListener('click', function() {
        const isDark = document.documentElement.classList.toggle('dark-theme');
        
        // Save preference
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        
        // Update button
        updateThemeToggle(isDark);
        
        // Dispatch event for other components
        document.dispatchEvent(new CustomEvent('themechange', {
            detail: { theme: isDark ? 'dark' : 'light' }
        }));
    });
    
    function updateThemeToggle(isDark) {
        if (!themeIcon || !themeText) return;
        
        themeIcon.textContent = isDark ? '☀️' : '🌙';
        themeText.textContent = isDark ? 'Light Mode' : 'Dark Mode';
    }
}

// ===== SMOOTH SCROLL =====
function initSmoothScroll() {
    // Add smooth scroll to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(event) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#" or external link
            if (href === '#' || href.startsWith('#!')) return;
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                event.preventDefault();
                
                // Scroll to element
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update URL without jumping
                history.pushState(null, null, href);
            }
        });
    });
}

// ===== PERFORMANCE MONITORING =====
function initPerformanceMonitoring() {
    // Log Core Web Vitals if supported
    if ('PerformanceObserver' in window) {
        // Largest Contentful Paint
        const lcpObserver = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            
            console.log('LCP:', lastEntry.startTime);
            
            // Could send to analytics
            // sendToAnalytics({ metric: 'LCP', value: lastEntry.startTime });
        });
        
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        
        // First Input Delay
        const fidObserver = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                console.log('FID:', entry.processingStart - entry.startTime);
            });
        });
        
        fidObserver.observe({ type: 'first-input', buffered: true });
        
        // Cumulative Layout Shift
        const clsObserver = new PerformanceObserver((entryList) => {
            let clsValue = 0;
            entryList.getEntries().forEach(entry => {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                }
            });
            
            console.log('CLS:', clsValue);
        });
        
        clsObserver.observe({ type: 'layout-shift', buffered: true });
    }
    
    // Log page load time
    window.addEventListener('load', function() {
        const timing = performance.timing;
        const loadTime = timing.loadEventEnd - timing.navigationStart;
        
        console.log('Page load time:', loadTime + 'ms');
        
        // Log if page loads slowly
        if (loadTime > 3000) {
            console.warn('Page load time exceeds 3 seconds');
        }
    });
}

// ===== LAZY LOADING =====
function initLazyLoading() {
    // Intersection Observer for lazy loading
    if ('IntersectionObserver' in window) {
        const lazyObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    
                    // Handle different types of lazy loading
                    if (element.dataset.src) {
                        element.src = element.dataset.src;
                        element.removeAttribute('data-src');
                    }
                    
                    if (element.dataset.srcset) {
                        element.srcset = element.dataset.srcset;
                        element.removeAttribute('data-srcset');
                    }
                    
                    if (element.dataset.background) {
                        element.style.backgroundImage = `url(${element.dataset.background})`;
                        element.removeAttribute('data-background');
                    }
                    
                    observer.unobserve(element);
                }
            });
        }, {
            rootMargin: '50px',
            threshold: 0.1
        });
        
        // Observe elements with data attributes
        document.querySelectorAll('[data-src], [data-srcset], [data-background]').forEach(element => {
            lazyObserver.observe(element);
        });
    }
}

// ===== STICKY HEADER =====
function initStickyHeader() {
    const header = document.getElementById('header');
    if (!header) return;
    
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add shadow when scrolled
        if (scrollTop > 10) {
            header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = 'none';
        }
        
        // Hide/show header on scroll (optional)
        const headerHeight = header.offsetHeight;
        
        if (scrollTop > lastScrollTop && scrollTop > headerHeight) {
            // Scrolling down
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
}

// ===== ERROR HANDLING =====
window.addEventListener('error', function(event) {
    console.error('Global error caught:', event.error);
    
    // Could send to error tracking service
    // sendToErrorTracking(event.error);
    
    // Prevent default error handling if needed
    // event.preventDefault();
});

// ===== PWA SUPPORT =====
if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').catch(error => {
            console.log('ServiceWorker registration failed:', error);
        });
    });
}

// ===== UTILITY FUNCTIONS =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Export for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initMobileMenu,
        initLeadForm,
        initThemeToggle,
        validateEmail,
        debounce,
        throttle
    };
}