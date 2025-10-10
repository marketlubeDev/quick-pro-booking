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
import { ChevronsUpDown, Check } from "lucide-react";

const SignUp = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedZips, setSelectedZips] = useState<string[]>([]);
  const [city, setCity] = useState<string>("");
  const [zipOpen, setZipOpen] = useState(false);
  const [selectedDesignations, setSelectedDesignations] = useState<string[]>([]);
  const [designationOpen, setDesignationOpen] = useState(false);
  const [selectedAddressZip, setSelectedAddressZip] = useState<string>("");

  const workCities = selectedZips
    .map((zip) => marylandZipCodes.find((z) => z.zip === zip)?.city || "")
    .filter(Boolean)
    .filter((cityName, index, arr) => arr.indexOf(cityName) === index)
    .join(", ");

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
      const zips = (formData.getAll("zips") as string[]).map((z) => z.toString().trim());
      const designation = (formData.get("designation") as string)
        ?.toString()
        .trim();
      const expectedSalaryStr = (formData.get("expectedSalary") as string)
        ?.toString()
        .trim();
      const expectedSalary = Number(expectedSalaryStr);
      const addressZip = (formData.get("addressZip") as string)?.toString().trim();
      const finalCity = formCity || city;
      if (
        !name ||
        !email ||
        !password ||
        !confirm ||
        !address ||
        !addressZip ||
        !zips.length ||
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
      const invalidWorkZip = zips.find((zip) => !marylandZipCodes.some((z) => z.zip === zip));
      if (invalidWorkZip) {
        setError("Please select valid Maryland ZIP codes we serve");
        return;
      }
      const isValidAddressZip = marylandZipCodes.some((z) => z.zip === addressZip);
      if (!isValidAddressZip) {
        setError("Please enter a valid Maryland address ZIP code");
        return;
      }
      const resp = await register(name, email, password, {
        designation: designation || undefined,
        address,
        city: finalCity || undefined,
        state: "MD",
        postalCode: addressZip,
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
          postalCode: addressZip,
          country: "USA",
          designation: designation || undefined,
          expectedSalary,
          workingZipCodes: zips,
          workingCities: workCities ? workCities.split(", ") : [],
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
                <Popover open={designationOpen} onOpenChange={setDesignationOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={designationOpen}
                      className="w-full justify-between"
                      id="designation"
                      type="button"
                    >
                      {selectedDesignations.length
                        ? selectedDesignations.join(", ")
                        : "Select designations"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="p-0 w-[--radix-popover-trigger-width]"
                    align="start"
                  >
                    <Command>
                      <CommandInput placeholder="Search designation..." />
                      <CommandEmpty>No results found.</CommandEmpty>
                      <CommandList>
                        <CommandGroup>
                          {[
                            "plumber",
                            "electrician",
                            "house cleaner",
                            "ac technician",
                            "appliance repair",
                            "painter",
                            "handyman",
                            "pest control specialist",
                            "landscaper",
                            "moving specialist",
                            "roofer",
                          ].map((d) => (
                            <CommandItem
                              key={d}
                              value={d}
                              onSelect={() => {
                                setSelectedDesignations((prev) => {
                                  const isSelected = prev.includes(d);
                                  return isSelected
                                    ? prev.filter((p) => p !== d)
                                    : [...prev, d];
                                });
                              }}
                            >
                              <span className="mr-2 inline-flex items-center justify-center h-4 w-4">
                                {selectedDesignations.includes(d) && (
                                  <Check className="h-4 w-4" />
                                )}
                              </span>
                              {d.replace(/\b\w/g, (c) => c.toUpperCase())}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <input
                  type="hidden"
                  name="designation"
                  value={selectedDesignations.join(", ")}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expectedSalary">Expected Salary ($)</Label>
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
              <div className="space-y-2">
                <Label htmlFor="zip">Work Location ZIP codes</Label>
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
                      {selectedZips.length
                        ? selectedZips.join(", ")
                        : "Select ZIPs"}
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
                                setSelectedZips((prev) => {
                                  const isSelected = prev.includes(z.zip);
                                  const next = isSelected
                                    ? prev.filter((p) => p !== z.zip)
                                    : [...prev, z.zip];
                                  return next;
                                });
                              }}
                            >
                              <span className="mr-2 inline-flex items-center justify-center h-4 w-4">
                                {selectedZips.includes(z.zip) && (
                                  <Check className="h-4 w-4" />
                                )}
                              </span>
                              {z.zip} — {z.city}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {selectedZips.map((zip) => (
                  <input key={zip} type="hidden" name="zips" value={zip} required />
                ))}
                {selectedZips.map((zip) => (
                  <input key={`working-${zip}`} type="hidden" name="workingZipCodes" value={zip} />
                ))}
              </div>
            <div className="space-y-2">
              <Label htmlFor="workCities">Work Cities</Label>
              <Input
                id="workCities"
                type="text"
                placeholder="Auto-filled from selected ZIPs"
                value={workCities}
                readOnly
              />
              <input type="hidden" name="workCities" value={workCities} />
              {workCities
                .split(", ")
                .filter(Boolean)
                .map((c) => (
                  <input key={`wc-${c}`} type="hidden" name="workingCities" value={c} />
                ))}
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
                <Label htmlFor="addressZipSelect">Address ZIP code</Label>
                <Select
                  value={selectedAddressZip}
                  onValueChange={(val) => {
                    setSelectedAddressZip(val);
                    const found = marylandZipCodes.find((z) => z.zip === val);
                    if (found?.city) {
                      setCity(found.city);
                    }
                  }}
                  required
                >
                  <SelectTrigger id="addressZipSelect">
                    {selectedAddressZip || "Select ZIP"}
                  </SelectTrigger>
                  <SelectContent>
                    {marylandZipCodes.map((z) => (
                      <SelectItem key={z.zip} value={z.zip}>
                        {z.zip} — {z.city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <input
                  type="hidden"
                  name="addressZip"
                  value={selectedAddressZip}
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
