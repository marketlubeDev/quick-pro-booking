import { useNavigate } from "react-router-dom";

export default function PaymentCancel() {
  const navigate = useNavigate();
  return (
    <div className="container mx-auto max-w-2xl py-16 px-4">
      <h1 className="text-2xl font-semibold mb-4">Payment Canceled</h1>
      <p className="text-muted-foreground mb-6">
        Your payment was canceled. You can try again or return to the home page.
      </p>
      <div className="flex gap-3">
        <button
          className="inline-flex items-center rounded-md bg-primary text-primary-foreground px-4 py-2"
          onClick={() => navigate("/")}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
