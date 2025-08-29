// Global state
let currentPage = 'home';
let mobileMenuOpen = false;

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeScrollEffects();
    initializeAnimations();
    initializeSocialLinks();
    initializeMobileMenu();
});

// Navigation functions
function showPage(pageId) {
    // Hide all pages including detail pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
        page.style.display = 'none';
    });

    // Hide detail container
    const detailContainer = document.getElementById('detailPages');
    if (detailContainer) {
        detailContainer.style.display = 'none';
    }

    // Show loading spinner
    showLoading();

    // Simulate loading time for smooth transition
    setTimeout(() => {
        // Show selected page
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.style.display = 'block';
            targetPage.classList.add('active');
            currentPage = pageId;
            
            // Update navigation
            updateNavigation(pageId);
            
            // Scroll to top
            window.scrollTo(0, 0);
            
            // Trigger animations
            triggerPageAnimations(pageId);
        }
        hideLoading();
    }, 300);

    // Close mobile menu if open
    if (mobileMenuOpen) {
        toggleMobileMenu();
    }
}

function showDetail(type, id) {
    const detailId = `${type}-${id}`;
    const detailPage = document.getElementById(detailId);
    
    if (detailPage) {
        // Hide current page
        const currentPageElement = document.getElementById(currentPage);
        if (currentPageElement) {
            currentPageElement.classList.remove('active');
            currentPageElement.style.display = 'none';
        }

        // Show the detail pages container
        const detailContainer = document.getElementById('detailPages');
        if (detailContainer) {
            detailContainer.style.display = 'block';
        }

        // Show loading
        showLoading();
        
        setTimeout(() => {
            detailPage.style.display = 'block';
            detailPage.classList.add('active');
            window.scrollTo(0, 0);
            hideLoading();
        }, 300);
    }
}

function updateNavigation(activePageId) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });

    const activeLink = document.querySelector(`[onclick="showPage('${activePageId}')"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

function initializeNavigation() {
    // Set initial active page
    updateNavigation('home');
}

function initializeMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const navLinks = document.getElementById('navLinks');

    mobileMenu.addEventListener('click', toggleMobileMenu);

    // Close mobile menu when clicking on a link
    navLinks.addEventListener('click', () => {
        if (mobileMenuOpen) {
            toggleMobileMenu();
        }
    });
}

function toggleMobileMenu() {
    const navLinks = document.getElementById('navLinks');
    const mobileMenu = document.getElementById('mobileMenu');
    
    mobileMenuOpen = !mobileMenuOpen;
    
    if (mobileMenuOpen) {
        navLinks.classList.add('active');
        mobileMenu.classList.add('active');
    } else {
        navLinks.classList.remove('active');
        mobileMenu.classList.remove('active');
    }
}

function initializeScrollEffects() {
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    // Observe all cards and sections
    const observeElements = document.querySelectorAll('.card, .timeline-item, .skill-category');
    observeElements.forEach(el => observer.observe(el));
}

function initializeAnimations() {
    // Add staggered animation delays to cards
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });

    // Add hover effects to navigation links
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

function triggerPageAnimations(pageId) {
    const page = document.getElementById(pageId);
    if (!page) return;

    const animatedElements = page.querySelectorAll('.card, .timeline-item, .skill-category');
    
    animatedElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

function initializeSocialLinks() {
    const socialLinks = document.querySelectorAll('.social-link');
    
    socialLinks.forEach(link => {
        // Add click tracking
        link.addEventListener('click', function(e) {
            const platform = this.classList[1].replace('-link', '');
            console.log(`Social link clicked: ${platform}`);
            
            // Add a subtle click animation
            this.style.transform = 'translateY(-5px) scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });

        // Add touch support for mobile
        link.addEventListener('touchstart', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });

        link.addEventListener('touchend', function() {
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });

    // Add copy to clipboard functionality for email
    const emailLink = document.querySelector('.email-link');
    if (emailLink) {
        emailLink.addEventListener('click', function(e) {
            // Only copy to clipboard, don't open email client
            e.preventDefault();
            
            const email = 'rkadelofficial@gmail.com';
            
            if (navigator.clipboard) {
                navigator.clipboard.writeText(email).then(() => {
                    showNotification('Email copied to clipboard!');
                });
            } else {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = email;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                showNotification('Email copied to clipboard!');
            }
        });
    }
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--primary-color);
        color: white;
        padding: 1rem 2rem;
        border-radius: 50px;
        font-weight: 500;
        z-index: 10000;
        animation: slideUpFade 3s ease forwards;
        box-shadow: var(--shadow);
    `;

    // Add animation keyframes if not already added
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideUpFade {
                0% {
                    opacity: 0;
                    transform: translateX(-50%) translateY(20px);
                }
                20%, 80% {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
                100% {
                    opacity: 0;
                    transform: translateX(-50%) translateY(-20px);
                }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    // Remove notification after animation
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

function showLoading() {
    document.getElementById('loading').style.display = 'block';
}

function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

// Smooth scrolling for internal links
document.addEventListener('click', function(e) {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const href = e.target.getAttribute('href');
        
        // Check if href has content after the #
        if (href && href.length > 1) {
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    }
});

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && mobileMenuOpen) {
        toggleMobileMenu();
    }
});

// Performance optimization: Lazy load images when implemented
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', lazyLoadImages);

// Add some interactive elements
function addInteractiveEffects() {
    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        if (currentPage === 'home') {
            const scrolled = window.pageYOffset;
            const hero = document.querySelector('.hero');
            if (hero) {
                hero.style.transform = `translateY(${scrolled * 0.5}px)`;
            }
        }
    });

    // Mouse follow effect for cards
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    });
}

// Initialize interactive effects
document.addEventListener('DOMContentLoaded', addInteractiveEffects);

// Add typing effect for hero text
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect when home page is shown
function initializeTypingEffect() {
    if (currentPage === 'home') {
        const subtitle = document.querySelector('.hero .subtitle');
        if (subtitle) {
            setTimeout(() => {
                typeWriter(subtitle, 'PhD Researcher & Full-Stack Developer', 80);
            }, 1500);
        }
    }
}

// Call typing effect on page load
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initializeTypingEffect, 2000);
});

// Add search functionality (for future enhancement)
function initializeSearch() {
    // This could be expanded to include search across projects, papers, etc.
    const searchData = {
        projects: ['AI Assistant', 'E-commerce Platform', 'Data Visualization', 'Blockchain Identity'],
        papers: ['Interpretable AI', 'Adaptive UI', 'Federated Learning', 'Quantum ML'],
        skills: ['Python', 'JavaScript', 'React', 'TensorFlow', 'Machine Learning']
    };
    
    // Future: Add search bar and functionality
}

// Analytics tracking (placeholder for future implementation)
function trackPageView(page) {
    // Future: Add analytics tracking
    console.log(`Page viewed: ${page}`);
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('An error occurred:', e.error);
    // Future: Add error reporting
});

// Service worker registration (for offline functionality)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Future: Register service worker for offline functionality
        console.log('Service worker support detected');
    });
}