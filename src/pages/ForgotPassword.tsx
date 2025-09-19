import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { useState } from "react";
import { authApi } from "@/lib/api";

const ForgotPassword = () => {
  const [step, setStep] = useState<"request" | "verify">("request");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [emailValue, setEmailValue] = useState("");
  const [otpValue, setOtpValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [confirmPasswordValue, setConfirmPasswordValue] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);
    try {
      if (step === "request") {
        const formData = new FormData(e.currentTarget);
        const email = (formData.get("email") as string)?.toString().trim();
        if (!email) return;
        setEmailValue(email);
        const resp = await authApi.requestPasswordOtp(email);
        if (resp?.success) {
          setSuccess(resp?.message || "OTP has been sent to your email.");
          setStep("verify");
        } else {
          setError("Unable to send OTP. Try again later.");
        }
      } else {
        // verify + reset password
        if (!emailValue) {
          setError("Missing email. Go back and re-enter your email.");
          return;
        }
        if (!otpValue || otpValue.length < 4) {
          setError("Enter the OTP sent to your email.");
          return;
        }
        if (!passwordValue || passwordValue.length < 6) {
          setError("Password must be at least 6 characters.");
          return;
        }
        if (passwordValue !== confirmPasswordValue) {
          setError("Passwords do not match.");
          return;
        }
        const resp = await authApi.resetPasswordWithOtp(
          emailValue,
          otpValue,
          passwordValue
        );
        if (resp?.success) {
          setSuccess(
            resp?.message || "Password has been reset. You can log in now."
          );
        } else {
          setError("Invalid OTP or request. Try again.");
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Request failed";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-background/80">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-10 grid place-items-center">
        <Card className="w-full max-w-md shadow-lg border-primary/10">
          <CardHeader>
            <CardTitle className="text-2xl">
              {step === "request"
                ? "Reset your password"
                : "Verify OTP & set password"}
            </CardTitle>
            <CardDescription>
              {step === "request"
                ? "Enter your email to receive a one-time passcode (OTP)"
                : `We sent an OTP to ${emailValue}. Enter it below and set your new password.`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              {step === "request" ? (
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    name="email"
                    required
                  />
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="otp">OTP</Label>
                    <Input
                      id="otp"
                      type="text"
                      inputMode="numeric"
                      placeholder="Enter the 6-digit OTP"
                      value={otpValue}
                      onChange={(e) => setOtpValue(e.target.value.trim())}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">New password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={passwordValue}
                      onChange={(e) => setPasswordValue(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                      Confirm new password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPasswordValue}
                      onChange={(e) => setConfirmPasswordValue(e.target.value)}
                      required
                    />
                  </div>
                </>
              )}

              {error && (
                <p className="text-sm text-red-600" role="alert">
                  {error}
                </p>
              )}
              {success && (
                <p className="text-sm text-green-600" role="status">
                  {success}
                </p>
              )}

              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground"
                disabled={submitting}
              >
                {submitting
                  ? step === "request"
                    ? "Sending..."
                    : "Verifying..."
                  : step === "request"
                  ? "Send OTP"
                  : "Reset password"}
              </Button>
              <div className="text-center text-sm text-muted-foreground">
                {step === "verify" ? (
                  <button
                    type="button"
                    className="text-primary hover:underline"
                    onClick={async () => {
                      if (!emailValue) return;
                      try {
                        setSubmitting(true);
                        setError(null);
                        setSuccess(null);
                        const resp = await authApi.requestPasswordOtp(
                          emailValue
                        );
                        if (resp?.success) {
                          setSuccess(
                            resp?.message || "OTP re-sent to your email."
                          );
                        } else {
                          setError("Unable to resend OTP. Try again later.");
                        }
                      } catch (err) {
                        setError("Unable to resend OTP.");
                      } finally {
                        setSubmitting(false);
                      }
                    }}
                  >
                    Resend OTP
                  </button>
                ) : (
                  <>
                    Remembered your password?{" "}
                    <Link to="/login" className="text-primary hover:underline">
                      Back to login
                    </Link>
                  </>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default ForgotPassword;
