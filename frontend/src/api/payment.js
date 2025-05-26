// src/api/payment.js
import apiClient from './client';
import axios from 'axios';

const MAX_RETRIES = 3;
const BASE_DELAY = 1000; // 1 second

/**
 * Create a new payment with retry logic
 */
export const createPayment = async (paymentData, retries = MAX_RETRIES) => {
  try {
    const response = await apiClient.post('payments/payments/', paymentData);

    if (response.status === 201 && response.data.success) {
      return {
        success: true,
        data: {
          success: true,
          message: response.data.message,
          payment: response.data.payment,
          reference: response.data.payment.reference,
          redirectUrl: response.data.payment.payment_url,
          pollUrl: response.data.payment.poll_url,
        },
      };
    }

    return {
      success: false,
      message: response.data.message || 'Payment creation failed',
      statusCode: response.status,
    };
  } catch (error) {
    if (axios.isCancel(error)) {
      return {
        success: false,
        message: 'Request cancelled',
      };
    }

    // Handle rate limiting
    if (error.response?.status === 429 && retries > 0) {
      const retryAfter = parseInt(error.response.headers['retry-after']) || 5;
      await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
      return createPayment(paymentData, retries - 1);
    }

    console.error('Payment creation error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Payment creation failed',
      statusCode: error.response?.status,
    };
  }
};

/**
 * Get payment details with exponential backoff
 */
export const getPaymentDetails = async (reference, attempt = 1) => {
  try {
    const response = await apiClient.get(`payments/payments/${reference}/`);

    return {
      success: true,
      data: {
        success: true,
        payment: response.data,
      },
    };
  } catch (error) {
    if (axios.isCancel(error)) {
      return {
        success: false,
        message: 'Request cancelled',
      };
    }

    // Exponential backoff for polling
    if (attempt <= MAX_RETRIES) {
      const delay = BASE_DELAY * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
      return getPaymentDetails(reference, attempt + 1);
    }

    console.error('Fetch payment details error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch payment details',
      statusCode: error.response?.status,
    };
  }
};

/**
 * Get active integrations with caching
 */
export const getActiveIntegrations = async () => {
  try {
    // Check cache first
    const cacheKey = 'active_integrations';
    const cachedData = sessionStorage.getItem(cacheKey);
    const expires = sessionStorage.getItem(`${cacheKey}_expires`);

    if (cachedData && expires && Date.now() < parseInt(expires)) {
      return {
        success: true,
        data: JSON.parse(cachedData),
      };
    }

    const response = await apiClient.get('/payments/paynow-integrations/');

    // Cache the response for 5 minutes
    if (response.data) {
      sessionStorage.setItem(
        cacheKey,
        JSON.stringify(response.data)
      );
      // Set expiration timestamp
      sessionStorage.setItem(
        `${cacheKey}_expires`,
        Date.now() + 300000 // 5 minutes
      );
    }

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    if (axios.isCancel(error)) {
      return {
        success: false,
        message: 'Request cancelled',
      };
    }

    // Return cached data if available (ignore expiration on error)
    const cacheKey = 'active_integrations';
    const cachedData = sessionStorage.getItem(cacheKey);

    if (cachedData) {
      return {
        success: true,
        data: JSON.parse(cachedData),
      };
    }

    console.error('Failed to fetch Paynow integrations:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error fetching integrations',
      statusCode: error.response?.status,
    };
  }
};

// Utility function to cancel pending requests
let cancelTokenSource = axios.CancelToken.source();

export const cancelPendingRequests = () => {
  cancelTokenSource.cancel('Operation canceled by the user.');
  cancelTokenSource = axios.CancelToken.source(); // Create new token for future requests
};

// Apply cancel token to apiClient
apiClient.interceptors.request.use(config => {
  config.cancelToken = cancelTokenSource.token;
  return config;
});