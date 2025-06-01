// === Contact Form JavaScript ===
// Handles form validation, submission, and user feedback with EmailJS

document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contactForm');
  const submitBtn = contactForm.querySelector('.form-submit');
  const submitText = submitBtn.querySelector('.submit-text');
  const submitIcon = submitBtn.querySelector('.submit-icon');
  
  // EmailJS Configuration - UPDATE THESE VALUES
  const EMAILJS_CONFIG = {
    publicKey: 'LSlktBikImmP5TDex',      // Get from https://dashboard.emailjs.com/admin/account
    serviceId: 'Devnom_1',      // Your email service ID  
    templateId: 'template_4lkz7cj'     // Your email template ID
  };
  
  // Initialize EmailJS
  if (typeof emailjs !== 'undefined') {
    emailjs.init(EMAILJS_CONFIG.publicKey);
  }
  
  // Form validation rules
  const validationRules = {
    name: {
      required: true,
      minLength: 2,
      pattern: /^[a-zA-Z\s'-]+$/,
      message: 'Please enter a valid name (letters, spaces, hyphens, apostrophes only)'
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Please enter a valid email address'
    },
    subject: {
      required: true,
      message: 'Please select a subject'
    },
    message: {
      required: true,
      minLength: 10,
      maxLength: 1000,
      message: 'Message must be between 10 and 1000 characters'
    }
  };

  // Add real-time validation to form fields
  Object.keys(validationRules).forEach(fieldName => {
    const field = contactForm.querySelector(`[name="${fieldName}"]`);
    if (field) {
      field.addEventListener('blur', () => validateField(field));
      field.addEventListener('input', () => clearError(field));
    }
  });

  // Handle form submission
  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Validate all fields
    const isValid = validateForm();
    if (!isValid) {
      showFormMessage('Please correct the errors below', 'error');
      return;
    }

    // Show loading state
    setSubmitState('loading');
    
    // Check if EmailJS is configured
    if (!isEmailJSConfigured()) {
      setSubmitState('error');
      showFormMessage('EmailJS not configured yet. Please check setup instructions below.', 'error');
      setTimeout(() => setSubmitState('default'), 3000);
      return;
    }
    
    // Send email via EmailJS
    try {
      await sendEmailViaEmailJS();
      
      // Success state
      setSubmitState('success');
      showFormMessage('Message sent successfully! I\'ll get back to you soon.', 'success');
      
      // Reset form after delay
      setTimeout(() => {
        contactForm.reset();
        setSubmitState('default');
        clearFormMessage();
        updateCharCounter(); // Reset character counter
      }, 3000);
      
    } catch (error) {
      console.error('EmailJS Error:', error);
      
      // Error state
      setSubmitState('error');
      showFormMessage('Failed to send message. Please try again or use direct email.', 'error');
      
      // Reset button after delay
      setTimeout(() => {
        setSubmitState('default');
      }, 3000);
    }
  });

  // Check if EmailJS is properly configured
  function isEmailJSConfigured() {
    return (
      typeof emailjs !== 'undefined' &&
      EMAILJS_CONFIG.publicKey !== 'YOUR_PUBLIC_KEY' &&
      EMAILJS_CONFIG.serviceId !== 'YOUR_SERVICE_ID' &&
      EMAILJS_CONFIG.templateId !== 'YOUR_TEMPLATE_ID'
    );
  }

  // Send email using EmailJS
  function sendEmailViaEmailJS() {
    return new Promise((resolve, reject) => {
      // Log configuration for debugging
      console.log('EmailJS Config:', {
        serviceId: EMAILJS_CONFIG.serviceId,
        templateId: EMAILJS_CONFIG.templateId,
        publicKey: EMAILJS_CONFIG.publicKey
      });
      
      // Prepare form data for EmailJS
      const formData = {
        from_name: contactForm.name.value,
        from_email: contactForm.email.value,
        company: contactForm.company.value || 'Not specified',
        subject: contactForm.subject.value,
        message: contactForm.message.value,
        timestamp: new Date().toLocaleString()
      };

      console.log('Form data being sent:', formData);

      // Send via EmailJS
      emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        formData
      ).then(
        function(response) {
          console.log('Email sent successfully:', response);
          resolve(response);
        },
        function(error) {
          console.error('Email send failed:', error);
          console.error('Error details:', error.text, error.status);
          reject(error);
        }
      );
    });
  }

  // Validate individual field
  function validateField(field) {
    const fieldName = field.name;
    const value = field.value.trim();
    const rules = validationRules[fieldName];
    
    if (!rules) return true;

    // Clear previous error
    clearError(field);

    // Required field check
    if (rules.required && !value) {
      showError(field, `${getFieldLabel(fieldName)} is required`);
      return false;
    }

    // Skip other validations if field is empty and not required
    if (!value && !rules.required) return true;

    // Length validation
    if (rules.minLength && value.length < rules.minLength) {
      showError(field, `${getFieldLabel(fieldName)} must be at least ${rules.minLength} characters`);
      return false;
    }

    if (rules.maxLength && value.length > rules.maxLength) {
      showError(field, `${getFieldLabel(fieldName)} must be no more than ${rules.maxLength} characters`);
      return false;
    }

    // Pattern validation
    if (rules.pattern && !rules.pattern.test(value)) {
      showError(field, rules.message);
      return false;
    }

    return true;
  }

  // Validate entire form
  function validateForm() {
    let isValid = true;
    
    Object.keys(validationRules).forEach(fieldName => {
      const field = contactForm.querySelector(`[name="${fieldName}"]`);
      if (field && !validateField(field)) {
        isValid = false;
      }
    });

    return isValid;
  }

  // Show field error
  function showError(field, message) {
    field.style.borderColor = '#ff4444';
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
      existingError.remove();
    }
    
    // Add new error message
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.cssText = `
      color: #ff4444;
      font-size: 0.85rem;
      margin-top: 4px;
      font-weight: 500;
    `;
    field.parentNode.appendChild(errorElement);
  }

  // Clear field error
  function clearError(field) {
    field.style.borderColor = '';
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
      errorElement.remove();
    }
  }

  // Show form-level message
  function showFormMessage(message, type) {
    // Remove existing message
    clearFormMessage();
    
    const messageElement = document.createElement('div');
    messageElement.className = `form-message form-message-${type}`;
    messageElement.textContent = message;
    
    const styles = {
      success: 'background: rgba(0, 255, 136, 0.1); border: 1px solid #00ff88; color: #00ff88;',
      error: 'background: rgba(255, 68, 68, 0.1); border: 1px solid #ff4444; color: #ff4444;'
    };
    
    messageElement.style.cssText = `
      ${styles[type]}
      padding: 12px 16px;
      border-radius: 8px;
      margin-bottom: 16px;
      font-weight: 500;
      text-align: center;
    `;
    
    contactForm.insertBefore(messageElement, contactForm.firstChild);
  }

  // Clear form message
  function clearFormMessage() {
    const existing = contactForm.querySelector('.form-message');
    if (existing) {
      existing.remove();
    }
  }

  // Set submit button state
  function setSubmitState(state) {
    submitBtn.disabled = state !== 'default';
    
    switch (state) {
      case 'loading':
        submitText.textContent = 'Sending...';
        submitIcon.textContent = '⏳';
        submitBtn.style.background = 'linear-gradient(135deg, #666 0%, #555 100%)';
        break;
        
      case 'success':
        submitText.textContent = 'Message Sent!';
        submitIcon.textContent = '✅';
        submitBtn.style.background = 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)';
        break;
        
      case 'error':
        submitText.textContent = 'Send Failed';
        submitIcon.textContent = '❌';
        submitBtn.style.background = 'linear-gradient(135deg, #ff4444 0%, #cc3333 100%)';
        break;
        
      default:
        submitText.textContent = 'Send Message';
        submitIcon.textContent = '📧';
        submitBtn.style.background = '';
        break;
    }
  }

  // Get user-friendly field label
  function getFieldLabel(fieldName) {
    const labels = {
      name: 'Name',
      email: 'Email',
      company: 'Company',
      subject: 'Subject',
      message: 'Message'
    };
    return labels[fieldName] || fieldName;
  }

  // Character counter for message field
  const messageField = contactForm.querySelector('[name="message"]');
  let counterElement;
  
  if (messageField) {
    const maxLength = validationRules.message.maxLength;
    
    // Create counter element
    counterElement = document.createElement('div');
    counterElement.className = 'char-counter';
    counterElement.style.cssText = `
      font-size: 0.8rem;
      color: #aaa;
      text-align: right;
      margin-top: 4px;
    `;
    messageField.parentNode.appendChild(counterElement);
    
    // Update counter function
    window.updateCharCounter = function() {
      const remaining = maxLength - messageField.value.length;
      counterElement.textContent = `${remaining} characters remaining`;
      counterElement.style.color = remaining < 50 ? '#ff6666' : '#aaa';
    };
    
    messageField.addEventListener('input', updateCharCounter);
    updateCharCounter(); // Initial update
  }
});

// === Additional Utility Functions ===

// Smooth scroll to form errors
function scrollToError() {
  const firstError = document.querySelector('.field-error');
  if (firstError) {
    firstError.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center' 
    });
  }
}

// Auto-resize textarea
function autoResizeTextarea(textarea) {
  textarea.style.height = 'auto';
  textarea.style.height = textarea.scrollHeight + 'px';
}

// Initialize auto-resize for message field
document.addEventListener('DOMContentLoaded', function() {
  const messageField = document.querySelector('[name="message"]');
  if (messageField) {
    messageField.addEventListener('input', function() {
      autoResizeTextarea(this);
    });
  }
});

// === EmailJS Template Example ===
/*
Example EmailJS email template (use these variable names):

Subject: New Portfolio Contact - {{subject}}

From: {{from_name}} ({{from_email}})
Company: {{company}}
Subject: {{subject}}
Time: {{timestamp}}

Message:
{{message}}

---
Sent via DevNom Portfolio Contact Form
*/ 