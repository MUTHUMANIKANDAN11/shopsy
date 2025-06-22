// API Configuration
const API_BASE_URL = 'https://shopsy-project.onrender.com/api';

// DOM Elements
const emailInput = document.querySelector('.email-input-js');
const passwordInput = document.querySelector('.password-input-js');
const submitBtn = document.querySelector('.submit-btn-js');
const errorMessage = document.querySelector('.error-message-js');

// Form validation
function validateForm() {
  const errors = {};

  // Email validation
  if (!emailInput.value.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) {
    errors.email = 'Please enter a valid email address';
  }

  // Password validation
  if (!passwordInput.value) {
    errors.password = 'Password is required';
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
[emailInput, passwordInput].forEach(clearErrorStyling);

// Handle form submission
async function handleSignin(event) {
  event.preventDefault();
  
  // Validate form
  const errors = validateForm();
  if (Object.keys(errors).length > 0) {
    displayErrors(errors);
    return;
  }

  // Show loading state
  submitBtn.disabled = true;
  submitBtn.textContent = 'Signing In...';

  try {
    const userData = {
      email: emailInput.value.trim(),
      password: passwordInput.value
    };

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
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
      errorMessage.innerHTML = '<span class="text-success">Login successful! Redirecting...</span>';
      
      // Redirect to main page
      setTimeout(() => {
        window.location.href = 'shopsy.html';
      }, 1500);
    } else {
      // Display server error
      errorMessage.innerHTML = data.error || 'Login failed. Please check your credentials.';
    }
  } catch (error) {
    console.error('Signin error:', error);
    errorMessage.innerHTML = 'Network error. Please check your connection and try again.';
  } finally {
    // Reset button state
    submitBtn.disabled = false;
    submitBtn.textContent = 'Sign In';
  }
}

// Event listeners
submitBtn.addEventListener('click', handleSignin);

// Handle Enter key navigation
emailInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    passwordInput.focus();
  }
});

passwordInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    submitBtn.click();
  }
});