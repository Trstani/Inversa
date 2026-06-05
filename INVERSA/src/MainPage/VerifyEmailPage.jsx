import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiClient } from '../api/client';
import { showSuccess } from '../utils/toast';

const OTP_LENGTH = 6;

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  const otpPreview = location.state?.otp;

  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const inputRefs = useRef([]);

  // Fokus ke kotak pertama saat mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (pasteData.length === 0) return;

    const newOtp = Array(OTP_LENGTH).fill('');
    pasteData.split('').forEach((char, i) => {
      if (i < OTP_LENGTH) newOtp[i] = char;
    });
    setOtp(newOtp);

    const focusIndex = pasteData.length < OTP_LENGTH ? pasteData.length : OTP_LENGTH - 1;
    inputRefs.current[focusIndex]?.focus();
  };

  const otpString = otp.join('');

  const handleVerify = async () => {
    if (otpString.length !== OTP_LENGTH) {
      setError('Please enter the complete OTP.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await apiClient.auth.verifyEmail({
        email,
        otp: otpString,
      });

      if (response.success) {
        setSuccess('Email verified successfully.');
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      }
    } catch (err) {
      setError(err.message || 'Verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await apiClient.auth.resendOtp({ email });
      showSuccess('New OTP sent.');
    } catch (err) {
      setError(err.message || 'Failed to resend OTP.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="card p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-2">Verify Email</h1>
        <p className="text-sm text-gray-500 mb-6">
          Enter the OTP sent to:
          <br />
          <strong>{email}</strong>
        </p>

        {otpPreview && (
          <div className="mb-6 p-4 rounded-lg border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20">

            <p className="text-sm font-medium">
              Beta Testing Mode
            </p>

            <p className="text-xs opacity-70 mt-1">
              Use this verification code:
            </p>

            <h2 className="text-3xl font-bold mt-2 tracking-widest">
              {otpPreview}
            </h2>

          </div>
        )}

        {error && (
          <div className="mb-4 p-3 rounded bg-red-100 text-red-600 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 rounded bg-green-100 text-green-600 text-sm">
            {success}
          </div>
        )}

        <div className="flex justify-center gap-3 mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              className="w-12 h-14 text-center text-xl font-semibold border-2 rounded-lg 
                         focus:border-light-accent focus:ring-1 focus:ring-light-accent outline-none 
                         transition-colors bg-white text-gray-800 
                         disabled:opacity-50"
              disabled={loading}
            />
          ))}
        </div>

        <button
          onClick={handleVerify}
          disabled={loading || otpString.length !== OTP_LENGTH}
          className="btn-primary w-full mb-3"
        >
          {loading ? 'Verifying...' : 'Verify Email'}
        </button>

        <button
          onClick={handleResend}
          className="text-sm text-light-accent hover:underline"
        >
          Resend OTP
        </button>
      </div>
    </div>
  );
};

export default VerifyEmailPage;