// Modern Banking JavaScript - Form Handling and Interactions

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initFormSteps();
    initFAQ();
    initMobileMenu();
    initSmoothScrolling();
    initConsentCheckbox();
    initApplyNowButton();
    initBottomApplyNowShake();
    initDisclaimerScroll();
    initLegalPagesCTA();
    initFormAnchor();
    initLegalPageReturn();
});

// Form Step Management
function initFormSteps() {
    const form = document.getElementById('loan-application');
    if (!form) return;
    
    const steps = form.querySelectorAll('.form-step');
    const prevButtons = form.querySelectorAll('.btn-prev');
    const submitButton = form.querySelector('.btn-submit');
    
    let currentStep = 1;
    const totalSteps = 27; // Updated to match Fund Finance form structure
    
    // Auto-advance functionality for all radio button steps
    const radioGroups = form.querySelectorAll('.radio-group');
    radioGroups.forEach(group => {
        const radioButtons = group.querySelectorAll('input[type="radio"]');
        radioButtons.forEach(radio => {
            radio.addEventListener('change', () => {
                // Save the selected radio button value
                const stepName = getStepFieldName(currentStep);
                if (stepName) {
                    const formData = JSON.parse(localStorage.getItem('formData') || '{}');
                    formData[stepName] = radio.value;
                    localStorage.setItem('formData', JSON.stringify(formData));
                }
                
                // Auto-advance for all radio button steps
                setTimeout(() => {
                    if (currentStep < totalSteps) {
                        currentStep++;
                        showStep(currentStep);
                        updateProgress();
                    }
                }, 500);
            });
        });
    });
    
    // Auto-advance functionality only for Steps 1 and 2 (text inputs and selects)
    const textInputs = form.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], input[type="date"]');
    const selectInputs = form.querySelectorAll('select');
    
    textInputs.forEach(input => {
        input.addEventListener('blur', () => {
            // Only auto-advance for Steps 1 and 2
            if (currentStep <= 2 && input.value.trim() && isStepComplete(currentStep)) {
                setTimeout(() => {
                    if (currentStep < totalSteps) {
                        currentStep++;
                        showStep(currentStep);
                        updateProgress();
                    }
                }, 300);
            }
        });
    });
    
    selectInputs.forEach(select => {
        select.addEventListener('change', () => {
            // Only auto-advance for Steps 1 and 2
            if (currentStep <= 2 && select.value && isStepComplete(currentStep)) {
                setTimeout(() => {
                    if (currentStep < totalSteps) {
                        currentStep++;
                        showStep(currentStep);
                        updateProgress();
                    }
                }, 300);
            }
        });
    });
    
    // Previous button functionality
    prevButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (currentStep > 1) {
                currentStep--;
                
                // Clear radio button selection from the step we're going back to
                const previousStepElement = document.querySelector(`[data-step="${currentStep}"]`);
                if (previousStepElement) {
                    const radioButtons = previousStepElement.querySelectorAll('input[type="radio"]');
                    radioButtons.forEach(radio => {
                        radio.checked = false;
                    });
                    
                    // Clear any saved form data for this step
                    const formData = JSON.parse(localStorage.getItem('formData') || '{}');
                    const stepName = getStepFieldName(currentStep);
                    if (stepName && formData[stepName]) {
                        delete formData[stepName];
                        localStorage.setItem('formData', JSON.stringify(formData));
                    }
                }
                
                showStep(currentStep);
                updateProgress();
            }
        });
    });
    
    // Helper function to get field name based on step number
    function getStepFieldName(stepNumber) {
        const stepFieldMap = {
            1: 'loanAmount',
            2: 'creditScore',
            7: 'residenceTime',
            8: 'residenceType',
            9: 'incomeSource',
            10: 'employmentTime',
            11: 'payFrequency',
            12: 'monthlyIncome',
            16: 'paycheckMethod',
            19: 'accountType',
            20: 'accountLength',
            26: 'creditTrial'
        };
        return stepFieldMap[stepNumber];
    }
    
    // Next button functionality
    const nextButtons = form.querySelectorAll('.btn-next');
    nextButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (validateCurrentStep()) {
                if (currentStep < totalSteps) {
                    currentStep++;
                    showStep(currentStep);
                    updateProgress();
                }
            }
        });
    });
    
    // Submit button functionality
    if (submitButton) {
        submitButton.addEventListener('click', (e) => {
            e.preventDefault();
            if (validateCurrentStep()) {
                submitForm();
            }
        });
    }
    
    function showStep(stepNumber) {
        steps.forEach((step, index) => {
            if (index + 1 === stepNumber) {
                step.classList.add('active');
                step.style.display = 'block';
            } else {
                step.classList.remove('active');
                step.style.display = 'none';
            }
        });
    }
    
    function updateProgress() {
        const progressFill = document.querySelector('.progress-fill');
        if (progressFill) {
            const percentage = (currentStep / totalSteps) * 100;
            progressFill.style.width = `${percentage}%`;
        }
    }
    
    function isStepComplete(stepNumber) {
        const currentStepElement = document.querySelector(`[data-step="${stepNumber}"]`);
        if (!currentStepElement) return false;
        
        const requiredFields = currentStepElement.querySelectorAll('[required]');
        let allFieldsFilled = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                allFieldsFilled = false;
            }
        });
        
        return allFieldsFilled;
    }
    
    function validateCurrentStep() {
        const currentStepElement = document.querySelector(`[data-step="${currentStep}"]`);
        if (!currentStepElement) return true;
        
        let isValid = true;
        
        // Check for radio button groups
        const radioGroups = currentStepElement.querySelectorAll('.radio-group');
        radioGroups.forEach(group => {
            const radioButtons = group.querySelectorAll('input[type="radio"]');
            const name = radioButtons[0]?.name;
            const checkedRadio = group.querySelector(`input[name="${name}"]:checked`);
            
            if (!checkedRadio) {
                isValid = false;
                // Show error on the radio group
                const errorElement = group.querySelector('.field-error');
                if (!errorElement) {
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'field-error';
                    errorDiv.style.color = 'var(--error)';
                    errorDiv.style.fontSize = 'var(--font-size-sm)';
                    errorDiv.style.marginTop = 'var(--spacing-1)';
                    errorDiv.textContent = 'Please select an option';
                    group.appendChild(errorDiv);
                }
            } else {
                // Clear error if radio is selected
                const errorElement = group.querySelector('.field-error');
                if (errorElement) {
                    errorElement.remove();
                }
            }
        });
        
        // Check for other required fields
        const requiredFields = currentStepElement.querySelectorAll('input[required], select[required]');
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                showFieldError(field, 'This field is required');
            } else {
                clearFieldError(field);
            }
        });
        
        // Additional validation for specific fields
        if (currentStep === 5) {
            // Step 5 is Zip Code - validate zip code
            const zipCode = document.getElementById('zipCode');
            if (zipCode && !isValidZipCode(zipCode.value)) {
                isValid = false;
                showFieldError(zipCode, 'Please enter a valid ZIP code');
            }
        }
        
        if (currentStep === 15) {
            // Step 15 is Employer Phone - validate employer phone
            const employerPhone = document.getElementById('employerPhone');
            
            if (employerPhone && !isValidPhone(employerPhone.value)) {
                isValid = false;
                showFieldError(employerPhone, 'Please enter a valid phone number');
            }
        }
        
        if (currentStep === 17) {
            // Step 17 is ABA Routing Number - validate routing number
            const routingNumber = document.getElementById('routingNumber');
            
            if (routingNumber && !isValidRoutingNumber(routingNumber.value)) {
                isValid = false;
                showFieldError(routingNumber, 'Please enter a valid 9-digit routing number');
            }
        }
        
        if (currentStep === 21) {
            // Step 21 is Bank Account Number - validate account number
            const accountNumber = document.getElementById('accountNumber');
            
            if (accountNumber && !isValidAccountNumber(accountNumber.value)) {
                isValid = false;
                showFieldError(accountNumber, 'Please enter a valid account number');
            }
        }
        
        if (currentStep === 24) {
            // Step 24 is Email - validate email
            const email = document.getElementById('email');
            
            if (email && !isValidEmail(email.value)) {
                isValid = false;
                showFieldError(email, 'Please enter a valid email address');
            }
        }
        
        if (currentStep === 25) {
            // Step 25 is Mobile Number - validate phone
            const phone = document.getElementById('phone');
            
            if (phone && !isValidPhone(phone.value)) {
                isValid = false;
                showFieldError(phone, 'Please enter a valid phone number');
            }
        }
        
        return isValid;
    }
    
    function showFieldError(field, message) {
        const formGroup = field.closest('.form-group');
        if (!formGroup) return;
        
        const existingError = formGroup.querySelector('.field-error');
        
        if (!existingError) {
            const errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            errorElement.style.color = 'var(--error)';
            errorElement.style.fontSize = 'var(--font-size-sm)';
            errorElement.style.marginTop = 'var(--spacing-1)';
            errorElement.textContent = message;
            formGroup.appendChild(errorElement);
        }
        
        field.style.borderColor = 'var(--error)';
    }
    
    function clearFieldError(field) {
        const formGroup = field.closest('.form-group');
        if (!formGroup) return;
        
        const errorElement = formGroup.querySelector('.field-error');
        
        if (errorElement) {
            errorElement.remove();
        }
        
        field.style.borderColor = 'var(--gray-200)';
    }
    

}

// Global form submission function
function submitForm() {
    const submitButton = document.querySelector('#submit-btn');
    const originalText = submitButton.textContent;
    
    // Show loading state
    submitButton.textContent = 'Processing...';
    submitButton.disabled = true;
    
    // Collect form data - All 30 fields from the 27-step form
    const formData = {
        // Step 1: Loan Amount
        loanAmount: document.querySelector('input[name="loanAmount"]:checked')?.value || '',
        
        // Step 2: Credit Score
        creditScore: document.querySelector('input[name="creditScore"]:checked')?.value || '',
        
        // Step 3: Legal Name
        title: document.getElementById('title')?.value || '',
        firstName: document.getElementById('firstName')?.value || '',
        lastName: document.getElementById('lastName')?.value || '',
        
        // Step 4: Date of Birth
        birthDate: document.getElementById('birthDate')?.value || '',
        
        // Step 5: Zip Code
        zipCode: document.getElementById('zipCode')?.value || '',
        
        // Step 6: Street Address
        address: document.getElementById('address')?.value || '',
        city: document.getElementById('city')?.value || '',
        
        // Step 7: Time at Current Residence
        residenceTime: document.querySelector('input[name="residenceTime"]:checked')?.value || '',
        
        // Step 8: Rent or Own
        residenceType: document.querySelector('input[name="residenceType"]:checked')?.value || '',
        
        // Step 9: Source of Income
        incomeSource: document.querySelector('input[name="incomeSource"]:checked')?.value || '',
        
        // Step 10: Time Employed
        employmentTime: document.querySelector('input[name="employmentTime"]:checked')?.value || '',
        
        // Step 11: Pay Frequency
        payFrequency: document.querySelector('input[name="payFrequency"]:checked')?.value || '',
        
        // Step 12: Monthly Gross Income
        monthlyIncome: document.querySelector('input[name="monthlyIncome"]:checked')?.value || '',
        
        // Step 13: Next Pay Date
        nextPayDate: document.getElementById('nextPayDate')?.value || '',
        
        // Step 14: Employer Information
        employer: document.getElementById('employer')?.value || '',
        jobTitle: document.getElementById('jobTitle')?.value || '',
        
        // Step 15: Employer Phone
        employerPhone: document.getElementById('employerPhone')?.value || '',
        
        // Step 16: Paycheck Method
        paycheckMethod: document.querySelector('input[name="paycheckMethod"]:checked')?.value || '',
        
        // Step 17: ABA Routing Number
        routingNumber: document.getElementById('routingNumber')?.value || '',
        
        // Step 18: Bank Name
        bankName: document.getElementById('bankName')?.value || '',
        
        // Step 19: Bank Account Type
        accountType: document.querySelector('input[name="accountType"]:checked')?.value || '',
        
        // Step 20: Length of Bank Account
        accountLength: document.querySelector('input[name="accountLength"]:checked')?.value || '',
        
        // Step 21: Bank Account Number
        accountNumber: document.getElementById('accountNumber')?.value || '',
        
        // Step 22: Driver's License
        driversLicense: document.getElementById('driversLicense')?.value || '',
        licenseState: document.getElementById('licenseState')?.value || '',
        
        // Step 23: Social Security Number
        ssn: document.getElementById('ssn')?.value || '',
        
        // Step 24: Email
        email: document.getElementById('email')?.value || '',
        
        // Step 25: Mobile Number
        phone: document.getElementById('phone')?.value || '',
        
        // Step 26: Credit Report Trial
        creditTrial: document.querySelector('input[name="creditTrial"]:checked')?.value || '',
        
        // Additional metadata
        submissionDate: new Date().toISOString(),
        userAgent: navigator.userAgent,
        timestamp: Date.now()
    };
    
    // Debug: Log the collected data
    console.log('Form data being sent:', formData);
    console.log('Total fields collected:', Object.keys(formData).length);
    
    // Validate that all required fields are collected
    const requiredFields = [
        'loanAmount', 'creditScore', 'title', 'firstName', 'lastName', 'birthDate', 
        'zipCode', 'address', 'city', 'residenceTime', 'residenceType', 'incomeSource',
        'employmentTime', 'payFrequency', 'monthlyIncome', 'nextPayDate', 'employer',
        'jobTitle', 'employerPhone', 'paycheckMethod', 'routingNumber', 'bankName',
        'accountType', 'accountLength', 'accountNumber', 'driversLicense', 'licenseState',
        'ssn', 'email', 'phone', 'creditTrial'
    ];
    
    const missingFields = requiredFields.filter(field => !formData[field]);
    if (missingFields.length > 0) {
        console.warn('Missing required fields:', missingFields);
        alert('Please complete all required fields before submitting.');
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        return;
    }
    
    // Send to Google Sheets
    fetch('https://script.google.com/macros/s/AKfycbz7QDfKyYpyd8tTxGUyjQVYN2jXXToynpTpFHEBnG5ri-RrIQFMX41hWoX696jn1J7W/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
    .then((response) => {
        console.log('Form submitted successfully to Google Sheets');
        showSuccessMessage();
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        // Clear saved form data
        localStorage.removeItem('loanApplicationData');
        
        // Optional: Track submission in analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_submit', {
                'event_category': 'loan_application',
                'event_label': 'google_sheets'
            });
        }
    })
    .catch((error) => {
        console.error('Error submitting form:', error);
        showErrorMessage();
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        // Optional: Track error in analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_error', {
                'event_category': 'loan_application',
                'event_label': 'google_sheets_error'
            });
        }
    });
}

function showSuccessMessage() {
    const form = document.getElementById('loan-application');
    form.innerHTML = `
        <div class="success-message" style="text-align: center; padding: var(--spacing-8);">
            <div style="width: 80px; height: 80px; background: var(--success); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto var(--spacing-6);">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
            </div>
            <h3 style="color: var(--gray-900); margin-bottom: var(--spacing-4);">Application Submitted!</h3>
            <p style="color: var(--gray-600); margin-bottom: var(--spacing-6);">
                Thank you for your application. We'll review your information and contact you within 24 hours with a decision.
            </p>
            <div class="security-badge">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                </svg>
                <span>Your information is secure</span>
            </div>
        </div>
    `;
}

function showErrorMessage() {
    const form = document.getElementById('loan-application');
    form.innerHTML = `
        <div class="error-message" style="text-align: center; padding: var(--spacing-8);">
            <div style="width: 80px; height: 80px; background: var(--error); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto var(--spacing-6);">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
            </div>
            <h3 style="color: var(--gray-900); margin-bottom: var(--spacing-4);">Submission Error</h3>
            <p style="color: var(--gray-600); margin-bottom: var(--spacing-6);">
                We encountered an issue submitting your application. Please try again or contact us directly.
            </p>
            <button onclick="location.reload()" class="btn btn-primary">Try Again</button>
        </div>
    `;
}

// FAQ Accordion
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });
            
            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// Mobile Menu Toggle
function initMobileMenu() {
    const hamburger = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-nav');
    
    if (hamburger && mobileMenu) {
        hamburger.onclick = function() {
            mobileMenu.style.display = mobileMenu.style.display === 'block' ? 'none' : 'block';
        };
        
        // Close menu when clicking links
        const links = mobileMenu.querySelectorAll('a');
        links.forEach(link => {
            link.onclick = function() {
                mobileMenu.style.display = 'none';
            };
        });
    }
}

// Smooth Scrolling for Navigation Links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const mobileNav = document.getElementById('mobile-nav');
                if (mobileNav && mobileNav.style.display === 'block') {
                    mobileNav.style.display = 'none';
                }
            }
        });
    });
}

// Form Validation Functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

function isValidZipCode(zipCode) {
    const zipRegex = /^\d{5}$/;
    return zipRegex.test(zipCode);
}

function isValidRoutingNumber(routingNumber) {
    const routingRegex = /^\d{9}$/;
    return routingRegex.test(routingNumber);
}

function isValidAccountNumber(accountNumber) {
    const accountRegex = /^\d{4,17}$/;
    return accountRegex.test(accountNumber);
}

// Header Scroll Effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (header) {
        if (window.scrollY > 100) {
            header.style.boxShadow = 'var(--shadow-lg)';
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
        } else {
            header.style.boxShadow = 'none';
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        }
    }
});

// Input Masking for Phone Numbers
function initPhoneMasking() {
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    
    phoneInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length >= 6) {
                value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
            } else if (value.length >= 3) {
                value = value.replace(/(\d{3})(\d{0,3})/, '($1) $2');
            }
            
            e.target.value = value;
        });
    });
}

// ZIP Code Auto-formatting
function initZipCodeFormatting() {
    const zipInputs = document.querySelectorAll('input[name="zipCode"]');
    
    zipInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            e.target.value = value.substring(0, 5);
        });
    });
}

// Routing Number Formatting
function initRoutingNumberFormatting() {
    const routingInputs = document.querySelectorAll('input[name="routingNumber"]');
    
    routingInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            e.target.value = value.substring(0, 9);
        });
    });
}

// Initialize input formatting
document.addEventListener('DOMContentLoaded', function() {
    initPhoneMasking();
    initZipCodeFormatting();
    initRoutingNumberFormatting();
});

// Add loading animation to buttons
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn')) {
        e.target.style.transform = 'scale(0.98)';
        setTimeout(() => {
            e.target.style.transform = '';
        }, 150);
    }
});

// Intersection Observer for animations
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

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.step-card, .requirement-card, .faq-item');
    animatedElements.forEach(el => observer.observe(el));
});

// Form Auto-save (localStorage)
function initFormAutoSave() {
    const form = document.getElementById('loan-application');
    if (!form) return;
    
    const formData = JSON.parse(localStorage.getItem('loanApplicationData') || '{}');
    
    // Restore form data
    Object.keys(formData).forEach(key => {
        const field = form.querySelector(`[name="${key}"]`);
        if (field) {
            field.value = formData[key];
        }
    });
    
    // Save form data on input
    form.addEventListener('input', (e) => {
        if (e.target.name) {
            formData[e.target.name] = e.target.value;
            localStorage.setItem('loanApplicationData', JSON.stringify(formData));
        }
    });
    
    // Clear saved data on successful submission
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent default form submission
        localStorage.removeItem('loanApplicationData');
        submitForm(); // Call our custom submit function
    });
}

// Initialize auto-save
document.addEventListener('DOMContentLoaded', initFormAutoSave);

// Consent Checkbox Functionality
function initConsentCheckbox() {
    const consentCheckbox = document.getElementById('consent');
    const submitButton = document.querySelector('#submit-btn');
    
    if (consentCheckbox && submitButton) {
        consentCheckbox.addEventListener('change', () => {
            submitButton.disabled = !consentCheckbox.checked;
        });
    }
}

// Apply Now Button Shake Animation
function initApplyNowButton() {
    // More specific selector to only target actual "Apply Now" buttons, not form navigation buttons
    const applyNowButtons = document.querySelectorAll('.apply-btn, .cta .btn-primary, header .btn-primary');
    const form = document.querySelector('.form-card');
    
    if (!applyNowButtons.length || !form) return;
    
    applyNowButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Prevent default behavior for anchor links
            if (button.tagName === 'A') {
                e.preventDefault();
            }
            
            // Check if form is in view
            const formRect = form.getBoundingClientRect();
            const isFormInView = formRect.top >= 0 && formRect.bottom <= window.innerHeight;
            
            if (isFormInView) {
                // Form is already in view, shake immediately
                form.classList.add('shake');
                setTimeout(() => {
                    form.classList.remove('shake');
                }, 800);
            } else {
                // Form is not in view, scroll first then shake
                const navHeight = 80; // Approximate navigation height
                const formTop = form.offsetTop - navHeight - 20; // Extra 20px for breathing room
                
                window.scrollTo({
                    top: formTop,
                    behavior: 'smooth'
                });
                
                // Wait for scroll to complete, then shake
                setTimeout(() => {
                    form.classList.add('shake');
                    setTimeout(() => {
                        form.classList.remove('shake');
                    }, 800);
                }, 1000); // Wait 1000ms for scroll to complete
            }
        });
    });
}

// Bottom Apply Now Button - Scroll to Form and Shake
function initBottomApplyNowShake() {
    const bottomApplyButton = document.querySelector('.cta .btn-primary');
    const form = document.querySelector('.form-card');
    
    if (!bottomApplyButton || !form) return;
    
    bottomApplyButton.addEventListener('click', function(e) {
        e.preventDefault(); // Prevent default anchor behavior
        
        // Smooth scroll to the form with offset for navigation
        const navHeight = 80; // Approximate navigation height
        const formTop = form.offsetTop - navHeight - 20; // Extra 20px for breathing room
        
        window.scrollTo({
            top: formTop,
            behavior: 'smooth'
        });
        
        // Wait for scroll to complete, then shake the form
        setTimeout(() => {
            form.classList.add('shake');
            
            // Remove shake class after animation completes
            setTimeout(() => {
                form.classList.remove('shake');
            }, 800);
        }, 1000); // Wait 1000ms for scroll to complete
    });
}

// Disclaimer Scroll Function
function initDisclaimerScroll() {
    const disclaimerLink = document.querySelector('.disclaimer-link');
    const disclaimerSection = document.getElementById('disclaimer');
    
    if (!disclaimerLink || !disclaimerSection) return;
    
    disclaimerLink.addEventListener('click', function(e) {
        e.preventDefault(); // Prevent default anchor behavior
        
        // Smooth scroll to the disclaimer section with offset for navigation
        const navHeight = 80; // Approximate navigation height
        const disclaimerTop = disclaimerSection.offsetTop - navHeight - 20; // Extra 20px for breathing room
        
        window.scrollTo({
            top: disclaimerTop,
            behavior: 'smooth'
        });
    });
}

// Legal Pages CTA Button Function
function initLegalPagesCTA() {
    const legalCTAButtons = document.querySelectorAll('.rates-fees-content .btn-primary, .rates-section .btn-primary');
    
    legalCTAButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default anchor behavior
            
            // Navigate to main page
            window.location.href = '../index.html';
        });
    });
}

// Handle form anchor with offset and shake
function initFormAnchor() {
    // Check if URL has #application anchor
    if (window.location.hash === '#application') {
        setTimeout(() => {
            const form = document.querySelector('.hero-form');
            if (form) {
                // Scroll to form with navigation offset
                const navHeight = 80; // Approximate navigation height
                const formTop = form.offsetTop - navHeight - 20; // Extra 20px for breathing room
                
                window.scrollTo({
                    top: formTop,
                    behavior: 'smooth'
                });
                
                // Add shake effect after scroll
                setTimeout(() => {
                    form.classList.add('shake');
                    setTimeout(() => {
                        form.classList.remove('shake');
                    }, 600);
                }, 800); // Wait for scroll to complete
            }
        }, 100); // Small delay to ensure page is loaded
    }
}

// Add shake effect when returning from legal pages
function initLegalPageReturn() {
    // Check if user is returning from a legal page (no hash in URL)
    if (!window.location.hash && document.referrer.includes('docs/')) {
        setTimeout(() => {
            const form = document.querySelector('.hero-form');
            if (form) {
                // Add shake effect after page loads
                setTimeout(() => {
                    form.classList.add('shake');
                    setTimeout(() => {
                        form.classList.remove('shake');
                    }, 600);
                }, 500); // Wait for page to fully load
            }
        }, 100);
    }
} 

// Mobile Navigation
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    
    if (mobileMenuToggle && mobileNav) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileNav.classList.toggle('active');
            
            // Animate hamburger to X
            const spans = mobileMenuToggle.querySelectorAll('span');
            spans.forEach((span, index) => {
                if (mobileNav.classList.contains('active')) {
                    if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
                    if (index === 1) span.style.opacity = '0';
                    if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
                } else {
                    span.style.transform = 'none';
                    span.style.opacity = '1';
                }
            });
        });
        
        // Close mobile menu when clicking on a link
        const mobileNavLinks = mobileNav.querySelectorAll('a');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileNav.classList.remove('active');
                const spans = mobileMenuToggle.querySelectorAll('span');
                spans.forEach(span => {
                    span.style.transform = 'none';
                    span.style.opacity = '1';
                });
            });
        });
    }
}); 