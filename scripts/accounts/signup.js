// API Configuration
const API_BASE_URL = 'https://shopsy-project.onrender.com/api';

// DOM Elements
const nameInput = document.querySelector('.name-input-js');
const emailInput = document.querySelector('.email-input-js');
const passwordInput = document.querySelector('.password-input-js');
const phoneInput = document.querySelector('.phone-input-js');
const addressInput = document.querySelector('.address-input-js');
const submitBtn = document.querySelector('.submit-btn-js');
const errorMessage = document.querySelector('.error-message-js');

// Form validation
function validateForm() {
  const errors = {};

  // Name validation
  if (!nameInput.value.trim()) {
    errors.name = 'Name is required';
  } else if (!/^[a-zA-Z\s]+$/.test(nameInput.value.trim())) {
    errors.name = 'Name must contain only letters and spaces';
  }

  // Email validation
  if (!emailInput.value.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) {
    errors.email = 'Please enter a valid email address';
  }

  // Password validation
  if (!passwordInput.value) {
    errors.password = 'Password is required';
  } else if (passwordInput.value.length < 8) {
    errors.password = 'Password must be at least 8 characters long';
  } else if (!/[A-Z]/.test(passwordInput.value)) {
    errors.password = 'Password must contain at least one uppercase letter';
  } else if (!/[a-z]/.test(passwordInput.value)) {
    errors.password = 'Password must contain at least one lowercase letter';
  } else if (!/[0-9]/.test(passwordInput.value)) {
    errors.password = 'Password must contain at least one digit';
  } else if (!/[!@#$%^&*]/.test(passwordInput.value)) {
    errors.password = 'Password must contain at least one special character (!@#$%^&*)';
  }

  // Phone validation
  if (!phoneInput.value.trim()) {
    errors.phone = 'Phone number is required';
  } else if (!/^\d{10}$/.test(phoneInput.value.trim())) {
    errors.phone = 'Phone number must be exactly 10 digits';
  }

  return errors;
}

// Display validation errors
function displayErrors(errors) {
  errorMessage.innerHTML = '';
  
  if (Object.keys(errors).length > 0) {
    const errorList = Object.values(errors).join('<br>');
    errorMessage.innerHTML = errorList;
    
    // Add error styling to form controls
    document.querySelectorAll('.form-control').forEach(control => {
      control.classList.add('is-invalid');
    });
  } else {
    // Remove error styling
    document.querySelectorAll('.form-control').forEach(control => {
      control.classList.remove('is-invalid');
    });
  }
}

// Clear error styling when user starts typing
function clearErrorStyling(input) {
  input.addEventListener('input', () => {
    input.classList.remove('is-invalid');
    if (errorMessage.innerHTML) {
      errorMessage.innerHTML = '';
    }
  });
}

// Apply error clearing to all inputs
[nameInput, emailInput, passwordInput, phoneInput, addressInput].forEach(clearErrorStyling);

// Handle form submission
async function handleSignup(event) {
  event.preventDefault();
  
  // Validate form
  const errors = validateForm();
  if (Object.keys(errors).length > 0) {
    displayErrors(errors);
    return;
  }

  // Show loading state
  submitBtn.disabled = true;
  submitBtn.textContent = 'Creating Account...';

  try {
    const userData = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      password: passwordInput.value,
      phone: phoneInput.value.trim(),
      address: addressInput.value.trim() || ''
    };

    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });

    const data = await response.json();

    if (response.ok) {
      // Store token and user data
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userData', JSON.stringify(data.user));
      
      // Show success message
      errorMessage.innerHTML = '<span class="text-success">Account created successfully! Redirecting...</span>';
      
      // Redirect to main page
      setTimeout(() => {
        window.location.href = 'shopsy.html';
      }, 1500);
    } else {
      // Display server error
      errorMessage.innerHTML = data.error || 'Registration failed. Please try again.';
    }
  } catch (error) {
    console.error('Signup error:', error);
    errorMessage.innerHTML = 'Network error. Please check your connection and try again.';
  } finally {
    // Reset button state
    submitBtn.disabled = false;
    submitBtn.textContent = 'Create Account';
  }
}

// Event listeners
submitBtn.addEventListener('click', handleSignup);

// Handle Enter key navigation
nameInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    emailInput.focus();
  }
});

emailInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    passwordInput.focus();
  }
});

passwordInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    phoneInput.focus();
  }
});

phoneInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    addressInput.focus();
  }
});

addressInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    submitBtn.click();
  }
}); 