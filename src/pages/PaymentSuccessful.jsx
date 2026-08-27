import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const PaymentSuccessful = () => {
  const [searchParams] = useSearchParams();
  const nav = useNavigate();

  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      setLoading(false);
      return;
    }

    const loadPayment = async () => {
      try {
        const response = await fetch(
          `https://fasco-backend-two.vercel.app/api/payments/checkout-session/${sessionId}`
        );

        const data = await response.json();

        if (data.success && data.session) {
          setPayment(data.session);
        }
      } catch (error) {
        console.error("Payment details error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPayment();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <p className="text-sm text-gray-600">Loading payment details...</p>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="font-serif text-3xl text-black mb-4">
            Payment Details Not Found
          </h1>

          <button
            type="button"
            onClick={() => nav("/shop")}
            className="bg-black text-white px-8 py-3 text-xs tracking-widest hover:bg-gray-900 transition"
          >
            CONTINUE SHOPPING
          </button>
        </div>
      </div>
    );
  }

  const amount = Number(payment.amountTotal || 0).toFixed(2);

  const date = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-xl">
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-full border border-black flex items-center justify-center">
            <svg
              className="w-6 h-6 text-black"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-center font-serif text-4xl text-black mb-3">
          Payment Successful
        </h1>

        <p className="text-center text-gray-600 text-sm max-w-md mx-auto mb-10 leading-6">
          Thank you for your purchase. Your payment has been successfully
          completed.
        </p>

        <div className="border border-gray-300">
          <div className="flex justify-between items-start gap-6 px-6 py-4 border-b border-gray-300">
            <span className="text-xs font-semibold tracking-widest text-gray-700 shrink-0 pt-1">
              ORDER NUMBER
            </span>

            <span className="text-sm font-semibold text-black text-right break-all max-w-[65%]">
              {payment.id}
            </span>
          </div>

          <div className="flex justify-between items-start gap-6 px-6 py-4 border-b border-gray-300">
            <span className="text-xs font-semibold tracking-widest text-gray-700 shrink-0">
              CUSTOMER EMAIL
            </span>

            <span className="text-sm font-semibold text-black text-right break-all max-w-[65%]">
              {payment.customerEmail || "N/A"}
            </span>
          </div>

          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-300">
            <span className="text-xs font-semibold tracking-widest text-gray-700">
              AMOUNT
            </span>

            <span className="text-sm font-semibold text-black">
              ${amount}
            </span>
          </div>

          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-300">
            <span className="text-xs font-semibold tracking-widest text-gray-700">
              STATUS
            </span>

            <span className="text-sm font-semibold text-black">
              {payment.paymentStatus === "paid"
                ? "Paid"
                : payment.paymentStatus}
            </span>
          </div>

          <div className="flex justify-between items-center px-6 py-4">
            <span className="text-xs font-semibold tracking-widest text-gray-700">
              DATE
            </span>

            <span className="text-sm font-semibold text-black">
              {date}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <button
            type="button"
            onClick={() => nav("/account?section=orders")}
            className="flex-1 bg-black text-white text-xs tracking-widest py-3 hover:bg-gray-900 transition"
          >
            VIEW ORDER
          </button>

          <button
            type="button"
            onClick={() => nav("/shop")}
            className="flex-1 border border-black text-black text-xs tracking-widest py-3 hover:bg-black hover:text-white transition"
          >
            CONTINUE SHOPPING
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessful;