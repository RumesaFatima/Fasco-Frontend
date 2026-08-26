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

    fetch(`https://fasco-backend-two.vercel.app/api/payments/checkout-session/${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPayment(data.session);
        }
      })
      .catch((error) => {
        console.error("Payment details error:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-gray-500">Loading payment details...</p>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-serif text-3xl mb-3">
            Payment Details Not Found
          </h1>
          <button
            onClick={() => nav("/shop")}
            className="bg-black text-white px-8 py-3 text-xs tracking-widest"
          >
            CONTINUE SHOPPING
          </button>
        </div>
      </div>
    );
  }

  const amount = (payment.amountTotal / 100).toFixed(2);

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

        <p className="text-center text-gray-500 text-sm max-w-md mx-auto mb-10">
          Thank you for your purchase. Your payment has been successfully completed.
        </p>

        <div className="border border-gray-200">

          <div className="flex justify-between items-start gap-6 px-6 py-4 border-b border-gray-200">
            <span className="text-xs tracking-widest text-gray-500 shrink-0 pt-1">
              ORDER NUMBER
            </span>

            <span className="text-sm font-semibold text-black text-right break-all max-w-[65%]">
              {payment.id}
            </span>
          </div>

          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
            <span className="text-xs tracking-widest text-gray-500">
              CUSTOMER EMAIL
            </span>

            <span className="text-sm font-semibold text-black">
              {payment.customerEmail}
            </span>
          </div>

          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
            <span className="text-xs tracking-widest text-gray-500">
              AMOUNT
            </span>

            <span className="text-sm font-semibold text-black">
              ${amount}
            </span>
          </div>

          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
            <span className="text-xs tracking-widest text-gray-500">
              STATUS
            </span>

            <span className="text-sm font-semibold text-black">
              {payment.paymentStatus === "paid" ? "Paid" : payment.paymentStatus}
            </span>
          </div>

          <div className="px-6 py-4">
            <span className="block text-xs tracking-widest text-gray-500 mb-1">
              DATE
            </span>

            <span className="text-sm font-semibold text-black">
              {date}
            </span>
          </div>

        </div>

        <div className="flex gap-4 mt-8">

          <button
            onClick={() => nav("/account")}
            className="flex-1 bg-black text-white text-xs tracking-widest py-3"
          >
            VIEW ORDER
          </button>

          <button
            onClick={() => nav("/shop")}
            className="flex-1 border border-black text-black text-xs tracking-widest py-3"
          >
            CONTINUE SHOPPING
          </button>

        </div>

      </div>
    </div>
  );
};

export default PaymentSuccessful;