// JavaScript for AFRIK EXPRESS LOGISTICS website

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const nav = document.querySelector('nav');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            nav.style.display = nav.style.display === 'block' ? 'none' : 'block';
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 90,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Testimonial slider auto-scroll
    const testimonialSlider = document.querySelector('.testimonial-slider');
    if (testimonialSlider) {
        const testimonials = document.querySelectorAll('.testimonial');
        let currentIndex = 0;
        
        function scrollToNextTestimonial() {
            currentIndex = (currentIndex + 1) % testimonials.length;
            testimonialSlider.scrollTo({
                left: testimonials[currentIndex].offsetLeft,
                behavior: 'smooth'
            });
        }
        
        // Auto-scroll every 5 seconds
        setInterval(scrollToNextTestimonial, 5000);
    }
    
    // Add fixed header class on scroll
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.classList.add('fixed');
        } else {
            header.classList.remove('fixed');
        }
    });
    
    // Form validation for contact form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple validation
            let isValid = true;
            const requiredFields = contactForm.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
            });
            
            // Email validation
            const emailField = contactForm.querySelector('input[type="email"]');
            if (emailField && emailField.value) {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(emailField.value)) {
                    isValid = false;
                    emailField.classList.add('error');
                }
            }
            
            if (isValid) {
                // Show success message (in a real scenario, this would submit the form)
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.textContent = 'Votre message a été envoyé avec succès! Nous vous contacterons bientôt.';
                
                const formContainer = contactForm.parentElement;
                formContainer.appendChild(successMessage);
                
                // Reset form
                contactForm.reset();
                
                // Remove success message after 5 seconds
                setTimeout(() => {
                    successMessage.remove();
                }, 5000);
            }
        });
    }
});
