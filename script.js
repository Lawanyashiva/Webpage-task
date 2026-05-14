/**
 * Gushwork - Responsive Web Page
 * Main JavaScript functionality for sticky header, carousel, and interactions
 */

/* =====================================================
   STICKY HEADER FUNCTIONALITY
   ===================================================== */

/**
 * Initialize sticky header
 * Shows header when scrolling past the hero section
 */
class StickyHeader {
    constructor() {
        this.header = document.getElementById('stickyHeader');
        this.heroSection = document.getElementById('home');
        this.lastScrollPosition = 0;
        this.isVisible = false;

        this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.handleScroll());
    }

    /**
     * Handle scroll event to show/hide sticky header
     * Shows header when scrolling beyond the hero section
     */
    handleScroll() {
        const heroBottom = this.heroSection.offsetHeight;
        const currentScrollPosition = window.scrollY;

        // Show header when scrolled past hero section
        if (currentScrollPosition > heroBottom && !this.isVisible) {
            this.header.classList.add('visible');
            this.isVisible = true;
        }
        // Hide header when scrolling back to hero section
        else if (currentScrollPosition <= heroBottom && this.isVisible) {
            this.header.classList.remove('visible');
            this.isVisible = false;
        }

        this.lastScrollPosition = currentScrollPosition;
    }
}

/* =====================================================
   IMAGE CAROUSEL FUNCTIONALITY
   ===================================================== */

/**
 * Image Carousel with automatic scroll and indicator dots
 * Supports keyboard navigation and touch gestures
 */
class ImageCarousel {
    constructor(carouselSelector = '#carousel') {
        this.carousel = document.querySelector(carouselSelector);
        this.items = Array.from(this.carousel.querySelectorAll('.carousel-item'));
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.indicatorsContainer = document.getElementById('indicators');

        this.currentIndex = 0;
        this.itemCount = this.items.length;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 5000; // Auto-advance every 5 seconds

        this.init();
    }

    /**
     * Initialize carousel
     * Setup event listeners and create indicator dots
     */
    init() {
        this.createIndicators();
        this.attachEventListeners();
        this.startAutoPlay();
        this.updateCarousel();
    }

    /**
     * Create indicator dots for each carousel item
     */
    createIndicators() {
        this.indicators = [];
        for (let i = 0; i < this.itemCount; i++) {
            const indicator = document.createElement('div');
            indicator.classList.add('indicator');
            if (i === 0) indicator.classList.add('active');

            indicator.addEventListener('click', () => this.goToSlide(i));
            this.indicatorsContainer.appendChild(indicator);
            this.indicators.push(indicator);
        }
    }

    /**
     * Attach event listeners to carousel controls
     */
    attachEventListeners() {
        // Button click handlers
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        this.prevBtn.addEventListener('click', () => this.prevSlide());

        // Pause auto-play on hover
        this.carousel.parentElement.addEventListener('mouseenter', () => this.stopAutoPlay());
        this.carousel.parentElement.addEventListener('mouseleave', () => this.startAutoPlay());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeydown(e));

        // Touch support for mobile
        let touchStartX = 0;
        this.carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        });

        this.carousel.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > 50) { // Minimum swipe distance
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
        });
    }

    /**
     * Handle keyboard navigation
     */
    handleKeydown(e) {
        if (e.key === 'ArrowLeft') this.prevSlide();
        if (e.key === 'ArrowRight') this.nextSlide();
    }

    /**
     * Go to next slide
     */
    nextSlide() {
        this.currentIndex = (this.currentIndex + 1) % this.itemCount;
        this.updateCarousel();
        this.resetAutoPlay();
    }

    /**
     * Go to previous slide
     */
    prevSlide() {
        this.currentIndex = (this.currentIndex - 1 + this.itemCount) % this.itemCount;
        this.updateCarousel();
        this.resetAutoPlay();
    }

    /**
     * Go to specific slide
     */
    goToSlide(index) {
        this.currentIndex = index;
        this.updateCarousel();
        this.resetAutoPlay();
    }

    /**
     * Update carousel position and indicators
     */
    updateCarousel() {
        // Translate carousel to show current item
        const offset = -this.currentIndex * 100;
        this.carousel.style.transform = `translateX(${offset}%)`;

        // Update indicators
        this.indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentIndex);
        });

        // Log current slide (for debugging)
        console.log(`Carousel: Showing slide ${this.currentIndex + 1} of ${this.itemCount}`);
    }

    /**
     * Start automatic carousel advancement
     */
    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoPlayDelay);
    }

    /**
     * Stop automatic carousel advancement
     */
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
        }
    }

    /**
     * Reset auto-play timer after user interaction
     */
    resetAutoPlay() {
        this.stopAutoPlay();
        this.startAutoPlay();
    }
}

/* =====================================================
   MOBILE NAVIGATION
   ===================================================== */

/**
 * Mobile hamburger menu toggle
 */
class MobileMenu {
    constructor() {
        this.hamburger = document.getElementById('hamburger');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-menu a');

        this.init();
    }

    init() {
        this.hamburger.addEventListener('click', () => this.toggleMenu());

        // Close menu when a link is clicked
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.navbar')) {
                this.closeMenu();
            }
        });
    }

    /**
     * Toggle mobile menu visibility
     */
    toggleMenu() {
        this.hamburger.classList.toggle('active');
        this.navMenu.classList.toggle('active');
    }

    /**
     * Close mobile menu
     */
    closeMenu() {
        this.hamburger.classList.remove('active');
        this.navMenu.classList.remove('active');
    }
}

/* =====================================================
   CONTACT FORM FUNCTIONALITY
   ===================================================== */

/**
 * Contact form submission handler
 */
class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    /**
     * Handle form submission
     */
    handleSubmit(e) {
        e.preventDefault();

        // Get form values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        // Validate form
        if (!this.validateForm(name, email, message)) {
            return;
        }

        // Simulate form submission
        this.submitForm(name, email, message);
    }

    /**
     * Validate form inputs
     */
    validateForm(name, email, message) {
        if (!name || !email || !message) {
            this.showMessage('Please fill in all fields', 'error');
            return false;
        }

        if (!this.validateEmail(email)) {
            this.showMessage('Please enter a valid email address', 'error');
            return false;
        }

        if (message.length < 10) {
            this.showMessage('Message must be at least 10 characters long', 'error');
            return false;
        }

        return true;
    }

    /**
     * Validate email format
     */
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Submit form (simulated)
     */
    submitForm(name, email, message) {
        // Show loading state
        const submitBtn = this.form.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;

            // Show success message
            this.showMessage('Message sent successfully! We\'ll be in touch soon.', 'success');

            // Reset form
            this.form.reset();

            // Log form data (in real app, this would be sent to server)
            console.log('Form submitted:', { name, email, message });
        }, 1500);
    }

    /**
     * Show temporary message to user
     */
    showMessage(messageText, type) {
        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            z-index: 9999;
            animation: slideInRight 0.3s ease-out;
            font-weight: 500;
            ${type === 'success' ? 'background: #10b981; color: white;' : 'background: #ef4444; color: white;'}
        `;
        messageDiv.textContent = messageText;

        document.body.appendChild(messageDiv);

        // Remove message after 3 seconds
        setTimeout(() => {
            messageDiv.style.animation = 'slideInLeft 0.3s ease-out reverse';
            setTimeout(() => messageDiv.remove(), 300);
        }, 3000);
    }
}

/* =====================================================
   SCROLL ANIMATIONS
   ===================================================== */

/**
 * Add scroll animations to elements
 * Elements fade in when they enter the viewport
 */
class ScrollAnimations {
    constructor() {
        this.animateElements = document.querySelectorAll(
            'section, .service-card, .carousel-item'
        );
        this.init();
    }

    init() {
        // Use Intersection Observer for better performance
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateElement(entry.target);
                        observer.unobserve(entry.target); // Animate only once
                    }
                });
            },
            { threshold: 0.1 }
        );

        this.animateElements.forEach(element => observer.observe(element));
    }

    /**
     * Animate element with fade-in effect
     */
    animateElement(element) {
        element.style.animation = 'fadeIn 0.6s ease-out';
    }
}

/* =====================================================
   SMOOTH SCROLL BEHAVIOR
   ===================================================== */

/**
 * Add smooth scroll behavior for anchor links
 */
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href !== '#' && document.querySelector(href)) {
                    e.preventDefault();
                    document.querySelector(href).scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

/* =====================================================
   PAGE LOAD & INITIALIZATION
   ===================================================== */

/**
 * Initialize all components when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing Gushwork page...');

    // Initialize components
    new StickyHeader();
    new ImageCarousel('#carousel');
    new MobileMenu();
    new ContactForm();
    new ScrollAnimations();
    new SmoothScroll();

    console.log('Gushwork page initialized successfully');
});

/**
 * Handle window resize for responsive adjustments
 */
window.addEventListener('resize', () => {
    // Debounce resize events
    clearTimeout(window.resizeTimer);
    window.resizeTimer = setTimeout(() => {
        console.log('Window resized - checking responsive layout');
    }, 250);
});

/**
 * Prevent FOUC (Flash of Unstyled Content)
 */
window.addEventListener('load', () => {
    document.body.style.visibility = 'visible';
});
