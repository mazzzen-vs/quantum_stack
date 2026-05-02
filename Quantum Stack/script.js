// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background on scroll
window.addEventListener('scroll', function () {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(42, 27, 61, 0.98)';
    } else {
        navbar.style.background = 'rgba(42, 27, 61, 0.95)';
    }
});

// EmailJS Configuration (Replace with your actual keys)
const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY";
const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";

// Check if EmailJS library is loaded
let emailjsLoaded = false;
try {
    emailjsLoaded = typeof emailjs !== 'undefined';
    if (emailjsLoaded && EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY") {
        emailjs.init(EMAILJS_PUBLIC_KEY);
    }
} catch (error) {
    console.log('EmailJS not loaded, using mailto fallback');
}

// Contact form handling
function handleContactForm(form) {
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Get form data
        const name = this.querySelector('input[name="name"], input[placeholder*="Name"], input[type="text"]').value;
        const email = this.querySelector('input[name="email"], input[type="email"]').value;
        const message = this.querySelector('textarea[name="message"], textarea').value;

        // Get additional fields if they exist (for detailed contact form)
        const phone = this.querySelector('input[name="phone"]')?.value || '';
        const company = this.querySelector('input[name="company"]')?.value || '';
        const service = this.querySelector('select[name="service"]')?.value || '';
        const budget = this.querySelector('select[name="budget"]')?.value || '';

        // Clear previous errors
        clearFormErrors(this);

        // Validation
        let isValid = true;

        if (!name.trim()) {
            showFieldError(this.querySelector('input[name="name"], input[placeholder*="Name"], input[type="text"]'), 'Name is required');
            isValid = false;
        }

        if (!email.trim()) {
            showFieldError(this.querySelector('input[name="email"], input[type="email"]'), 'Email is required');
            isValid = false;
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showFieldError(this.querySelector('input[name="email"], input[type="email"]'), 'Please enter a valid email address');
                isValid = false;
            }
        }

        if (!message.trim()) {
            showFieldError(this.querySelector('textarea[name="message"], textarea'), 'Message is required');
            isValid = false;
        }

        if (!isValid) {
            return;
        }

        const submitBtn = this.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;

        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');

        // Prepare email parameters
        const templateParams = {
            from_name: name,
            from_email: email,
            phone: phone,
            company: company,
            service: service,
            budget: budget,
            message: message,
            to_email: 'qauntamstack12@gmail.com'
        };

        // Check if EmailJS is configured and available
        if (emailjsLoaded && EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY") {
            // Send email using EmailJS
            emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
                .then(function (response) {
                    console.log('SUCCESS!', response.status, response.text);
                    showSuccessMessage('Message sent successfully! We will contact you soon.');
                    form.reset();
                    clearFormErrors(form);
                })
                .catch(function (error) {
                    console.log('FAILED...', error);
                    // Fallback to mailto if EmailJS fails
                    sendViaMailto(name, email, phone, company, service, budget, message);
                })
                .finally(function () {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    submitBtn.classList.remove('loading');
                });
        } else {
            // Use mailto as primary method if EmailJS is not configured
            sendViaMailto(name, email, phone, company, service, budget, message);
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
        }
    });
}

// Function to send email via mailto
function sendViaMailto(name, email, phone, company, service, budget, message) {
    const subject = encodeURIComponent(`New Contact Form Message from ${name}`);
    const body = encodeURIComponent(`
Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}
Company: ${company || 'Not provided'}
Service: ${service || 'Not specified'}
Budget: ${budget || 'Not specified'}

Message:
${message}

---
This message was sent from Quantum Stack website contact form.
    `);

    // Create mailto link
    const mailtoLink = `mailto:qauntamstack12@gmail.com?subject=${subject}&body=${body}`;

    // Try to open email client
    window.location.href = mailtoLink;

    // Show confirmation message
    setTimeout(() => {
        alert('Your email client should open now. If it doesn\'t, please copy the information and send it manually to qauntamstack12@gmail.com');
    }, 500);
}

// Initialize contact forms when DOM is loaded (removed duplicate)
// This is handled in the enhanced form initialization below

// Add animation on scroll
const basicObserverOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, basicObserverOptions);

// Observe elements for animation
document.querySelectorAll('.service-card, .about-text, .contact-info, .contact-form').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});

// Add hover effect to service cards
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });

    card.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Animate stats numbers
function animateStats() {
    const stats = document.querySelectorAll('.stat-number');

    stats.forEach(stat => {
        // Check if it has data-target attribute (for hero section)
        const dataTarget = stat.getAttribute('data-target');
        if (dataTarget) {
            const target = parseInt(dataTarget);
            let current = 0;
            const increment = target / 50;

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                stat.textContent = Math.floor(current) + '+';
            }, 50);
        } else {
            // For static numbers (like in about page), just leave them as they are
            return;
        }
    });
}

// Trigger stats animation when about section is visible (only for pages with .about-preview class)
const aboutSection = document.querySelector('.about-preview');
const statsObserver = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateStats();
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

if (aboutSection) {
    statsObserver.observe(aboutSection);
}
// Team Member Modal Functions
function openModal(memberId) {
    const modal = document.getElementById(memberId);
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
}

function closeModal(memberId) {
    const modal = document.getElementById(memberId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore scrolling
    }
}

// Close modal when clicking outside of it
window.addEventListener('click', function (event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (modal.style.display === 'block') {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }
});
// Advanced Animations and Interactions

// Animated Counter for Hero Stats
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');

    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        if (!isNaN(target)) {
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60fps
            let current = 0;

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                counter.textContent = Math.floor(current) + '+';
            }, 16);
        }
    });
}

// Trigger counter animation when hero section is visible
const heroSection = document.querySelector('.hero');
if (heroSection) {
    const heroObserver = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                heroObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    heroObserver.observe(heroSection);
}

// Tech Stack Hover Effects
document.querySelectorAll('.tech-item').forEach(item => {
    item.addEventListener('mouseenter', function () {
        const techName = this.getAttribute('data-tech');

        // Create tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'tech-tooltip';
        tooltip.textContent = techName;
        tooltip.style.cssText = `
            position: absolute;
            top: -40px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 212, 255, 0.9);
            color: white;
            padding: 5px 10px;
            border-radius: 5px;
            font-size: 0.8rem;
            font-weight: 600;
            white-space: nowrap;
            z-index: 1000;
            animation: fadeInUp 0.3s ease;
        `;

        this.appendChild(tooltip);

        // Add ripple effect
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(0, 212, 255, 0.3);
            transform: scale(0);
            animation: ripple 0.6s linear;
            width: 100px;
            height: 100px;
            left: 50%;
            top: 50%;
            margin-left: -50px;
            margin-top: -50px;
        `;

        this.appendChild(ripple);

        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    });

    item.addEventListener('mouseleave', function () {
        const tooltip = this.querySelector('.tech-tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    });
});

// Parallax Effect for Hero Background
window.addEventListener('scroll', function () {
    const scrolled = window.scrollY;
    const parallaxElements = document.querySelectorAll('.particle, .shape');

    parallaxElements.forEach((element, index) => {
        const speed = (index + 1) * 0.1;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Smooth Page Transitions
document.addEventListener('DOMContentLoaded', function () {
    // Add page load animation
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';

    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Advanced Scroll Animations
const advancedObserverOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const advancedObserver = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');

            // Stagger animation for child elements
            const children = entry.target.querySelectorAll('.service-card, .feature-card, .team-member');
            children.forEach((child, index) => {
                setTimeout(() => {
                    child.style.opacity = '1';
                    child.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }
    });
}, advancedObserverOptions);

// Observe sections for advanced animations
document.querySelectorAll('.features, .services, .about-preview, .contact-preview').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'all 0.8s ease';
    advancedObserver.observe(section);
});

// Add CSS for ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);

// Helper Functions for Form Validation and Messages

function showFieldError(field, message) {
    const formGroup = field.closest('.form-group') || field.parentElement;
    formGroup.classList.add('error');

    let errorElement = formGroup.querySelector('.error-message');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        formGroup.appendChild(errorElement);
    }
    errorElement.textContent = message;
}

function clearFormErrors(form) {
    const errorGroups = form.querySelectorAll('.form-group.error');
    errorGroups.forEach(group => {
        group.classList.remove('error');
        const errorMessage = group.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    });
}

function showSuccessMessage(message) {
    // Remove existing success message if any
    const existingMessage = document.querySelector('.success-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create success message element
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <span>${message}</span>
        <button class="close-btn" onclick="this.parentElement.remove()">&times;</button>
    `;

    // Add to page
    document.body.appendChild(successDiv);

    // Show with animation
    setTimeout(() => {
        successDiv.classList.add('show');
    }, 100);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (successDiv.parentElement) {
            successDiv.classList.remove('show');
            setTimeout(() => {
                successDiv.remove();
            }, 300);
        }
    }, 5000);
}

// Add real-time validation
function addRealTimeValidation(form) {
    const inputs = form.querySelectorAll('input, textarea, select');

    inputs.forEach(input => {
        input.addEventListener('blur', function () {
            validateField(this);
        });

        input.addEventListener('input', function () {
            // Clear error state when user starts typing
            const formGroup = this.closest('.form-group') || this.parentElement;
            if (formGroup.classList.contains('error')) {
                formGroup.classList.remove('error');
                const errorMessage = formGroup.querySelector('.error-message');
                if (errorMessage) {
                    errorMessage.remove();
                }
            }
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name || field.placeholder || 'This field';
    const formGroup = field.closest('.form-group') || field.parentElement;

    // Clear previous error
    formGroup.classList.remove('error', 'success');
    const errorMessage = formGroup.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }

    // Validate based on field type
    if (field.hasAttribute('required') || field.type === 'email') {
        if (!value) {
            showFieldError(field, `${fieldName} is required`);
            return false;
        }

        if (field.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                showFieldError(field, 'Please enter a valid email address');
                return false;
            }
        }

        // Show success state
        formGroup.classList.add('success');
        return true;
    }

    return true;
}

// Enhanced form initialization
document.addEventListener('DOMContentLoaded', function () {
    // Handle all contact forms on the page
    const contactForms = document.querySelectorAll('.contact-form, .contact-form-detailed');
    contactForms.forEach(form => {
        handleContactForm(form);
        addRealTimeValidation(form);
    });
});
// ===== RESPONSIVE ENHANCEMENTS =====

// Mobile Menu Toggle
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const hamburger = document.querySelector('.hamburger');
    const body = document.body;
    
    if (navMenu && menuToggle) {
        const isActive = navMenu.classList.contains('active');
        
        if (isActive) {
            // Close menu
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
            hamburger.classList.remove('active');
            body.style.overflow = 'auto';
        } else {
            // Open menu
            navMenu.classList.add('active');
            menuToggle.classList.add('active');
            hamburger.classList.add('active');
            body.style.overflow = 'hidden';
        }
    }
}

// Close mobile menu when clicking on a link
function closeMobileMenuOnLinkClick() {
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const navMenu = document.querySelector('.nav-menu');
            const menuToggle = document.querySelector('.mobile-menu-toggle');
            const hamburger = document.querySelector('.hamburger');
            const body = document.body;
            
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
                hamburger.classList.remove('active');
                body.style.overflow = 'auto';
            }
        });
    });
}

// Close mobile menu when clicking outside
function closeMobileMenuOnOutsideClick() {
    document.addEventListener('click', (e) => {
        const navMenu = document.querySelector('.nav-menu');
        const menuToggle = document.querySelector('.mobile-menu-toggle');
        const hamburger = document.querySelector('.hamburger');
        const body = document.body;
        
        if (navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            !menuToggle.contains(e.target)) {
            
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
            hamburger.classList.remove('active');
            body.style.overflow = 'auto';
        }
    });
}

// Close mobile menu on escape key
function closeMobileMenuOnEscape() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const navMenu = document.querySelector('.nav-menu');
            const menuToggle = document.querySelector('.mobile-menu-toggle');
            const hamburger = document.querySelector('.hamburger');
            const body = document.body;
            
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
                hamburger.classList.remove('active');
                body.style.overflow = 'auto';
            }
        }
    });
}

// Improved Touch Handling for Mobile
document.addEventListener('DOMContentLoaded', function() {
    // Add touch-friendly classes
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
    }
    
    // Improve modal touch handling
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('touchstart', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    });
    
    // Improve form input handling on mobile
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            // Prevent zoom on iOS
            if (window.innerWidth < 768) {
                const viewport = document.querySelector('meta[name="viewport"]');
                if (viewport) {
                    viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
                }
            }
        });
        
        input.addEventListener('blur', function() {
            // Restore zoom capability
            if (window.innerWidth < 768) {
                const viewport = document.querySelector('meta[name="viewport"]');
                if (viewport) {
                    viewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
                }
            }
        });
    });
});

// Responsive Image Loading
function optimizeImagesForDevice() {
    const images = document.querySelectorAll('img');
    const isHighDPI = window.devicePixelRatio > 1;
    const isSmallScreen = window.innerWidth < 768;
    
    images.forEach(img => {
        if (isSmallScreen && !isHighDPI) {
            // Use smaller images on small, low-DPI screens
            img.style.imageRendering = 'auto';
        } else if (isHighDPI) {
            // Use crisp rendering on high-DPI screens
            img.style.imageRendering = 'crisp-edges';
        }
    });
}

// Responsive Layout Adjustments
function adjustLayoutForScreen() {
    const screenWidth = window.innerWidth;
    const heroSection = document.querySelector('.hero');
    const pageHeaders = document.querySelectorAll('.page-header');
    
    // Adjust hero height based on screen size
    if (heroSection) {
        if (screenWidth < 576) {
            heroSection.style.minHeight = '60vh';
        } else if (screenWidth < 768) {
            heroSection.style.minHeight = '70vh';
        } else {
            heroSection.style.minHeight = '100vh';
        }
    }
    
    // Adjust page header heights
    pageHeaders.forEach(header => {
        if (screenWidth < 576) {
            header.style.minHeight = '35vh';
        } else if (screenWidth < 768) {
            header.style.minHeight = '40vh';
        } else {
            header.style.minHeight = '60vh';
        }
    });
}

// Performance Optimization for Mobile
function optimizeForMobile() {
    const isSmallScreen = window.innerWidth < 768;
    const particles = document.querySelectorAll('.page-header-particle, .particle');
    const shapes = document.querySelectorAll('.page-header-shape, .shape');
    
    if (isSmallScreen) {
        // Reduce particles on small screens
        particles.forEach((particle, index) => {
            if (index > 4) {
                particle.style.display = 'none';
            }
        });
        
        // Simplify animations on mobile
        shapes.forEach(shape => {
            shape.style.animationDuration = '20s';
        });
    } else {
        // Restore particles on larger screens
        particles.forEach(particle => {
            particle.style.display = '';
        });
        
        shapes.forEach(shape => {
            shape.style.animationDuration = '';
        });
    }
}

// Orientation Change Handler
function handleOrientationChange() {
    setTimeout(() => {
        adjustLayoutForScreen();
        optimizeForMobile();
        
        // Recalculate viewport height
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }, 100);
}

// Initialize responsive features
window.addEventListener('load', function() {
    optimizeImagesForDevice();
    adjustLayoutForScreen();
    optimizeForMobile();
    
    // Initialize mobile menu
    closeMobileMenuOnLinkClick();
    closeMobileMenuOnOutsideClick();
    closeMobileMenuOnEscape();
    
    // Set initial viewport height
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
});

// Handle window resize
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        adjustLayoutForScreen();
        optimizeForMobile();
        optimizeImagesForDevice();
        
        // Update viewport height
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }, 250);
});

// Handle orientation change
window.addEventListener('orientationchange', handleOrientationChange);

// Improved Scroll Performance
let ticking = false;
function updateOnScroll() {
    // Existing scroll functionality with performance optimization
    const scrolled = window.scrollY;
    const navbar = document.querySelector('.navbar');
    
    if (navbar) {
        if (scrolled > 50) {
            navbar.style.background = 'rgba(42, 27, 61, 0.98)';
        } else {
            navbar.style.background = 'rgba(42, 27, 61, 0.95)';
        }
    }
    
    ticking = false;
}

window.addEventListener('scroll', function() {
    if (!ticking) {
        requestAnimationFrame(updateOnScroll);
        ticking = true;
    }
});

// Prevent iOS Safari bounce effect
document.addEventListener('touchmove', function(e) {
    if (e.target.closest('.modal-content') || e.target.closest('.contact-form')) {
        return; // Allow scrolling in modals and forms
    }
    
    const isAtTop = window.scrollY === 0;
    const isAtBottom = window.scrollY >= document.body.scrollHeight - window.innerHeight;
    
    if ((isAtTop && e.touches[0].clientY > e.touches[0].clientY) || 
        (isAtBottom && e.touches[0].clientY < e.touches[0].clientY)) {
        e.preventDefault();
    }
}, { passive: false });   