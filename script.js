

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initNavigation();
    initFormSubmission();
});



function initScrollAnimations() {
    const options = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = entry.target.dataset.scroll 
                    ? 'slideInUp 0.8s ease-out forwards' 
                    : 'none';
                entry.target.style.opacity = '1';
            }
        });
    }, options);

    // Observe all elements with data-scroll attribute
    document.querySelectorAll('[data-scroll]').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        observer.observe(element);
    });
}



function initNavigation() {
    const navLinks = document.querySelectorAll('.floating-nav-links a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            // Add active class to clicked link
            link.classList.add('active');
        });
    });

    // Set active nav link based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        }
    });
}



function initFormSubmission() {
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Validate
            if (!name || !email || !subject || !message) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('Please enter a valid email', 'error');
                return;
            }
            
            // Simulate form submission
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Simulate delay
            setTimeout(() => {
                showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
                form.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }
}


function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Styles
    notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        font-weight: 600;
        z-index: 2000;
        animation: slideInRight 0.5s ease-out;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.5s ease-out reverse';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}



document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn')) {
        createRipple(e);
    }
});

function createRipple(event) {
    const button = event.target.closest('.btn');
    if (!button) return;
    
    const rect = button.getBoundingClientRect();
    const ripple = document.createElement('span');
    
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: rgba(255, 255, 255, 0.5);
        border-radius: 50%;
        left: ${x}px;
        top: ${y}px;
        pointer-events: none;
        animation: ripple 0.6s ease-out;
    `;
    
    button.style.position = 'relative';
    button.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
}

// ============================================
// SCROLL PROGRESS BAR
// ============================================

function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, #8B5CF6, #06B6D4, #EC4899);
        width: 0;
        z-index: 2001;
        background-size: 200% 100%;
        animation: scroll-gradient 2s ease-in-out infinite;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = window.scrollY / windowHeight * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// Initialize progress bar
initScrollProgress();

// ============================================
// SMOOTH PAGE TRANSITIONS
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    document.body.style.animation = 'fadeInUp 0.6s ease-out';
});

document.querySelectorAll('a:not([href^="#"])').forEach(link => {
    link.addEventListener('click', (e) => {
        // Don't prevent default for external links or actual navigation
        if (!link.getAttribute('href').startsWith('/') && 
            !link.getAttribute('href').endsWith('.html')) return;
    });
});

// ============================================
// PARALLAX EFFECT (Optional Enhancement)
// ============================================

function initParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    window.addEventListener('scroll', () => {
        parallaxElements.forEach(element => {
            const scrollPosition = window.scrollY;
            const speed = element.dataset.parallax || 0.5;
            element.style.transform = `translateY(${scrollPosition * speed}px)`;
        });
    });
}

// Uncomment to enable parallax
// initParallax();

// ============================================
// COUNTER ANIMATION
// ============================================

function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const targetText = counter.textContent;
                const target = parseInt(targetText.replace(/\D/g, ''));
                const suffix = targetText.replace(/[0-9]/g, '');
                
                let current = 0;
                const increment = target / 100;
                
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.textContent = Math.floor(current) + suffix;
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = targetText;
                    }
                };
                
                updateCounter();
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

// Initialize counters when page loads
window.addEventListener('load', animateCounters);
 function scrollToBottom() {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth"
    });
  }
// ============================================
// KEYBOARD SHORTCUTS
// ============================================

document.addEventListener('keydown', (e) => {
    // Home key - Scroll to top
    if (e.key === 'Home') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // End key - Scroll to bottom
    if (e.key === 'End') {
        e.preventDefault();
        window.scrollTo({ 
            top: document.documentElement.scrollHeight, 
            behavior: 'smooth' 
        });
    }
});

// ============================================
// MOBILE MENU (Optional Enhancement)
// ============================================

function initMobileMenu() {
    // Add mobile menu toggle if needed for future enhancement
    const navbar = document.querySelector('.navbar');
    const navContainer = document.querySelector('.nav-container');
    
    // This can be expanded for mobile hamburger menu
}

// ============================================
// THEME TOGGLE (Optional Enhancement)
// ============================================

function initThemeToggle() {
    // Light/Dark theme toggle can be added here
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

// Initialize theme
initThemeToggle();

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================

// Lazy load images
if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[data-lazy]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.lazy;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
}

// ============================================
// SCROLL TO FUNCTIONS
// ============================================

function scrollToBottom() {
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
}

// ============================================
// EVENT LISTENERS FOR PREMIUM FEATURES
// ============================================

document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        showNotification('Project details coming soon!', 'info');
    });
});

document.querySelectorAll('.social-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const platform = btn.textContent.trim();
        showNotification(`Connecting to ${platform}...`, 'info');
    });
});

// ============================================
// RESPONSIVE VIDEO EMBEDS
// ============================================

function makeVideosResponsive() {
    const videos = document.querySelectorAll('iframe');
    videos.forEach(video => {
        if (video.getAttribute('width')) {
            const aspectRatio = video.getAttribute('height') / video.getAttribute('width');
            video.style.cssText = `
                width: 100%;
                height: auto;
                aspect-ratio: ${1 / aspectRatio};
            `;
        }
    });
}

function updateIndiaTime() {
    const formatter = new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });

    const time = formatter.format(new Date());

    document.getElementById('india-time').textContent = time;
}

updateIndiaTime();
setInterval(updateIndiaTime, 1000);

fetch("https://api.counterapi.dev/v2/exlipseverses-team-4038/first-counter-4038/up")
    .then(res => res.json())
    .then(data => {
        console.log(data);
        document.getElementById("view-count").innerText = data.data.up_count;
    });


// Initialize responsive videos
makeVideosResponsive();

console.log('✨ PRISM Studio - Portfolio loaded successfully!');
