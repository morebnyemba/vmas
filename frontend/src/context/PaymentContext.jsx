// src/context/PaymentContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { createPayment, getPaymentDetails, getActiveIntegrations } from '../api/payment';
import { toast } from 'sonner';
import axios from 'axios';

const PaymentContext = createContext();

export const usePayment = () => useContext(PaymentContext);

export const PaymentProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [integrations, setIntegrations] = useState([]);
  const [payment, setPayment] = useState(null);
  const [error, setError] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [retryCount, setRetryCount] = useState(0);

  const handleRateLimitError = useCallback((retryAfter = 30) => {
    toast.error(`Too many requests. Retrying in ${retryAfter} seconds...`);
    setTimeout(() => {
      setRetryCount(prev => prev + 1);
    }, retryAfter * 1000);
  }, []);

  const fetchIntegrations = useCallback(async (abortSignal) => {
    setLoading(true);
    try {
      const res = await getActiveIntegrations({ signal: abortSignal });
      if (res.success && res.data) {
        const processedIntegrations = res.data.map(integration => ({
          ...integration,
          is_active: Boolean(integration.is_active), // Ensure it's a boolean
        }));
        setIntegrations(processedIntegrations);
        setError(null);
      } else if (res.statusCode === 429) {
        handleRateLimitError(res.retryAfter); // Now handleRateLimitError is defined
      } else {
        throw new Error(res.message || 'Failed to load integrations');
      }
    } catch (error) {
      if (!axios.isCancel(error)) {
        setError(error.message);
        toast.error(error.message || 'Failed to load integrations');
      }
    } finally {
      setLoading(false);
    }
  }, [handleRateLimitError]); // handleRateLimitError is a dependency

  useEffect(() => {
    const abortController = new AbortController();
    fetchIntegrations(abortController.signal);

    return () => abortController.abort();
  }, [fetchIntegrations, retryCount]);

  const initiatePayment = useCallback(async (paymentData) => {
    const { amount, currency, integration_id } = paymentData;

    if (!amount || !currency || !integration_id) {
      toast.error('Missing required fields');
      return { success: false, message: 'Missing required fields' };
    }

    setLoading(true);
    try {
      const res = await createPayment(paymentData);
      if (res.success) {
        setPayment(res.data.payment);
        setPaymentAmount(res.data.payment.amount);
        toast.success(res.message);
        return res;
      }
      throw new Error(res.message);
    } catch (error) {
      if (error.response?.status === 429) {
        handleRateLimitError(error.response.headers['retry-after']); // handleRateLimitError is defined here too
      } else {
        setError(error.message);
        toast.error(error.message);
      }
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  }, [handleRateLimitError]);

  const fetchPaymentDetails = useCallback(async (reference) => {
    setLoading(true);
    try {
      const res = await getPaymentDetails(reference);
      if (res.success) {
        setPayment(res.data.payment);
        return res;
      }
      throw new Error(res.message);
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const pollPaymentStatus = useCallback(async (reference, interval = 5000, maxAttempts = 12) => {
    let attempts = 0;
    const poll = async () => {
      try {
        const res = await getPaymentDetails(reference);
        if (res.success) {
          const status = res.data.payment.status;
          console.log('Polling Status:', status);
          if (['Paid', 'Cancelled', 'Failed'].includes(status)) {
            toast.success(`Payment ${status}`);
            return res;
          }
        }
        if (++attempts >= maxAttempts) {
          throw new Error('Polling timeout');
        }
      } catch (error) {
        throw error;
      }
    };

    return new Promise((resolve, reject) => {
      const intervalId = setInterval(async () => {
        try {
          const result = await poll();
          if (result) {
            clearInterval(intervalId);
            resolve(result);
          }
        } catch (error) {
          clearInterval(intervalId);
          toast.error(error.message);
          reject(error);
        }
      }, interval);
    });
  }, []);

  return (
    <PaymentContext.Provider
      value={{
        loading,
        error,
        integrations,
        payment,
        paymentAmount,
        initiatePayment,
        fetchPaymentDetails,
        pollPaymentStatus
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
};