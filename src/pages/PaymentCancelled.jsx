import { useNavigate } from "react-router-dom";

const PaymentCancelled = () => {
  const nav = useNavigate();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-xl">

        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-full border border-black flex items-center justify-center">
            <svg
              className="w-6 h-6 text-black"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <line
                x1="12"
                y1="11"
                x2="12"
                y2="16"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <circle cx="12" cy="8" r="1" fill="currentColor" />
            </svg>
          </div>
        </div>

        <h1 className="text-center font-serif text-4xl text-black mb-3">
          Payment Cancelled
        </h1>

        <p className="text-center text-gray-500 text-sm max-w-md mx-auto mb-10">
          Your payment was cancelled. No payment was completed.
        </p>

        <div className="border border-gray-200">

          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
            <span className="text-xs tracking-widest text-gray-500">
              STATUS
            </span>

            <span className="text-sm font-semibold text-black">
              Cancelled
            </span>
          </div>

          <div className="px-6 py-4">
            <span className="block text-xs tracking-widest text-gray-500 mb-1">
              PAYMENT
            </span>

            <span className="text-sm font-semibold text-black">
              Not Completed
            </span>
          </div>

        </div>

        <div className="flex gap-4 mt-8">

          <button
            onClick={() => nav("/checkout")}
            className="flex-1 bg-black text-white text-xs tracking-widest py-3"
          >
            TRY PAYMENT AGAIN
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

export default PaymentCancelled;