// API Configuration
const API_BASE_URL = 'https://shopsy-project.onrender.com/api';

// Authentication utilities
export function getAuthToken() {
  return localStorage.getItem('authToken');
}

export function getUserData() {
  const userData = localStorage.getItem('userData');
  return userData ? JSON.parse(userData) : null;
}

export function isAuthenticated() {
  return !!getAuthToken();
}

export function logout() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userData');
  window.location.href = 'signin.html';
}

// API request helper
async function apiRequest(endpoint, options = {}) {
  const token = getAuthToken();
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (response.status === 401) {
      // Token expired or invalid
      logout();
      return null;
    }

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}

// Product API calls
export async function getProducts(filters = {}) {
  const queryParams = new URLSearchParams(filters).toString();
  const endpoint = `/products${queryParams ? `?${queryParams}` : ''}`;
  return apiRequest(endpoint);
}

export async function getProduct(id) {
  return apiRequest(`/products/${id}`);
}

// Cart API calls
export async function getCart() {
  return apiRequest('/cart');
}

export async function addToCart(productId, quantity) {
  return apiRequest('/cart/add', {
    method: 'POST',
    body: JSON.stringify({ productId, quantity }),
  });
}

export async function updateCartItem(productId, quantity) {
  return apiRequest('/cart/update', {
    method: 'PUT',
    body: JSON.stringify({ productId, quantity }),
  });
}

export async function clearCart() {
  return apiRequest('/cart/clear', {
    method: 'DELETE',
  });
}

export async function updateCartDeliveryOption(productId, deliveryOptionId) {
  return apiRequest('/cart/delivery-option', {
    method: 'PUT',
    body: JSON.stringify({ productId, deliveryOptionId }),
  });
}

// Order API calls
export async function getOrders() {
  return apiRequest('/orders');
}

export async function getOrder(orderId) {
  return apiRequest(`/orders/${orderId}`);
}

export async function createOrder(orderData) {
  return apiRequest('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  });
}

// User API calls
export async function getUserProfile() {
  return apiRequest('/user/profile');
}

export async function updateUserProfile(profileData) {
  return apiRequest('/user/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData),
  });
}

// Authentication API calls
export async function login(credentials) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (response.ok) {
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('userData', JSON.stringify(data.user));
    return data;
  } else {
    throw new Error(data.error || 'Login failed');
  }
}

export async function register(userData) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (response.ok) {
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('userData', JSON.stringify(data.user));
    return data;
  } else {
    throw new Error(data.error || 'Registration failed');
  }
}

// Legacy API calls for backward compatibility
export async function getLegacyProducts() {
  const response = await fetch('https://shopsy-project.onrender.com/products');
  return response.json();
}

export async function createLegacyOrder(cart) {
  const response = await fetch('https://shopsy-project.onrender.com/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ cart }),
  });
  return response.json();
} 