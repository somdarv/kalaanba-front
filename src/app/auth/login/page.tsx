"use client";

import { useState } from "react";
import { useLogin, useRequestOtp, useVerifyOtp } from "@/lib/api/hooks/use-auth";
import { Button, Checkbox, TextField, OtpInput } from "@/components/ui";

export default function LoginPage() {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { mutate: loginMutate, isPending: loginPending } = useLogin();
  const { mutate: requestOtpMutate, isPending: requestOtpPending } = useRequestOtp();
  const {
    mutate: verifyOtpMutate,
    isPending: verifyOtpPending,
    isError: verifyOtpError,
    error: verifyOtpErrorObj,
  } = useVerifyOtp();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      // In a real app, we would have email/password login here.
      // For now, we are focusing on phone/OTP flow as per the build plan.
      // We'll just move to the phone input step.
      setStep("phone");
    } catch (err) {
      setError("Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await requestOtpMutate({ phone_e164: phone });
      setStep("otp");
    } catch (err: any) {
      setError(err.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await verifyOtpMutate({
        phone_e164: phone,
        otp,
      });
      // On success, the mutation will store the token and redirect or update state.
      // We'll handle redirect via useEffect or by checking auth state.
      // For now, we'll just move to a success state or redirect.
      // TODO: Implement redirect to home or protected route after login.
    } catch (err: any) {
      setError(err.message || "Verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  if (step === "phone") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
        <form onSubmit={handlePhoneSubmit} className="w-full max-w-md space-y-4">
          <h2 className="text-2xl font-bold text-center">Login with Phone</h2>
          <TextField
            label="Phone Number"
            placeholder="+233 XXXXXXXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <Button type="submit" disabled={isLoading || !phone}>
            {isLoading ? "Sending..." : "Send OTP"}
          </Button>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </form>
        <p className="text-sm text-muted-foreground mt-4">
          Don't have an account? <span className="text-primary underline">Sign up</span>
        </p>
      </div>
    );
  }

  if (step === "otp") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
        <form onSubmit={handleOtpSubmit} className="w-full max-w-md space-y-4">
          <h2 className="text-2xl font-bold text-center">Verify OTP</h2>
          <p className="text-sm text-center">
            We've sent an OTP to {phone}. Enter it below to continue.
          </p>
          <OtpInput
            value={otp}
            onChange={setOtp}
            length={6}
          />
          <div className="flex items-center gap-3">
            <Checkbox
              checked={rememberMe}
              onChange={(checked) => setRememberMe(checked)}
              label="Remember me"
            />
          </div>
          <Button type="submit" disabled={isLoading || !otp}>
            {isLoading ? "Verifying..." : "Verify & Continue"}
          </Button>
          {verifyOtpError && (
            <p className="text-sm text-destructive">
              {verifyOtpErrorObj?.message || "Invalid OTP"}
            </p>
          )}
          {error && <p className="text-sm text-destructive">{error}</p>}
        </form>
        <p className="text-sm text-muted-foreground mt-4">
          Didn't get the code? <span onClick={() => setStep("phone")} className="text-primary underline">
            Resend
          </span>
        </p>
      </div>
    );
  }

  // Default fallback (should not happen)
  return <div>Loading...</div>;
}