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
                hamburger?.classList.remove('active');
                navContainer?.classList.remove('active');
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

    // Unified counter animation function
    function animateCounter(counterElement, target, isPercentage = false) {
        let count = 0;
        const increment = target / 100;
        
        function updateCounter() {
            if (count < target) {
                count += increment;
                counterElement.innerText = Math.ceil(count) + (isPercentage ? '%' : '+');
                requestAnimationFrame(updateCounter);
            } else {
                counterElement.innerText = target + (isPercentage ? '%' : '+');
            }
        }
        
        updateCounter();
    }

    // Counter animation observer
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Stats Counter
                document.querySelectorAll('.stats-counter .stat-number, .achievement-number').forEach(stat => {
                    const target = parseInt(stat.getAttribute('data-count'));
                    const isPercentage = stat.getAttribute('data-count')?.endsWith('%') || stat.getAttribute('data-count') === '95';
                    animateCounter(stat, target, isPercentage);
                });

                // Success Counter
                const successCounters = document.querySelectorAll('.success-counter .counter-item h3');
                const targets = [500, 200, 95]; // Students Placed, Partner Universities, Visa Success Rate
                successCounters.forEach((counter, index) => {
                    animateCounter(counter, targets[index], index === 2);
                });

                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    // Observe all counter sections
    document.querySelectorAll('.stats-counter, .success-counter, .achievements-section').forEach(section => {
        if (section) counterObserver.observe(section);
    });

    // Unified form handling
    const admissionForm = document.getElementById('admission-form');
    if (admissionForm) {
        // Set the replyto field to match the email field
        const emailField = document.getElementById('email');
        if (emailField) {
            emailField.addEventListener('change', function() {
                document.getElementById('replyto').value = this.value;
            });
        }

        // Form validation functions
        function isValidEmail(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        }

        function isValidPhone(phone) {
            return /^[+]?[\d\s-]{8,}$/.test(phone);
        }

        function validateField(field) {
            const formGroup = field.closest('.form-group');
            const errorMessage = formGroup?.querySelector('.error-message');
            
            if (!formGroup || !errorMessage) return true;
            
            let isValid = true;
            let message = 'This field is required';
            
            if (!field.value.trim()) {
                isValid = false;
            } 
            else if (field.type === 'email' && !isValidEmail(field.value)) {
                isValid = false;
                message = 'Please enter a valid email address';
            }
            else if (field.id === 'phone' && !isValidPhone(field.value)) {
                isValid = false;
                message = 'Please enter a valid phone number';
            }
            else if (field.id === 'grad-year') {
                const year = parseInt(field.value);
                if (isNaN(year) || year < 1900 || year > new Date().getFullYear()) {
                    isValid = false;
                    message = 'Please enter a valid graduation year';
                }
            }
            else if (field.id === 'countries') {
    const selected = field.selectedOptions.length;
    if (selected < 3 || selected > 4) {
        isValid = false;
        message = 'Please select 3 to 4 countries';
    }
}
            
            if (!isValid) {
                formGroup.classList.add('error');
                errorMessage.textContent = message;
                errorMessage.style.display = 'block';
            } else {
                formGroup.classList.remove('error');
                errorMessage.style.display = 'none';
            }
            
            return isValid;
        }

        function validateFileInput(input) {
            const formGroup = input.closest('.form-group');
            const errorMessage = formGroup?.querySelector('.error-message');
            
            if (!formGroup || !errorMessage) return true;
            
            let isValid = true;
            
            if (input.required && !input.files.length) {
                isValid = false;
                errorMessage.textContent = 'This file is required';
            }
            else if (input.files.length) {
                const file = input.files[0];
                const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
                const maxSize = 5 * 1024 * 1024; // 5MB
                
                if (!validTypes.includes(file.type)) {
                    isValid = false;
                    errorMessage.textContent = 'Invalid file type. Please upload PDF, JPG, or PNG';
                }
                else if (file.size > maxSize) {
                    isValid = false;
                    errorMessage.textContent = 'File too large. Max size is 5MB';
                }
            }
            
            if (!isValid) {
                formGroup.classList.add('error');
                errorMessage.style.display = 'block';
            } else {
                formGroup.classList.remove('error');
                errorMessage.style.display = 'none';
            }
            
            return isValid;
        }

        // Validate individual fields on blur
        const requiredFields = admissionForm.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            field.addEventListener('blur', function() {
                validateField(this);
            });
        });

        // File input validation
        const fileInputs = admissionForm.querySelectorAll('input[type="file"]');
        fileInputs.forEach(input => {
            input.addEventListener('change', function() {
                validateFileInput(this);
            });
        });

        // Form submission
        admissionForm.addEventListener('submit', function(e) {
            e.preventDefault();
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
            
            if (isValid) {
                const submitBtn = document.getElementById('submit-btn');
                const spinner = document.getElementById('spinner');
                const formMessage = document.getElementById('form-message');
                
                // Show loading spinner
                if (submitBtn) {
                    submitBtn.classList.add('loading');
                    submitBtn.disabled = true;
                }
                if (spinner) spinner.style.display = 'inline-block';
                
                // Submit form via AJAX
                const formData = new FormData(admissionForm);
                
                fetch(admissionForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                })
                .then(response => {
                    if (response.ok) {
                        // Show success message
                        if (formMessage) {
                            formMessage.textContent = 'Thank you! Your application has been submitted successfully. We will contact you shortly.';
                            formMessage.className = 'form-message success';
                        }
                        
                        // Reset form
                        admissionForm.reset();
                    } else {
                        throw new Error('Form submission failed');
                    }
                })
                .catch(error => {
                    // Show error message
                    if (formMessage) {
                        formMessage.textContent = 'There was an error submitting your form. Please try again or contact us directly.';
                        formMessage.className = 'form-message error';
                    }
                    console.error('Error:', error);
                })
                .finally(() => {
                    // Hide loading spinner
                    if (submitBtn) {
                        submitBtn.classList.remove('loading');
                        submitBtn.disabled = false;
                    }
                    if (spinner) spinner.style.display = 'none';
                    
                    // Scroll to message
                    if (formMessage) formMessage.scrollIntoView({ behavior: 'smooth' });
                });
            }
        });
    }
});