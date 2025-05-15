document.addEventListener('DOMContentLoaded', () => {
    // Hamburger menu toggle
    const hamburger = document.querySelector('#hamburger');
    const navContainer = document.querySelector('.nav-container');

    if (hamburger && navContainer) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navContainer.classList.toggle('active');
        });
    }

    // Dropdown menu toggle for mobile
    // Dropdown menu toggle for mobile
const dropdowns = document.querySelectorAll('.dropdown');
dropdowns.forEach(dropdown => {
    const dropdownToggle = dropdown.querySelector('a');
    dropdownToggle.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            e.preventDefault();
            const isActive = dropdown.classList.toggle('active');
            // Close other dropdowns
            dropdowns.forEach(otherDropdown => {
                if (otherDropdown !== dropdown) {
                    otherDropdown.classList.remove('active');
                }
            });
        }
    });
});

    // Close mobile menu when clicking a link
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768 && !link.parentElement.classList.contains('dropdown')) {
                hamburger.classList.remove('active');
                navContainer.classList.remove('active');
                dropdowns.forEach(dropdown => dropdown.classList.remove('active'));
            }
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && navContainer && hamburger && !navContainer.contains(e.target) && !hamburger.contains(e.target)) {
            hamburger.classList.remove('active');
            navContainer.classList.remove('active');
            dropdowns.forEach(dropdown => dropdown.classList.remove('active'));
        }
    });

    // Set active class based on current page
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Newsletter form submission
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            if (emailInput.value) {
                alert('Thank you for subscribing!');
                newsletterForm.reset();
            } else {
                alert('Please enter a valid email address.');
            }
        });
    }

    // Fade-in animations for sections
    const fadeInSections = document.querySelectorAll('.hero, .about-section, .services-section, .why-choose-us, .success-counter, .cta, .faq-section');
    const observerOptions = {
        threshold: 0.1
    };

    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeInSections.forEach(section => {
        fadeObserver.observe(section);
    });

    // FAQ accordion functionality
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            item.classList.toggle('active');
        });
    });

    // Back to Top Button
    const backToTopButton = document.createElement('div');
    backToTopButton.className = 'back-to-top';
    backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(backToTopButton);

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('active');
        } else {
            backToTopButton.classList.remove('active');
        }
    });

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Counter animation for stats-counter and success-counter
    const animateCounters = () => {
        // Stats Counter (uses .stat-number with data-count)
        const statNumbers = document.querySelectorAll('.stats-counter .stat-number');
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            let count = 0;
            const increment = target / 100;
            const isPercentage = stat.getAttribute('data-count') === '95';

            const updateStat = () => {
                if (count < target) {
                    count += increment;
                    stat.innerText = Math.ceil(count) + (isPercentage ? '%' : '+');
                    requestAnimationFrame(updateStat);
                } else {
                    stat.innerText = target + (isPercentage ? '%' : '+');
                }
            };
            updateStat();
        });

        // Success Counter (uses .counter-item h3 with predefined values)
        const counterItems = document.querySelectorAll('.success-counter .counter-item h3');
        const targets = [500, 200, 95]; // Students Placed, Partner Universities, Visa Success Rate
        counterItems.forEach((counter, index) => {
            let count = 0;
            const target = targets[index];
            const increment = target / 100;
            const isPercentage = index === 2; // Visa Success Rate is percentage

            const updateCounter = () => {
                if (count < target) {
                    count += increment;
                    counter.innerText = Math.ceil(count) + (isPercentage ? '%' : '+');
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.innerText = target + (isPercentage ? '%' : '+');
                }
            };
            updateCounter();
        });
    };

    // Trigger counter animation when sections are in view
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const statsCounterSection = document.querySelector('.stats-counter');
    const successCounterSection = document.querySelector('.success-counter');
    if (statsCounterSection) counterObserver.observe(statsCounterSection);
    if (successCounterSection) counterObserver.observe(successCounterSection);
});
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('admission-form');
    const submitBtn = document.getElementById('submit-btn');
    const spinner = document.getElementById('spinner');
    const formMessage = document.getElementById('form-message');
    
    // Set the replyto field to match the email field
    const emailField = document.getElementById('email');
    emailField.addEventListener('change', function() {
        document.getElementById('replyto').value = this.value;
    });
    
    // Form validation
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        if (validateForm()) {
            // Show loading spinner
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            
            // Submit form via AJAX
            const formData = new FormData(form);
            
            fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    // Show success message
                    formMessage.textContent = 'Thank you! Your application has been submitted successfully. We will contact you shortly.';
                    formMessage.className = 'form-message success';
                    
                    // Reset form
                    form.reset();
                } else {
                    throw new Error('Form submission failed');
                }
            })
            .catch(error => {
                // Show error message
                formMessage.textContent = 'There was an error submitting your form. Please try again or contact us directly.';
                formMessage.className = 'form-message error';
                console.error('Error:', error);
            })
            .finally(() => {
                // Hide loading spinner
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
                
                // Scroll to message
                formMessage.scrollIntoView({ behavior: 'smooth' });
            });
        }
    });
    
    // Validate individual fields on blur
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        field.addEventListener('blur', function() {
            validateField(this);
        });
    });
    
    // File input validation
    const fileInputs = form.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => {
        input.addEventListener('change', function() {
            validateFileInput(this);
        });
    });
    
    // Function to validate the entire form
    function validateForm() {
        let isValid = true;
        
        // Validate all required fields
        requiredFields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });
        
        // Validate file inputs
        fileInputs.forEach(input => {
            if (input.required && !validateFileInput(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    // Function to validate a single field
    function validateField(field) {
        const formGroup = field.closest('.form-group');
        const errorMessage = formGroup.querySelector('.error-message');
        
        if (!field.value.trim()) {
            formGroup.classList.add('error');
            errorMessage.textContent = 'This field is required';
            return false;
        }
        
        // Special validation for email
        if (field.type === 'email' && !isValidEmail(field.value)) {
            formGroup.classList.add('error');
            errorMessage.textContent = 'Please enter a valid email address';
            return false;
        }
        
        // Special validation for phone
        if (field.id === 'phone' && !isValidPhone(field.value)) {
            formGroup.classList.add('error');
            errorMessage.textContent = 'Please enter a valid phone number';
            return false;
        }
        
        // Special validation for graduation year
        if (field.id === 'grad-year') {
            const year = parseInt(field.value);
            if (isNaN(year) || year < 1900 || year > new Date().getFullYear()) {
                formGroup.classList.add('error');
                errorMessage.textContent = 'Please enter a valid graduation year';
                return false;
            }
        }
        
        // If all validations pass
        formGroup.classList.remove('error');
        return true;
    }
    
    // Function to validate file inputs
    function validateFileInput(input) {
        const formGroup = input.closest('.form-group');
        const errorMessage = formGroup.querySelector('.error-message');
        
        if (input.required && !input.files.length) {
            formGroup.classList.add('error');
            errorMessage.textContent = 'This file is required';
            return false;
        }
        
        if (input.files.length) {
            const file = input.files[0];
            const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            const maxSize = 5 * 1024 * 1024; // 5MB
            
            if (!validTypes.includes(file.type)) {
                formGroup.classList.add('error');
                errorMessage.textContent = 'Invalid file type. Please upload PDF, JPG, or PNG';
                return false;
            }
            
            if (file.size > maxSize) {
                formGroup.classList.add('error');
                errorMessage.textContent = 'File too large. Max size is 5MB';
                return false;
            }
        }
        
        formGroup.classList.remove('error');
        return true;
    }
    
    // Helper function to validate email
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    // Helper function to validate phone number (basic international format)
    function isValidPhone(phone) {
        return /^[+]?[\d\s-]{8,}$/.test(phone);
    }
});
/* JavaScript for counter animation */
document.addEventListener('DOMContentLoaded', function() {
    const counters = document.querySelectorAll('.achievement-number');
    const speed = 200;
    
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-count');
        const count = +counter.innerText;
        const increment = target / speed;
        
        if(count < target) {
            counter.innerText = Math.ceil(count + increment);
            setTimeout(updateCount, 1);
        } else {
            counter.innerText = target + (counter.getAttribute('data-count') === '95' ? '%' : '+');
        }
        
        function updateCount() {
            const count = +counter.innerText;
            const increment = target / speed;
            
            if(count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(updateCount, 1);
            } else {
                counter.innerText = target + (counter.getAttribute('data-count') === '95' ? '%' : '+');
            }
        }
    });
});