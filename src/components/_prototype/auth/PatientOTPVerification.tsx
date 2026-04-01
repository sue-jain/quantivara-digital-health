import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Phone, Clock, RefreshCw } from 'lucide-react';
import santhicaLogo from '@/assets/santhica-logo.png';

interface PatientOTPVerificationProps {
  phoneNumber: string;
  onBack: () => void;
  onSuccess: (phoneNumber: string) => void;
}

const PatientOTPVerification: React.FC<PatientOTPVerificationProps> = ({
  phoneNumber,
  onBack,
  onSuccess
}) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [autoFilled, setAutoFilled] = useState(false);

  // Demo OTP for different scenarios
  const DEMO_OTP = '123456';

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Auto-focus first input
    inputRefs.current[0]?.focus();
  }, []);

  // Demo: auto-fill OTP and auto-verify since it's constant in the demo
  useEffect(() => {
    if (!autoFilled) {
      const digits = DEMO_OTP.split('');
      setOtp(digits);
      setAutoFilled(true);
      // Small delay so UI shows the filled digits, then auto-verify
      const t = setTimeout(() => handleVerifyOTP(DEMO_OTP), 300);
      return () => clearTimeout(t);
    }
  }, [autoFilled]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (error) setError(null);

    // Auto-move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verify when all digits entered
    if (newOtp.every(digit => digit) && newOtp.join('') === DEMO_OTP) {
      handleVerifyOTP(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async (otpCode?: string) => {
    const otpToVerify = otpCode || otp.join('');
    
    if (otpToVerify.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }

    if (otpToVerify !== DEMO_OTP) {
      setError('Invalid OTP. Please try again.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Simulate OTP verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSuccess(phoneNumber);
    } catch (err) {
      setError('Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setTimeLeft(60);
    setCanResend(false);
    setOtp(['', '', '', '', '', '']);
    setError(null);
    inputRefs.current[0]?.focus();
  };

  const formatPhoneNumber = (phone: string) => {
    return phone.replace(/(\d{5})(\d{5})/, '$1-$2');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="rounded-t-2xl overflow-hidden">
          <div style={{ backgroundColor: '#BBF1F1' }} className="text-gray-800 px-4 py-3">
            <div className="flex items-center justify-center gap-2">
              <img src={santhicaLogo} alt="Santhica" style={{ height: 24, width: 'auto' }} />
              <div className="font-semibold">Santhica Digital Health Platform</div>
            </div>
          </div>
        </div>
        <Card className="shadow-xl border-0 rounded-t-none rounded-b-2xl">
          <CardHeader className="text-center pb-2">
            <div className="flex items-center justify-center mb-4">
              <div style={{ backgroundColor: '#BBF1F1' }} className="p-3 rounded-full">
                <Phone className="h-8 w-8 text-gray-700" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Verify Phone Number
            </CardTitle>
            <CardDescription className="text-gray-600 mt-2">
              Enter the 6-digit code sent to<br />
              <span className="font-semibold">+91 {formatPhoneNumber(phoneNumber)}</span>
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Welcome Message */}
            <div className="text-center">
              <div className="text-4xl mb-3">📱</div>
              <p className="text-sm text-gray-600">
                We've sent a verification code to your phone
              </p>
            </div>

            {/* OTP Input */}
            <div className="space-y-4">
              <div className="flex justify-center gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => inputRefs.current[index] = el}
                    type="password"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-200 rounded-lg focus:border-[#BBF1F1] focus:outline-none transition-colors"
                    maxLength={1}
                  />
                ))}
              </div>

              {/* Demo OTP Display */}
              <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                <p className="text-sm text-yellow-800 font-medium">
                  🎬 Demo Mode: OTP is <span className="font-bold">{DEMO_OTP}</span>
                </p>
              </div>

              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                  {error}
                </div>
              )}

              <Button
                onClick={() => handleVerifyOTP()}
                disabled={otp.some(digit => !digit) || isLoading}
                className="w-full py-3 text-lg font-semibold rounded-xl shadow-lg transition-all duration-200 transform hover:scale-[1.02] text-gray-800"
                style={{ backgroundColor: '#BBF1F1' }}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                    Verifying...
                  </div>
                ) : (
                  <>
                    Verify OTP →
                  </>
                )}
              </Button>
            </div>

            {/* Resend OTP */}
            <div className="text-center">
              {canResend ? (
                <Button
                  variant="ghost"
                  onClick={handleResendOTP}
                  className="text-gray-700 hover:text-gray-800 flex items-center gap-2 mx-auto"
                >
                  <RefreshCw className="h-4 w-4" />
                  Resend OTP
                </Button>
              ) : (
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  Resend OTP in {timeLeft}s
                </div>
              )}
            </div>

            {/* Back Button */}
            <Button
              variant="ghost"
              onClick={onBack}
              className="w-full flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="h-4 w-4" />
              Change Phone Number
            </Button>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            Didn't receive the code? Check your messages or try resending.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PatientOTPVerification;
