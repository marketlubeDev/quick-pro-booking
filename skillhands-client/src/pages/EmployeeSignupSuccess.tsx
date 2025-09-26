import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const EmployeeSignupSuccess = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-background/80">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-16 grid place-items-center">
        <Card className="w-full max-w-lg text-center shadow-lg border-primary/10">
          <CardHeader>
            <CardTitle className="text-2xl">Application submitted</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Thank you for signing up as a SkillHands Pro. Our admin team will
              review your application. You will receive an email once your
              application is approved, and you can access your account at that
              time.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Button asChild variant="default">
                <Link to="/login">Go to login</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default EmployeeSignupSuccess;
