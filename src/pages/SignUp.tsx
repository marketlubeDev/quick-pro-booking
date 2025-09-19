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
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

const SignUp = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const formData = new FormData(e.currentTarget);
      const name = (formData.get("name") as string)?.toString().trim();
      const email = (formData.get("email") as string)
        ?.toString()
        .toLowerCase()
        .trim();
      const password = (formData.get("password") as string) || "";
      const confirm = (formData.get("confirm") as string) || "";
      if (!name || !email || !password || !confirm) return;
      if (password !== confirm) {
        setError("Passwords do not match");
        return;
      }
      const resp = await register(name, email, password);
      const role = resp.user?.role?.toString().toLowerCase();
      if (role === "admin") navigate("/admin");
      else navigate("/employee");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Sign up failed";
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
            <CardTitle className="text-2xl">Employee Sign Up</CardTitle>
            <CardDescription>
              Create your employee account to join the SkillHands team
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  name="name"
                  required
                />
              </div>
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
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a strong password"
                  name="password"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm">Confirm password</Label>
                <Input
                  id="confirm"
                  type="password"
                  placeholder="Re-enter your password"
                  name="confirm"
                  required
                />
              </div>
              {error && (
                <p className="text-sm text-red-600" role="alert">
                  {error}
                </p>
              )}
              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground"
                disabled={submitting}
              >
                {submitting ? "Creating account..." : "Create employee account"}
              </Button>
            </form>
            <div className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Log in
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default SignUp;
