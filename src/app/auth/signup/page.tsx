"use client";

import { useState } from "react";
import { useRequestOtp, useRegister } from "@/lib/api/hooks/use-auth";
import { Button, TextField, OtpInput } from "@/components/ui";

export default function SignupPage() {
  const [step, setStep] = useState<"phone" | "otp" | "nameArea">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [areaId, setAreaId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { mutate: requestOtpMutate, isPending: requestOtpPending } = useRequestOtp();
  const {
    mutate: registerMutate,
    isPending: registerPending,
    isError: registerError,
    error: registerErrorObj,
  } = useRegister();

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
      await registerMutate({
        phone_e164: phone,
        otp,
        name,
        area_id: areaId,
      });
      // On successful registration, we should get a token and be logged in
      // The mutation handler in useRegister should take care of storing the token
      // For now, we'll just show a success message or redirect
      // TODO: Implement proper redirect after successful signup
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  if (step === "phone") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
        <form onSubmit={handlePhoneSubmit} className="w-full max-w-md space-y-4">
          <h2 className="text-2xl font-bold text-center">Sign Up with Phone</h2>
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
          Already have an account? <span className="text-primary underline">Login</span>
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
          <Button type="submit" disabled={isLoading || !otp}>
            {isLoading ? "Verifying..." : "Verify & Continue"}
          </Button>
          {registerError && (
            <p className="text-sm text-destructive">
              {registerErrorObj?.message || "Invalid OTP"}
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

  if (step === "nameArea") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
        <form onSubmit={handleOtpSubmit} className="w-full max-w-md space-y-4">
          <h2 className="text-2xl font-bold text-center">Complete Profile</h2>
          <TextField
            label="Full Name"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <TextField
            label="Area ID (UUID)"
            placeholder="Enter your area UUID"
            value={areaId}
            onChange={(e) => setAreaId(e.target.value)}
            required
          />
          <Button type="submit" disabled={isLoading || !name || !areaId}>
            {isLoading ? "Saving..." : "Finish Signup"}
          </Button>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </form>
      </div>
    );
  }

  // Default fallback (should not happen)
  return <div>Loading...</div>;
}