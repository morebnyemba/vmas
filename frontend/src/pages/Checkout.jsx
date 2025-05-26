import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePayment } from '@/context/PaymentContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { LoaderCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import axios from 'axios';

const Checkout = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const {
    integrations,
    initiatePayment: contextInitiatePayment,
    pollPaymentStatus,
    loading: paymentLoading,
    error: paymentError,
  } = usePayment();
  const location = useLocation();
  const navigate = useNavigate();

  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [integrationId, setIntegrationId] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [currentPaymentUrl, setCurrentPaymentUrl] = useState('');
  const [isViewingFee, setIsViewingFee] = useState(false);

  // Auth Guard with redirect to registration
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        // Save original URL with state
        const redirectUrl = `${location.pathname}${location.search}`;
        localStorage.setItem('redirectUrl', redirectUrl);
        localStorage.setItem('checkoutState', JSON.stringify(location.state));
        navigate('/register', { state: { fromCheckout: true } });
      } else {
        setIsChecking(false);
        // Restore checkout state if coming from registration
        const savedState = localStorage.getItem('checkoutState');
        if (savedState) {
          try {
            const state = JSON.parse(savedState);
            if (state.purpose === 'property_viewing') {
              setAmount(state.amount.toString());
              setCurrency(state.currency);
              setIsViewingFee(true);
            }
            localStorage.removeItem('checkoutState');
          } catch (error) {
            console.error('Error parsing checkout state:', error);
          }
        }
      }
    }
  }, [authLoading, isAuthenticated, location, navigate]);

  // Handle payment polling
  const startPolling = useCallback((reference) => {
    let pollInterval;
    let attempts = 0;
    const maxAttempts = 24;

    const poll = async () => {
      try {
        const res = await pollPaymentStatus(reference);
        if (res?.data?.payment?.status === 'Paid') {
          clearInterval(pollInterval);
          toast.success('Payment successful!');
          navigate('/dashboard');
        } else if (++attempts >= maxAttempts) {
          clearInterval(pollInterval);
          toast.info('Payment verification taking longer than expected. Please check your payment history later.');
        }
      } catch (error) {
        clearInterval(pollInterval);
        toast.error('Payment verification failed');
        console.error('Polling error:', error);
      }
    };

    pollInterval = setInterval(poll, 5000);
    return () => clearInterval(pollInterval);
  }, [navigate, pollPaymentStatus]);

  // Initialize payment data if coming from viewing fee
  useEffect(() => {
    if (location.state?.purpose === 'property_viewing') {
      const { amount, currency } = location.state;
      setAmount(amount.toString());
      setCurrency(currency);
      setIsViewingFee(true);
    }
  }, [location.state]);

  const handlePayment = async () => {
    if (paymentLoading || !amount || !integrationId) return;

    setIsChecking(true);
    const paymentData = {
      amount: parseFloat(amount),
      currency,
      integration_id: integrationId,
      metadata: location.state?.viewingDetails || {},
    };

    try {
      const response = await contextInitiatePayment(paymentData);
      if (response?.data?.redirectUrl) {
        setCurrentPaymentUrl(response.data.redirectUrl);
        setDialogOpen(true);
        toast.success('Payment initiated');
      } else {
        toast.error(response?.message || 'Failed to initiate payment');
      }
    } catch (error) {
      console.error('Payment initiation error:', error);
      if (error.response?.status === 429) {
        const retryAfter = parseInt(error.response.headers['retry-after']) || 30;
        toast.error(`Please wait ${retryAfter} seconds before trying again`);
      } else {
        toast.error(error.message || 'Payment initiation failed');
      }
    } finally {
      setIsChecking(false);
    }
  };

  const isFormValid = amount > 0 && integrationId && !paymentLoading;

  if (authLoading || isChecking) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        <LoaderCircle className="animate-spin h-6 w-6 mr-2" />
        Checking authentication...
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold text-center mb-6">Checkout</h2>

      <div className="space-y-4">
        <div className="flex flex-col">
          <label htmlFor="amount" className="text-sm text-gray-600">Amount</label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => !isViewingFee && setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
            className="mt-1 p-2 border rounded-md"
            placeholder="0.00"
            disabled={isViewingFee}
            readOnly={isViewingFee}
          />
          {isViewingFee && (
            <p className="text-sm text-gray-500 mt-1">
              Viewing fee amount set by property
            </p>
          )}
        </div>

        <div className="flex flex-col">
          <label htmlFor="currency" className="text-sm text-gray-600">Currency</label>
          <select
            id="currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="mt-1 p-2 border rounded-md"
            disabled={isViewingFee}
          >
            <option value="USD">USD</option>
            <option value="ZWD">ZWD</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="integrationId" className="text-sm text-gray-600">Payment Method</label>
          <select
            id="integrationId"
            value={integrationId}
            onChange={(e) => setIntegrationId(e.target.value)}
            className="mt-1 p-2 border rounded-md"
            disabled={paymentLoading}
          >
            <option value="">Select payment method</option>
            {integrations?.length ? (
              integrations.map((integration) => (
                <option
                  key={integration.id}
                  value={integration.id}
                  disabled={!integration.is_active}
                >
                  {integration.name} {integration.is_active ? "(Active)" : "(Inactive)"}
                </option>
              ))
            ) : (
              <option disabled>Loading payment methods...</option>
            )}
          </select>
        </div>

        <button
          onClick={handlePayment}
          disabled={!isFormValid}
          className={`w-full px-6 py-3 mt-4 text-white font-semibold rounded-lg focus:outline-none ${
            isFormValid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          {paymentLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <LoaderCircle className="animate-spin text-white" size={20} />
              <span>Processing...</span>
            </div>
          ) : (
            <span>Pay Now</span>
          )}
        </button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="p-6 bg-white rounded-lg shadow-lg max-w-sm mx-auto">
          <DialogHeader>
            <h2 className="text-xl font-semibold">Confirm Payment</h2>
          </DialogHeader>
          <div className="mt-4 space-y-2">
            <p className="text-gray-600">
              Amount: <span className="font-medium">{currency} {parseFloat(amount).toFixed(2)}</span>
            </p>
            <p className="text-gray-600">
              Payment Method: <span className="font-medium">
                {integrations.find(i => i.id === integrationId)?.name}
              </span>
            </p>
          </div>
          <div className="mt-6 flex justify-between space-x-4">
            <button
              onClick={() => setDialogOpen(false)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 flex-1 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                window.open(currentPaymentUrl, '_blank', 'noopener,noreferrer');
                setDialogOpen(false);
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex-1 transition-colors"
            >
              Confirm & Pay
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Checkout;