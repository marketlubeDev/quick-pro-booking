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
import { marylandZipCodes } from "@/data/marylandZipCodes";
import { employeeApi } from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ChevronsUpDown } from "lucide-react";

const SignUp = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedZip, setSelectedZip] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [zipOpen, setZipOpen] = useState(false);
  const [selectedDesignation, setSelectedDesignation] = useState<string>("");

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
      const address = (formData.get("address") as string)?.toString().trim();
      const formCity = (formData.get("city") as string)?.toString().trim();
      const zip = (formData.get("zip") as string)?.toString().trim();
      const designation = (formData.get("designation") as string)
        ?.toString()
        .trim();
      const expectedSalaryStr = (formData.get("expectedSalary") as string)
        ?.toString()
        .trim();
      const expectedSalary = Number(expectedSalaryStr);
      const finalCity = formCity || city;
      if (
        !name ||
        !email ||
        !password ||
        !confirm ||
        !address ||
        !zip ||
        !designation ||
        !finalCity ||
        !expectedSalaryStr
      ) {
        setError("All fields are required");
        setSubmitting(false);
        return;
      }
      if (Number.isNaN(expectedSalary) || expectedSalary < 0) {
        setError("Expected Salary must be a non-negative number");
        setSubmitting(false);
        return;
      }
      if (password !== confirm) {
        setError("Passwords do not match");
        return;
      }
      const isValidMdZip = marylandZipCodes.some((z) => z.zip === zip);
      if (!isValidMdZip) {
        setError("Please enter a valid Maryland ZIP code we serve");
        return;
      }
      const resp = await register(name, email, password, {
        designation: designation || undefined,
        address,
        city: finalCity || undefined,
        state: "MD",
        postalCode: zip,
        expectedSalary,
      });
      // Best-effort profile bootstrap with address info
      try {
        await employeeApi.updateProfile({
          fullName: name,
          email,
          addressLine1: address,
          city: finalCity || undefined,
          state: "MD",
          postalCode: zip,
          country: "USA",
          designation: designation || undefined,
          expectedSalary,
        });
      } catch {
        // ignore profile update failure; user can complete later
      }
      const role = resp.user?.role?.toString().toLowerCase();
      if (role === "admin") navigate("/admin");
      else navigate("/signup/success");
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
        <Card className="w-full max-w-3xl shadow-lg border-primary/10">
          <CardHeader>
            <CardTitle className="text-2xl">Pro Sign Up</CardTitle>
            <CardDescription>
              Create your pro account to join the SkillHands team
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
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
                <Label htmlFor="designation">Designation</Label>
                <Select
                  value={selectedDesignation}
                  onValueChange={(val) => setSelectedDesignation(val)}
                >
                  <SelectTrigger id="designation">
                    <SelectValue placeholder="Select designation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="plumbing">Plumbing</SelectItem>
                    <SelectItem value="electrical">Electrical</SelectItem>
                    <SelectItem value="house cleaning">
                      House cleaning
                    </SelectItem>
                    <SelectItem value="ac repair">AC repair</SelectItem>
                    <SelectItem value="appliance repair">
                      Appliance repair
                    </SelectItem>
                    <SelectItem value="painting">Painting</SelectItem>
                    <SelectItem value="handyman">Handyman</SelectItem>
                    <SelectItem value="pest control">Pest control</SelectItem>
                    <SelectItem value="lawn care">Lawn care</SelectItem>
                    <SelectItem value="moving">Moving</SelectItem>
                    <SelectItem value="roofing">Roofing</SelectItem>
                  </SelectContent>
                </Select>
                <input
                  type="hidden"
                  name="designation"
                  value={selectedDesignation}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expectedSalary">Expected Salary (AED)</Label>
                <Input
                  id="expectedSalary"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step="0.01"
                  placeholder="0"
                  name="expectedSalary"
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  type="text"
                  placeholder="123 Main St"
                  name="address"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  type="text"
                  placeholder="Baltimore"
                  name="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zip">ZIP code</Label>
                <Popover open={zipOpen} onOpenChange={setZipOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={zipOpen}
                      className="w-full justify-between"
                      id="zip"
                      type="button"
                    >
                      {selectedZip
                        ? `${selectedZip} — ${
                            marylandZipCodes.find((z) => z.zip === selectedZip)
                              ?.city || ""
                          }`
                        : "Select ZIP"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="p-0 w-[--radix-popover-trigger-width]"
                    align="start"
                  >
                    <Command>
                      <CommandInput placeholder="Type ZIP or city..." />
                      <CommandEmpty>No results found.</CommandEmpty>
                      <CommandList>
                        <CommandGroup>
                          {marylandZipCodes.map((z) => (
                            <CommandItem
                              key={z.zip}
                              value={`${z.zip} ${z.city}`}
                              onSelect={() => {
                                setSelectedZip(z.zip);
                                if (z.city) setCity(z.city);
                                setZipOpen(false);
                              }}
                            >
                              {z.zip} — {z.city}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <input type="hidden" name="zip" value={selectedZip} required />
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
                <p className="md:col-span-2 text-sm text-red-600" role="alert">
                  {error}
                </p>
              )}
              <Button
                type="submit"
                className="md:col-span-2 w-full bg-primary text-primary-foreground"
                disabled={submitting}
              >
                {submitting ? "Creating account..." : "Create pro account"}
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
