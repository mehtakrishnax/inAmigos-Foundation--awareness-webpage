/* ==========================================================================
   INAMIGOS FOUNDATION - INTERACTIVE LOGIC (VANILLA JS)
   Implements: Scroll Spy, Sticky Header, Stats Animation, Testimonial Carousel, Modals
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initStickyHeader();
    initMobileNav();
    initScrollSpy();
    initStatsCounter();
    initTestimonialSlider();
    initModalClosures();
});

/* --- 1. Sticky Header Scroll Effect --- */
function initStickyHeader() {
    const header = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/* --- 2. Mobile Menu Drawer Drawer --- */
function initMobileNav() {
    const toggleBtn = document.getElementById('mobile-toggle');
    const mobileMenu = document.getElementById('mobile-nav');

    toggleBtn.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.contains('active');
        if (isOpen) {
            mobileMenu.classList.remove('active');
            toggleBtn.classList.remove('open');
        } else {
            mobileMenu.classList.add('active');
            toggleBtn.classList.add('open');
        }
    });
}

function toggleMobileMenu() {
    const toggleBtn = document.getElementById('mobile-toggle');
    const mobileMenu = document.getElementById('mobile-nav');
    mobileMenu.classList.remove('active');
    toggleBtn.classList.remove('open');
}

/* --- 3. Scroll Spy & Active Nav Link Highlight --- */
function initScrollSpy() {
    const sections = document.querySelectorAll('.id-anchor, .hero-section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let currentSectionId = 'top';
        const scrollPosition = window.scrollY + 120; // Offset for sticky navbar

        sections.forEach(sec => {
            const top = sec.offsetTop;
            const height = sec.offsetHeight;
            const id = sec.getAttribute('id') || 'about';

            if (scrollPosition >= top && scrollPosition < top + height) {
                currentSectionId = id;
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${currentSectionId}` || (currentSectionId === 'top' && href === '#about')) {
                // Default home state highlighting
                if (currentSectionId !== 'top' || href === '#about') {
                    link.classList.add('active');
                }
            }
        });
    });
}

/* --- 4. Animated Statistics Counters on Scroll --- */
function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const countUp = (element) => {
        const target = parseInt(element.getAttribute('data-target'), 10);
        const duration = 2000; // Total count duration in ms
        const stepTime = 20; // Interval frequency
        const stepCount = duration / stepTime;
        const increment = target / stepCount;
        
        let currentVal = 0;
        let steps = 0;

        const timer = setInterval(() => {
            currentVal += increment;
            steps++;
            
            // Format output (e.g. adds commas or plus signs)
            if (steps >= stepCount) {
                element.textContent = target.toLocaleString() + '+';
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(currentVal).toLocaleString();
            }
        }, stepTime);
    };

    // IntersectionObserver to only animate counters when they enter the viewport
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                countUp(entry.target);
                observer.unobserve(entry.target); // Runs only once
            }
        });
    }, {
        threshold: 0.2
    });

    statNumbers.forEach(num => observer.observe(num));
}

/* --- 5. Testimonial Slider Carousel --- */
let activeSlideIndex = 0;
let slideInterval = null;

function initTestimonialSlider() {
    const prevBtn = document.getElementById('prev-slide');
    const nextBtn = document.getElementById('next-slide');
    
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            navigateSlide(-1);
            resetAutoPlay();
        });
        nextBtn.addEventListener('click', () => {
            navigateSlide(1);
            resetAutoPlay();
        });
    }

    startAutoPlay();
}

function navigateSlide(direction) {
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.slider-dot');
    
    if (slides.length === 0) return;

    // Remove active class
    slides[activeSlideIndex].classList.remove('active');
    dots[activeSlideIndex].classList.remove('active');

    // Calculate next active slide
    activeSlideIndex += direction;
    if (activeSlideIndex >= slides.length) {
        activeSlideIndex = 0;
    } else if (activeSlideIndex < 0) {
        activeSlideIndex = slides.length - 1;
    }

    // Set new active classes
    slides[activeSlideIndex].classList.add('active');
    dots[activeSlideIndex].classList.add('active');
}

function goToSlide(slideIdx) {
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.slider-dot');
    
    if (slides.length === 0) return;

    slides[activeSlideIndex].classList.remove('active');
    dots[activeSlideIndex].classList.remove('active');

    activeSlideIndex = slideIdx;

    slides[activeSlideIndex].classList.add('active');
    dots[activeSlideIndex].classList.add('active');
    
    resetAutoPlay();
}

function startAutoPlay() {
    slideInterval = setInterval(() => {
        navigateSlide(1);
    }, 5000); // Transitions slide every 5 seconds
}

function resetAutoPlay() {
    clearInterval(slideInterval);
    startAutoPlay();
}

/* --- 6. Overlay Modal Handlers --- */
function openModal(modalId, category = '', presetAmount = null) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    // Contextual form filling if available
    if (category) {
        if (modalId === 'donation-modal') {
            const projectSelect = document.getElementById('donor-project');
            if (projectSelect) {
                // Find matching option
                for (let i = 0; i < projectSelect.options.length; i++) {
                    if (projectSelect.options[i].value.toLowerCase().includes(category.toLowerCase())) {
                        projectSelect.selectedIndex = i;
                        break;
                    }
                }
            }
        }
    }

    if (presetAmount && modalId === 'donation-modal') {
        setCustomAmount(presetAmount);
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent main body scrolling when modal is open
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = 'auto'; // Restore scrolling
}

// Close modals when clicking the dim overlay background
function initModalClosures() {
    const overlays = document.querySelectorAll('.modal-overlay');
    overlays.forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeModal(overlay.getAttribute('id'));
            }
        });
    });
}

/* --- 7. Preset Donation Controls --- */
function setCustomAmount(amount) {
    const amountInput = document.getElementById('donor-amount');
    const presetBtns = document.querySelectorAll('.preset-btn');
    
    if (amountInput) {
        amountInput.value = amount;
    }

    // Toggle active design styles on preset option buttons
    presetBtns.forEach(btn => {
        btn.classList.remove('active');
        const cleanBtnText = btn.textContent.replace('₹', '').replace(',', '').trim();
        if (parseInt(cleanBtnText, 10) === amount) {
            btn.classList.add('active');
        }
    });
}

// Custom amount input listener to untoggle active presets if custom values are typed
const donorAmtInput = document.getElementById('donor-amount');
if (donorAmtInput) {
    donorAmtInput.addEventListener('input', () => {
        const val = parseInt(donorAmtInput.value, 10);
        const presetBtns = document.querySelectorAll('.preset-btn');
        presetBtns.forEach(btn => {
            const cleanBtnText = btn.textContent.replace('₹', '').replace(',', '').trim();
            if (parseInt(cleanBtnText, 10) === val) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    });
}

/* --- 8. Dynamic Modal Form Submissions --- */
function handleFormSubmit(event, type) {
    event.preventDefault();
    const form = event.target;
    
    // Simple verification check
    if (!form.checkValidity()) return;

    const data = new FormData(form);
    const applicantName = data.get('name') || 'Friend';

    if (type === 'internship') {
        const role = data.get('role');
        const overlay = document.getElementById('intern-modal');
        overlay.classList.remove('active');
        document.body.style.overflow = 'auto';
        
        // Show high-end premium notification
        alert(`🌟 Success! Thank you, ${applicantName}.\nYour application for the "${role}" profile under Project Vikas has been submitted successfully to the InAmigos HR team.\nOur coordinators will reach out on WhatsApp within 48 hours.`);
    } 
    else if (type === 'donation') {
        const project = data.get('project');
        const amt = data.get('amount');
        const overlay = document.getElementById('donation-modal');
        overlay.classList.remove('active');
        document.body.style.overflow = 'auto';
        
        // Show custom success notification
        alert(`❤️ Thank you for your support, ${applicantName}!\nYour donation pledge of ₹${parseInt(amt, 10).toLocaleString()} for "${project}" has been recorded.\nAn automated email with 80G tax benefit claim steps and our bank UPI account details has been sent to your email.`);
    }

    form.reset();
}
