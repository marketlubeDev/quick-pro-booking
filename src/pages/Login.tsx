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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label as FieldLabel } from "@/components/ui/label";

const Login = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const role = (formData.get("role") as string) || "employee";

    // TODO: Integrate real auth here. For now, redirect based on role.
    if (role === "employee") {
      navigate("/employee");
    } else if (role === "admin") {
      navigate("/admin");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-background/80">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-10 grid place-items-center">
        <Card className="w-full max-w-md shadow-lg border-primary/10">
          <CardHeader>
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription>
              Login to continue booking skilled pros
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <FieldLabel className="text-sm font-medium">
                  Login as
                </FieldLabel>
                <RadioGroup
                  defaultValue="employee"
                  className="grid grid-cols-2 gap-3"
                  name="role"
                >
                  <div className="flex items-center space-x-2 rounded-md border p-3">
                    <RadioGroupItem id="role-employee" value="employee" />
                    <label htmlFor="role-employee" className="text-sm">
                      Employee
                    </label>
                  </div>
                  <div className="flex items-center space-x-2 rounded-md border p-3">
                    <RadioGroupItem id="role-admin" value="admin" />
                    <label htmlFor="role-admin" className="text-sm">
                      Admin
                    </label>
                  </div>
                </RadioGroup>
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
                  placeholder="••••••••"
                  name="password"
                  required
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <Link to="/signup" className="text-primary hover:underline">
                  Create account
                </Link>
                <Link to="#" className="text-muted-foreground hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground"
              >
                Sign in
              </Button>
            </form>
            <div className="mt-6 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
