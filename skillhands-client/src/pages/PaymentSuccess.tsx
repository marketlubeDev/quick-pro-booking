import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { serviceRequestApi, paymentApi } from "@/lib/api";
import {
  CheckCircle2,
  CalendarDays,
  MapPin,
  User as UserIcon,
  Phone,
  BadgeDollarSign,
  ClipboardList,
} from "lucide-react";

function formatStatus(status: string): string {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export default function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [request, setRequest] = useState<any>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const srid = params.get("srid");
    const sessionId = params.get("session_id");
    if (!srid) {
      setError("Missing service request ID.");
      setLoading(false);
      return;
    }
    (async () => {
      try {
        let updatedRequest = null;
        if (sessionId) {
          try {
            const verifyRes = await paymentApi.verifyCheckoutSession(sessionId);
            // Use the updated service request from the verification response if available
            if (verifyRes?.success && verifyRes?.data?.serviceRequest) {
              updatedRequest = verifyRes.data.serviceRequest;
            }
          } catch (_) {
            // ignore; we'll still fetch the request below
          }
        }
        // If we got an updated request from verification, use it; otherwise fetch fresh
        if (updatedRequest) {
          setRequest(updatedRequest);
          setError("");
        } else {
          const res = await serviceRequestApi.getById(srid);
          if (res?.success && res?.data) {
            setRequest(res.data);
            setError("");
          } else {
            setError(res?.message || "Could not load service details.");
          }
        }
      } catch (e: any) {
        setError(e?.message || "Failed to load service details.");
      } finally {
        setLoading(false);
      }
    })();
  }, [location.search]);

  const params = new URLSearchParams(location.search);
  const srid = params.get("srid");

  return (
    <div className="container mx-auto max-w-3xl py-16 px-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="rounded-full bg-green-100 p-2 text-green-600">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-semibold">Payment Successful</h1>
      </div>
      <p className="text-muted-foreground mb-8">
        Thank you! Your payment was processed successfully. We have received
        your service request. A confirmation email will be sent shortly.
      </p>

      {loading ? (
        <div className="rounded-lg border p-4 mb-6">
          Loading service details...
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 mb-6 text-red-700">
          {error}
        </div>
      ) : request ? (
        <div className="rounded-xl border p-6 mb-10 bg-white shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-3">
              {srid && (
                <div className="flex items-start gap-2">
                  <ClipboardList className="w-4 h-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <div className="text-muted-foreground">Request ID</div>
                    <div className="font-medium break-all">{srid}</div>
                  </div>
                </div>
              )}
              {request.service && (
                <div className="flex items-start gap-2">
                  <BadgeDollarSign className="w-4 h-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <div className="text-muted-foreground">Service</div>
                    <div className="font-medium capitalize">
                      {request.service}
                    </div>
                  </div>
                </div>
              )}
              {(request.preferredDate || request.preferredTime) && (
                <div className="flex items-start gap-2">
                  <CalendarDays className="w-4 h-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <div className="text-muted-foreground">Schedule</div>
                    <div className="font-medium">
                      {request.preferredDate}
                      {request.preferredTime
                        ? `, ${request.preferredTime}`
                        : ""}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-3">
              {(request.address ||
                request.city ||
                request.state ||
                request.zip) && (
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <div className="text-muted-foreground">Location</div>
                    <div className="font-medium">
                      {request.address}
                      {request.city ? `, ${request.city}` : ""}
                      {request.state ? `, ${request.state}` : ""}
                      {request.zip ? ` ${request.zip}` : ""}
                    </div>
                  </div>
                </div>
              )}
              {(request.name || request.phone) && (
                <div className="flex items-start gap-2">
                  <UserIcon className="w-4 h-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <div className="text-muted-foreground">Contact</div>
                    <div className="font-medium flex items-center gap-2">
                      <span>{request.name}</span>
                      {request.phone && (
                        <span className="inline-flex items-center gap-1 text-muted-foreground">
                          <Phone className="w-3 h-3" /> {request.phone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
              {(typeof request.amountPaid === "number" ||
                typeof request.totalAmount === "number") && (
                <div className="flex items-start gap-2">
                  <BadgeDollarSign className="w-4 h-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <div className="text-muted-foreground">Amount Paid</div>
                    <div className="font-semibold text-green-700">
                      ${(request.amountPaid || 0).toFixed(2)}
                    </div>
                    {request.paymentStatus === "partially_paid" &&
                      typeof request.totalAmount === "number" && (
                        <div className="text-xs text-muted-foreground mt-1">
                          Total Amount: ${request.totalAmount.toFixed(2)} |
                          Remaining: $
                          {(
                            request.totalAmount - (request.amountPaid || 0)
                          ).toFixed(2)}
                        </div>
                      )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {request.paymentStatus && (
            <div className="mt-6">
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                  request.paymentStatus === "paid"
                    ? "bg-green-100 text-green-700"
                    : request.paymentStatus === "failed"
                    ? "bg-red-100 text-red-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {request.paymentStatus === "paid"
                  ? "Payment Confirmed"
                  : `Payment Status: ${formatStatus(request.paymentStatus)}`}
              </span>
            </div>
          )}
        </div>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <button
          className="inline-flex items-center rounded-md bg-primary text-primary-foreground px-4 py-2"
          onClick={() => navigate("/")}
        >
          Back to Home
        </button>
        <button
          className="inline-flex items-center rounded-md border px-4 py-2"
          onClick={() => navigate("/request")}
        >
          Book Another Service
        </button>
      </div>
    </div>
  );
}
